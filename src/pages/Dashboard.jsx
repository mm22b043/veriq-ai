import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Activity,
  PlusCircle,
  ArrowRight,
  Database,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import StatCard from '../components/StatCard';
import VendorTable from '../components/VendorTable';
import LoadingState from '../components/LoadingState';
import { getVendors, getStoredAuditLogs } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const COLORS = {
  Approved: '#10B981', // Mint/Emerald
  Pending: '#F59E0B',  // Amber
  Rejected: '#F43F5E', // Rose/Ruby
};

export default function Dashboard() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getVendors();
      setVendors(res.data || []);
      setAuditLogs(getStoredAuditLogs().slice(0, 5));
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const total = vendors.length;
  const approved = vendors.filter(v => (v.decision || v.status || '').toLowerCase().includes('approv')).length;
  const pending = vendors.filter(v => (v.decision || v.status || '').toLowerCase().includes('pend') || !(v.decision || v.status)).length;
  const rejected = vendors.filter(v => (v.decision || v.status || '').toLowerCase().includes('reject')).length;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  // Pie chart data
  const pieData = [
    { name: 'Approved', value: approved, color: COLORS.Approved },
    { name: 'Pending', value: pending, color: COLORS.Pending },
    { name: 'Rejected', value: rejected, color: COLORS.Rejected },
  ].filter(d => d.value > 0);

  // Bar chart data
  const barData = [
    { name: 'Approved', count: approved, fill: COLORS.Approved },
    { name: 'Pending', count: pending, fill: COLORS.Pending },
    { name: 'Rejected', count: rejected, fill: COLORS.Rejected },
  ];

  // Neon trend curve data inspired by reference screenshot
  const trendData = [
    { month: 'Jan', submissions: Math.max(1, total * 0.4), verified: Math.max(1, approved * 0.4) },
    { month: 'Feb', submissions: Math.max(2, total * 0.6), verified: Math.max(1, approved * 0.5) },
    { month: 'Mar', submissions: Math.max(3, total * 0.8), verified: Math.max(2, approved * 0.7) },
    { month: 'Apr', submissions: Math.max(4, total), verified: Math.max(3, approved) },
  ];

  if (loading) {
    return <LoadingState message="Connecting to VERIQ AI Pipeline..." subtext="Syncing verified vendor logs and real-time risk scores" />;
  }

  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white shadow-xl border border-white/10">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-brand-500/20 text-brand-300 border border-brand-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> VERIQ AI Engine
              </span>
              <span className="text-xs text-slate-400 font-mono">Production n8n + Gemini AI</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-sans">
              Intelligent Vendor Verification & Onboarding
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Automated document OCR, cross-field integrity checks, and banking fraud prevention powered by Google Gemini and live n8n orchestration.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-stretch md:self-auto shrink-0">
            <Link
              to="/register"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-glow-sm hover:shadow-glow-violet"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Vendor</span>
            </Link>
            <Link
              to="/workflow"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs px-4 py-3 rounded-xl border border-white/15 backdrop-blur-md transition-colors"
            >
              <Activity className="w-4 h-4 text-brand-300" />
              <span className="hidden sm:inline">Live Workflow</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Vendors"
          value={total}
          icon={Users}
          color="brand"
          subtitle="Processed submissions"
        />
        <StatCard
          title="Approved"
          value={approved}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Cleared for disbursement"
        />
        <StatCard
          title="Pending Review"
          value={pending}
          icon={Clock}
          color="amber"
          subtitle="Awaiting info or check"
        />
        <StatCard
          title="Rejected"
          value={rejected}
          icon={XCircle}
          color="rose"
          subtitle="Discrepancies flagged"
        />
        <StatCard
          title="Approval Rate"
          value={`${approvalRate}%`}
          icon={TrendingUp}
          color="cyan"
          trend={{ isPositive: approvalRate >= 50, value: `${total} runs` }}
        />
      </div>

      {/* Main Analytics Section (Inspired by Reference Design) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics Overview Neon Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border p-6 shadow-card-light dark:shadow-card-dark flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Main Analytics Overview</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Live submission velocity and verification clearance rate</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500 inline-block shadow-glow-sm" /> Submissions
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Verified
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={isDark ? 0.45 : 0.25} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={isDark ? 0.35 : 0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : '#F1F0F8'} />
                <XAxis dataKey="month" stroke={isDark ? '#64748B' : '#94A3B8'} fontSize={11} />
                <YAxis allowDecimals={false} stroke={isDark ? '#64748B' : '#94A3B8'} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#17192C' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#EDE9FE',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="submissions"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#brandGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="verified"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#emeraldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verification Decisions Donut Chart */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border p-6 shadow-card-light dark:shadow-card-dark flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Verification Decisions</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ratio</span>
          </div>

          <div className="flex-1 min-h-[190px] flex items-center justify-center relative">
            {pieData.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8">
                <Database className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p>No decision data recorded yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">Submit a vendor to view real-time breakdown.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#17192C' : '#FFFFFF',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#EDE9FE',
                      borderRadius: '10px',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}

            {pieData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">{total}</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Runs</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/5 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Pass
              </p>
              <p className="font-bold text-slate-800 dark:text-white mt-0.5">{approved}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Hold
              </p>
              <p className="font-bold text-slate-800 dark:text-white mt-0.5">{pending}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Flag
              </p>
              <p className="font-bold text-slate-800 dark:text-white mt-0.5">{rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Submissions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Vendor Submissions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live vendor submissions and current verification decisions</p>
          </div>
          <Link
            to="/vendors"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1"
          >
            All Vendors Directory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <VendorTable
          vendors={vendors}
          emptyMessage="No vendor submissions recorded yet. Use 'Register Vendor' to run a live test case."
        />
      </div>
    </motion.div>
  );
}
