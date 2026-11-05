import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, FileCheck, ArrowUpDown } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function VendorTable({ vendors = [], onViewDetails, onViewReport, emptyMessage = 'No vendors found.' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState('submissionDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered and sorted data
  const processedVendors = useMemo(() => {
    let result = [...vendors];

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(v => {
        const dec = (v.decision || v.status || '').toUpperCase();
        return dec.includes(statusFilter);
      });
    }

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(v =>
        (v.companyName && v.companyName.toLowerCase().includes(q)) ||
        (v.vendorId && v.vendorId.toLowerCase().includes(q)) ||
        (v.email && v.email.toLowerCase().includes(q)) ||
        (v.contactPerson && v.contactPerson.toLowerCase().includes(q)) ||
        (v.taxId && v.taxId.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (sortField === 'submissionDate') {
        valA = new Date(valA).getTime() || 0;
        valB = new Date(valB).getTime() || 0;
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [vendors, searchTerm, statusFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(processedVendors.length / itemsPerPage) || 1;
  const paginatedVendors = processedVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 border-b border-slate-200/80 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-slate-50/50">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search by company, vendor ID, email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {['ALL', 'APPROVED', 'PENDING', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 cursor-pointer hover:text-slate-700" onClick={() => toggleSort('vendorId')}>
                <div className="flex items-center gap-1">Vendor ID <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-slate-700" onClick={() => toggleSort('companyName')}>
                <div className="flex items-center gap-1">Company Name <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th className="py-3 px-4">Contact Person</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4 cursor-pointer hover:text-slate-700" onClick={() => toggleSort('submissionDate')}>
                <div className="flex items-center gap-1">Submitted <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedVendors.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  <p className="text-sm font-medium">{emptyMessage}</p>
                  {searchTerm && <p className="text-xs mt-1">Try clearing your search query or filter.</p>}
                </td>
              </tr>
            ) : (
              paginatedVendors.map((vendor) => (
                <tr key={vendor.id || vendor.vendorId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                    {vendor.vendorId || vendor.id || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {vendor.companyName || '—'}
                    {vendor.country && (
                      <span className="block text-2xs text-slate-400 font-normal">{vendor.country}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{vendor.contactPerson || '—'}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-2xs">{vendor.email || '—'}</td>
                  <td className="py-3.5 px-4 text-slate-500">{formatDate(vendor.submissionDate || vendor.created_at)}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={vendor.decision || vendor.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {onViewDetails && (
                        <button
                          onClick={() => onViewDetails(vendor)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onViewReport && (
                        <button
                          onClick={() => onViewReport(vendor)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Verification Report"
                        >
                          <FileCheck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {processedVendors.length > itemsPerPage && (
        <div className="p-3 border-t border-slate-200/80 flex items-center justify-between bg-slate-50/40 text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedVendors.length)} of {processedVendors.length} vendors
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-medium">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

