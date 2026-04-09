'use client';

import React from 'react';
import { ShieldX, ShieldCheck } from 'lucide-react';

interface PatchDiffProps {
  before: string;
  after: string;
  file: string;
}

export function PatchDiff({ before, after, file }: PatchDiffProps) {
  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* VULNERABLE */}
      <div className="rounded-xl overflow-hidden border border-[rgba(199,36,177,0.3)]">
        <div className="px-4 py-3 bg-[rgba(199,36,177,0.15)] flex items-center space-x-2 border-b border-[rgba(199,36,177,0.3)]">
          <ShieldX className="h-4 w-4 text-cyber-magenta" />
          <span className="text-xs font-bold font-orbitron text-cyber-magenta uppercase tracking-wider">
            Vulnerable
          </span>
        </div>
        <div className="bg-bg-primary p-4 overflow-x-auto">
          <pre className="text-xs font-ibm-plex leading-relaxed">
            {beforeLines.map((line, i) => (
              <div key={i} className="flex">
                <span className="text-text-muted w-8 text-right mr-4 select-none flex-shrink-0">{i + 1}</span>
                <span className="text-[#FF6B9D]">{line}</span>
              </div>
            ))}
          </pre>
        </div>
      </div>

      {/* PATCHED */}
      <div className="rounded-xl overflow-hidden border border-[rgba(0,255,136,0.3)]">
        <div className="px-4 py-3 bg-[rgba(0,255,136,0.1)] flex items-center space-x-2 border-b border-[rgba(0,255,136,0.3)]">
          <ShieldCheck className="h-4 w-4 text-cyber-green" />
          <span className="text-xs font-bold font-orbitron text-cyber-green uppercase tracking-wider">
            Patched
          </span>
        </div>
        <div className="bg-bg-primary p-4 overflow-x-auto">
          <pre className="text-xs font-ibm-plex leading-relaxed">
            {afterLines.map((line, i) => (
              <div key={i} className="flex">
                <span className="text-text-muted w-8 text-right mr-4 select-none flex-shrink-0">{i + 1}</span>
                <span className="text-cyber-green">{line}</span>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}
