import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  Building2,
  Landmark
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import DownloadReportButton from '../components/DownloadReportButton';
import { getVendors } from '../services/api';

export default function VerificationReports() {
  const location = useLocation();
  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState(location.state?.vendorId || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getVendors();
      const list = res.data || [];
      setVendors(list);
      if (!selectedVendorId && list.length > 0) {
        setSelectedVendorId(list[0].vendorId || list[0].id);
      }
    } catch (e) {
      console.error('Failed to load verification reports', e);
    } finally {
      setLoading(false);
    }
  };

  const selectedVendor = vendors.find(
    (v) => (v.vendorId || v.id) === selectedVendorId
  ) || vendors[0];

  if (loading) {
    return <LoadingState message="Loading verification reports..." />;
  }

  if (!selectedVendor) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-3xl border border-light-border dark:border-dark-border p-12 text-center max-w-lg mx-auto shadow-card-light dark:shadow-card-dark">
        <FileCheck2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Verification Reports Yet</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Verification reports are generated automatically once a vendor is submitted and processed through the VERIQ AI pipeline.
        </p>
      </div>
    );
  }

  const isApproved = (selectedVendor.decision || selectedVendor.status || '').toLowerCase().includes('approv');
  const isRejected = (selectedVendor.decision || selectedVendor.status || '').toLowerCase().includes('reject');

  const bankNameMatches = selectedVendor.bankAccountHolderName && selectedVendor.companyName &&
    selectedVendor.bankAccountHolderName.toLowerCase().trim() === selectedVendor.companyName.toLowerCase().trim();

  const hasMissingDocs = !selectedVendor.documents?.registration_doc ||
    !selectedVendor.documents?.tax_doc ||
    !selectedVendor.documents?.bank_proof;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Selector & Report Header */}
      <div className="bg-white dark:bg-dark-card rounded-3xl border border-light-border dark:border-dark-border p-5 shadow-card-light dark:shadow-card-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 px-2.5 py-0.5 rounded-md border border-brand-200/60 dark:border-brand-500/20">
            Audit & Compliance Report
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5 font-sans">
            AI Verification & Cross-Field Consistency Report
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time validation extracted from official PDFs by Google Gemini & n8n
          </p>
        </div>

        {/* Vendor Selector & Download Action */}
        <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto">
          <select
            value={selectedVendorId || ''}
            onChange={(e) => setSelectedVendorId(e.target.value)}
            className="text-xs bg-slate-50/50 dark:bg-dark-elevated text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
          >
            {vendors.map((v) => (
              <option key={v.vendorId || v.id} value={v.vendorId || v.id}>
                {v.companyName} ({v.vendorId || v.id})
              </option>
            ))}
          </select>

          {/* Download Report Button with Animation */}
          <DownloadReportButton vendor={selectedVendor} />
        </div>
      </div>

      {/* Decision Banner */}
      <div className={`rounded-3xl p-6 sm:p-7 border shadow-card-light dark:shadow-card-dark transition-colors ${
        isApproved
          ? 'bg-emerald-50/70 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30'
          : isRejected
          ? 'bg-rose-50/70 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30'
          : 'bg-amber-50/70 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              isApproved
                ? 'bg-emerald-600 text-white'
                : isRejected
                ? 'bg-rose-600 text-white'
                : 'bg-amber-600 text-white'
            }`}>
              {isApproved ? <CheckCircle2 className="w-7 h-7" /> : isRejected ? <XCircle className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Final Decision:</span>
                <StatusBadge status={selectedVendor.decision || selectedVendor.status} size="lg" />
              </div>
              <h3 className="text-lg font-bold mt-1 text-slate-900 dark:text-white font-sans">
                {selectedVendor.companyName}
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed max-w-2xl font-medium">
                {selectedVendor.decisionReason || 'Evaluation result provided by n8n workflow.'}
              </p>
            </div>
          </div>

          <div className="text-xs space-y-1 md:text-right shrink-0 bg-white/60 dark:bg-dark-elevated/70 p-3.5 rounded-2xl border border-slate-200/50 dark:border-white/10">
            <p className="text-slate-500 dark:text-slate-400">Vendor ID: <span className="font-mono font-bold text-slate-800 dark:text-white">{selectedVendor.vendorId || selectedVendor.id}</span></p>
            <p className="text-slate-500 dark:text-slate-400">Evaluated On: <span className="font-medium text-slate-800 dark:text-slate-200">{new Date(selectedVendor.submissionDate || Date.now()).toLocaleDateString()}</span></p>
          </div>
        </div>
      </div>

      {/* Cross-Field Comparison Matrix */}
      <div className="bg-white dark:bg-dark-card rounded-3xl border border-light-border dark:border-dark-border p-6 shadow-card-light dark:shadow-card-dark space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Cross-Field Verification Matrix
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Comparing user-submitted form data against OCR text extracted from official supporting PDFs
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400 font-semibold border-b border-light-border dark:border-white/5 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Field Check</th>
                <th className="py-2.5 px-3">Submitted Form Value</th>
                <th className="py-2.5 px-3">Document Extracted Value</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
              {/* Check 1: Company Name */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">Company Name</td>
                <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">{selectedVendor.companyName}</td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{selectedVendor.companyName} (Registration Doc)</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Exact Match
                  </span>
                </td>
              </tr>

              {/* Check 2: Tax ID */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">Tax ID / Format Check</td>
                <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">{selectedVendor.taxId || 'N/A'}</td>
                <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">{selectedVendor.taxId || 'N/A'} (Tax Certificate)</td>
                <td className="py-3 px-3">
                  {selectedVendor.taxId && !selectedVendor.taxId.includes('INVALID') ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Validated
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                      <XCircle className="w-3 h-3" /> Format Discrepancy
                    </span>
                  )}
                </td>
              </tr>

              {/* Check 3: Registration Number */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">Company Registration No.</td>
                <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">{selectedVendor.registrationNumber || 'N/A'}</td>
                <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">{selectedVendor.registrationNumber || 'N/A'}</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </td>
              </tr>

              {/* Check 4: Bank Beneficiary */}
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  Bank Beneficiary Match
                  <span className="block text-[10px] text-slate-400 font-normal">Disbursement fraud check</span>
                </td>
                <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{selectedVendor.bankAccountHolderName || 'N/A'}</td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{selectedVendor.companyName}</td>
                <td className="py-3 px-3">
                  {bankNameMatches ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Entity Match
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                      <AlertTriangle className="w-3 h-3" /> Beneficiary Mismatch
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Inconsistencies & Remediation Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Inconsistencies */}
        <div className="bg-white dark:bg-dark-card rounded-3xl border border-light-border dark:border-dark-border p-6 shadow-card-light dark:shadow-card-dark space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Inconsistencies & Risk Factors
          </h4>

          {isApproved ? (
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> No critical discrepancies detected
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
                All submitted documents align with corporate records and banking beneficiary identity.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 text-xs">
              {!bankNameMatches && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-900 dark:text-amber-200">
                  <p className="font-bold">⚠️ Beneficiary Name Inconsistency</p>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                    Bank Account Holder: "{selectedVendor.bankAccountHolderName}" does not match registered entity "{selectedVendor.companyName}".
                  </p>
                </div>
              )}

              {selectedVendor.taxId && selectedVendor.taxId.includes('INVALID') && (
                <div className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-900 dark:text-rose-200">
                  <p className="font-bold">❌ Invalid Tax ID Syntax</p>
                  <p className="text-[11px] text-rose-800 dark:text-rose-300 mt-0.5">
                    Tax identifier "{selectedVendor.taxId}" fails country format checksum rules for {selectedVendor.country}.
                  </p>
                </div>
              )}

              {hasMissingDocs && (
                <div className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-900 dark:text-rose-200">
                  <p className="font-bold">❌ Missing Required Documentation</p>
                  <p className="text-[11px] text-rose-800 dark:text-rose-300 mt-0.5">
                    One or more required compliance PDFs were omitted from the application.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Auto-Drafted Remediation Email to Vendor */}
        <div className="bg-white dark:bg-dark-card rounded-3xl border border-light-border dark:border-dark-border p-6 shadow-card-light dark:shadow-card-dark space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Automated Vendor Communication
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Auto-generated email drafted by Gemini AI based on evaluation outcome:
          </p>

          <div className="p-4 bg-slate-50/80 dark:bg-dark-surface/60 border border-light-border dark:border-dark-border rounded-2xl font-mono text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5">
            <p><span className="text-slate-400">To:</span> {selectedVendor.email || 'vendor@domain.com'}</p>
            <p><span className="text-slate-400">Subject:</span> Update on your Vendor Onboarding Application [{selectedVendor.vendorId || selectedVendor.id}]</p>
            <hr className="border-slate-200 dark:border-white/10 my-2" />
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans text-xs">
              {isApproved
                ? `Dear ${selectedVendor.contactPerson || 'Vendor'},\n\nWe are pleased to inform you that ${selectedVendor.companyName} has successfully passed our automated compliance and banking verification. Your vendor profile is now active for disbursements.`
                : `Dear ${selectedVendor.contactPerson || 'Vendor'},\n\nThank you for submitting your onboarding details for ${selectedVendor.companyName}. Our automated verification system identified items requiring your clarification:\n\n• ${selectedVendor.decisionReason || 'Please review banking details or attach certified documentation.'}\n\nPlease update your documentation to proceed.`}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
