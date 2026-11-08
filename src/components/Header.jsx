import React, { useState } from 'react';
import { Menu, Zap, Sun, Moon, Plus, LogOut, User, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import GlowingSearch from './GlowingSearch';

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getPageTitle = (path) => {
    switch (path) {
      case '/': return { title: 'Operational Dashboard', subtitle: 'Real-time AI vendor verification & risk analytics' };
      case '/register': return { title: 'Register Vendor', subtitle: 'Submit vendor credentials & documentation for AI validation' };
      case '/vendors': return { title: 'Vendor Directory', subtitle: 'Manage, search and inspect all evaluated vendor records' };
      case '/reports': return { title: 'Verification Reports', subtitle: 'Deep cross-field inconsistency & document audit matrix' };
      case '/workflow': return { title: 'Workflow Monitor', subtitle: 'Live multi-stage verification status from n8n & Gemini AI' };
      case '/audit': return { title: 'Audit Trail', subtitle: 'Chronological timeline of system events & decision dispatches' };
      case '/settings': return { title: 'System Settings', subtitle: 'Configure n8n webhook, Supabase database & integration parameters' };
      default: return { title: 'VERIQ AI', subtitle: 'Intelligent Vendor Verification & Onboarding' };
    }
  };

  const { title } = getPageTitle(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-18 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-light-border dark:border-dark-border gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight font-sans shrink-0 hidden sm:block">
          {title}
        </h1>
      </div>

      {/* Glowing Search Bar in Header (Image 2 reference) */}
      <div className="flex-1 max-w-md mx-2 hidden md:block">
        <GlowingSearch placeholder="Search vendors, tax IDs, compliance..." />
      </div>

      <div className="flex items-center gap-3">
        {/* Backend Webhook Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-xs shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-medium">n8n:</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono text-[11px] truncate max-w-[120px]">
            Live Webhook
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10 hover:border-brand-400 dark:hover:border-brand-500 transition-all duration-200"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 animate-in fade-in zoom-in duration-200" />
          ) : (
            <Moon className="w-4 h-4 text-brand-600 animate-in fade-in zoom-in duration-200" />
          )}
        </button>

        {/* User Profile / Auth Chip */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 hover:border-brand-500 transition-all text-xs"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold text-[11px] flex items-center justify-center shadow-xs">
                {user.avatar || 'U'}
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline text-xs">
                {user.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl shadow-xl p-2 z-50 space-y-1">
                <div className="px-3 py-2 border-b border-light-border dark:border-white/5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline px-2 py-1"
          >
            Sign In
          </Link>
        )}

        {/* Quick Action Button */}
        {location.pathname !== '/register' && (
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-glow-sm hover:shadow-glow-violet shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Onboard Vendor</span>
          </Link>
        )}
      </div>
    </header>
  );
}
