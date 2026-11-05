import React from 'react';
import { Menu, Zap, Shield, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getConfig } from '../services/api';

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const config = getConfig();

  const getPageTitle = (path) => {
    switch (path) {
      case '/': return { title: 'Operational Dashboard', subtitle: 'Real-time overview of vendor onboarding & AI verification pipeline' };
      case '/register': return { title: 'Register New Vendor', subtitle: 'Submit vendor credentials and documentation for AI validation' };
      case '/vendors': return { title: 'Vendor Directory', subtitle: 'Manage and review all onboarded vendor accounts' };
      case '/reports': return { title: 'Verification Reports', subtitle: 'Detailed cross-field inconsistency & document audit reports' };
      case '/workflow': return { title: 'Workflow Execution Monitor', subtitle: 'Live multi-stage verification status from n8n & Gemini' };
      case '/audit': return { title: 'Audit Trail & Event Log', subtitle: 'Chronological timeline of system and verification events' };
      case '/settings': return { title: 'System Settings & Integration', subtitle: 'Configure n8n webhook, Supabase DB & API parameters' };
      default: return { title: 'VendorFlow AI', subtitle: 'Vendor Onboarding & Verification' };
    }
  };

  const { title, subtitle } = getPageTitle(location.pathname);

  return (
    <header className="h-18 bg-white border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {title}
          </h1>
          <p className="hidden md:block text-xs text-slate-500 font-medium">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Backend Connected Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs">
          <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
          <span className="text-slate-600 font-medium">n8n:</span>
          <span className="font-semibold text-emerald-700 font-mono text-2xs truncate max-w-[140px]">
            Connected
          </span>
        </div>

        {location.pathname !== '/register' && (
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-xs hover:shadow-sm"
          >
            <span>+ Onboard Vendor</span>
          </Link>
        )}
      </div>
    </header>
  );
}

