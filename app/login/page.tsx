'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Shield, ShieldX, ArrowRight, Github, Chrome } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: authError } = await supabaseBrowser().auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect') || '/dashboard';
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    setLoading(true);
    setError('');
    try {
      const { error: authError } = await supabaseBrowser().auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (authError) throw authError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-[440px] w-full">
        {/* Card */}
        <div className="cyber-card p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-cyber-cyan mx-auto mb-4 animate-glow-pulse" />
            <h1 className="text-2xl font-black font-orbitron text-white uppercase tracking-[0.15em]">
              Reforge <span className="text-cyber-cyan">AI</span>
            </h1>
            <p className="text-[10px] font-ibm-plex text-text-muted uppercase tracking-[0.2em] mt-2">
              Secure Development Platform
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-[rgba(199,36,177,0.1)] border border-cyber-magenta/30 rounded-lg p-3 flex items-start space-x-3">
              <ShieldX className="h-4 w-4 text-cyber-magenta flex-shrink-0 mt-0.5" />
              <p className="text-sm font-ibm-plex text-cyber-magenta">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-text-secondary font-ibm-plex mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-text-muted" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@reforge.ai"
                  required
                  className="cyber-input pl-11 font-ibm-plex"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-text-secondary font-ibm-plex mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-text-muted" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="cyber-input pl-11 pr-11 font-ibm-plex"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-cyber-cyan transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full font-orbitron text-sm flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgba(255,255,255,0.07)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-bg-secondary text-text-muted font-ibm-plex uppercase tracking-widest">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuthLogin('github')}
              disabled={loading}
              className="btn-secondary py-2.5 text-xs flex items-center justify-center"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </button>
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="btn-secondary py-2.5 text-xs flex items-center justify-center"
            >
              <Chrome className="h-4 w-4 mr-2" />
              Google
            </button>
          </div>
        </div>

        {/* Bottom link */}
        <p className="text-center mt-6 text-sm font-ibm-plex text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-cyber-cyan hover:underline font-orbitron text-xs uppercase tracking-wider"
          >
            Create One →
          </Link>
        </p>
      </div>
    </div>
  );
}