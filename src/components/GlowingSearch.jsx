import React, { useState } from 'react';
import { Search, X, Building2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStoredVendors } from '../services/api';

export default function GlowingSearch({ placeholder = 'What do you want to search...', className = '' }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = (val) => {
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      return;
    }
    const q = val.toLowerCase();
    const vendors = getStoredVendors();
    const matched = vendors.filter(v =>
      (v.companyName && v.companyName.toLowerCase().includes(q)) ||
      (v.vendorId && v.vendorId.toLowerCase().includes(q)) ||
      (v.email && v.email.toLowerCase().includes(q)) ||
      (v.taxId && v.taxId.toLowerCase().includes(q))
    ).slice(0, 5);
    setResults(matched);
  };

  return (
    <div className={`relative halo-search-container ${className}`}>
      {/* Diffused Ambient Violet/Lavender Halo Glow (Image 2 reference) */}
      <div className={`halo-search-glow ${isFocused ? 'opacity-100 scale-105' : 'opacity-60'} transition-all duration-300`} />

      {/* Pill Search Input */}
      <div className="relative z-10 flex items-center bg-white/95 dark:bg-dark-elevated/95 backdrop-blur-md border border-brand-200/80 dark:border-white/15 rounded-full px-4 py-2 shadow-sm transition-all focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/25">
        <Search className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mr-2.5" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full text-xs bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); }}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Instant Dropdown Quick Search Results */}
      {isFocused && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl shadow-xl p-2 z-50 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
            Matching Vendors
          </span>
          {results.map((v) => (
            <button
              key={v.id || v.vendorId}
              onMouseDown={() => navigate('/reports', { state: { vendorId: v.vendorId || v.id } })}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-white/5 text-left text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{v.companyName}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{v.vendorId || v.id} • {v.taxId || 'Tax Verified'}</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

