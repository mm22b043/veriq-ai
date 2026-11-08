import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading data...', subtext = '' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative mb-4">
        <div className="w-10 h-10 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-brand-600 dark:text-brand-400 animate-spin" />
        </div>
      </div>
      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{message}</p>
      {subtext && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 max-w-sm">{subtext}</p>}
    </div>
  );
}
