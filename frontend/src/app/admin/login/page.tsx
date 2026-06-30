'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Lock, Mail, Sparkles, AlertCircle, Shield } from 'lucide-react';
import { setCookie } from '../../../lib/cookies';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Admin credentials — multiple admins supported
    const ADMIN_ACCOUNTS = [
      {
        email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'sanjayindia6666@gmail.com',
        password: process.env.NEXT_PUBLIC_ADMIN_PASS  || 'SumanAdmin@2026',
        name: 'Sanjay Choudhary',
      },
      {
        email: 'shivachoudhary4235@gmail.com',
        password: 'SuMAN#@20092@project',
        name: 'Shiva Choudhary',
      },
    ];

    await new Promise((r) => setTimeout(r, 800)); // Simulate auth delay

    const matched = ADMIN_ACCOUNTS.find(
      (a) => a.email === email && a.password === password
    );

    if (matched) {
      setCookie('suman_admin', { email: matched.email, role: 'admin', name: matched.name, loginAt: Date.now() }, 1);
      setCookie('suman_user',  { email: matched.email, name: matched.name, role: 'admin' }, 1);
      router.push('/admin');
    } else {
      setError('Invalid admin credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #0F0F0F 100%)' }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF6B4A]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-2xl border p-8 space-y-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-[#FF6B4A]/15 flex items-center justify-center">
                <Car className="h-6 w-6 text-[#FF6B4A]" />
              </div>
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl">Admin Panel</h1>
              <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">Suman Travels Management</p>
            </div>
            <div className="inline-flex items-center space-x-1.5 bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 px-3 py-1 rounded-full">
              <Shield className="h-3 w-3 text-[#FF6B4A]" />
              <span className="text-[#FF6B4A] text-xs font-semibold">Secured Access</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 font-semibold uppercase mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#FF6B4A]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm focus:outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/50 font-semibold uppercase mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#FF6B4A]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm focus:outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold transition-all duration-300 disabled:opacity-50"
              style={{ background: loading ? '#555' : '#FF6B4A' }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Admin'}
            </button>
          </form>

          <p className="text-center text-white/25 text-xs">
            Contact your administrator for access credentials
          </p>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          <a href="/" className="hover:text-white/40 transition-colors">← Back to Suman Travels Website</a>
        </p>
      </div>
    </main>
  );
}
