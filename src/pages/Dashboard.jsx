import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Activity,
  PlusCircle,
  FileCheck2,
  ArrowRight,
  Database
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import StatCard from '../components/StatCard';
import VendorTable from '../components/VendorTable';
import LoadingState from '../components/LoadingState';
import { getVendors, getStoredAuditLogs } from '../services/api';

const COLORS = {
  Approved: '#10B981', // emerald-500
  Pending: '#F59E0B',  // amber-500
  Rejected: '#EF4444', // rose-500
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [backendMeta, setBackendMeta] = useState({ source: 'local', backendConfigured: false });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getVendors();
      setVendors(res.data || []);
      setBackendMeta({ source: res.source, backendConfigured: res.backendConfigured });
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

  // Compute metrics
  const total = vendors.length;
  const approved = vendors.filter(v => (v.decision || v.status || '').toLowerCase().includes('approv')).length;
  const pending = vendors.filter(v => (v.decision || v.status || '').toLowerCase().includes('pend') || !(v.decision || v.status)).length;
  const rejected = vendors.filter(v => (v.decision || v.status || '').toLowerCase().includes('reject')).length;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  // Chart data
  const pieData = [
    { name: 'Approved', value: approved, color: COLORS.Approved },
    { name: 'Pending', value: pending, color: COLORS.Pending },
    { name: 'Rejected', value: rejected, color: COLORS.Rejected },
  ].filter(d => d.value > 0);

  const barData = [
    { name: 'Approved', count: approved, fill: COLORS.Approved },
    { name: 'Pending', count: pending, fill: COLORS.Pending },
    { name: 'Rejected', count: rejected, fill: COLORS.Rejected },
  ];

  if (loading) {
    return <LoadingState message="Connecting to verification pipeline..." subtext="Fetching recent vendor runs and verification statuses" />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-2xs font-bold uppercase rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              Live Pipeline Active
            </span>
            <span className="text-2xs text-slate-300">Target: n8n + Gemini AI</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Intelligent Vendor Onboarding & Verification
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Automated verification pipeline validating vendor registration certificates, tax identifiers, bank accounts, and compliance legitimacy.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <Link
            to="/register"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Vendor</span>
          </Link>
          <Link
            to="/workflow"
            className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
          >
            <Activity className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Live Workflow</span>
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Vendors"
          value={total}
          icon={Users}
          color="indigo"
          subtitle="Processed submissions"
        />
        <StatCard
          title="Approved"
          value={approved}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Ready for disbursement"
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
          color="blue"
          trend={{ isPositive: approvalRate >= 50, value: `${total} total runs` }}
        />
      </div>

      {/* Visual Analytics / Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Chart */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Verification Decisions</h3>
            <span className="text-2xs text-slate-400 font-medium">Distribution</span>
          </div>

          <div className="flex-1 min-h-[220px] flex items-center justify-center">
            {pieData.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8">
                <Database className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No vendor decisions recorded yet.</p>
                <p className="text-2xs text-slate-400 mt-1">Submit a vendor to view real-time breakdown.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-2 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xs text-slate-500 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Approved
              </p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{approved}</p>
            </div>
            <div>
              <p className="text-2xs text-slate-500 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> Pending
              </p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{pending}</p>
            </div>
            <div>
              <p className="text-2xs text-slate-500 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> Rejected
              </p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{rejected}</p>
            </div>
          </div>
        </div>

        {/* Volume Breakdown Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Decision Breakdown</h3>
            <span className="text-2xs text-slate-400 font-medium">By Status</span>
          </div>

          <div className="flex-1 min-h-[220px]">
            {total === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-xs">
                <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No volume data available.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <p className="text-2xs text-slate-400 mt-2 text-center">
            Verification criteria executed by n8n workflow
          </p>
        </div>

        {/* Recent Audit / Verification Events */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Recent Verification Events</h3>
            <Link to="/audit" className="text-2xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {auditLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-xs py-8">
                <p>No activity logged yet.</p>
                <p className="text-2xs text-slate-400 mt-1">Actions from live submissions will appear here.</p>
              </div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-slate-800 truncate">{log.vendorName}</span>
                      <span className="text-2xs text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-2xs text-slate-500 mt-0.5 truncate">{log.details}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Vendor Submissions</h3>
            <p className="text-xs text-slate-500">Live vendor submissions and current verification decisions</p>
          </div>
          <Link
            to="/vendors"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
          >
            All Vendors Directory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <VendorTable
          vendors={vendors}
          emptyMessage="No vendor submissions recorded yet. Use the 'Submit Vendor' button to test your live n8n pipeline."
        />
      </div>
    </div>
  );
}

