'use client';

import { useState } from 'react';
import { Download, Github, CheckCircle, AlertTriangle, Key, GitBranch, MessageSquare } from 'lucide-react';

interface Finding {
  type: string;
  severity: 'low' | 'medium' | 'high';
  file: string;
  line: number;
  snippet: string;
}

interface Patch {
  file: string;
  change: string;
}

interface ScanResultsProps {
  findings: Finding[];
  patches: Patch[];
  projectId: string | null;
}

const SEVERITY_BADGE: Record<string, string> = {
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low',
};

export default function ScanResults({ findings, patches, projectId }: ScanResultsProps) {
  const [githubToken, setGithubToken] = useState('');
  const [branchName, setBranchName] = useState('reforge-fixes');
  const [commitMessage, setCommitMessage] = useState('Apply security fixes from Reforge AI');
  const [exportMethod, setExportMethod] = useState<'zip' | 'github'>('zip');

  const handleExport = async () => {
    if (exportMethod === 'zip') {
      const response = await fetch('/api/patch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, export: true }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'patched-code.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        alert(`Export failed: ${error.error}`);
      }
    } else {
      const response = await fetch('/api/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, githubToken, branchName, commitMessage }),
      });
      if (response.ok) {
        const result = await response.json();
        alert(`Committed to GitHub! ${result.prUrl ? `PR: ${result.prUrl}` : ''}`);
      } else {
        const error = await response.json();
        alert(`Commit failed: ${error.error}`);
      }
    }
  };

  return (
    <div className="cyber-card p-6">
      <h2 className="text-xl font-bold font-orbitron text-white uppercase tracking-wider mb-6">Scan Results</h2>

      {findings.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-lg font-bold font-orbitron text-white mb-4">Issues Found ({findings.length})</h3>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full">
              <thead>
                <tr className="bg-bg-tertiary/50 text-[10px] uppercase tracking-[0.15em] text-text-muted font-ibm-plex">
                  <th className="py-3 px-4 text-left">Severity</th>
                  <th className="py-3 px-4 text-left">File</th>
                  <th className="py-3 px-4 text-left">Line</th>
                  <th className="py-3 px-4 text-left">Issue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                {findings.map((f, i) => (
                  <tr key={i} className="hover:bg-[rgba(0,229,255,0.02)] transition-colors">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${SEVERITY_BADGE[f.severity] || 'badge-low'}`}>
                        {f.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-ibm-plex text-sm text-text-secondary">{f.file}</td>
                    <td className="py-3 px-4 font-ibm-plex text-sm text-text-muted">{f.line}</td>
                    <td className="py-3 px-4 font-ibm-plex text-sm text-white">{f.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] rounded-xl">
          <h3 className="text-lg font-bold font-orbitron text-cyber-green mb-1">No Issues Found</h3>
          <p className="text-text-secondary font-ibm-plex text-sm">Your code passed all security checks.</p>
        </div>
      )}

      {patches.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold font-orbitron text-white mb-4">Patches ({patches.length})</h3>
          <div className="space-y-3">
            {patches.map((p, i) => (
              <div key={i} className="bg-bg-tertiary/50 rounded-xl p-4 border border-[rgba(255,255,255,0.07)]">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-cyber-green" />
                  <span className="font-ibm-plex text-sm text-white">{p.file}</span>
                </div>
                <div className="font-ibm-plex text-xs text-text-secondary bg-bg-primary rounded-lg p-3">{p.change}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-[rgba(255,255,255,0.07)] pt-6">
        <h3 className="text-lg font-bold font-orbitron text-white mb-4">Export</h3>
        <div className="flex space-x-3 mb-6">
          <button onClick={() => setExportMethod('zip')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider transition-all ${exportMethod === 'zip' ? 'bg-cyber-cyan text-black' : 'bg-bg-tertiary text-text-secondary border border-[rgba(255,255,255,0.07)]'}`}>
            <Download className="mr-2 h-4 w-4 inline" /> Download ZIP
          </button>
          <button onClick={() => setExportMethod('github')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider transition-all ${exportMethod === 'github' ? 'bg-cyber-cyan text-black' : 'bg-bg-tertiary text-text-secondary border border-[rgba(255,255,255,0.07)]'}`}>
            <Github className="mr-2 h-4 w-4 inline" /> Commit to GitHub
          </button>
        </div>

        {exportMethod === 'github' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-text-secondary font-ibm-plex mb-2">GitHub Token</label>
              <input type="password" value={githubToken} onChange={(e) => setGithubToken(e.target.value)} placeholder="ghp_********" className="cyber-input font-ibm-plex" required />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-text-secondary font-ibm-plex mb-2">Branch Name</label>
              <input type="text" value={branchName} onChange={(e) => setBranchName(e.target.value)} className="cyber-input font-ibm-plex" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-text-secondary font-ibm-plex mb-2">Commit Message</label>
              <input type="text" value={commitMessage} onChange={(e) => setCommitMessage(e.target.value)} className="cyber-input font-ibm-plex" />
            </div>
          </div>
        )}

        <button onClick={handleExport} className="btn-primary w-full font-orbitron text-xs">
          {exportMethod === 'zip' ? 'Download Patched ZIP' : 'Commit to GitHub'}
        </button>
      </div>
    </div>
  );
}