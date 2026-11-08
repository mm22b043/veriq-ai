import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  History,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck
} from 'lucide-react';
import LoadingState from '../components/LoadingState';
import { getAuditHistory } from '../services/api';

export default function AuditHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getAuditHistory();
      setLogs(res.data || []);
    } catch (e) {
      console.error('Failed to load audit history', e);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action) => {
    const act = (action || '').toUpperCase();
    if (act.includes('COMPLETED') || act.includes('APPROVED')) {
      return { icon: CheckCircle2, color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30', label: 'Completed' };
    } else if (act.includes('FAILED') || act.includes('REJECTED')) {
      return { icon: XCircle, color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30', label: 'Failed' };
    } else if (act.includes('ATTEMPT') || act.includes('STARTED')) {
      return { icon: Clock, color: 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 border-brand-200 dark:border-brand-500/30', label: 'Initiated' };
    }
    return { icon: ShieldCheck, color: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10', label: 'Logged' };
  };

  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== 'ALL') {
      if (!log.action?.toUpperCase().includes(actionFilter)) return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        (log.vendorName && log.vendorName.toLowerCase().includes(q)) ||
        (log.vendorId && log.vendorId.toLowerCase().includes(q)) ||
        (log.action && log.action.toLowerCase().includes(q)) ||
        (log.details && log.details.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Audit Trail & Compliance Log</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Immutable chronological log of vendor submissions, AI verification milestones, and decision dispatches
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border p-4 shadow-card-light dark:shadow-card-dark flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by vendor, ID, or activity detail..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50/50 dark:bg-dark-elevated text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white dark:bg-dark-elevated border border-slate-200 dark:border-white/10 rounded-xl p-1 text-xs shadow-2xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
          {['ALL', 'COMPLETED', 'FAILED', 'ATTEMPTED'].map((st) => (
            <button
              key={st}
              onClick={() => setActionFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                actionFilter === st
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Timeline */}
      {loading ? (
        <LoadingState message="Loading audit records..." />
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-3xl border border-light-border dark:border-dark-border p-12 text-center shadow-card-light dark:shadow-card-dark">
          <History className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Audit Events Logged</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {searchTerm || actionFilter !== 'ALL'
              ? 'No events match your current filter query.'
              : 'Audit events are automatically generated as live submissions are dispatched to n8n.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-card rounded-3xl border border-light-border dark:border-dark-border p-6 sm:p-8 shadow-card-light dark:shadow-card-dark">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
            {filteredLogs.map((log) => {
              const badge = getActionBadge(log.action);
              const Icon = badge.icon;

              return (
                <div key={log.id} className="relative group">
                  <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-dark-surface border-2 border-brand-500 group-hover:scale-125 transition-transform shadow-glow-sm" />

                  <div className="bg-slate-50/80 dark:bg-dark-surface/60 border border-light-border dark:border-white/5 rounded-2xl p-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                          <Icon className="w-3 h-3" /> {badge.label}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {log.vendorName}
                        </h4>
                        {log.vendorId && (
                          <span className="text-[10px] font-mono text-slate-400">({log.vendorId})</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 font-medium leading-relaxed">
                      {log.details}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Event Code: {log.action}</span>
                      <span>Target: n8n Production Webhook</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
