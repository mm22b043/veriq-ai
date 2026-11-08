import React from 'react';
import { Menu, Zap, Sun, Moon, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getConfig } from '../services/api';

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const config = getConfig();

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

  const { title, subtitle } = getPageTitle(location.pathname);

  return (
    <header className="h-18 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-light-border dark:border-dark-border">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 font-sans">
            {title}
          </h1>
          <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Backend Webhook Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-xs shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-medium">n8n:</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono text-[11px] truncate max-w-[130px]">
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

        {/* Quick Action Button */}
        {location.pathname !== '/register' && (
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-glow-sm hover:shadow-glow-violet"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard Vendor</span>
          </Link>
        )}
      </div>
    </header>
  );
}
