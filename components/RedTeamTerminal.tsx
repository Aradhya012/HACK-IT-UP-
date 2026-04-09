'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, Square, Timer, Shield, CheckCircle, XCircle } from 'lucide-react';

interface RedTeamTerminalProps {
  projectPath: string;
}

interface LogLine {
  text: string;
  type: 'init' | 'probe' | 'exploit' | 'block' | 'success' | 'fail' | 'info' | 'summary';
}

const MOCK_LOGS: LogLine[] = [
  { text: '[INIT] NeuroSploit Validation Engine v2.1 initializing...', type: 'init' },
  { text: '[INIT] Loading attack vector database (4,122 patterns)...', type: 'init' },
  { text: '[INIT] Establishing sandboxed execution environment...', type: 'init' },
  { text: '[INIT] Target acquired. Beginning adversarial assessment.', type: 'init' },
  { text: '', type: 'info' },
  { text: '[PROBE] Scanning for exposed .env and sensitive config...', type: 'probe' },
  { text: '[BLOCK] ✓ Config files properly secured or ignored.', type: 'block' },
  { text: '', type: 'info' },
  { text: '[PROBE] Testing SQL injection vectors on /api/user-profile...', type: 'probe' },
  { text: '[EXPLOIT] Attempting payload: \' OR 1=1; --', type: 'exploit' },
  { text: '[BLOCK] ✓ Parameterized queries detected. Injection failed.', type: 'block' },
  { text: '', type: 'info' },
  { text: '[PROBE] Testing XSS reflection on /search?q=...', type: 'probe' },
  { text: '[EXPLOIT] Attempting payload: <img src=x onerror=alert(1)>', type: 'exploit' },
  { text: '[FAIL] ✗ Payload executed. Reflection found in DOM.', type: 'fail' },
  { text: '[REFORGE] Initiating autonomous patch generation...', type: 'init' },
  { text: '[REFORGE] Patch applied. Re-testing endpoint...', type: 'init' },
  { text: '[BLOCK] ✓ Output encoding confirmed. XSS neutralized.', type: 'block' },
  { text: '', type: 'info' },
  { text: '[PROBE] Testing path traversal on /api/download?file=...', type: 'probe' },
  { text: '[EXPLOIT] Attempting payload: ../../../../etc/passwd', type: 'exploit' },
  { text: '[BLOCK] ✓ Path normalization enforced. Traversal denied.', type: 'block' },
  { text: '', type: 'info' },
  { text: '[PROBE] Auditing JWT implementation on /api/v1/session...', type: 'probe' },
  { text: '[EXPLOIT] Attempting "alg": "none" header substitution...', type: 'exploit' },
  { text: '[BLOCK] ✓ Signature validation enforced. Exploit failed.', type: 'block' },
  { text: '', type: 'info' },
  { text: '[PROBE] Testing SSRF on webhook integration...', type: 'probe' },
  { text: '[EXPLOIT] Attempting redirect to meta-data: 169.254.169.254', type: 'exploit' },
  { text: '[BLOCK] ✓ Egress whitelist active. SSRF blocked.', type: 'block' },
  { text: '', type: 'info' },
  { text: '═══════════════════════════════════════════════════', type: 'summary' },
  { text: '[SUMMARY] Red Team Assessment Complete', type: 'summary' },
  { text: '  Threats Simulated:  6', type: 'summary' },
  { text: '  Autonomous Fixes:   1', type: 'summary' },
  { text: '  System Integrity:   100% SECURE', type: 'summary' },
  { text: '═══════════════════════════════════════════════════', type: 'summary' },
];

const TYPE_COLORS: Record<string, string> = {
  init: 'text-cyber-cyan',
  probe: 'text-cyber-yellow',
  exploit: 'text-cyber-magenta',
  block: 'text-cyber-green',
  success: 'text-cyber-green',
  fail: 'text-[#FF4D00]',
  info: 'text-text-muted',
  summary: 'text-cyber-cyan',
};

export default function RedTeamTerminal({ projectPath }: RedTeamTerminalProps) {
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const startScan = () => {
    setLogs([]);
    setElapsed(0);
    setRunning(true);
    setComplete(false);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < MOCK_LOGS.length) {
        setLogs(prev => [...prev, MOCK_LOGS[idx]]);
        idx++;
      } else {
        clearInterval(interval);
        setRunning(false);
        setComplete(true);
      }
    }, 300);
  };

  const stopScan = () => {
    setRunning(false);
    setLogs(prev => [...prev, { text: '[ABORT] Scan terminated by operator.', type: 'fail' }]);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="cyber-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-bg-tertiary/50 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <Terminal className="h-4 w-4 text-cyber-cyan" />
          <span className="text-xs font-orbitron text-cyber-cyan uppercase tracking-wider">
            NeuroSploit Validation Engine v2.1
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-text-muted">
            <Timer className="h-3.5 w-3.5" />
            <span className="text-xs font-ibm-plex tabular-nums">{formatTime(elapsed)}</span>
          </div>
          {!running ? (
            <button onClick={startScan} className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyber-green/10 border border-cyber-green/30 text-cyber-green text-xs font-ibm-plex hover:bg-cyber-green/20 transition-colors">
              <Play className="h-3 w-3" />
              <span>Run</span>
            </button>
          ) : (
            <button onClick={stopScan} className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[rgba(255,77,0,0.1)] border border-[rgba(255,77,0,0.3)] text-[#FF4D00] text-xs font-ibm-plex hover:bg-[rgba(255,77,0,0.2)] transition-colors">
              <Square className="h-3 w-3" />
              <span>Stop</span>
            </button>
          )}
        </div>
      </div>

      {/* Terminal body */}
      <div ref={scrollRef} className="bg-bg-primary p-5 h-[400px] overflow-y-auto font-ibm-plex text-xs leading-6">
        {logs.length === 0 && !running && (
          <div className="h-full flex flex-col items-center justify-center text-text-muted">
            <Shield className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm font-orbitron uppercase tracking-wider">Ready for Assessment</p>
            <p className="text-[10px] font-ibm-plex mt-1">Click Run to begin adversarial validation</p>
          </div>
        )}

        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className={`${TYPE_COLORS[log.type] || 'text-text-secondary'} ${log.text === '' ? 'h-3' : ''}`}
          >
            {log.text}
          </motion.div>
        ))}

        {running && (
          <span className="inline-block w-2 h-4 bg-cyber-cyan ml-1" style={{ animation: 'typewriter-blink 1s infinite' }} />
        )}
      </div>

      {/* Complete summary */}
      <AnimatePresence>
        {complete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="px-5 py-4 bg-bg-tertiary/30 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-cyber-green" />
                <span className="text-xs font-ibm-plex text-cyber-green">4 Blocked</span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-[#FF4D00]" />
                <span className="text-xs font-ibm-plex text-[#FF4D00]">1 Bypassed</span>
              </div>
            </div>
            <span className="text-xs font-bold font-orbitron text-cyber-cyan uppercase tracking-wider">
              80% Resilient
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}