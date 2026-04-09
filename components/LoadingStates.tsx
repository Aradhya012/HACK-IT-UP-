'use client';

import React from 'react';
import { Loader2, Shield } from 'lucide-react';

/** Full-page loader with Reforge branding */
export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[100] bg-bg-primary flex flex-col items-center justify-center">
      <div className="relative mb-6">
        <Shield className="h-12 w-12 text-cyber-cyan animate-glow-pulse" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cyber-cyan" style={{ width: 64, height: 64, top: -8, left: -8 }} />
      </div>
      <p className="text-sm font-orbitron text-cyber-cyan tracking-[0.2em] uppercase animate-cyber-flicker">
        Initializing Systems...
      </p>
    </div>
  );
}

/** Skeleton card with shimmer animation */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`cyber-card p-6 ${className}`}>
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-bg-tertiary rounded w-1/3" />
        <div className="h-8 bg-bg-tertiary rounded w-1/2" />
        <div className="h-3 bg-bg-tertiary rounded w-2/3" />
      </div>
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(0,229,255,0.04) 50%, rgba(255,255,255,0) 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }}
      />
    </div>
  );
}

/** Inline loader with spinner + text */
export function InlineLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="h-4 w-4 text-cyber-cyan animate-spin" />
      <span className="text-sm font-ibm-plex text-cyber-cyan">{text}</span>
    </div>
  );
}

/** Skeleton row for tables */
export function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 bg-bg-tertiary rounded w-16" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-bg-tertiary rounded w-32" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-bg-tertiary rounded w-12" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-bg-tertiary rounded w-24" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-bg-tertiary rounded w-20" /></td>
    </tr>
  );
}
