'use client';

import { useState } from 'react';
import { Upload, Github, Shield, FileArchive, X } from 'lucide-react';

interface UploadFormProps {
  onUploadStart: () => void;
  onUploadComplete: (projectId: string) => void;
  onScanComplete: (findings: unknown[], patches: unknown[]) => void;
  onError: (error: string) => void;
}

export default function UploadForm({ onUploadStart, onUploadComplete, onScanComplete, onError }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'zip' | 'github'>('zip');
  const [githubToken, setGithubToken] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onUploadStart();
    try {
      if (uploadMethod === 'zip' && file) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');
        onUploadComplete(data.projectId);
        const scanRes = await fetch('/api/scan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId: data.projectId }) });
        const scanData = await scanRes.json();
        if (!scanRes.ok || !scanData.success) throw new Error(scanData.error || 'Scan failed');
        onScanComplete(scanData.findings, scanData.patches);
      } else if (uploadMethod === 'github' && repoUrl) {
        const res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ repoUrl, githubToken }) });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Clone failed');
        onUploadComplete(data.projectId);
        const scanRes = await fetch('/api/scan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId: data.projectId }) });
        const scanData = await scanRes.json();
        if (!scanRes.ok || !scanData.success) throw new Error(scanData.error || 'Scan failed');
        onScanComplete(scanData.findings, scanData.patches);
      }
    } catch (error) {
      onError((error as Error).message);
    }
  };

  return (
    <div className="cyber-card p-6 mb-8">
      <h2 className="text-xl font-bold font-orbitron text-white uppercase tracking-wider mb-6">Upload Code</h2>

      <div className="flex space-x-3 mb-6">
        <button onClick={() => setUploadMethod('zip')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider transition-all ${uploadMethod === 'zip' ? 'bg-cyber-cyan text-black' : 'bg-bg-tertiary text-text-secondary border border-[rgba(255,255,255,0.07)]'}`}>
          <Upload className="mr-2 h-4 w-4 inline" /> Upload ZIP
        </button>
        <button onClick={() => setUploadMethod('github')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider transition-all ${uploadMethod === 'github' ? 'bg-cyber-cyan text-black' : 'bg-bg-tertiary text-text-secondary border border-[rgba(255,255,255,0.07)]'}`}>
          <Github className="mr-2 h-4 w-4 inline" /> GitHub
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {uploadMethod === 'zip' ? (
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-[0.15em] text-text-secondary font-ibm-plex mb-2">Select ZIP File</label>
            <input type="file" accept=".zip" onChange={handleFileChange} className="cyber-input font-ibm-plex" required />
            {file && (
              <div className="mt-3 flex items-center space-x-3 bg-bg-tertiary rounded-lg px-4 py-2 border border-[rgba(255,255,255,0.07)]">
                <FileArchive className="h-4 w-4 text-cyber-cyan" />
                <span className="text-sm font-ibm-plex text-cyber-cyan">{file.name}</span>
                <button type="button" onClick={() => setFile(null)} className="text-text-muted hover:text-cyber-magenta"><X className="h-3 w-3" /></button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-text-secondary font-ibm-plex mb-2">Repository URL</label>
              <input type="text" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/user/repo" className="cyber-input font-ibm-plex" required />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-text-secondary font-ibm-plex mb-2">GitHub Token (optional)</label>
              <input type="password" value={githubToken} onChange={(e) => setGithubToken(e.target.value)} placeholder="ghp_********" className="cyber-input font-ibm-plex" />
            </div>
          </div>
        )}
        <button type="submit" className="btn-primary w-full font-orbitron text-xs">
          <Shield className="mr-2 h-4 w-4 inline" /> Upload and Scan
        </button>
      </form>
    </div>
  );
}