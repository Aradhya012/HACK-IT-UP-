'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff, Shield, ShieldX, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: authError } = await supabaseBrowser().auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });
      if (authError) throw authError;

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
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
              Create Your Secure Account
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
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-text-secondary font-ibm-plex mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-text-muted" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Operator Name"
                  required
                  className="cyber-input pl-11 font-ibm-plex"
                />
              </div>
            </div>

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

            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-text-secondary font-ibm-plex mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-text-muted" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="cyber-input pl-11 pr-11 font-ibm-plex"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-cyber-cyan transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full font-orbitron text-sm flex items-center justify-center mt-2"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center">
                  Create Account <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Bottom link */}
        <p className="text-center mt-6 text-sm font-ibm-plex text-text-secondary">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-cyber-cyan hover:underline font-orbitron text-xs uppercase tracking-wider"
          >
            Sign In →
          </Link>
        </p>
      </div>
    </div>
  );
}