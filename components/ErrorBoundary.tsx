'use client';

import React, { Component, ReactNode } from 'react';
import { ShieldX } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
          <div className="cyber-card p-8 max-w-md w-full text-center">
            <ShieldX className="h-12 w-12 text-cyber-magenta mx-auto mb-4 icon-glow-magenta" />
            <h2 className="text-xl font-black font-orbitron text-cyber-magenta uppercase tracking-wider mb-2">
              System Error
            </h2>
            <p className="text-sm font-ibm-plex text-text-secondary mb-6">
              {this.state.error?.message || 'An unexpected error occurred in this module.'}
            </p>
            <button
              onClick={this.handleRestart}
              className="btn-primary font-orbitron text-xs"
            >
              Restart System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
