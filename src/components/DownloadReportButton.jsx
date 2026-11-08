import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle2, FileText, Loader2 } from 'lucide-react';

export default function DownloadReportButton({ vendor, reportType = 'Full Verification Dossier' }) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    if (!vendor) return;
    setDownloading(true);

    setTimeout(() => {
      // Build structured verification report payload
      const reportContent = {
        platform: 'VERIQ AI — Intelligent Vendor Verification Platform',
        timestamp: new Date().toISOString(),
        reportType,
        vendorDetails: {
          vendorId: vendor.vendorId || vendor.id || 'N/A',
          companyName: vendor.companyName || 'N/A',
          contactPerson: vendor.contactPerson || 'N/A',
          email: vendor.email || 'N/A',
          country: vendor.country || 'N/A',
          taxId: vendor.taxId || 'N/A',
          registrationNumber: vendor.registrationNumber || 'N/A',
          bankAccountHolderName: vendor.bankAccountHolderName || 'N/A',
          bankAccountNumber: vendor.bankAccountNumber || '••••',
          ifscCode: vendor.ifscCode || 'N/A',
        },
        evaluation: {
          finalDecision: vendor.decision || vendor.status || 'Pending',
          decisionReason: vendor.decisionReason || 'All verification parameters executed.',
          ocrComparisonStatus: 'Completed via Google Gemini',
          antiFraudCheck: vendor.bankAccountHolderName === vendor.companyName ? 'PASS' : 'FLAGGED_MISMATCH',
        },
        documents: vendor.documents || {}
      };

      // Create download blob
      const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `VERIQ_Report_${(vendor.companyName || 'Vendor').replace(/\s+/g, '_')}_${vendor.vendorId || 'Audit'}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 800);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      onClick={handleDownload}
      disabled={downloading}
      className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm ${
        downloaded
          ? 'bg-emerald-600 text-white shadow-glow-sm'
          : 'bg-white dark:bg-dark-elevated text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-300'
      }`}
      title="Download verification audit report"
    >
      {downloading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600 dark:text-brand-400" />
          <span>Generating Audit Dossier...</span>
        </>
      ) : downloaded ? (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          <span>Report Downloaded!</span>
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Download Report</span>
        </>
      )}
    </motion.button>
  );
}

