import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Landmark,
  FileText,
  FileCheck2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
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
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4">
        <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Vendor Record Not Found</h3>
        <p className="text-xs text-slate-500">
          The requested vendor ID <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{id}</code> could not be found.
        </p>
        <Link
          to="/vendors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Vendors Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          onClick={() => navigate('/reports', { state: { vendorId: vendor.vendorId || vendor.id } })}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs"
        >
          <FileCheck2 className="w-4 h-4" /> View Verification Report
        </button>
      </div>

      {/* Main Vendor Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-2xs text-slate-400 font-semibold">{vendor.vendorId || vendor.id}</span>
              <StatusBadge status={vendor.decision || vendor.status} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{vendor.companyName}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{vendor.country || 'International Vendor'}</p>
          </div>

          <div className="text-xs text-slate-500 sm:text-right">
            <span className="text-2xs text-slate-400 block">Submitted On</span>
            <span className="font-medium text-slate-700">
              {vendor.submissionDate ? new Date(vendor.submissionDate).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        {/* Verification Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Verification Reason
          </h4>
          <p className="text-xs text-slate-800 leading-relaxed">
            {vendor.decisionReason || 'Evaluation recorded.'}
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Company Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-600" /> Company Profile
            </h4>
            <div className="space-y-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-2xs text-slate-400 block">Contact Person</span>
                <span className="font-semibold text-slate-800">{vendor.contactPerson || '—'}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 block">Email</span>
                <span className="font-mono text-slate-800">{vendor.email || '—'}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 block">Phone</span>
                <span className="text-slate-800">{vendor.phone || '—'}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 block">Address</span>
                <span className="text-slate-800">{vendor.address || '—'}</span>
              </div>
            </div>
          </div>

          {/* Banking & Identifiers */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-indigo-600" /> Banking & Registration
            </h4>
            <div className="space-y-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-2xs text-slate-400 block">Tax ID / GSTIN</span>
                <span className="font-mono font-semibold text-slate-800">{vendor.taxId || '—'}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 block">Company Registration</span>
                <span className="font-mono text-slate-800">{vendor.registrationNumber || '—'}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 block">Bank Account Holder</span>
                <span className="font-semibold text-slate-800">{vendor.bankAccountHolderName || '—'}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 block">Bank Account Number</span>
                <span className="font-mono text-slate-800">{vendor.bankAccountNumber || '••••'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

