import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (email: string, pass: string) => Promise<boolean>;
  onClose?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
  const [email, setEmail] = useState('admin@toolly.io');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const success = await onLogin(email, password);
    setLoading(false);

    if (!success) {
      setError('Invalid admin credentials. Please enter authorized admin email and password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-[#0A0A0A] border border-[#262626] w-full max-w-md rounded-[24px] p-6 sm:p-8 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-black font-bold flex items-center justify-center text-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Admin Control Panel</h2>
              <p className="text-xs text-[#A1A1AA]">Authorized Administrator Access Only</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs text-[#A1A1AA] hover:text-white px-3 py-1.5 rounded-full border border-[#262626] hover:bg-[#111111] transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* Demo Credentials Alert Banner */}
        <div className="mb-6 p-3.5 rounded-2xl bg-[#111111] border border-[#262626] text-xs space-y-1">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin Credentials</span>
          </div>
          <div className="text-[#A1A1AA]">
            Email: <code className="text-white bg-black/50 px-1 py-0.5 rounded">admin@toolly.io</code>
          </div>
          <div className="text-[#A1A1AA]">
            Password: <code className="text-white bg-black/50 px-1 py-0.5 rounded">admin123</code>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@toolly.io"
                className="w-full bg-[#111111] border border-[#262626] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#111111] border border-[#262626] text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-white/90 text-black font-bold text-sm py-3 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Panel'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
