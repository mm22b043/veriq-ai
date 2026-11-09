import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import VeriqLogo from '../components/VeriqLogo';
import GalaxyBackground from '../components/GalaxyBackground';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      navigate('/');
    }, 700);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-12 font-sans">
      {/* ── Cinematic Galaxy Canvas ── */}
      <GalaxyBackground />

      {/* No overlay — show full galaxy on login */}

      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-white/5 backdrop-blur-md text-slate-300 border border-white/10 hover:border-brand-500 hover:text-white transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-brand-400" />}
        </button>
      </div>

      {/* ── Login Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm space-y-7"
      >
        {/* Logo + Title */}
        <div className="flex flex-col items-center text-center space-y-3">
          <VeriqLogo size={48} showText={false} />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Sign in to VERIQ AI
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Intelligent Vendor Verification &amp; Onboarding
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl bg-white/[0.05] backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden p-8">
          {/* Neon top border beam */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
            style={{ background: 'linear-gradient(90deg, #8B5CF6, #6366F1, #06B6D4)' }}
          />

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Company Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white/[0.06] text-white placeholder-slate-500 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-11 py-3 text-sm bg-white/[0.06] text-white placeholder-slate-500 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-rose-400 font-medium"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg hover:shadow-brand-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secured by AI-powered verification pipeline</span>
        </div>
      </motion.div>
    </div>
  );
}
