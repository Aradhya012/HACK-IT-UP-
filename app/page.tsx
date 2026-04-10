'use client';

import { useState, useRef } from 'react';
import { Shield, Upload, Github, Zap, Download, AlertTriangle, CheckCircle, RefreshCw, FileText } from 'lucide-react';
import VulnTable from '@/components/VulnTable';
import DiffView from '@/components/DiffView';
import ScanProgress from '@/components/ScanProgress';

type ScanState = 'idle' | 'scanning' | 'done' | 'remediating';

export default function Home() {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'github'>('file');
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');
  const [report, setReport] = useState<any>(null);
  const [scanId, setScanId] = useState('');
  const [remediationResult, setRemediationResult] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleScan = async () => {
    setError('');
    setReport(null);
    setRemediationResult(null);
    setScanState('scanning');

    try {
      let res: Response;

      if (uploadMethod === 'file') {
        const file = fileRef.current?.files?.[0];
        if (!file) { setError('Please select a package.json file'); setScanState('idle'); return; }
        const formData = new FormData();
        formData.append('file', file);
        res = await fetch('/api/scan', { method: 'POST', body: formData });
      } else {
        if (!repoUrl) { setError('Please enter a GitHub repo URL'); setScanState('idle'); return; }
        res = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repoUrl })
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scan failed');

      setReport(data.report);
      setScanId(data.scanId);
      setScanState('done');
    } catch (e: any) {
      setError(e.message);
      setScanState('idle');
    }
  };

  const handleRemediate = async () => {
    if (!scanId) return;
    setScanState('remediating');
    try {
      const res = await fetch(`/api/remediate/${scanId}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Remediation failed');
      setRemediationResult(data.remediationReport);
      setScanState('done');
    } catch (e: any) {
      setError(e.message);
      setScanState('done');
    }
  };

  const downloadReport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vulnguard-report-${scanId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPatched = () => {
    if (!remediationResult) return;
    const blob = new Blob([remediationResult.diff.after], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'package.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-bg-primary bg-dot-grid">
      {/* Scan line overlay */}
      <div className="scan-line-overlay" />

      {/* Header */}
      <header className="border-b border-[rgba(0,229,255,0.2)] bg-bg-primary/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-cyber-cyan icon-glow-cyan" />
            <div>
              <h1 className="text-xl font-black text-white tracking-wider" style={{ fontFamily: 'monospace' }}>
                VULN<span className="text-cyber-cyan">GUARD</span>
              </h1>
              <p className="text-[10px] text-text-muted tracking-widest uppercase">Autonomous NPM Security System</p>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-xs text-cyber-cyan font-mono">Team Hack-It-Up</span>
            <span className="text-[10px] text-text-muted">Aradhya Saraf · Chinmay Muddapur</span>
            <span className="text-[10px] text-text-muted">HackZion V3 by AMCEC 2026</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Hero */}
        <div className="text-center py-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ fontFamily: 'monospace' }}>
            Detect. Analyse. <span className="text-cyber-cyan">Remediate.</span>
          </h2>
          <p className="text-text-secondary text-sm">Autonomous vulnerability management for npm-based applications — no human intervention required.</p>
        </div>

        {/* Upload Zone */}
        <div className="cyber-card p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2" style={{ fontFamily: 'monospace' }}>
            <Upload className="h-4 w-4 text-cyber-cyan" /> Upload Target
          </h3>

          <div className="flex gap-3 mb-5">
            <button
              onClick={() => setUploadMethod('file')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${uploadMethod === 'file' ? 'bg-cyber-cyan text-black' : 'bg-bg-tertiary text-text-secondary border border-[rgba(255,255,255,0.07)]'}`}
            >
              <FileText className="inline h-3 w-3 mr-1" /> package.json File
            </button>
            <button
              onClick={() => setUploadMethod('github')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${uploadMethod === 'github' ? 'bg-cyber-cyan text-black' : 'bg-bg-tertiary text-text-secondary border border-[rgba(255,255,255,0.07)]'}`}
            >
              <Github className="inline h-3 w-3 mr-1" /> GitHub Repo URL
            </button>
          </div>

          {uploadMethod === 'file' ? (
            <div
              className="border-2 border-dashed border-[rgba(0,229,255,0.3)] rounded-xl p-8 text-center cursor-pointer hover:border-cyber-cyan transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-cyber-cyan mx-auto mb-2" />
              <p className="text-text-secondary text-sm">Drop <span className="text-cyber-cyan">package.json</span> here or click to browse</p>
              <p className="text-text-muted text-xs mt-1">Supports package.json files</p>
              <input ref={fileRef} type="file" accept=".json" className="hidden" />
            </div>
          ) : (
            <input
              type="text"
              value={repoUrl}
              onChange={e => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className="cyber-input"
            />
          )}

          {error && (
            <div className="mt-3 p-3 bg-[rgba(255,77,0,0.1)] border border-[rgba(255,77,0,0.3)] rounded-lg text-sm text-[#FF4D00]">
              {error}
            </div>
          )}

          <button
            onClick={handleScan}
            disabled={scanState === 'scanning'}
            className="btn-primary w-full mt-5 flex items-center justify-center gap-2"
          >
            {scanState === 'scanning' ? (
              <><RefreshCw className="h-4 w-4 animate-spin" /> Scanning...</>
            ) : (
              <><Zap className="h-4 w-4" /> SCAN NOW</>
            )}
          </button>
        </div>

        {/* Progress */}
        {scanState === 'scanning' && <ScanProgress />}

        {/* Results */}
        {report && scanState !== 'scanning' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Critical', count: report.summary.critical, color: 'text-[#FF3DFF]', bg: 'bg-[rgba(199,36,177,0.1)]', border: 'border-[rgba(199,36,177,0.3)]' },
                { label: 'High', count: report.summary.high, color: 'text-[#FF4D00]', bg: 'bg-[rgba(255,77,0,0.1)]', border: 'border-[rgba(255,77,0,0.3)]' },
                { label: 'Medium', count: report.summary.medium, color: 'text-cyber-yellow', bg: 'bg-[rgba(255,214,0,0.1)]', border: 'border-[rgba(255,214,0,0.3)]' },
                { label: 'Low', count: report.summary.low, color: 'text-cyber-green', bg: 'bg-[rgba(0,255,136,0.1)]', border: 'border-[rgba(0,255,136,0.3)]' },
              ].map(s => (
                <div key={s.label} className={`cyber-card p-4 ${s.bg} border ${s.border}`}>
                  <div className={`text-3xl font-black ${s.color}`} style={{ fontFamily: 'monospace' }}>{s.count}</div>
                  <div className="text-xs text-text-muted uppercase tracking-widest mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Vulnerability Table */}
            <VulnTable vulnerabilities={report.vulnerabilities} />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRemediate}
                disabled={scanState === 'remediating'}
                className="btn-primary flex items-center gap-2"
              >
                {scanState === 'remediating' ? (
                  <><RefreshCw className="h-4 w-4 animate-spin" /> Remediating...</>
                ) : (
                  <><Zap className="h-4 w-4" /> AUTO-REMEDIATE</>
                )}
              </button>
              <button onClick={downloadReport} className="btn-secondary flex items-center gap-2">
                <Download className="h-4 w-4" /> Download JSON Report
              </button>
              {remediationResult && (
                <button onClick={downloadPatched} className="btn-secondary flex items-center gap-2">
                  <Download className="h-4 w-4" /> Download Patched package.json
                </button>
              )}
            </div>

            {/* Remediation Result */}
            {remediationResult && (
              <div className="space-y-4">
                <div className="cyber-card p-5">
                  <h3 className="text-sm font-bold text-cyber-green uppercase tracking-widest mb-3 flex items-center gap-2" style={{ fontFamily: 'monospace' }}>
                    <CheckCircle className="h-4 w-4" /> Remediation Complete
                  </h3>
                  {remediationResult.changes.length > 0 ? (
                    <div className="space-y-2">
                      {remediationResult.changes.map((c: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-mono">
                          <span className="text-text-secondary">{c.package}</span>
                          <span className="text-[#FF4D00]">{c.from}</span>
                          <span className="text-text-muted">→</span>
                          <span className="text-cyber-green">{c.to}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-secondary text-sm">No automatic version fixes available. See manual steps below.</p>
                  )}
                  {remediationResult.manualSteps.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs text-cyber-yellow uppercase tracking-widest mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Manual Steps Required
                      </h4>
                      <ul className="space-y-1">
                        {remediationResult.manualSteps.map((s: string, i: number) => (
                          <li key={i} className="text-xs text-text-secondary font-mono bg-bg-tertiary rounded p-2">{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Diff View */}
                <DiffView
                  before={remediationResult.diff.before}
                  after={remediationResult.diff.after}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.07)] mt-16 py-6 text-center">
        <p className="text-text-muted text-xs font-mono">
          VulnGuard — Autonomous NPM Security System &nbsp;|&nbsp; Team Hack-It-Up &nbsp;|&nbsp;
          Leader: Aradhya Saraf &nbsp;|&nbsp; Member: Chinmay Muddapur &nbsp;|&nbsp; HackZion V3 by AMCEC 2026
        </p>
      </footer>
    </div>
  );
}
