'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Shield, Lock, Globe, Database, CheckCircle2, ArrowRight, FileCheck, TrendingDown, Building2
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="absolute top-0 w-full px-6 md:px-8 py-6 flex justify-between items-center z-50">
        <div className="text-xl md:text-2xl font-black font-orbitron text-white flex items-center group tracking-wider">
          <Shield className="mr-3 h-7 w-7 text-cyber-cyan transition-transform group-hover:scale-110 duration-300 icon-glow-cyan" />
          REFORGE <span className="text-cyber-cyan ml-1">AI</span>
        </div>
        <div className="hidden md:flex space-x-10 text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase font-orbitron">
          <Link href="#solutions" className="hover:text-cyber-cyan transition-colors">Frameworks</Link>
          <Link href="#compliance" className="hover:text-cyber-cyan transition-colors">Intelligence</Link>
          <Link href="#api-defense" className="hover:text-cyber-cyan transition-colors">API Defense</Link>
          <Link href="#enterprise" className="hover:text-cyber-cyan transition-colors">Enterprise</Link>
        </div>
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link href="/login">
            <button className="text-[10px] font-bold tracking-[0.2em] text-white hover:text-cyber-cyan uppercase transition-colors font-orbitron">
              Login
            </button>
          </Link>
          <Link href="/upload">
            <button className="btn-primary py-2.5 px-5 text-[10px] font-orbitron">
              Start Audit
            </button>
          </Link>
        </div>
      </nav>

      <main className="pt-32 md:pt-40 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32 md:mb-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left z-10"
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-0.5 w-10 bg-cyber-cyan glow-cyan" />
              <span className="text-cyber-cyan text-[10px] font-bold font-orbitron tracking-[0.2em] uppercase">
                Autonomous Vulnerability Engine
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-orbitron leading-[1.1] mb-8 text-white tracking-tight uppercase">
              Establish Trust In{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyber-cyan to-cyber-purple">
                Production Layers
              </span>
            </h1>

            <p className="text-text-secondary font-ibm-plex text-sm md:text-base mb-10 max-w-xl leading-relaxed">
              Reforge operates an autonomous risk-prevention compiler for modern systems.
              Fortify backend architectures, eliminate injection vectors, stop zero-days,
              and enforce security policies before merging branches.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/upload">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary w-full sm:w-auto font-orbitron text-sm flex items-center justify-center py-4 px-8"
                >
                  Start Scanning <ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </Link>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-secondary w-full sm:w-auto font-orbitron text-sm flex items-center justify-center py-4 px-8"
                >
                  Access Console
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[450px] md:h-[500px] w-full hidden lg:block"
          >
            <div className="absolute inset-0 bg-cyber-cyan/10 blur-[100px] rounded-full opacity-40 pointer-events-none" />

            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/4 left-1/4 right-0 bottom-0"
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 md:w-80 h-96 cyber-card p-8 flex flex-col items-center justify-center z-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />

                <div className="w-20 h-20 bg-bg-tertiary border border-[rgba(255,255,255,0.07)] rounded-xl flex items-center justify-center mb-8 glow-cyan">
                  <Database className="text-cyber-cyan h-10 w-10" />
                </div>

                <div className="w-full space-y-6 font-ibm-plex text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.15em]">
                      <span className="text-text-secondary">Path Traversal</span>
                      <CheckCircle2 className="h-4 w-4 text-cyber-green icon-glow-green" />
                    </div>
                    <div className="h-1 w-full bg-bg-primary rounded-full overflow-hidden">
                      <div className="h-full w-full bg-cyber-green" style={{ filter: 'drop-shadow(0 0 5px #00FF88)' }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.15em]">
                      <span className="text-text-secondary">Injection Sweep</span>
                      <span className="text-cyber-cyan font-bold">100%</span>
                    </div>
                    <div className="h-1 w-full bg-bg-primary rounded-full overflow-hidden">
                      <div className="h-full w-full bg-cyber-cyan" style={{ filter: 'drop-shadow(0 0 5px #00E5FF)' }} />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[rgba(255,255,255,0.07)] mt-6">
                    <div className="flex justify-between text-[10px] tracking-[0.15em]">
                      <span className="text-text-muted uppercase">Integrity Score</span>
                      <span className="text-white font-bold font-orbitron">A+ RATING</span>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, 15, 0], x: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -right-8 md:-right-12 top-20 w-44 md:w-48 p-4 cyber-card flex items-center space-x-3 z-30"
              >
                <div className="p-2.5 bg-[rgba(255,214,0,0.1)] border border-[rgba(255,214,0,0.3)] rounded-lg">
                  <Lock className="h-5 w-5 text-cyber-yellow" />
                </div>
                <div>
                  <div className="text-white font-bold font-orbitron text-xs">Zero-Trust</div>
                  <div className="text-text-muted text-[9px] uppercase tracking-wider font-ibm-plex">Enforced</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -15, 0], x: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -left-12 md:-left-16 bottom-28 md:bottom-32 w-52 md:w-56 p-4 cyber-card flex items-center space-x-3 z-30"
              >
                <div className="p-2.5 bg-[rgba(0,229,255,0.1)] border border-[rgba(0,229,255,0.3)] rounded-lg">
                  <Globe className="h-5 w-5 text-cyber-cyan" />
                </div>
                <div>
                  <div className="text-white font-bold font-orbitron text-xs">Edge Validation</div>
                  <div className="text-text-muted text-[9px] uppercase tracking-wider font-ibm-plex">Active Monitoring</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-32 md:mb-40 border-y border-[rgba(255,255,255,0.07)] py-12 md:py-16"
        >
          <p className="text-text-muted text-[9px] font-bold tracking-[0.25em] uppercase font-orbitron mb-8 md:mb-10">
            Trusted by enterprise production platforms globally
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-24 opacity-40 hover:opacity-80 transition-opacity duration-500">
            {[
              { icon: Shield, name: 'ARMORHQ' },
              { icon: Globe, name: 'NEXUS' },
              { icon: Building2, name: 'FINCORP' },
              { icon: Database, name: 'VECTOR' },
            ].map((company) => (
              <div key={company.name} className="text-lg md:text-xl font-black font-orbitron text-white flex items-center tracking-wider">
                <company.icon className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6 text-text-secondary" />
                {company.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black font-orbitron text-white mb-6 tracking-wide uppercase">
              Infrastructure Resiliency
            </h2>
            <p className="text-text-secondary font-ibm-plex max-w-2xl mx-auto text-sm leading-relaxed">
              Zero-knowledge verification frameworks that identify logical bypasses dynamically.
              We map structural AST vulnerabilities instantaneously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {[
              { title: 'Data Extraction Prevention', desc: 'Safeguard backend logic paths mapping to SQL injection sequences.', icon: TrendingDown, color: 'text-cyber-green', borderColor: '#00FF88' },
              { title: 'Deep Dependency Scanning', desc: 'Audit package locks blocking malicious third-party dependencies.', icon: FileCheck, color: 'text-cyber-cyan', borderColor: '#00E5FF' },
              { title: 'Auth Bypass Lockdowns', desc: 'Block faulty stateless token decoders and broken JWT implementations.', icon: Lock, color: 'text-cyber-yellow', borderColor: '#FFD600' },
              { title: 'Live Exploit Matrix', desc: 'Execute adversarial maneuvers testing security bounds automatically.', icon: Shield, color: 'text-cyber-magenta', borderColor: '#C724B1' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="cyber-card p-7 md:p-8 relative overflow-hidden group"
              >
                <div
                  className="absolute top-0 left-0 w-full h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.borderColor}, transparent)` }}
                />
                <div className={`p-3 bg-bg-tertiary border border-[rgba(255,255,255,0.07)] rounded-xl inline-block mb-6 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base md:text-lg font-bold font-orbitron text-white mb-3 tracking-wide uppercase">{item.title}</h3>
                <p className="text-text-secondary font-ibm-plex text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
