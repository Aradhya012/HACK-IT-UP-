'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScan } from '@/components/ScanContext';
import { VulnerabilityTable } from '@/components/VulnerabilityTable';
import RedTeamTerminal from '@/components/RedTeamTerminal';
import { Download, Wrench, Shield, ShieldAlert, Upload, Activity } from 'lucide-react';
import Link from 'next/link';

interface ScanResultsClientProps {
  initialScanResults: Array<{ type: string; severity: string; file: string; line: number; snippet: string }>;
  initialPatches: Array<{ file: string; change: string; before?: string; after?: string; [key: string]: unknown }>;
  projectId: string;
}

const SEVERITY_TABS = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'RESOLVED'] as const;

export default function ScanResultsClient({ initialScanResults, initialPatches, projectId }: ScanResultsClientProps) {
  const { scanResults: contextScans } = useScan();
  const scanResults = initialScanResults.length > 0 ? initialScanResults : contextScans;
  const patches = initialPatches;
  const [activeTab, setActiveTab] = useState<string>('ALL');

  const criticalCount = scanResults.filter((f) => f.severity === 'critical').length;
  const highCount = scanResults.filter((f) => f.severity === 'high').length;
  const mediumCount = scanResults.filter((f) => f.severity === 'medium').length;
  const lowCount = scanResults.filter((f) => f.severity === 'low').length;

  const filteredResults = activeTab === 'ALL'
    ? scanResults
    : scanResults.filter((f) => f.severity.toUpperCase() === activeTab);

  if (scanResults.length === 0) {
    return (
      <div className="max-w-7xl mx-auto pb-12">
        <div className="cyber-card p-16 text-center">
          <Shield className="h-16 w-16 text-cyber-cyan mx-auto mb-6 opacity-30" />
          <h2 className="text-2xl font-black font-orbitron text-white uppercase tracking-wider mb-3">
            No Scan Results
          </h2>
          <p className="text-sm font-ibm-plex text-text-secondary mb-8 max-w-md mx-auto">
            Upload a repository and initiate a security scan to view vulnerability reports here.
          </p>
          <Link href="/upload">
            <button className="btn-primary font-orbitron text-xs">
              <Upload className="mr-2 h-4 w-4 inline" />
              Start New Scan
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black font-orbitron text-white uppercase tracking-[0.15em] flex items-center">
            <ShieldAlert className="h-7 w-7 text-cyber-cyan mr-3" />
            Scan Results
          </h1>
          <div className="flex items-center space-x-3 mt-2 font-ibm-plex text-xs">
            <span className="text-[#FF3DFF]">{criticalCount} Critical</span>
            <span className="text-text-muted">·</span>
            <span className="text-[#FF4D00]">{highCount} High</span>
            <span className="text-text-muted">·</span>
            <span className="text-cyber-yellow">{mediumCount} Medium</span>
            <span className="text-text-muted">·</span>
            <span className="text-cyber-green">{lowCount} Low</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="btn-primary font-orbitron text-xs py-2.5 px-5">
            <Download className="mr-2 h-4 w-4 inline" /> Export Report
          </button>
          <Link href="/patches">
            <button className="btn-secondary font-orbitron text-xs py-2.5 px-5">
              <Wrench className="mr-2 h-4 w-4 inline" /> View Patches
            </button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-bg-secondary rounded-xl p-1 mb-6 flex space-x-1 border border-[rgba(255,255,255,0.07)]">
        {SEVERITY_TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-cyber-cyan text-black' : 'text-text-secondary hover:text-white hover:bg-white/[0.04]'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <VulnerabilityTable
          findings={filteredResults as Array<{ type: string; severity: 'low' | 'medium' | 'high' | 'critical'; file: string; line: number; snippet: string }>}
          patches={patches}
        />
      </motion.div>

      {/* Red Team Terminal */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <RedTeamTerminal projectPath={projectId} />
      </motion.div>
    </div>
  );
}
