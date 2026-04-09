'use client';

import { Inter, IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { ScanProvider } from '@/components/ScanContext';
import { BackgroundEffects } from '@/components/BackgroundEffects';

/* ── We load Orbitron as a local/google font. Using next/font/google: ── */
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

/** Routes that should NOT show sidebar/navbar (auth pages, landing) */
const STANDALONE_ROUTES = ['/login', '/signup'];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  const isStandalone = STANDALONE_ROUTES.includes(pathname) || pathname === '/';

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${ibmPlexMono.variable} ${inter.variable}`}
    >
      <head>
        <title>Reforge AI — Autonomous Security Platform</title>
        <meta
          name="description"
          content="Multi-agent LLM-powered vulnerability scanning, patch generation, and red-team validation."
        />
        <meta name="theme-color" content="#0D0B1E" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-bg-primary text-white overflow-x-hidden font-ibm-plex">
        <ScanProvider>
          {/* Scan line overlay — always visible */}
          <div className="scan-line-overlay" />

          {isStandalone ? (
            /* ── Standalone layout (landing, login, signup) ── */
            <div className="relative min-h-screen">
              <div className="ambient-orb-purple" />
              <div className="ambient-orb-cyan" />
              <div className="fixed inset-0 bg-dot-grid pointer-events-none z-0" />
              <div className="relative z-10">{children}</div>
            </div>
          ) : (
            /* ── App layout (sidebar + navbar + content) ── */
            <div className="flex h-screen overflow-hidden relative">
              {/* Background effects */}
              <div className="fixed inset-0 bg-dot-grid pointer-events-none z-0" />
              <div className="ambient-orb-purple" />
              <div className="ambient-orb-cyan" />

              {/* Sidebar */}
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />

              {/* Main area */}
              <div
                className="flex flex-col flex-1 overflow-hidden relative z-10 transition-all duration-300"
                style={{
                  marginLeft: mounted
                    ? sidebarOpen
                      ? '240px'
                      : '72px'
                    : '72px',
                }}
              >
                <Navbar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />

                <main className="flex-1 overflow-y-auto relative bg-bg-primary">
                  <div className="relative z-10 p-6 md:p-8">{children}</div>
                </main>
              </div>
            </div>
          )}
        </ScanProvider>
      </body>
    </html>
  );
}
