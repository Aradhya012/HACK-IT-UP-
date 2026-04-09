'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Key,
  Github,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  CheckCircle,
  Save,
} from 'lucide-react';

type SettingsSection = 'profile' | 'apikeys' | 'github' | 'security' | 'notifications';

const SECTIONS: Array<{ key: SettingsSection; label: string; icon: typeof User }> = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'apikeys', label: 'API Keys', icon: Key },
  { key: 'github', label: 'GitHub', icon: Github },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'notifications', label: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showServiceKey, setShowServiceKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('Admin');
  const [email, setEmail] = useState('admin@reforge.ai');
  const [githubToken, setGithubToken] = useState('');
  const [notifications, setNotifications] = useState({
    scanComplete: true,
    criticalVuln: true,
    patchReady: true,
    weeklyReport: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black font-orbitron text-white uppercase tracking-[0.15em] flex items-center">
          <SettingsIcon className="h-7 w-7 text-cyber-cyan mr-3" />
          Settings
        </h1>
        <p className="mt-2 text-text-secondary font-ibm-plex text-sm">
          Configure platform preferences and integrations.
        </p>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <div className="cyber-card p-3 h-fit">
          <nav className="space-y-1">
            {SECTIONS.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-ibm-plex transition-all ${
                  activeSection === section.key
                    ? 'bg-[rgba(0,229,255,0.1)] text-cyber-cyan border-l-2 border-cyber-cyan'
                    : 'text-text-secondary hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <section.icon className="h-4 w-4" />
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="cyber-card p-6">
          {/* ── PROFILE ── */}
          {activeSection === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-lg font-bold font-orbitron text-white uppercase tracking-wider mb-6 section-header">
                Profile Settings
              </h2>
              <div className="space-y-5 max-w-md">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-text-secondary font-ibm-plex mb-2">Display Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="cyber-input font-ibm-plex" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-text-secondary font-ibm-plex mb-2">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="cyber-input font-ibm-plex" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-text-secondary font-ibm-plex mb-2">Role</label>
                  <div className="cyber-input bg-bg-tertiary/50 text-text-muted cursor-not-allowed">Administrator</div>
                </div>
                <button onClick={handleSave} className="btn-primary font-orbitron text-xs flex items-center">
                  {saved ? <><CheckCircle className="mr-2 h-4 w-4" /> Saved</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── API KEYS ── */}
          {activeSection === 'apikeys' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-lg font-bold font-orbitron text-white uppercase tracking-wider mb-6 section-header">
                API Keys
              </h2>
              <div className="space-y-5">
                {[
                  { label: 'OpenRouter API Key', value: 'sk-or-v1-xxxx...xxxx', show: showApiKey, toggle: () => setShowApiKey(!showApiKey), key: 'openrouter' },
                  { label: 'Supabase Service Key', value: 'eyJhbGciOi...truncated', show: showServiceKey, toggle: () => setShowServiceKey(!showServiceKey), key: 'supabase' },
                ].map((item) => (
                  <div key={item.key}>
                    <label className="block text-xs uppercase tracking-[0.15em] text-text-secondary font-ibm-plex mb-2">{item.label}</label>
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type={item.show ? 'text' : 'password'}
                          value={item.value}
                          readOnly
                          className="cyber-input font-ibm-plex pr-20"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                          <button onClick={item.toggle} className="p-1 text-text-muted hover:text-cyber-cyan transition-colors">
                            {item.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button onClick={() => handleCopy(item.value, item.key)} className="p-1 text-text-muted hover:text-cyber-cyan transition-colors">
                            {copied === item.key ? <CheckCircle className="h-4 w-4 text-cyber-green" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <button className="btn-secondary font-orbitron text-[10px] py-2 px-3 flex items-center">
                        <RefreshCw className="h-3 w-3 mr-1" /> Rotate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── GITHUB ── */}
          {activeSection === 'github' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-lg font-bold font-orbitron text-white uppercase tracking-wider mb-6 section-header">
                GitHub Integration
              </h2>
              <div className="space-y-5 max-w-md">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-text-secondary font-ibm-plex mb-2">Personal Access Token</label>
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxx"
                    className="cyber-input font-ibm-plex"
                  />
                  <p className="text-[10px] font-ibm-plex text-text-muted mt-1">Required for private repository scanning.</p>
                </div>
                <div className="p-4 rounded-lg bg-bg-tertiary/50 border border-[rgba(255,255,255,0.07)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Github className="h-5 w-5 text-text-secondary" />
                      <div>
                        <p className="text-sm font-ibm-plex text-white">Connection Status</p>
                        <p className="text-[10px] font-ibm-plex text-text-muted">OAuth integration</p>
                      </div>
                    </div>
                    <span className="badge-medium rounded-full px-2.5 py-1 text-[10px] font-bold">Not Connected</span>
                  </div>
                </div>
                <button onClick={handleSave} className="btn-primary font-orbitron text-xs flex items-center">
                  <Save className="mr-2 h-4 w-4" /> Save Token
                </button>
              </div>
            </motion.div>
          )}

          {/* ── SECURITY ── */}
          {activeSection === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-lg font-bold font-orbitron text-white uppercase tracking-wider mb-6 section-header">
                Security Settings
              </h2>
              <div className="space-y-5 max-w-md">
                <div className="flex items-center justify-between p-4 rounded-lg bg-bg-tertiary/50 border border-[rgba(255,255,255,0.07)]">
                  <div>
                    <p className="text-sm font-ibm-plex text-white">Two-Factor Authentication</p>
                    <p className="text-[10px] font-ibm-plex text-text-muted">Add an extra layer of security</p>
                  </div>
                  <button className="btn-secondary text-[10px] py-1.5 px-3 font-orbitron">Enable</button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-bg-tertiary/50 border border-[rgba(255,255,255,0.07)]">
                  <div>
                    <p className="text-sm font-ibm-plex text-white">Session Timeout</p>
                    <p className="text-[10px] font-ibm-plex text-text-muted">Auto-logout after inactivity</p>
                  </div>
                  <select className="bg-bg-tertiary border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-1.5 text-xs font-ibm-plex text-white outline-none focus:border-cyber-cyan">
                    <option value="30">30 min</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="0">Never</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-bg-tertiary/50 border border-[rgba(255,255,255,0.07)]">
                  <div>
                    <p className="text-sm font-ibm-plex text-white">Active Sessions</p>
                    <p className="text-[10px] font-ibm-plex text-text-muted">Manage your active sessions</p>
                  </div>
                  <span className="text-xs font-ibm-plex text-cyber-cyan">1 active</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeSection === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-lg font-bold font-orbitron text-white uppercase tracking-wider mb-6 section-header">
                Notification Preferences
              </h2>
              <div className="space-y-4 max-w-md">
                {[
                  { key: 'scanComplete', label: 'Scan Completed', desc: 'Get notified when scans finish' },
                  { key: 'criticalVuln', label: 'Critical Vulnerabilities', desc: 'Alert on critical findings' },
                  { key: 'patchReady', label: 'Patches Ready', desc: 'Notify when patches are generated' },
                  { key: 'weeklyReport', label: 'Weekly Digest', desc: 'Weekly security summary email' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-bg-tertiary/50 border border-[rgba(255,255,255,0.07)]">
                    <div>
                      <p className="text-sm font-ibm-plex text-white">{item.label}</p>
                      <p className="text-[10px] font-ibm-plex text-text-muted">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className={`relative w-11 h-6 rounded-full transition-all ${notifications[item.key as keyof typeof notifications] ? 'bg-cyber-cyan' : 'bg-bg-tertiary border border-[rgba(255,255,255,0.15)]'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${notifications[item.key as keyof typeof notifications] ? 'left-6 bg-black' : 'left-1 bg-text-muted'}`} />
                    </button>
                  </div>
                ))}
                <button onClick={handleSave} className="btn-primary font-orbitron text-xs flex items-center mt-2">
                  {saved ? <><CheckCircle className="mr-2 h-4 w-4" /> Saved</> : <><Save className="mr-2 h-4 w-4" /> Save Preferences</>}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}