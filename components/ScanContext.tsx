'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AppState = 'idle' | 'uploading' | 'scanning' | 'showing-results' | 'error';

interface Patch {
  file: string;
  change: string;
  before?: string;
  after?: string;
}

interface ScanContextType {
  appState: AppState;
  setAppState: (state: AppState) => void;
  projectId: string | null;
  setProjectId: (id: string | null) => void;
  scanResults: Array<{ type: string; severity: string; file: string; line: number; snippet: string }>;
  setScanResults: (results: Array<{ type: string; severity: string; file: string; line: number; snippet: string }>) => void;
  patches: Patch[];
  setPatches: (patches: Patch[]) => void;
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
  resetScan: () => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

const STORAGE_KEY = 'reforge-scan-state';

export function ScanProvider({ children }: { children: ReactNode }) {
  const [appState, setAppState] = useState<AppState>('idle');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [scanResults, setScanResults] = useState<Array<{ type: string; severity: string; file: string; line: number; snippet: string }>>([]);
  const [patches, setPatches] = useState<Patch[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.projectId) setProjectId(data.projectId);
        if (data.scanResults?.length) setScanResults(data.scanResults);
        if (data.patches?.length) setPatches(data.patches);
        if (data.appState === 'showing-results') setAppState('showing-results');
      }
    } catch {
      // Ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on state change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          projectId,
          scanResults,
          patches,
          appState: appState === 'showing-results' ? 'showing-results' : 'idle',
        })
      );
    } catch {
      // Ignore storage errors
    }
  }, [projectId, scanResults, patches, appState, hydrated]);

  const resetScan = () => {
    setAppState('idle');
    setProjectId(null);
    setScanResults([]);
    setPatches([]);
    setErrorMessage(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <ScanContext.Provider
      value={{
        appState,
        setAppState,
        projectId,
        setProjectId,
        scanResults,
        setScanResults,
        patches,
        setPatches,
        errorMessage,
        setErrorMessage,
        resetScan,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
}