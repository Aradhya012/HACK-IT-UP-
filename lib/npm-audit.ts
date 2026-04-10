import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import path from 'path';
import os from 'os';

export interface CVEVulnerability {
  id: string;
  package: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cvss: number;
  title: string;
  description: string;
  affectedVersions: string;
  fixedIn: string | null;
  cveIds: string[];
  isDirect: boolean;
  via: string[];
  url: string;
}

export interface AuditReport {
  scanId: string;
  timestamp: string;
  packageJson: any;
  vulnerabilities: CVEVulnerability[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  patchedPackageJson?: any;
  remediationReport?: RemediationReport;
}

export interface RemediationReport {
  applied: boolean;
  changes: Array<{ package: string; from: string; to: string }>;
  manualSteps: string[];
  diff: { before: string; after: string };
}

// In-memory store for scan results
const scanStore = new Map<string, AuditReport>();

export function getScan(id: string): AuditReport | undefined {
  return scanStore.get(id);
}

export function storeScan(report: AuditReport): void {
  scanStore.set(report.scanId, report);
}

export async function runNpmAudit(packageJsonContent: string): Promise<CVEVulnerability[]> {
  const tmpDir = path.join(os.tmpdir(), `vulnguard-${Date.now()}`);
  try {
    mkdirSync(tmpDir, { recursive: true });
    const pkgJson = JSON.parse(packageJsonContent);

    // Write package.json
    writeFileSync(path.join(tmpDir, 'package.json'), packageJsonContent);

    // Create minimal package-lock.json to allow audit without install
    const lockJson = {
      name: pkgJson.name || 'audit-target',
      version: pkgJson.version || '1.0.0',
      lockfileVersion: 3,
      requires: true,
      packages: {
        '': {
          name: pkgJson.name || 'audit-target',
          version: pkgJson.version || '1.0.0',
          dependencies: pkgJson.dependencies || {},
          devDependencies: pkgJson.devDependencies || {}
        }
      }
    };
    writeFileSync(path.join(tmpDir, 'package-lock.json'), JSON.stringify(lockJson, null, 2));

    let auditOutput = '';
    try {
      auditOutput = execSync('npm audit --json', {
        cwd: tmpDir,
        timeout: 30000,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (e: any) {
      // npm audit exits with non-zero when vulnerabilities found — that's expected
      auditOutput = e.stdout || '';
    }

    if (!auditOutput) return [];

    const auditData = JSON.parse(auditOutput);
    return parseNpmAuditOutput(auditData, pkgJson);
  } catch (err) {
    console.error('npm audit error:', err);
    return [];
  } finally {
    try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }
}

function parseNpmAuditOutput(auditData: any, pkgJson: any): CVEVulnerability[] {
  const vulns: CVEVulnerability[] = [];
  const directDeps = new Set([
    ...Object.keys(pkgJson.dependencies || {}),
    ...Object.keys(pkgJson.devDependencies || {})
  ]);

  const vulnerabilities = auditData.vulnerabilities || {};

  for (const [pkgName, vuln] of Object.entries<any>(vulnerabilities)) {
    const via = Array.isArray(vuln.via) ? vuln.via : [];
    const advisories = via.filter((v: any) => typeof v === 'object');

    if (advisories.length === 0) {
      // Transitive with no direct advisory info
      vulns.push({
        id: `${pkgName}-transitive`,
        package: pkgName,
        severity: normalizeSeverity(vuln.severity),
        cvss: severityToCvss(vuln.severity),
        title: `Vulnerability in ${pkgName} (transitive)`,
        description: `${pkgName} has a ${vuln.severity} severity vulnerability via transitive dependency.`,
        affectedVersions: vuln.range || '*',
        fixedIn: vuln.fixAvailable ? (typeof vuln.fixAvailable === 'object' ? vuln.fixAvailable.version : 'available') : null,
        cveIds: [],
        isDirect: directDeps.has(pkgName),
        via: via.filter((v: any) => typeof v === 'string'),
        url: `https://www.npmjs.com/advisories`
      });
    } else {
      for (const advisory of advisories) {
        vulns.push({
          id: advisory.source ? String(advisory.source) : `${pkgName}-${Date.now()}`,
          package: pkgName,
          severity: normalizeSeverity(advisory.severity || vuln.severity),
          cvss: advisory.cvss?.score || severityToCvss(advisory.severity || vuln.severity),
          title: advisory.title || `Vulnerability in ${pkgName}`,
          description: advisory.overview || advisory.title || `Security vulnerability in ${pkgName}`,
          affectedVersions: advisory.vulnerable_versions || vuln.range || '*',
          fixedIn: advisory.patched_versions || (vuln.fixAvailable ? (typeof vuln.fixAvailable === 'object' ? vuln.fixAvailable.version : 'available') : null),
          cveIds: advisory.cves || [],
          isDirect: directDeps.has(pkgName),
          via: via.filter((v: any) => typeof v === 'string'),
          url: advisory.url || `https://www.npmjs.com/advisories/${advisory.source}`
        });
      }
    }
  }

  return vulns;
}

export async function queryOSVDev(packageName: string, version: string): Promise<CVEVulnerability[]> {
  try {
    const response = await fetch('https://api.osv.dev/v1/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        version,
        package: { name: packageName, ecosystem: 'npm' }
      }),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) return [];
    const data = await response.json();
    const vulns: CVEVulnerability[] = [];

    for (const vuln of (data.vulns || [])) {
      const severity = extractOSVSeverity(vuln);
      vulns.push({
        id: vuln.id,
        package: packageName,
        severity,
        cvss: extractOSVCvss(vuln),
        title: vuln.summary || vuln.id,
        description: vuln.details || vuln.summary || '',
        affectedVersions: version,
        fixedIn: extractOSVFixedVersion(vuln),
        cveIds: (vuln.aliases || []).filter((a: string) => a.startsWith('CVE-')),
        isDirect: false,
        via: [],
        url: `https://osv.dev/vulnerability/${vuln.id}`
      });
    }
    return vulns;
  } catch {
    return [];
  }
}

function extractOSVSeverity(vuln: any): 'critical' | 'high' | 'medium' | 'low' {
  const severities = vuln.severity || [];
  for (const s of severities) {
    if (s.type === 'CVSS_V3' || s.type === 'CVSS_V2') {
      const score = parseFloat(s.score);
      if (score >= 9.0) return 'critical';
      if (score >= 7.0) return 'high';
      if (score >= 4.0) return 'medium';
      return 'low';
    }
  }
  return 'medium';
}

function extractOSVCvss(vuln: any): number {
  const severities = vuln.severity || [];
  for (const s of severities) {
    if (s.type === 'CVSS_V3' || s.type === 'CVSS_V2') {
      return parseFloat(s.score) || 5.0;
    }
  }
  return 5.0;
}

function extractOSVFixedVersion(vuln: any): string | null {
  for (const affected of (vuln.affected || [])) {
    for (const range of (affected.ranges || [])) {
      for (const event of (range.events || [])) {
        if (event.fixed) return event.fixed;
      }
    }
  }
  return null;
}

export function generatePatchedPackageJson(packageJson: any, vulns: CVEVulnerability[]): {
  patched: any;
  changes: Array<{ package: string; from: string; to: string }>;
} {
  const patched = JSON.parse(JSON.stringify(packageJson));
  const changes: Array<{ package: string; from: string; to: string }> = [];

  for (const vuln of vulns) {
    if (!vuln.fixedIn || vuln.fixedIn === 'available') continue;

    const fixVersion = vuln.fixedIn.replace(/[^0-9.]/g, '');
    if (!fixVersion) continue;

    if (patched.dependencies?.[vuln.package]) {
      const current = patched.dependencies[vuln.package];
      patched.dependencies[vuln.package] = `^${fixVersion}`;
      changes.push({ package: vuln.package, from: current, to: `^${fixVersion}` });
    } else if (patched.devDependencies?.[vuln.package]) {
      const current = patched.devDependencies[vuln.package];
      patched.devDependencies[vuln.package] = `^${fixVersion}`;
      changes.push({ package: vuln.package, from: current, to: `^${fixVersion}` });
    }
  }

  return { patched, changes };
}

function normalizeSeverity(s: string): 'critical' | 'high' | 'medium' | 'low' {
  const lower = (s || '').toLowerCase();
  if (lower === 'critical') return 'critical';
  if (lower === 'high') return 'high';
  if (lower === 'medium' || lower === 'moderate') return 'medium';
  return 'low';
}

function severityToCvss(s: string): number {
  switch ((s || '').toLowerCase()) {
    case 'critical': return 9.5;
    case 'high': return 7.5;
    case 'medium': return 5.0;
    default: return 2.5;
  }
}
