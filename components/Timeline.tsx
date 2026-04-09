'use client';

import { motion } from 'framer-motion';
import {
  Clock,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Zap,
} from 'lucide-react';

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

interface TimelineProps {
  events: TimelineEvent[];
}

const STATUS_CONFIG: Record<string, { icon: typeof ShieldCheck; color: string; border: string; bg: string }> = {
  completed: { icon: ShieldCheck, color: 'text-cyber-green', border: 'border-cyber-green', bg: 'bg-[rgba(0,255,136,0.1)]' },
  patched: { icon: Wrench, color: 'text-cyber-cyan', border: 'border-cyber-cyan', bg: 'bg-[rgba(0,229,255,0.1)]' },
  vulnerable: { icon: AlertTriangle, color: 'text-cyber-magenta', border: 'border-cyber-magenta', bg: 'bg-[rgba(199,36,177,0.1)]' },
  clean: { icon: CheckCircle, color: 'text-cyber-green', border: 'border-cyber-green', bg: 'bg-[rgba(0,255,136,0.1)]' },
};

export function Timeline({ events }: TimelineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      case 'clean': return 'badge-low';
      default: return 'badge-low';
    }
  };

  return (
    <div className="flow-root">
      <div className="relative">
        {/* Vertical connector */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyber-cyan/50 via-cyber-purple/30 to-transparent" />

        <ul className="space-y-6">
          {events.map((event, idx) => {
            const config = STATUS_CONFIG[event.status] || STATUS_CONFIG.completed;
            const Icon = config.icon;

            return (
              <motion.li
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <div className="relative flex items-start space-x-4">
                  {/* Event dot */}
                  <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${config.border} ${config.bg}`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>

                  {/* Card */}
                  <div className="flex-1 cyber-card p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-ibm-plex text-white font-medium">{event.title}</p>
                      <span className="text-[10px] font-ibm-plex text-text-muted flex-shrink-0 ml-3">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <p className="text-xs font-ibm-plex text-text-secondary mb-3">{event.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {event.findings > 0 && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getSeverityBadge(event.severity)}`}>
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
                      {event.patches > 0 && event.findings > 0 && (
                        <span className="badge-resolved inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          <Zap className="mr-1 h-3 w-3" />
                          Security posture improved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
