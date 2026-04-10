'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  'Parsing package.json...',
  'Running npm audit --json...',
  'Querying OSV.dev API for CVEs...',
  'Calculating CVSS scores...',
  'Building dependency graph...',
  'Generating vulnerability report...',
];

export default function ScanProgress() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s < STEPS.length - 1 ? s + 1 : s));
      setProgress(p => Math.min(p + 100 / STEPS.length, 95));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cyber-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 bg-cyber-cyan rounded-full animate-pulse" />
        <span className="text-sm font-mono text-cyber-cyan uppercase tracking-widest">Scanning in progress...</span>
      </div>
      <div className="w-full bg-bg-tertiary rounded-full h-2 mb-4 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="space-y-1">
        {STEPS.map((s, i) => (
          <div key={i} className={`text-xs font-mono flex items-center gap-2 transition-all ${i <= step ? 'text-text-secondary' : 'text-text-muted opacity-40'}`}>
            <span>{i < step ? '✓' : i === step ? '▶' : '○'}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
