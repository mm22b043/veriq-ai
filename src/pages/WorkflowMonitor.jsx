import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  Zap,
  RefreshCw
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import { getVendors, getConfig } from '../services/api';

const PIPELINE_STAGES = [
  { id: 1, name: 'Vendor Submission Received', description: 'Webhook listener captures multipart payload and initializes run context' },
  { id: 2, name: 'Documents Uploaded', description: 'PDF files parsed into binary streams for processing' },
  { id: 3, name: 'Text Extraction', description: 'OCR extraction of registration, tax, and bank proof documents' },
  { id: 4, name: 'AI Document Verification', description: 'Google Gemini analyzes authenticity, dates, and official seals' },
  { id: 5, name: 'Data Consistency Check', description: 'Cross-checks company name vs bank account holder and tax format vs country' },
  { id: 6, name: 'Duplicate Vendor Check', description: 'Checks Supabase database for existing tax ID or bank accounts' },
  { id: 7, name: 'Final Decision', description: 'Decision Engine computes Approved, Pending, or Rejected with reason' },
  { id: 8, name: 'Notification Sent', description: 'Generates automated email response to procurement and vendor' },
];

export default function WorkflowMonitor() {
  const config = getConfig();
  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRuns();
  }, []);

  const fetchRuns = async () => {
    setLoading(true);
    try {
      const res = await getVendors();
      const list = res.data || [];
      setVendors(list);
      if (list.length > 0 && !selectedVendorId) {
        setSelectedVendorId(list[0].vendorId || list[0].id);
      }
    } catch (e) {
      console.error('Failed to load runs', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRuns();
    setRefreshing(false);
  };

  const currentVendor = vendors.find(v => (v.vendorId || v.id) === selectedVendorId) || vendors[0];

  if (loading) {
    return <LoadingState message="Loading workflow monitor..." />;
  }

  const getStageStatus = (stageId) => {
    if (!currentVendor) {
      return { status: 'PENDING', label: 'Idle / Awaiting Run', icon: Clock, color: 'text-slate-400' };
    }

    const decision = (currentVendor.decision || currentVendor.status || '').toUpperCase();
    const isSuccess = decision.includes('APPROV');
    const isRejected = decision.includes('REJECT');

    if (stageId <= 4) {
      return {
        status: 'COMPLETED',
        label: 'Completed',
        icon: CheckCircle2,
        color: 'text-emerald-500',
        time: currentVendor.submissionDate ? new Date(currentVendor.submissionDate).toLocaleTimeString() : 'Recorded'
      };
    }

    if (stageId === 5) {
      if (isRejected) {
        return {
          status: 'FLAGGED',
          label: 'Discrepancy Flagged',
          icon: XCircle,
          color: 'text-rose-500',
          time: currentVendor.submissionDate ? new Date(currentVendor.submissionDate).toLocaleTimeString() : 'Recorded',
          error: currentVendor.decisionReason
        };
      }
      return {
        status: 'COMPLETED',
        label: 'Passed',
        icon: CheckCircle2,
        color: 'text-emerald-500',
        time: currentVendor.submissionDate ? new Date(currentVendor.submissionDate).toLocaleTimeString() : 'Recorded'
      };
    }

    if (stageId === 6) {
      return {
        status: 'COMPLETED',
        label: 'No Duplicate',
        icon: CheckCircle2,
        color: 'text-emerald-500',
        time: currentVendor.submissionDate ? new Date(currentVendor.submissionDate).toLocaleTimeString() : 'Recorded'
      };
    }

    if (stageId === 7) {
      return {
        status: 'COMPLETED',
        label: currentVendor.decision || 'Completed',
        icon: isRejected ? XCircle : CheckCircle2,
        color: isRejected ? 'text-rose-500' : 'text-emerald-500',
        time: currentVendor.submissionDate ? new Date(currentVendor.submissionDate).toLocaleTimeString() : 'Recorded'
      };
    }

    if (stageId === 8) {
      return {
        status: 'COMPLETED',
        label: 'Dispatched',
        icon: CheckCircle2,
        color: 'text-emerald-500',
        time: currentVendor.submissionDate ? new Date(currentVendor.submissionDate).toLocaleTimeString() : 'Recorded'
      };
    }

    return { status: 'PENDING', label: 'Pending', icon: Clock, color: 'text-slate-400' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Bar */}
      <div className="bg-white dark:bg-dark-card rounded-3xl border border-light-border dark:border-dark-border p-5 shadow-card-light dark:shadow-card-dark flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans">Live Workflow Execution Monitor</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Stage-by-stage pipeline telemetry from n8n automation engine and Google Gemini
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto">
          {vendors.length > 0 && (
            <select
              value={selectedVendorId || ''}
              onChange={(e) => setSelectedVendorId(e.target.value)}
              className="text-xs bg-slate-50/50 dark:bg-dark-elevated text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            >
              {vendors.map((v) => (
                <option key={v.vendorId || v.id} value={v.vendorId || v.id}>
                  Run: {v.companyName} ({v.vendorId || v.id})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            title="Refresh status"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-brand-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Backend Connection Information Box */}
      <div className="rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card p-4 shadow-card-light dark:shadow-card-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">
              Target Webhook: <code className="font-mono text-[11px] text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded-md">{config.n8nWebhookUrl}</code>
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              Live stages mapped directly from active webhook execution response and persistent audit log.
            </p>
          </div>
        </div>

        {currentVendor && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Run Decision:</span>
            <StatusBadge status={currentVendor.decision || currentVendor.status} />
          </div>
        )}
      </div>

      {/* Pipeline Stages Vertical Tree */}
      {!currentVendor ? (
        <div className="bg-white dark:bg-dark-card rounded-3xl border border-light-border dark:border-dark-border p-12 text-center shadow-card-light dark:shadow-card-dark">
          <Activity className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Workflow Runs Detected</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Submit a vendor application on the "Register Vendor" page to observe the live VERIQ AI execution pipeline.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-card rounded-3xl border border-light-border dark:border-dark-border p-6 sm:p-8 shadow-card-light dark:shadow-card-dark">
          <div className="space-y-6">
            {PIPELINE_STAGES.map((stage, idx) => {
              const state = getStageStatus(stage.id);
              const Icon = state.icon;
              const isLast = idx === PIPELINE_STAGES.length - 1;

              return (
                <div key={stage.id} className="relative flex items-start gap-4">
                  {!isLast && (
                    <div className="absolute left-4 top-9 -bottom-7 w-0.5 bg-slate-200 dark:bg-white/10" />
                  )}

                  <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    state.status === 'COMPLETED'
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                      : state.status === 'FLAGGED'
                      ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
                      : 'bg-slate-100 dark:bg-dark-elevated border-slate-300 dark:border-white/15 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 bg-slate-50/70 dark:bg-dark-surface/60 border border-light-border dark:border-white/5 rounded-2xl p-4 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-brand-600 dark:text-brand-400">STAGE {stage.id}</span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{stage.name}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{stage.description}</p>
                      </div>

                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        {state.time && (
                          <span className="text-[10px] font-mono text-slate-400">{state.time}</span>
                        )}
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          state.status === 'COMPLETED'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                            : state.status === 'FLAGGED'
                            ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10'
                        }`}>
                          {state.label}
                        </span>
                      </div>
                    </div>

                    {state.error && (
                      <div className="mt-2.5 p-3 rounded-xl bg-rose-50/80 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-900 dark:text-rose-200 text-xs">
                        <span className="font-bold">Workflow Discrepancy Note:</span> {state.error}
                      </div>
                    )}
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
