'use client';

import { useScan } from '@/components/ScanContext';
import ScanResultsClient from './ScanResultsClient';

export default function ScanResultsPage() {
  return <ScanResultsClientWrapper />;
}

function ScanResultsClientWrapper() {
  const { scanResults, patches, projectId } = useScan();

  return (
    <ScanResultsClient
      initialScanResults={scanResults}
      initialPatches={patches.map((p) => ({
        ...p,
        id: p.file,
        vulnerability_id: p.file,
        scan_id: projectId || '',
        before_code: p.before || null,
        after_code: p.after || null,
        created_at: new Date().toISOString(),
      }))}
      projectId={projectId || ''}
    />
  );
}