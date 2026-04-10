'use client';

import { ShieldX, ShieldCheck } from 'lucide-react';

interface DiffViewProps {
  before: string;
  after: string;
}

export default function DiffView({ before, after }: DiffViewProps) {
  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');

  return (
    <div className="cyber-card overflow-hidden">
      <div className="px-5 py-3 border-b border-[rgba(255,255,255,0.07)]">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest" style={{ fontFamily: 'monospace' }}>
          package.json Diff — Before / After Remediation
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Before */}
        <div className="border-r border-[rgba(255,255,255,0.07)]">
          <div className="px-4 py-2 bg-[rgba(199,36,177,0.1)] border-b border-[rgba(199,36,177,0.2)] flex items-center gap-2">
            <ShieldX className="h-4 w-4 text-cyber-magenta" />
            <span className="text-xs font-bold text-cyber-magenta uppercase tracking-wider">Vulnerable</span>
          </div>
          <div className="p-4 overflow-x-auto max-h-96 overflow-y-auto">
            <pre className="text-xs font-mono leading-relaxed">
              {beforeLines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="text-text-muted w-8 text-right mr-3 select-none flex-shrink-0">{i + 1}</span>
                  <span className="text-[#FF6B9D]">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
        {/* After */}
        <div>
          <div className="px-4 py-2 bg-[rgba(0,255,136,0.08)] border-b border-[rgba(0,255,136,0.2)] flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyber-green" />
            <span className="text-xs font-bold text-cyber-green uppercase tracking-wider">Patched</span>
          </div>
          <div className="p-4 overflow-x-auto max-h-96 overflow-y-auto">
            <pre className="text-xs font-mono leading-relaxed">
              {afterLines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="text-text-muted w-8 text-right mr-3 select-none flex-shrink-0">{i + 1}</span>
                  <span className="text-cyber-green">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
