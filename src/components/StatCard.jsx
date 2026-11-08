import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, trend, color = 'brand', subtitle }) {
  const colorMap = {
    brand: {
      lightBg: 'bg-brand-50 text-brand-600 border-brand-200/60',
      darkBg: 'dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20',
      glow: 'group-hover:shadow-glow-sm',
    },
    emerald: {
      lightBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
      darkBg: 'dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
      glow: 'group-hover:dark:shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    },
    amber: {
      lightBg: 'bg-amber-50 text-amber-600 border-amber-200/60',
      darkBg: 'dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
      glow: 'group-hover:dark:shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    },
    rose: {
      lightBg: 'bg-rose-50 text-rose-600 border-rose-200/60',
      darkBg: 'dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
      glow: 'group-hover:dark:shadow-[0_0_20px_rgba(244,63,94,0.25)]',
    },
    cyan: {
      lightBg: 'bg-cyan-50 text-cyan-600 border-cyan-200/60',
      darkBg: 'dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20',
      glow: 'group-hover:dark:shadow-[0_0_20px_rgba(6,182,212,0.25)]',
    }
  };

  const scheme = colorMap[color] || colorMap.brand;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`group relative rounded-2xl p-5 transition-all duration-300 bg-white dark:bg-dark-card border border-light-border dark:border-dark-border shadow-card-light dark:shadow-card-dark overflow-hidden ${scheme.glow}`}
    >
      {/* Ambient background glow in dark mode */}
      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-brand-500/5 dark:bg-brand-500/10 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${scheme.lightBg} ${scheme.darkBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="relative z-10 mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
          {value}
        </h3>
        {trend && (
          <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend.isPositive
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
              : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
          }`}>
            {trend.isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="relative z-10 mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
