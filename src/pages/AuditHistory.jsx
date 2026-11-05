import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Send,
  FileText
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
      return { icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', label: 'Completed' };
    } else if (act.includes('FAILED') || act.includes('REJECTED')) {
      return { icon: XCircle, color: 'text-rose-700 bg-rose-50 border-rose-200', label: 'Failed' };
    } else if (act.includes('ATTEMPT') || act.includes('STARTED')) {
      return { icon: Clock, color: 'text-blue-700 bg-blue-50 border-blue-200', label: 'Initiated' };
    }
    return { icon: ShieldCheck, color: 'text-slate-700 bg-slate-100 border-slate-200', label: 'Logged' };
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
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Audit Trail & Compliance Log</h2>
          <p className="text-xs text-slate-500">
            Immutable chronological log of vendor submissions, AI verification milestones, and decision dispatches
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by vendor, ID, or activity detail..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {['ALL', 'COMPLETED', 'FAILED', 'ATTEMPTED'].map((st) => (
            <button
              key={st}
              onClick={() => setActionFilter(st)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                actionFilter === st
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
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
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
          <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-700">No Audit Events Logged</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {searchTerm || actionFilter !== 'ALL'
              ? 'No events match your current filter query.'
              : 'Audit events are automatically generated as live submissions are dispatched to n8n.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {filteredLogs.map((log) => {
              const badge = getActionBadge(log.action);
              const Icon = badge.icon;

              return (
                <div key={log.id} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-white border-2 border-indigo-600 group-hover:scale-110 transition-transform" />

                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 transition-colors hover:bg-slate-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
                          <Icon className="w-3 h-3" /> {badge.label}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">
                          {log.vendorName}
                        </h4>
                        {log.vendorId && (
                          <span className="text-2xs font-mono text-slate-400">({log.vendorId})</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-2xs font-mono text-slate-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 mt-2 font-medium">
                      {log.details}
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400 font-mono">
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
    </div>
  );
}

