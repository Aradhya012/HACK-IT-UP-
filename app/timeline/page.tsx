'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Zap,
  Shield,
  Upload,
  Filter,
} from 'lucide-react';
import Link from 'next/link';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'patched' | 'vulnerable' | 'clean';
  severity: 'high' | 'medium' | 'low' | 'clean';
  findings: number;
  patches: number;
}

const MOCK_EVENTS: TimelineEvent[] = [
  { id: 1, date: '2025-04-07T14:30:00Z', title: 'auth-service scan completed', description: 'Full deep analysis with OWASP Top 10 coverage. Found 3 critical injection vulnerabilities.', status: 'vulnerable', severity: 'high', findings: 7, patches: 0 },
  { id: 2, date: '2025-04-07T14:35:00Z', title: 'Patches generated for auth-service', description: 'Auto-generated 5 security patches addressing SQL injection and XSS vectors.', status: 'patched', severity: 'high', findings: 7, patches: 5 },
  { id: 3, date: '2025-04-07T15:00:00Z', title: 'payment-gateway scan completed', description: 'Dependency audit and secret detection pass. Minor issues found.', status: 'completed', severity: 'medium', findings: 3, patches: 0 },
  { id: 4, date: '2025-04-07T15:05:00Z', title: 'Patches applied to payment-gateway', description: 'All patches successfully applied and validated.', status: 'patched', severity: 'medium', findings: 3, patches: 3 },
  { id: 5, date: '2025-04-07T16:00:00Z', title: 'user-portal-ui clean scan', description: 'No vulnerabilities detected. All security checks passed.', status: 'clean', severity: 'clean', findings: 0, patches: 0 },
  { id: 6, date: '2025-04-06T10:00:00Z', title: 'Red team validation on auth-service', description: 'Adversarial assessment complete. 80% resilience score.', status: 'completed', severity: 'medium', findings: 1, patches: 0 },
];

const STATUS_CONFIG: Record<string, { icon: typeof ShieldCheck; color: string; border: string; bg: string }> = {
  completed: { icon: ShieldCheck, color: 'text-cyber-green', border: 'border-cyber-green', bg: 'bg-[rgba(0,255,136,0.1)]' },
  patched: { icon: Wrench, color: 'text-cyber-cyan', border: 'border-cyber-cyan', bg: 'bg-[rgba(0,229,255,0.1)]' },
  vulnerable: { icon: AlertTriangle, color: 'text-cyber-magenta', border: 'border-cyber-magenta', bg: 'bg-[rgba(199,36,177,0.1)]' },
  clean: { icon: CheckCircle, color: 'text-cyber-green', border: 'border-cyber-green', bg: 'bg-[rgba(0,255,136,0.1)]' },
};

const FILTER_TABS = ['All', 'Scans', 'Patches', 'Alerts', 'Clean'] as const;

export default function TimelinePage() {
  const [filter, setFilter] = useState<string>('All');

  const filteredEvents = MOCK_EVENTS
    .filter((e) => {
      if (filter === 'All') return true;
      if (filter === 'Scans') return e.status === 'completed' || e.status === 'vulnerable';
      if (filter === 'Patches') return e.status === 'patched';
      if (filter === 'Alerts') return e.status === 'vulnerable';
      if (filter === 'Clean') return e.status === 'clean';
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black font-orbitron text-white uppercase tracking-[0.15em] flex items-center">
          <Clock className="h-7 w-7 text-cyber-cyan mr-3" />
          Security Timeline
        </h1>
        <p className="mt-2 text-text-secondary font-ibm-plex text-sm">
          Track all security events, scans, and patch operations.
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider transition-all ${
              filter === tab
                ? 'bg-cyber-cyan text-black'
                : 'bg-bg-secondary border border-[rgba(255,255,255,0.07)] text-text-secondary hover:text-white hover:border-cyber-cyan/30'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {filteredEvents.length === 0 ? (
        <div className="cyber-card p-16 text-center">
          <Clock className="h-12 w-12 text-cyber-cyan mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-bold font-orbitron text-white uppercase tracking-wider mb-2">No Events Found</h3>
          <p className="text-sm font-ibm-plex text-text-secondary">No security events match the current filter.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyber-cyan/50 via-cyber-purple/30 to-transparent" />

          <div className="space-y-6">
            {filteredEvents.map((event, idx) => {
              const config = STATUS_CONFIG[event.status] || STATUS_CONFIG.completed;
              const Icon = config.icon;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="relative flex items-start space-x-4 pl-0"
                >
                  {/* Event dot */}
                  <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${config.border} ${config.bg}`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>

                  {/* Event card */}
                  <div className="flex-1 cyber-card p-4 hover:border-[rgba(0,229,255,0.3)] transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-ibm-plex text-white font-medium">{event.title}</h4>
                      <span className="text-[10px] font-ibm-plex text-text-muted flex-shrink-0 ml-3">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <p className="text-xs font-ibm-plex text-text-secondary mb-3">{event.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {event.findings > 0 && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          event.severity === 'high' ? 'badge-high' : event.severity === 'medium' ? 'badge-medium' : 'badge-low'
                        }`}>
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          {event.findings} findings
                        </span>
                      )}
                      {event.patches > 0 && (
                        <span className="badge-resolved inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          <Wrench className="mr-1 h-3 w-3" />
                          {event.patches} patches
                        </span>
                      )}
                      {event.findings === 0 && event.patches === 0 && (
                        <span className="badge-low inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Clean scan
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
