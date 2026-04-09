'use client';

import {
  Shield,
  ShieldAlert,
  CheckCircle,
  Scan,
  ArrowUpRight,
  Upload,
  Wrench,
  Target,
  Eye,
  Activity,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/* ── Mock data ── */
const mockStats = [
  { name: 'TOTAL SCANS', value: '1,248', trend: '+12% this week', trendUp: true, icon: Scan, iconColor: 'text-cyber-cyan icon-glow-cyan' },
  { name: 'VULNERABILITIES', value: '47', sub: '3 Critical · 12 High · 18 Med · 14 Low', icon: ShieldAlert, iconColor: 'text-cyber-magenta icon-glow-magenta' },
  { name: 'PATCHES APPLIED', value: '412', sub: '5 pending review', icon: CheckCircle, iconColor: 'text-cyber-green icon-glow-green' },
];

const mockRecentScans = [
  { id: '1', project: 'auth-service', date: '2 mins ago', critical: 1, high: 2, medium: 4, low: 12 },
  { id: '2', project: 'payment-gateway', date: '1 hour ago', critical: 0, high: 1, medium: 2, low: 8 },
  { id: '3', project: 'user-portal-ui', date: '3 hours ago', critical: 0, high: 0, medium: 5, low: 15 },
  { id: '4', project: 'legacy-api-v1', date: 'Yesterday', critical: 2, high: 5, medium: 10, low: 22 },
];

const agentPipeline = [
  { name: 'Architect', emoji: '🏗️', status: 'COMPLETE' as const },
  { name: 'Builder', emoji: '🔨', status: 'COMPLETE' as const },
  { name: 'Critic', emoji: '🔎', status: 'IDLE' as const },
  { name: 'Sentinel', emoji: '🛡️', status: 'IDLE' as const },
  { name: 'Red-Team', emoji: '⚔️', status: 'IDLE' as const },
];

const timelineEvents = [
  { id: 1, message: 'Scan completed on auth-service', time: '2 min ago', severity: 'high' as const },
  { id: 2, message: 'Patch applied to payment-gateway', time: '1 hour ago', severity: 'resolved' as const },
  { id: 3, message: 'New vulnerability found in legacy-api', time: '3 hours ago', severity: 'critical' as const },
  { id: 4, message: 'Red team validation passed', time: 'Yesterday', severity: 'low' as const },
];

const owaspData = [
  { name: 'A01: Broken Access Control', pct: 95 },
  { name: 'A02: Cryptographic Failures', pct: 88 },
  { name: 'A03: Injection', pct: 100 },
  { name: 'A04: Insecure Design', pct: 72 },
  { name: 'A05: Security Misconfiguration', pct: 90 },
  { name: 'A06: Vulnerable Components', pct: 85 },
  { name: 'A07: Auth Failures', pct: 92 },
  { name: 'A08: Data Integrity Failures', pct: 78 },
  { name: 'A09: Logging Failures', pct: 65 },
  { name: 'A10: SSRF', pct: 100 },
];

function SeverityDot({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    critical: 'bg-[#FF3DFF]',
    high: 'bg-[#FF4D00]',
    medium: 'bg-cyber-yellow',
    low: 'bg-cyber-green',
    resolved: 'bg-cyber-cyan',
  };
  return <div className={`w-2 h-2 rounded-full ${colors[severity] || 'bg-text-muted'}`} />;
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [securityScore] = useState(94);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const circumference = 2 * Math.PI * 46;
  const offset = circumference * (1 - securityScore / 100);

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black font-orbitron text-white uppercase tracking-[0.15em]">
          Command Center
        </h1>
        <p className="mt-2 text-text-secondary font-ibm-plex text-sm">
          Welcome to your Reforge autonomous security operations dashboard.
        </p>
      </div>

      {/* ── HERO STATS ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {mockStats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="cyber-card p-5 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-bg-tertiary border border-[rgba(255,255,255,0.07)]">
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              {stat.trendUp && (
                <span className="flex items-center text-xs font-ibm-plex text-cyber-green">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-xs uppercase tracking-[0.15em] text-text-muted font-ibm-plex mb-1">{stat.name}</p>
            <p className="text-3xl font-black font-orbitron text-white">{stat.value}</p>
            {stat.sub && <p className="text-[10px] font-ibm-plex text-text-secondary mt-1">{stat.sub}</p>}
          </motion.div>
        ))}

        {/* Security Score Ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="cyber-card p-5 flex flex-col items-center justify-center"
        >
          <p className="text-xs uppercase tracking-[0.15em] text-text-muted font-ibm-plex mb-3">Security Score</p>
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" stroke="rgba(255,255,255,0.07)" strokeWidth="6" fill="none" />
              <circle
                cx="50" cy="50" r="46"
                stroke="url(#scoreGradient)"
                strokeWidth="6"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{ filter: 'drop-shadow(0 0 6px rgba(0,229,255,0.5))' }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C724B1" />
                  <stop offset="100%" stopColor="#00FF88" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black font-orbitron text-white">{securityScore}</span>
              <span className="text-[8px] font-ibm-plex text-cyber-green font-bold">A+ GRADE</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── MAIN 2-COL LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-5 mb-8">
        {/* LEFT COL */}
        <div className="space-y-5">
          {/* Recent Scans Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="cyber-card overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between">
              <h3 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider flex items-center">
                <Activity className="h-4 w-4 text-cyber-cyan mr-2" />
                Recent Scan Activity
              </h3>
              <Link href="/scan-results" className="text-xs text-cyber-cyan hover:text-white transition-colors font-ibm-plex flex items-center">
                View All <ArrowUpRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-bg-tertiary/50 text-[10px] uppercase tracking-[0.15em] text-text-muted font-ibm-plex">
                    <th className="px-5 py-3 text-left">Repository</th>
                    <th className="px-5 py-3 text-left">Time</th>
                    <th className="px-5 py-3 text-left">Severity</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {mockRecentScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-[rgba(0,229,255,0.04)] transition-colors group">
                      <td className="px-5 py-3">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-text-muted" />
                          <span className="text-sm font-ibm-plex text-white group-hover:text-cyber-cyan transition-colors">{scan.project}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-text-secondary font-ibm-plex">{scan.date}</td>
                      <td className="px-5 py-3">
                        <div className="flex space-x-1.5">
                          {scan.critical > 0 && <span className="badge-critical rounded-full px-2 py-0.5 text-[10px] font-bold">C:{scan.critical}</span>}
                          {scan.high > 0 && <span className="badge-high rounded-full px-2 py-0.5 text-[10px] font-bold">H:{scan.high}</span>}
                          {scan.medium > 0 && <span className="badge-medium rounded-full px-2 py-0.5 text-[10px] font-bold">M:{scan.medium}</span>}
                          <span className="badge-low rounded-full px-2 py-0.5 text-[10px] font-bold">L:{scan.low}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button className="p-1.5 rounded-md text-text-muted hover:text-cyber-cyan hover:bg-bg-tertiary transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Vulnerability Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="cyber-card p-5"
          >
            <h3 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider mb-4 flex items-center section-header">
              <ShieldAlert className="h-4 w-4 text-cyber-cyan mr-2" />
              Vulnerability Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Critical', count: 3, color: 'bg-[#FF3DFF]', textColor: 'text-[#FF3DFF]', pct: 6 },
                { label: 'High', count: 12, color: 'bg-[#FF4D00]', textColor: 'text-[#FF4D00]', pct: 26 },
                { label: 'Medium', count: 18, color: 'bg-cyber-yellow', textColor: 'text-cyber-yellow', pct: 38 },
                { label: 'Low', count: 14, color: 'bg-cyber-green', textColor: 'text-cyber-green', pct: 30 },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className={`text-2xl font-black font-orbitron ${item.textColor}`}>{item.count}</p>
                  <p className="text-[10px] uppercase tracking-widest text-text-muted font-ibm-plex mt-1">{item.label}</p>
                  <div className="mt-2 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COL */}
        <div className="space-y-5">
          {/* Agent Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="cyber-card p-5"
          >
            <h3 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider mb-4 flex items-center section-header">
              Agent Pipeline Status
            </h3>
            <div className="space-y-3">
              {agentPipeline.map((agent) => (
                <div key={agent.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-bg-tertiary/50">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{agent.emoji}</span>
                    <span className="text-sm font-ibm-plex text-white">{agent.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {agent.status === 'COMPLETE' && (
                      <>
                        <div className="w-2 h-2 rounded-full bg-cyber-green" />
                        <span className="text-[10px] font-ibm-plex text-cyber-green uppercase tracking-wider">Complete</span>
                      </>
                    )}
                    {agent.status === 'IDLE' && (
                      <>
                        <div className="w-2 h-2 rounded-full bg-text-muted" />
                        <span className="text-[10px] font-ibm-plex text-text-muted uppercase tracking-wider">Idle</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Security Timeline Mini */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="cyber-card p-5"
          >
            <h3 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider mb-4 flex items-center section-header">
              <Clock className="h-4 w-4 text-cyber-cyan mr-2" />
              Security Timeline
            </h3>
            <div className="space-y-3">
              {timelineEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 py-2 border-l-2 pl-3" style={{
                  borderColor: event.severity === 'critical' ? '#FF3DFF' :
                    event.severity === 'high' ? '#FF4D00' :
                    event.severity === 'resolved' ? '#00E5FF' : '#00FF88'
                }}>
                  <SeverityDot severity={event.severity} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-ibm-plex text-white truncate">{event.message}</p>
                    <p className="text-[10px] font-ibm-plex text-text-muted mt-0.5">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/timeline" className="block mt-3 text-xs text-cyber-cyan hover:text-white font-ibm-plex transition-colors text-center">
              View Full Timeline →
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* OWASP Coverage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="cyber-card p-5"
        >
          <h3 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider mb-4 section-header">
            OWASP Top 10 Coverage
          </h3>
          <div className="space-y-2">
            {owaspData.map((item) => (
              <div key={item.name} className="flex items-center space-x-3">
                <span className="text-[9px] font-ibm-plex text-text-secondary w-[145px] truncate flex-shrink-0">{item.name}</span>
                <div className="flex-1 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${item.pct}%`,
                      background: item.pct >= 90 ? '#00FF88' : item.pct >= 70 ? '#FFD600' : '#FF4D00',
                    }}
                  />
                </div>
                <span className="text-[10px] font-ibm-plex text-text-secondary w-8 text-right">{item.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Repos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="cyber-card p-5"
        >
          <h3 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider mb-4 section-header">
            Recent Repositories
          </h3>
          <div className="space-y-3">
            {mockRecentScans.slice(0, 3).map((scan) => (
              <div key={scan.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary/50 hover:bg-bg-tertiary transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-ibm-plex text-white truncate">{scan.project}</p>
                  <p className="text-[10px] font-ibm-plex text-text-muted">{scan.date}</p>
                </div>
                <span className="badge-high rounded-full px-2 py-0.5 text-[10px] font-bold flex-shrink-0 ml-2">
                  {scan.critical + scan.high + scan.medium + scan.low}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="cyber-card p-5"
        >
          <h3 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider mb-4 section-header">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link href="/upload" className="block">
              <button className="btn-primary w-full font-orbitron text-xs flex items-center justify-center py-3">
                <Upload className="h-4 w-4 mr-2" />
                New Scan
              </button>
            </Link>
            <Link href="/patches" className="block">
              <button className="btn-secondary w-full font-orbitron text-xs flex items-center justify-center py-3">
                <Wrench className="h-4 w-4 mr-2" />
                View Patches
              </button>
            </Link>
            <Link href="/scan-results?tab=redteam" className="block">
              <button className="btn-danger w-full font-orbitron text-xs flex items-center justify-center py-3">
                <Target className="h-4 w-4 mr-2" />
                Red Team Test
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}