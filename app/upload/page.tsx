'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScan } from '@/components/ScanContext';
import { useRouter } from 'next/navigation';
import {
  Upload as UploadIcon,
  Github,
  FileText,
  Loader2,
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  FileArchive,
  X,
} from 'lucide-react';

type ScanPhase = 'idle' | 'fetching' | 'analyzing' | 'patching' | 'reporting' | 'complete';

const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\.git)?$/;

const AGENTS = [
  { name: 'Architect', emoji: '🏗️', description: 'Analyzes code structure and architecture' },
  { name: 'Builder', emoji: '🔨', description: 'Constructs security test harnesses' },
  { name: 'Critic', emoji: '🔎', description: 'Identifies vulnerabilities and weaknesses' },
  { name: 'Sentinel', emoji: '🛡️', description: 'Validates security patches' },
  { name: 'Red-Team', emoji: '⚔️', description: 'Simulates adversarial attack vectors' },
];

export default function UploadPage() {
  const router = useRouter();
  const { appState, setAppState, setProjectId, setScanResults, setPatches, setErrorMessage, errorMessage } = useScan();

  const [file, setFile] = useState<File | null>(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'zip' | 'github'>('zip');
  const [isDragging, setIsDragging] = useState(false);
  const [scanPhase, setScanPhase] = useState<ScanPhase>('idle');
  const [progress, setProgress] = useState(0);

  const [scanConfig, setScanConfig] = useState({
    deepAnalysis: true,
    owaspTop10: true,
    secretDetection: true,
    dependencyAudit: true,
    redTeamValidation: true,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]?.name.endsWith('.zip')) setFile(e.dataTransfer.files[0]);
  };

  const validateGitHubUrl = (url: string) => {
    if (!url) { setUrlError(''); return; }
    if (!GITHUB_URL_REGEX.test(url)) setUrlError('Invalid GitHub URL format');
    else setUrlError('');
  };

  const simulateProgress = () => {
    const phases: ScanPhase[] = ['fetching', 'analyzing', 'patching', 'reporting', 'complete'];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < phases.length) {
        setScanPhase(phases[idx]);
        setProgress((idx + 1) * 20);
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => router.push('/scan-results'), 1000);
      }
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppState('uploading');
    setErrorMessage(null);
    setProgress(0);

    try {
      if (uploadMethod === 'zip' && file) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');
        setProjectId(data.projectId);
        setAppState('scanning');
        setScanPhase('fetching');
        simulateProgress();
        const scanRes = await fetch('/api/scan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId: data.projectId }) });
        const scanData = await scanRes.json();
        if (!scanRes.ok || !scanData.success) throw new Error(scanData.error || 'Scan failed');
        setScanResults(scanData.findings);
        setPatches(scanData.patches);
        setAppState('showing-results');
      } else if (uploadMethod === 'github' && repoUrl) {
        if (!GITHUB_URL_REGEX.test(repoUrl)) { setUrlError('Invalid GitHub URL'); setAppState('idle'); return; }
        const res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ repoUrl }) });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Clone failed');
        setProjectId(data.projectId);
        setAppState('scanning');
        setScanPhase('fetching');
        simulateProgress();
        const scanRes = await fetch('/api/scan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId: data.projectId }) });
        const scanData = await scanRes.json();
        if (!scanRes.ok || !scanData.success) throw new Error(scanData.error || 'Scan failed');
        setScanResults(scanData.findings);
        setPatches(scanData.patches);
        setAppState('showing-results');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMessage(message);
      setAppState('error');
    }
  };

  const phaseLabels: Record<ScanPhase, string> = {
    idle: 'Ready to Scan',
    fetching: 'Fetching Repository...',
    analyzing: 'Analyzing Code...',
    patching: 'Generating Patches...',
    reporting: 'Building Report...',
    complete: 'Scan Complete',
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black font-orbitron text-white uppercase tracking-[0.15em] flex items-center">
          <UploadIcon className="h-8 w-8 text-cyber-cyan mr-3" />
          Upload Repository
        </h1>
        <p className="mt-2 text-text-secondary font-ibm-plex text-sm">
          Initiate deep vulnerability scanning for your codebase.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── LEFT: UPLOAD ZONE ── */}
        <div className="space-y-6">
          {/* Method toggle */}
          <div className="flex space-x-2 p-1.5 bg-bg-tertiary rounded-xl border border-[rgba(255,255,255,0.07)]">
            <button type="button" onClick={() => setUploadMethod('zip')}
              className={`flex-1 flex justify-center items-center px-4 py-2.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider transition-all ${uploadMethod === 'zip' ? 'bg-gradient-cyber text-black shadow-glow-cyan' : 'text-text-secondary hover:text-white'}`}>
              <UploadIcon className="mr-2 h-4 w-4" /> Upload ZIP
            </button>
            <button type="button" onClick={() => setUploadMethod('github')}
              className={`flex-1 flex justify-center items-center px-4 py-2.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider transition-all ${uploadMethod === 'github' ? 'bg-gradient-cyber text-black shadow-glow-cyan' : 'text-text-secondary hover:text-white'}`}>
              <Github className="mr-2 h-4 w-4" /> GitHub
            </button>
          </div>

          {/* Error */}
          <AnimatePresence>
            {appState === 'error' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-[rgba(199,36,177,0.1)] border border-cyber-magenta/30 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-cyber-magenta flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold font-orbitron text-cyber-magenta">Scan Aborted</h4>
                  <p className="text-xs font-ibm-plex text-cyber-magenta/80 mt-1">{errorMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress */}
          <AnimatePresence>
            {(appState === 'uploading' || appState === 'scanning') && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="cyber-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-ibm-plex text-cyber-cyan flex items-center">
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                    {phaseLabels[scanPhase]}
                  </span>
                  <span className="text-lg font-black font-orbitron text-cyber-cyan">{progress}%</span>
                </div>
                <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            {uploadMethod === 'zip' ? (
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-cyber-cyan bg-[rgba(0,229,255,0.08)] shadow-glow-cyan' : 'border-[rgba(0,229,255,0.3)] hover:border-cyber-cyan/50 bg-[rgba(0,229,255,0.03)]'}`}
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <UploadIcon className={`h-12 w-12 text-cyber-cyan mb-4 ${isDragging ? 'animate-bounce' : ''}`} />
                  <h3 className="text-lg font-bold font-orbitron text-white uppercase mb-1">
                    {isDragging ? 'Drop File Here' : 'Drop Your Repo Here'}
                  </h3>
                  <p className="text-xs font-ibm-plex text-text-muted mb-6">.zip files up to 50MB</p>
                  <input type="file" accept=".zip" onChange={handleFileChange} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="btn-secondary text-xs font-orbitron cursor-pointer py-2.5 px-6">
                    <Shield className="mr-2 h-4 w-4 inline" /> Select File
                  </label>
                  {file && (
                    <div className="mt-6 flex items-center space-x-3 bg-bg-tertiary rounded-xl px-4 py-3 border border-[rgba(255,255,255,0.07)]">
                      <FileArchive className="h-4 w-4 text-cyber-cyan" />
                      <span className="text-sm font-ibm-plex text-cyber-cyan truncate max-w-[180px]">{file.name}</span>
                      <span className="text-[10px] text-text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <button type="button" onClick={() => setFile(null)} className="text-text-muted hover:text-cyber-magenta">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-text-secondary font-ibm-plex mb-2">
                    GitHub Repository URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Github className="h-4 w-4 text-text-muted" />
                    </div>
                    <input type="text" value={repoUrl}
                      onChange={(e) => { setRepoUrl(e.target.value); validateGitHubUrl(e.target.value); }}
                      placeholder="https://github.com/org/repo.git"
                      className={`cyber-input pl-11 font-ibm-plex ${urlError ? 'border-cyber-magenta focus:border-cyber-magenta' : ''}`}
                    />
                  </div>
                  {urlError && <p className="text-xs text-cyber-magenta font-ibm-plex mt-1">{urlError}</p>}
                </div>
              </div>
            )}

            <button type="submit"
              disabled={appState === 'uploading' || appState === 'scanning' || (uploadMethod === 'zip' && !file) || (uploadMethod === 'github' && (!repoUrl || !!urlError))}
              className="btn-primary w-full mt-6 font-orbitron text-sm flex items-center justify-center py-4">
              {appState === 'uploading' || appState === 'scanning' ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Scanning...</>
              ) : (
                <><Zap className="mr-2 h-5 w-5" /> Initiate Scan <ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </button>
          </form>
        </div>

        {/* ── RIGHT: SCAN CONFIGURATION ── */}
        <div className="space-y-6">
          <div className="cyber-card p-6">
            <h3 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider mb-5 section-header">
              Scan Configuration
            </h3>
            <div className="space-y-3">
              {[
                { key: 'deepAnalysis', label: 'Deep LLM Analysis' },
                { key: 'owaspTop10', label: 'OWASP Top 10' },
                { key: 'secretDetection', label: 'Secret Detection' },
                { key: 'dependencyAudit', label: 'Dependency Audit' },
                { key: 'redTeamValidation', label: 'Red-Team Validation' },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center space-x-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${scanConfig[opt.key as keyof typeof scanConfig] ? 'bg-cyber-cyan border-cyber-cyan' : 'border-[rgba(0,229,255,0.25)] bg-bg-tertiary'}`}
                    onClick={() => setScanConfig(prev => ({ ...prev, [opt.key]: !prev[opt.key as keyof typeof prev] }))}>
                    {scanConfig[opt.key as keyof typeof scanConfig] && (
                      <CheckCircle2 className="h-3 w-3 text-black" />
                    )}
                  </div>
                  <span className="text-sm font-ibm-plex text-text-secondary group-hover:text-white transition-colors">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Agent Pipeline Visual */}
          <div className="cyber-card p-6">
            <h3 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider mb-5 section-header">
              Agent Pipeline
            </h3>
            <div className="space-y-0">
              {AGENTS.map((agent, idx) => {
                const isActive = appState === 'scanning' && idx <= Math.floor(progress / 20);
                const isComplete = appState === 'scanning' && idx < Math.floor(progress / 20);
                return (
                  <div key={agent.name} className="flex items-start space-x-3">
                    {/* Stepper line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-all ${isComplete ? 'border-cyber-green bg-cyber-green/10' : isActive ? 'border-cyber-cyan bg-cyber-cyan/10 animate-pulse' : 'border-[rgba(255,255,255,0.07)] bg-bg-tertiary'}`}>
                        {agent.emoji}
                      </div>
                      {idx < AGENTS.length - 1 && (
                        <div className={`w-0.5 h-6 my-1 transition-colors ${isComplete ? 'bg-cyber-green' : 'bg-[rgba(255,255,255,0.07)]'}`} />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className={`text-sm font-ibm-plex font-medium ${isActive ? 'text-cyber-cyan' : 'text-text-secondary'}`}>{agent.name}</p>
                      <p className="text-[10px] font-ibm-plex text-text-muted">{agent.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
