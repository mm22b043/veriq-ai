import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ShieldAlert
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import { getVendors } from '../services/api';

export default function AllVendors() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

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
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">All Onboarded Vendors</h2>
          <p className="text-xs text-slate-500">
            Comprehensive directory of evaluated vendors and risk decisions
          </p>
        </div>

        <button
          onClick={() => navigate('/register')}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-xs"
        >
          + Add New Vendor
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID, Tax ID, Reg Number..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {['ALL', 'APPROVED', 'PENDING', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
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
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-xs">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-700">No vendor records found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Try resetting the filters or clearing the search query.'
              : 'Submit a new vendor registration to view live verification records here.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
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
              <tbody className="divide-y divide-slate-100">
                {filtered.map((vendor) => (
                  <tr key={vendor.id || vendor.vendorId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      {vendor.vendorId || vendor.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {vendor.companyName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-2xs">
                      {vendor.email}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {vendor.taxId || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {vendor.registrationNumber || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {vendor.bankAccountHolderName || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={vendor.decision || vendor.status} />
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600" title={vendor.decisionReason}>
                      {vendor.decisionReason || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate('/reports', { state: { vendorId: vendor.vendorId || vendor.id } })}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
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
      {selectedVendor && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Vendor Profile Details</h3>
                <StatusBadge status={selectedVendor.decision || selectedVendor.status} />
              </div>
              <button
                onClick={() => setSelectedVendor(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs">
              {/* Decision Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                  Verification Evaluation
                </span>
                <p className="text-slate-800 font-medium mt-1 leading-relaxed">
                  {selectedVendor.decisionReason || 'Evaluation complete.'}
                </p>
              </div>

              {/* Company Info */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-3">
                  <Building2 className="w-4 h-4 text-indigo-600" /> Company Information
                </h4>
                <div className="grid grid-cols-2 gap-3 bg-white p-3 border border-slate-100 rounded-xl">
                  <div>
                    <span className="text-2xs text-slate-400">Company Name</span>
                    <p className="font-semibold text-slate-800">{selectedVendor.companyName}</p>
                  </div>
                  <div>
                    <span className="text-2xs text-slate-400">Vendor ID</span>
                    <p className="font-mono text-slate-800">{selectedVendor.vendorId || selectedVendor.id}</p>
                  </div>
                  <div>
                    <span className="text-2xs text-slate-400">Contact Person</span>
                    <p className="text-slate-800">{selectedVendor.contactPerson || '—'}</p>
                  </div>
                  <div>
                    <span className="text-2xs text-slate-400">Email Address</span>
                    <p className="font-mono text-slate-800">{selectedVendor.email || '—'}</p>
                  </div>
                  <div>
                    <span className="text-2xs text-slate-400">Country</span>
                    <p className="text-slate-800">{selectedVendor.country || '—'}</p>
                  </div>
                  <div>
                    <span className="text-2xs text-slate-400">Address</span>
                    <p className="text-slate-800">{selectedVendor.address || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Business & Banking */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-3">
                  <Landmark className="w-4 h-4 text-indigo-600" /> Business & Banking Details
                </h4>
                <div className="grid grid-cols-2 gap-3 bg-white p-3 border border-slate-100 rounded-xl">
                  <div>
                    <span className="text-2xs text-slate-400">Tax ID / GSTIN</span>
                    <p className="font-mono text-slate-800">{selectedVendor.taxId || '—'}</p>
                  </div>
                  <div>
                    <span className="text-2xs text-slate-400">Registration Number</span>
                    <p className="font-mono text-slate-800">{selectedVendor.registrationNumber || '—'}</p>
                  </div>
                  <div>
                    <span className="text-2xs text-slate-400">Bank Account Holder</span>
                    <p className="text-slate-800 font-medium">{selectedVendor.bankAccountHolderName || '—'}</p>
                  </div>
                  <div>
                    <span className="text-2xs text-slate-400">Bank Account Number</span>
                    <p className="font-mono text-slate-800">{selectedVendor.bankAccountNumber || '••••'}</p>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents */}
              {selectedVendor.documents && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                    <FileText className="w-4 h-4 text-indigo-600" /> Submitted Documentation
                  </h4>
                  <div className="space-y-1.5">
                    {Object.entries(selectedVendor.documents).map(([key, name]) => (
                      <div key={key} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg">
                        <span className="capitalize text-slate-600">{key.replace('_', ' ')}</span>
                        <span className="font-mono text-2xs text-slate-800">{String(name)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedVendor(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200/60"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = selectedVendor.vendorId || selectedVendor.id;
                  setSelectedVendor(null);
                  navigate('/reports', { state: { vendorId: id } });
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs"
              >
                Open Full Verification Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

