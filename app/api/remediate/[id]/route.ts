import { NextRequest, NextResponse } from 'next/server';
import { getScan, storeScan, generatePatchedPackageJson } from '@/lib/npm-audit';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const report = getScan(params.id);
  if (!report) {
    return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
  }

  const { patched, changes } = generatePatchedPackageJson(
    report.packageJson,
    report.vulnerabilities
  );

  const manualSteps: string[] = [];
  const unfixable = report.vulnerabilities.filter(v => !v.fixedIn || v.fixedIn === 'available');
  for (const v of unfixable) {
    manualSteps.push(
      `${v.package}: No automatic fix available for ${v.title}. Check ${v.url} for manual remediation.`
    );
  }

  const remediationReport = {
    applied: true,
    changes,
    manualSteps,
    diff: {
      before: JSON.stringify(report.packageJson, null, 2),
      after: JSON.stringify(patched, null, 2)
    }
  };

  // Update stored report
  const updated = { ...report, patchedPackageJson: patched, remediationReport };
  storeScan(updated);

  return NextResponse.json({
    success: true,
    scanId: params.id,
    patchedPackageJson: patched,
    remediationReport
  });
}
