'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Menu, Shield } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'COMMAND CENTER', subtitle: 'Autonomous security operations dashboard' },
  '/upload': { title: 'UPLOAD / SCAN', subtitle: 'Initiate vulnerability audit' },
  '/scan-results': { title: 'SCAN RESULTS', subtitle: 'Vulnerability intelligence report' },
  '/patches': { title: 'PATCH MANAGEMENT', subtitle: 'Review and apply security patches' },
  '/timeline': { title: 'SECURITY TIMELINE', subtitle: 'Track security events and history' },
  '/settings': { title: 'SETTINGS', subtitle: 'Configure platform preferences' },
};

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Navbar({ sidebarOpen, setSidebarOpen }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState('');
  const [notificationCount] = useState(3);

  const pageInfo = PAGE_TITLES[pathname] || { title: 'REFORGE AI', subtitle: 'Autonomous security platform' };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="sticky top-0 z-30 flex items-center h-[72px] bg-bg-primary/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.07)] px-4 md:px-8">
      {/* Left — Mobile menu + Breadcrumb */}
      <div className="flex items-center flex-1 min-w-0">
        <button
          type="button"
          className="mr-4 p-2 rounded-lg text-text-muted hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-all md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm md:text-base font-black font-orbitron text-white tracking-[0.1em] truncate">
            {pageInfo.title}
          </h1>
          <p className="text-[10px] md:text-xs text-text-secondary font-ibm-plex truncate mt-0.5">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Center — Status pill (hidden on mobile) */}
      <div className="hidden md:flex items-center">
        <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)]">
          <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
          <span className="text-[10px] font-orbitron font-bold uppercase tracking-[0.15em] text-cyber-green">
            System Secure
          </span>
        </div>
      </div>

      {/* Right — Notifications, Clock, Avatar */}
      <div className="flex items-center space-x-3 md:space-x-5 flex-shrink-0 ml-4">
        {/* Notification bell */}
        <button
          className="relative p-2 rounded-lg text-text-secondary hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-all"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cyber-magenta rounded-full flex items-center justify-center text-[8px] font-bold text-white">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Live clock */}
        <div className="hidden sm:block text-sm font-ibm-plex text-cyber-cyan tabular-nums tracking-wider">
          {currentTime}
        </div>

        {/* User avatar */}
        <div className="h-8 w-8 rounded-full bg-bg-tertiary border-2 border-cyber-cyan/40 flex items-center justify-center">
          <span className="text-[10px] font-bold font-orbitron text-cyber-cyan">
            A
          </span>
        </div>
      </div>
    </nav>
  );
}
