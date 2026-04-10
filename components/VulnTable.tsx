'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, Shield } from 'lucide-react';

interface Vuln {
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

const SEVERITY_BADGE: Record<string, string> = {
  critical: 'badge-critical',
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low',
};

const SEVERITY_EMOJI: Record<string, string> = {
  critical: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🟢',
};

export default function VulnTable({ vulnerabilities }: { vulnerabilities: Vuln[] }) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  if (!vulnerabilities || vulnerabilities.length === 0) {
    return (
      <div className="cyber-card p-8 text-center">
        <Shield className="h-12 w-12 text-cyber-green mx-auto mb-3" />
        <h3 className="text-lg font-bold text-cyber-green mb-1" style={{ fontFamily: 'monospace' }}>No Vulnerabilities Found</h3>
        <p className="text-text-secondary text-sm">Your package.json passed all security checks.</p>
      </div>
    );
  }

  return (
    <div className="cyber-card overflow-hidden">
      <div className="px-5 py-3 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest" style={{ fontFamily: 'monospace' }}>
          Vulnerability Report — {vulnerabilities.length} Issues
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-bg-tertiary/50 text-[10px] uppercase tracking-[0.15em] text-text-muted">
              <th className="px-4 py-3 text-left">Severity</th>
              <th className="px-4 py-3 text-left">Package</th>
              <th className="px-4 py-3 text-left">CVE</th>
              <th className="px-4 py-3 text-left">CVSS</th>
              <th className="px-4 py-3 text-left">Fix Available</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
            {vulnerabilities.map((v, i) => (
              <>
                <tr
                  key={i}
                  className="cursor-pointer hover:bg-[rgba(0,229,255,0.02)] transition-colors"
                  onClick={() => setExpanded(prev => ({ ...prev, [i]: !prev[i] }))}
                >
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${SEVERITY_BADGE[v.severity]}`}>
                      {SEVERITY_EMOJI[v.severity]} {v.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-white">{v.package}</td>
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                    {v.cveIds.length > 0 ? v.cveIds[0] : <span className="text-text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm">
                    <span className={v.cvss >= 9 ? 'text-[#FF3DFF]' : v.cvss >= 7 ? 'text-[#FF4D00]' : v.cvss >= 4 ? 'text-cyber-yellow' : 'text-cyber-green'}>
                      {v.cvss.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {v.fixedIn ? (
                      <span className="badge-resolved px-2 py-0.5 rounded-full text-[10px] font-bold">✓ {v.fixedIn}</span>
                    ) : (
                      <span className="text-text-muted">No fix yet</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted">
                    {v.isDirect ? 'Direct' : 'Transitive'}
                  </td>
                  <td className="px-4 py-3">
                    {expanded[i] ? <ChevronDown className="h-4 w-4 text-cyber-cyan" /> : <ChevronRight className="h-4 w-4 text-text-muted" />}
                  </td>
                </tr>
                {expanded[i] && (
                  <tr key={`${i}-detail`} className="bg-bg-primary/50">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs text-text-muted uppercase tracking-wider">Title: </span>
                          <span className="text-sm text-white">{v.title}</span>
                        </div>
                        <div>
                          <span className="text-xs text-text-muted uppercase tracking-wider">Description: </span>
                          <span className="text-sm text-text-secondary">{v.description}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs font-mono">
                          <span><span className="text-text-muted">Affected: </span><span className="text-[#FF4D00]">{v.affectedVersions}</span></span>
                          {v.fixedIn && <span><span className="text-text-muted">Fixed in: </span><span className="text-cyber-green">{v.fixedIn}</span></span>}
                          {v.cveIds.length > 0 && <span><span className="text-text-muted">CVEs: </span><span className="text-cyber-cyan">{v.cveIds.join(', ')}</span></span>}
                        </div>
                        {v.via.length > 0 && (
                          <div className="text-xs">
                            <span className="text-text-muted">Via: </span>
                            <span className="text-text-secondary">{v.via.join(' → ')}</span>
                          </div>
                        )}
                        <a href={v.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-cyber-cyan hover:underline"
                          onClick={e => e.stopPropagation()}>
                          <ExternalLink className="h-3 w-3" /> View Advisory
                        </a>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
