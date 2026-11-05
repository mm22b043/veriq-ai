import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ title = 'An error occurred', message, onRetry }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-900 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-rose-800">{title}</h4>
          <p className="mt-1 text-xs text-rose-700 leading-relaxed break-words">{message || 'Unable to complete the requested operation.'}</p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-white border border-rose-300 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
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

