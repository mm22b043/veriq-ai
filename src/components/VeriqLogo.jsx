import React from 'react';

export default function VeriqLogo({ size = 32, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Geometric Logo Mark */}
      <div 
        style={{ width: size, height: size }} 
        className="relative shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-500 to-indigo-400 p-0.5 shadow-glow-sm"
      >
        <div className="w-full h-full rounded-[14px] bg-white dark:bg-dark-bg flex items-center justify-center overflow-hidden relative">
          {/* Subtle interior glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 via-transparent to-indigo-500/30" />
          
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-3/5 h-3/5 text-brand-600 dark:text-brand-400 relative z-10 transition-transform duration-300 hover:scale-110"
          >
            {/* Geometric stylized 'V' & Shield Polygon */}
            <path
              d="M12 2.5L20 7.2V16.8L12 21.5L4 16.8V7.2L12 2.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              className="opacity-40"
            />
            <path
              d="M7.5 9L12 16.5L16.5 9"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="7.5" r="1.5" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              VERIQ
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-gradient-to-r from-brand-600 to-indigo-500 text-white shadow-xs">
              AI
            </span>
          </div>
          <span className="text-[10px] font-medium tracking-tight text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            Intelligent Vendor Verification
          </span>
        </div>
      )}
    </div>
  );
}
