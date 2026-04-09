'use client';

import React from 'react';

export function BackgroundEffects() {
  return (
    <>
      {/* Scan line overlay */}
      <div className="scan-line-overlay" />

      {/* Dot grid */}
      <div
        className="fixed inset-0 bg-dot-grid pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Ambient glow orbs */}
      <div className="ambient-orb-purple" aria-hidden="true" />
      <div className="ambient-orb-cyan" aria-hidden="true" />
    </>
  );
}
