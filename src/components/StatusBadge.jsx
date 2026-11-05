import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

export default function StatusBadge({ status, size = 'md', showIcon = true }) {
  const norm = (status || '').toLowerCase();

  let config = {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
    label: 'Pending'
  };

  if (norm.includes('approv') || norm === 'verified') {
    config = {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      label: 'Approved'
    };
  } else if (norm.includes('reject') || norm === 'failed') {
    config = {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle,
      label: 'Rejected'
    };
  } else if (norm.includes('review') || norm === 'in_progress') {
    config = {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: AlertCircle,
      label: 'In Review'
    };
  }

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5 gap-1' 
    : size === 'lg' 
      ? 'text-sm px-3.5 py-1.5 gap-2 font-semibold' 
      : 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses}`}>
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
}

