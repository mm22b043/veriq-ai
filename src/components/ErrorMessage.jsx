import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ title = 'An error occurred', message, onRetry }) {
  return (
    <div className="rounded-3xl border border-rose-300 dark:border-rose-500/30 bg-rose-50/80 dark:bg-rose-500/10 p-5 text-rose-900 dark:text-rose-200 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
        <div className="flex-1">
          <h4 className="text-xs font-bold text-rose-800 dark:text-rose-200">{title}</h4>
          <p className="mt-1 text-xs text-rose-700 dark:text-rose-300 leading-relaxed break-words">{message || 'Unable to complete the requested operation.'}</p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-200 bg-white dark:bg-dark-elevated border border-rose-300 dark:border-rose-500/40 hover:bg-rose-100 dark:hover:bg-rose-500/20 px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
