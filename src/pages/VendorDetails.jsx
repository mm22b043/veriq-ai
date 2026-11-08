import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  Landmark,
  FileCheck2,
  ShieldAlert
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import { getVendorById } from '../services/api';

export default function VendorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      try {
        const data = await getVendorById(id);
        setVendor(data);
      } catch (err) {
        console.error('Failed to fetch vendor', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  if (loading) {
    return <LoadingState message="Loading vendor profile..." />;
  }

  if (!vendor) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-3xl border border-light-border dark:border-dark-border p-12 text-center max-w-xl mx-auto space-y-4 shadow-card-light dark:shadow-card-dark">
        <ShieldAlert className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Vendor Record Not Found</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The requested vendor ID <code className="font-mono bg-slate-100 dark:bg-white/10 px-1 py-0.5 rounded">{id}</code> could not be found.
        </p>
        <Link
          to="/vendors"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Vendors Directory
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          onClick={() => navigate('/reports', { state: { vendorId: vendor.vendorId || vendor.id } })}
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-glow-sm"
        >
          <FileCheck2 className="w-4 h-4" /> View Verification Report
        </button>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-3xl border border-light-border dark:border-dark-border p-6 sm:p-8 shadow-card-light dark:shadow-card-dark space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-light-border dark:border-white/5 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 font-semibold">{vendor.vendorId || vendor.id}</span>
              <StatusBadge status={vendor.decision || vendor.status} />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{vendor.companyName}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{vendor.country || 'International Vendor'}</p>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 sm:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Submitted On</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {vendor.submissionDate ? new Date(vendor.submissionDate).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-dark-surface/60 border border-light-border dark:border-dark-border rounded-2xl p-4">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Verification Reason
          </h4>
          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
            {vendor.decisionReason || 'Evaluation recorded.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Company Profile
            </h4>
            <div className="space-y-2.5 bg-slate-50/50 dark:bg-dark-elevated p-4 rounded-2xl border border-light-border dark:border-white/5">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Contact Person</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{vendor.contactPerson || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Email</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{vendor.email || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Phone</span>
                <span className="text-slate-800 dark:text-slate-200">{vendor.phone || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Address</span>
                <span className="text-slate-800 dark:text-slate-200">{vendor.address || '—'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Landmark className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Banking & Registration
            </h4>
            <div className="space-y-2.5 bg-slate-50/50 dark:bg-dark-elevated p-4 rounded-2xl border border-light-border dark:border-white/5">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Tax ID / GSTIN</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{vendor.taxId || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Company Registration</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{vendor.registrationNumber || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Bank Account Holder</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{vendor.bankAccountHolderName || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Bank Account Number</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{vendor.bankAccountNumber || '••••'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
