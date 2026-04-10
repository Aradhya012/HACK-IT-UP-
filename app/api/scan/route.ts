import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import {
  runNpmAudit,
  queryOSVDev,
  storeScan,
  AuditReport,
  CVEVulnerability
} from '@/lib/npm-audit';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let packageJsonContent = '';
    let repoUrl = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      packageJsonContent = await file.text();
    } else {
      const body = await req.json();
      if (body.packageJson) {
        packageJsonContent = typeof body.packageJson === 'string'
          ? body.packageJson
          : JSON.stringify(body.packageJson);
      } else if (body.repoUrl) {
        repoUrl = body.repoUrl;
        // Fetch package.json from GitHub
        const raw = repoUrl
          .replace('github.com', 'raw.githubusercontent.com')
          .replace(/\/$/, '') + '/HEAD/package.json';
        const res = await fetch(raw, { signal: AbortSignal.timeout(10000) });
        if (!res.ok) return NextResponse.json({ error: 'Could not fetch package.json from repo' }, { status: 400 });
        packageJsonContent = await res.text();
      } else {
        return NextResponse.json({ error: 'Provide file or packageJson or repoUrl' }, { status: 400 });
      }
    }

    // Validate JSON
    let pkgJson: any;
    try {
      pkgJson = JSON.parse(packageJsonContent);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in package.json' }, { status: 400 });
    }

    // Run npm audit
    const npmVulns = await runNpmAudit(packageJsonContent);

    // Also query OSV.dev for each dependency
    const allDeps = {
      ...pkgJson.dependencies,
      ...pkgJson.devDependencies
    };

    const osvResults: CVEVulnerability[] = [];
    const osvPromises = Object.entries(allDeps).map(async ([name, version]) => {
      const cleanVersion = String(version).replace(/[\^~>=<]/g, '').split(' ')[0];
      const results = await queryOSVDev(name, cleanVersion);
      osvResults.push(...results);
    });

    await Promise.allSettled(osvPromises);

    // Merge and deduplicate
    const allVulns = mergeVulnerabilities(npmVulns, osvResults);

    const summary = {
      critical: allVulns.filter(v => v.severity === 'critical').length,
      high: allVulns.filter(v => v.severity === 'high').length,
      medium: allVulns.filter(v => v.severity === 'medium').length,
      low: allVulns.filter(v => v.severity === 'low').length,
      total: allVulns.length
    };

    const scanId = randomUUID();
    const report: AuditReport = {
      scanId,
      timestamp: new Date().toISOString(),
      packageJson: pkgJson,
      vulnerabilities: allVulns,
      summary
    };

    storeScan(report);

    return NextResponse.json({ success: true, scanId, report });
  } catch (err: any) {
    console.error('Scan error:', err);
    return NextResponse.json({ error: err.message || 'Scan failed' }, { status: 500 });
  }
}

function mergeVulnerabilities(npm: CVEVulnerability[], osv: CVEVulnerability[]): CVEVulnerability[] {
  const seen = new Set<string>();
  const merged: CVEVulnerability[] = [];

  for (const v of [...npm, ...osv]) {
    const key = `${v.package}-${v.id}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(v);
    }
  }

  // Sort by severity
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return merged.sort((a, b) => order[a.severity] - order[b.severity]);
}
