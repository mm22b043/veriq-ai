import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  FileCheck2,
  Activity,
  History,
  Settings,
  ChevronRight,
  Zap,
  Sparkles
} from 'lucide-react';
import VeriqLogo from './VeriqLogo';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Register Vendor', path: '/register', icon: UserPlus },
    { name: 'All Vendors', path: '/vendors', icon: Users },
    { name: 'Verification Reports', path: '/reports', icon: FileCheck2 },
    { name: 'Workflow Monitor', path: '/workflow', icon: Activity },
    { name: 'Audit History', path: '/audit', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white dark:bg-dark-surface border-r border-light-border dark:border-dark-border`}
      >
        {/* Brand / Logo Area */}
        <div className="h-18 px-5 flex items-center justify-between border-b border-light-border dark:border-white/5">
          <VeriqLogo size={34} />
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-1">
          <div className="px-3 pb-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Platform Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Animated Active Pill Background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 shadow-glow-sm"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    <Icon
                      className={`relative z-10 w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400'
                      }`}
                    />
                    <span className="relative z-10 flex-1">{item.name}</span>

                    {isActive && (
                      <ChevronRight className="relative z-10 w-3.5 h-3.5 text-white/80" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* n8n Status Pill at bottom */}
        <div className="p-3.5 border-t border-light-border dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.02]">
          <div className="rounded-xl bg-white dark:bg-dark-elevated border border-slate-200/80 dark:border-white/10 p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span className="text-[11px] font-bold text-slate-800 dark:text-white">AI Automation</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                Active
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono truncate">
              zampvendorproject.app.n8n.cloud
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
