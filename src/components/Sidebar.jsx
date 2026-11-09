import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  Sparkles,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import VeriqLogo from './VeriqLogo';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Register Vendor', path: '/register', icon: UserPlus },
    { name: 'All Vendors', path: '/vendors', icon: Users },
    { name: 'Verification Reports', path: '/reports', icon: FileCheck2 },
    { name: 'Workflow Monitor', path: '/workflow', icon: Activity },
    { name: 'Audit History', path: '/audit', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
        } bg-white dark:bg-dark-surface border-r border-light-border dark:border-dark-border shadow-2xl lg:shadow-none`}
      >
        {/* Brand / Logo Area with subtle ambient glow */}
        <div className="h-18 px-5 flex items-center justify-between border-b border-light-border dark:border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-18 bg-brand-500/10 blur-xl pointer-events-none" />
          <VeriqLogo size={34} />
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-1">
          <div className="px-3 pb-2.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span>Platform Menu</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'text-white font-bold shadow-glow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Glowing Active Pill Background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 shadow-glow-sm"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}

                    <Icon
                      className={`relative z-10 w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
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

        {/* User Card & Logout / Live Webhook at bottom */}
        <div className="p-3.5 border-t border-light-border dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.02] space-y-2">
          {user && (
            <div className="rounded-2xl bg-white dark:bg-[#121422] border border-slate-200/80 dark:border-white/10 p-3 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {user.avatar || 'VQ'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{user.email || 'analyst@veriq.ai'}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{user.role || 'Analyst'}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between px-2 text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              n8n Connected
            </span>
            <span className="text-slate-500">v2.1</span>
          </div>
        </div>
      </aside>
    </>
  );
}
