'use client';

import '../styles/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>VulnGuard — Autonomous NPM Security System</title>
        <meta name="description" content="Autonomous NPM Vulnerability Detection, Analysis & Remediation" />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className={`${inter.className} bg-bg-primary text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
