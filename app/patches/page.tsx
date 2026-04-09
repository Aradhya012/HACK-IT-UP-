'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScan } from '@/components/ScanContext';
import { PatchDiff } from '@/components/PatchDiff';
import {
  Wrench, CheckCircle, Clock, AlertTriangle, Shield, ChevronDown, ChevronUp, Upload
} from 'lucide-react';
import Link from 'next/link';

export default function PatchesPage() {
  const { patches, projectId } = useScan();
  const [expandedPatch, setExpandedPatch] = useState<number | null>(null);

  if (!patches || patches.length === 0) {
    return (
      <div className="max-w-7xl mx-auto pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black font-orbitron text-white uppercase tracking-[0.15em] flex items-center">
            <Wrench className="h-7 w-7 text-cyber-cyan mr-3" />
            Patch Management
          </h1>
        </div>
        <div className="cyber-card p-16 text-center">
          <Shield className="h-16 w-16 text-cyber-cyan mx-auto mb-6 opacity-30" />
          <h2 className="text-2xl font-black font-orbitron text-white uppercase tracking-wider mb-3">
            No Patches Available
          </h2>
          <p className="text-sm font-ibm-plex text-text-secondary mb-8 max-w-md mx-auto">
            Run a vulnerability scan to generate automated security patches.
          </p>
          <Link href="/upload">
            <button className="btn-primary font-orbitron text-xs">
              <Upload className="mr-2 h-4 w-4 inline" /> Start New Scan
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const applied = patches.filter(p => p.after).length;
  const pending = patches.length - applied;

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black font-orbitron text-white uppercase tracking-[0.15em] flex items-center">
            <Wrench className="h-7 w-7 text-cyber-cyan mr-3" />
            Patch Management
          </h1>
          <p className="mt-2 text-text-secondary font-ibm-plex text-sm">
            Review and apply auto-generated security patches.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="cyber-card p-5">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 rounded-lg bg-bg-tertiary border border-[rgba(255,255,255,0.07)]">
              <Wrench className="h-5 w-5 text-cyber-cyan icon-glow-cyan" />
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.15em] text-text-muted font-ibm-plex mb-1">Total Generated</p>
          <p className="text-3xl font-black font-orbitron text-white">{patches.length}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="cyber-card p-5">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 rounded-lg bg-bg-tertiary border border-[rgba(255,255,255,0.07)]">
              <CheckCircle className="h-5 w-5 text-cyber-green icon-glow-green" />
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.15em] text-text-muted font-ibm-plex mb-1">Applied</p>
          <p className="text-3xl font-black font-orbitron text-cyber-green">{applied}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="cyber-card p-5">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 rounded-lg bg-bg-tertiary border border-[rgba(255,255,255,0.07)]">
              <Clock className="h-5 w-5 text-cyber-yellow" />
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.15em] text-text-muted font-ibm-plex mb-1">Pending Review</p>
          <p className="text-3xl font-black font-orbitron text-cyber-yellow">{pending}</p>
        </motion.div>
      </div>

      {/* Patch list */}
      <div className="space-y-4">
        {patches.map((patch, idx) => {
          const isExpanded = expandedPatch === idx;
          const hasAfter = !!patch.after;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="cyber-card overflow-hidden"
            >
              <div
                className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-[rgba(0,229,255,0.02)] transition-colors"
                onClick={() => setExpandedPatch(isExpanded ? null : idx)}
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <div className={`p-2 rounded-lg ${hasAfter ? 'bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)]' : 'bg-[rgba(255,214,0,0.1)] border border-[rgba(255,214,0,0.3)]'}`}>
                    {hasAfter ? <CheckCircle className="h-4 w-4 text-cyber-green" /> : <AlertTriangle className="h-4 w-4 text-cyber-yellow" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-ibm-plex text-white truncate">{patch.file}</p>
                    <p className="text-xs font-ibm-plex text-text-muted mt-0.5">{patch.change}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <span className={`text-[10px] font-bold font-ibm-plex uppercase tracking-wider ${hasAfter ? 'text-cyber-green' : 'text-cyber-yellow'}`}>
                    {hasAfter ? 'Applied' : 'Pending'}
                  </span>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
                </div>
              </div>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-5 py-5 bg-bg-primary border-t border-[rgba(255,255,255,0.07)]"
                >
                  <PatchDiff
                    before={patch.before || '// Original code'}
                    after={patch.after || '// Patched code'}
                    file={patch.file}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
