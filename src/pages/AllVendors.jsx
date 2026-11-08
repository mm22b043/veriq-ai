import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  FileCheck2,
  Building2,
  Landmark,
  FileText,
  X,
  ExternalLink,
  ShieldAlert,
  Download
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import DownloadReportButton from '../components/DownloadReportButton';
import { getVendors } from '../services/api';

export default function AllVendors() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await getVendors();
      setVendors(res.data || []);
    } catch (e) {
      console.error('Failed to load vendors', e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAll = () => {
    setExporting(true);
    setTimeout(() => {
      const blob = new Blob([JSON.stringify(vendors, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `VERIQ_Vendor_Registry_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setExporting(false);
    }, 500);
  };

  const filtered = vendors.filter((v) => {
    const dec = (v.decision || v.status || '').toUpperCase();
    if (statusFilter !== 'ALL' && !dec.includes(statusFilter)) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        (v.companyName && v.companyName.toLowerCase().includes(q)) ||
        (v.vendorId && v.vendorId.toLowerCase().includes(q)) ||
        (v.email && v.email.toLowerCase().includes(q)) ||
        (v.taxId && v.taxId.toLowerCase().includes(q)) ||
        (v.registrationNumber && v.registrationNumber.toLowerCase().includes(q))
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Vendor Directory</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comprehensive registry of evaluated vendors and risk decisions
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportAll}
            disabled={exporting || vendors.length === 0}
            className="inline-flex items-center gap-1.5 bg-white dark:bg-dark-elevated text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-brand-500 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>{exporting ? 'Exporting...' : 'Export Registry'}</span>
          </button>

          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-glow-sm"
          >
            + Add New Vendor
          </button>
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
            placeholder="Search by company, ID, tax ID, reg number..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50/50 dark:bg-dark-elevated text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white dark:bg-dark-elevated border border-slate-200 dark:border-white/10 rounded-xl p-1 text-xs shadow-2xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
          {['ALL', 'APPROVED', 'PENDING', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Vendors Table */}
      {loading ? (
        <LoadingState message="Loading vendor records..." />
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-3xl border border-light-border dark:border-dark-border p-12 text-center shadow-card-light dark:shadow-card-dark">
          <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No vendor records found</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Try resetting the filters or clearing the search query.'
              : 'Submit a new vendor registration to view live verification records here.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border shadow-card-light dark:shadow-card-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-semibold border-b border-light-border dark:border-white/5 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Vendor ID</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Tax ID</th>
                  <th className="py-3 px-4">Reg Number</th>
                  <th className="py-3 px-4">Bank Account Holder</th>
                  <th className="py-3 px-4">Decision</th>
                  <th className="py-3 px-4">Reasoning</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {filtered.map((vendor) => (
                  <tr key={vendor.id || vendor.vendorId} className="hover:bg-brand-50/30 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {vendor.vendorId || vendor.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {vendor.companyName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {vendor.email}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {vendor.taxId || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {vendor.registrationNumber || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {vendor.bankAccountHolderName || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={vendor.decision || vendor.status} />
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400" title={vendor.decisionReason}>
                      {vendor.decisionReason || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate('/reports', { state: { vendorId: vendor.vendorId || vendor.id } })}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                          title="View Verification Report"
                        >
                          <FileCheck2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vendor Details Modal */}
      <AnimatePresence>
        {selectedVendor && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-dark-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-light-border dark:border-dark-border"
            >
              <div className="sticky top-0 bg-white/95 dark:bg-dark-card/95 backdrop-blur-md px-6 py-4 border-b border-light-border dark:border-white/5 flex items-center justify-between z-10">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Vendor Profile Details</h3>
                  <StatusBadge status={selectedVendor.decision || selectedVendor.status} />
                </div>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 text-xs">
                {/* Decision Summary */}
                <div className="bg-slate-50 dark:bg-dark-surface/60 border border-light-border dark:border-dark-border rounded-2xl p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Verification Evaluation
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold mt-1 leading-relaxed">
                    {selectedVendor.decisionReason || 'Evaluation complete.'}
                  </p>
                </div>

                {/* Company Info */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Company Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3 bg-white dark:bg-dark-elevated p-4 border border-light-border dark:border-white/5 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Company Name</span>
                      <p className="font-bold text-slate-800 dark:text-slate-100">{selectedVendor.companyName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Vendor ID</span>
                      <p className="font-mono text-slate-800 dark:text-slate-100">{selectedVendor.vendorId || selectedVendor.id}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Contact Person</span>
                      <p className="text-slate-800 dark:text-slate-200">{selectedVendor.contactPerson || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Email Address</span>
                      <p className="font-mono text-slate-800 dark:text-slate-200">{selectedVendor.email || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Country</span>
                      <p className="text-slate-800 dark:text-slate-200">{selectedVendor.country || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Address</span>
                      <p className="text-slate-800 dark:text-slate-200">{selectedVendor.address || '—'}</p>
                    </div>
                  </div>
                </div>

                {/* Business & Banking */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                    <Landmark className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Business & Banking Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 bg-white dark:bg-dark-elevated p-4 border border-light-border dark:border-white/5 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Tax ID / GSTIN</span>
                      <p className="font-mono text-slate-800 dark:text-slate-200">{selectedVendor.taxId || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Registration Number</span>
                      <p className="font-mono text-slate-800 dark:text-slate-200">{selectedVendor.registrationNumber || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Bank Account Holder</span>
                      <p className="text-slate-800 dark:text-slate-200 font-semibold">{selectedVendor.bankAccountHolderName || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Bank Account Number</span>
                      <p className="font-mono text-slate-800 dark:text-slate-200">{selectedVendor.bankAccountNumber || '••••'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-slate-50/90 dark:bg-dark-surface/90 px-6 py-3.5 border-t border-light-border dark:border-white/5 flex items-center justify-between">
                <DownloadReportButton vendor={selectedVendor} />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedVendor(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200/60 dark:hover:bg-white/5 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const id = selectedVendor.vendorId || selectedVendor.id;
                      setSelectedVendor(null);
                      navigate('/reports', { state: { vendorId: id } });
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-glow-sm"
                  >
                    Open Full Verification Report
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
