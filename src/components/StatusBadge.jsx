import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

export default function StatusBadge({ status, size = 'md', showIcon = true }) {
  const norm = (status || '').toLowerCase();

  let config = {
    bgLight: 'bg-amber-50 text-amber-700 border-amber-200/80',
    bgDark: 'dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30',
    glow: 'dark:shadow-[0_0_12px_rgba(245,158,11,0.2)]',
    icon: Clock,
    label: 'Pending'
  };

  if (norm.includes('approv') || norm === 'verified') {
    config = {
      bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      bgDark: 'dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30',
      glow: 'dark:shadow-[0_0_12px_rgba(16,185,129,0.2)]',
      icon: CheckCircle2,
      label: 'Approved'
    };
  } else if (norm.includes('reject') || norm === 'failed') {
    config = {
      bgLight: 'bg-rose-50 text-rose-700 border-rose-200/80',
      bgDark: 'dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30',
      glow: 'dark:shadow-[0_0_12px_rgba(244,63,94,0.2)]',
      icon: XCircle,
      label: 'Rejected'
    };
  } else if (norm.includes('review') || norm === 'in_progress') {
    config = {
      bgLight: 'bg-brand-50 text-brand-700 border-brand-200/80',
      bgDark: 'dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/30',
      glow: 'dark:shadow-[0_0_12px_rgba(139,92,246,0.2)]',
      icon: AlertCircle,
      label: 'In Review'
    };
  }

  const sizeClasses = size === 'sm' 
    ? 'text-[11px] px-2 py-0.5 gap-1 font-medium' 
    : size === 'lg' 
      ? 'text-xs px-3.5 py-1.5 gap-2 font-semibold' 
      : 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center rounded-full border transition-colors ${config.bgLight} ${config.bgDark} ${config.glow} ${sizeClasses}`}>
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
}
