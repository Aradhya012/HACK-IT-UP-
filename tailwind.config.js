/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0D0B1E',
        'bg-secondary': '#12102A',
        'bg-tertiary': '#1A1535',
        'cyber-cyan': '#00E5FF',
        'cyber-purple': '#7B2FBE',
        'cyber-magenta': '#C724B1',
        'cyber-green': '#00FF88',
        'cyber-yellow': '#FFD600',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0B4C8',
        'text-muted': '#4A5568',
      },
      fontFamily: {
        orbitron: ['var(--font-orbitron)', 'monospace'],
        'ibm-plex': ['var(--font-ibm-plex-mono)', 'monospace'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'scan-line': 'scan-line 8s linear infinite',
        'cyber-flicker': 'cyber-flicker 4s linear infinite',
        'border-trace': 'border-trace 0.6s ease-out forwards',
        'float-up': 'float-up 0.5s ease-out forwards',
        shimmer: 'shimmer 1.5s linear infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0,229,255,0.4)' },
          '50%': { boxShadow: '0 0 24px rgba(0,229,255,0.8), 0 0 48px rgba(0,229,255,0.3)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        'cyber-flicker': {
          '0%, 94%, 96%, 100%': { opacity: '1' },
          '95%': { opacity: '0.7' },
        },
        'border-trace': {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0% 0 0)' },
        },
        'float-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.5)' },
        },
      },
      backgroundImage: {
        'cyber-grid': 'radial-gradient(circle, rgba(0,229,255,0.06) 1px, transparent 1px)',
        'gradient-cyber': 'linear-gradient(135deg, #00E5FF 0%, #7B2FBE 100%)',
      },
      backgroundSize: {
        'grid-28': '28px 28px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0,229,255,0.4)',
        'glow-magenta': '0 0 20px rgba(199,36,177,0.4)',
        'glow-green': '0 0 20px rgba(0,255,136,0.4)',
        'glow-purple': '0 0 20px rgba(123,47,190,0.4)',
        card: '0 0 0 1px rgba(0,229,255,0.25), 0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 0 0 1px rgba(0,229,255,0.4), 0 0 20px rgba(0,229,255,0.15), 0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};