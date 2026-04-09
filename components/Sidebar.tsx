'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Upload,
  ShieldAlert,
  Wrench,
  Target,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload / Scan', href: '/upload', icon: Upload },
  { name: 'Vulnerabilities', href: '/scan-results', icon: ShieldAlert },
  { name: 'Patches', href: '/patches', icon: Wrench },
  { name: 'Red Team', href: '/scan-results?tab=redteam', icon: Target },
  { name: 'Timeline', href: '/timeline', icon: Clock },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActive = (href: string): boolean => {
    if (href === '/dashboard') return pathname === '/dashboard';
    if (href.includes('?')) return pathname === href.split('?')[0];
    return pathname === href || (pathname.startsWith(href) && href !== '/dashboard');
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-bg-primary/95 backdrop-blur-xl border-r border-[rgba(0,229,255,0.25)] transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-[240px]' : 'w-[72px]'
        }`}
      >
        {/* Brand area */}
        <div className="flex items-center justify-center h-[72px] border-b border-[rgba(255,255,255,0.07)] px-4">
          {sidebarOpen ? (
            <div className="flex items-center space-x-2 w-full">
              <Shield className="h-7 w-7 text-cyber-cyan animate-glow-pulse flex-shrink-0" />
              <div className="flex items-baseline space-x-1">
                <span className="text-lg font-black font-orbitron text-white tracking-wider">
                  REFORGE
                </span>
                <span className="text-lg font-black font-orbitron text-cyber-cyan">
                  AI
                </span>
              </div>
              <span className="text-[8px] border border-cyber-cyan/30 rounded px-1 py-0.5 text-cyber-cyan font-ibm-plex ml-1">
                v1.0
              </span>
            </div>
          ) : (
            <Shield className="h-7 w-7 text-cyber-cyan animate-glow-pulse" />
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 relative ${
                    active
                      ? 'text-cyber-cyan'
                      : 'text-text-secondary hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Active left border */}
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-cyber-cyan shadow-[0_0_8px_#00E5FF]" />
                  )}

                  {/* Active background gradient */}
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,229,255,0.1)] to-transparent pointer-events-none" />
                  )}

                  <item.icon
                    className={`flex-shrink-0 h-[18px] w-[18px] transition-all ${
                      active
                        ? 'text-cyber-cyan icon-glow-cyan'
                        : 'text-text-muted group-hover:text-text-secondary'
                    } ${sidebarOpen ? 'mr-3' : 'mx-auto'}`}
                  />

                  {sidebarOpen && (
                    <span className="truncate font-ibm-plex text-[13px]">
                      {item.name}
                    </span>
                  )}
                </Link>

                {/* Tooltip on collapsed sidebar */}
                {!sidebarOpen && hoveredItem === item.name && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-[60] pointer-events-none">
                    <div className="bg-bg-secondary border border-[rgba(0,229,255,0.25)] rounded-lg px-3 py-2 text-xs font-ibm-plex text-white whitespace-nowrap shadow-card">
                      {item.name}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-bg-secondary border-l border-b border-[rgba(0,229,255,0.25)] rotate-45" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-[rgba(255,255,255,0.07)] p-3">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3 px-2">
              <div className="h-8 w-8 rounded-full bg-bg-tertiary border-2 border-cyber-cyan/50 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold font-orbitron text-cyber-cyan">
                  A
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-ibm-plex text-white truncate">
                  Admin
                </p>
                <p className="text-[10px] font-ibm-plex text-text-muted truncate">
                  admin@reforge.ai
                </p>
              </div>
              <button
                className="text-text-muted hover:text-cyber-magenta transition-colors p-1"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="h-8 w-8 rounded-full bg-bg-tertiary border-2 border-cyber-cyan/50 flex items-center justify-center">
                <span className="text-xs font-bold font-orbitron text-cyber-cyan">
                  A
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute right-[-12px] top-1/2 -translate-y-1/2 z-50 h-6 w-6 rounded-full bg-bg-secondary border border-[rgba(0,229,255,0.25)] flex items-center justify-center hover:border-cyber-cyan transition-colors shadow-card"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-3 w-3 text-cyber-cyan" />
          ) : (
            <ChevronRight className="h-3 w-3 text-cyber-cyan" />
          )}
        </button>
      </aside>
    </>
  );
}
