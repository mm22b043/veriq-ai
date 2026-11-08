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

  const processedVendors = useMemo(() => {
    let result = [...vendors];

    if (statusFilter !== 'ALL') {
      result = result.filter(v => {
        const dec = (v.decision || v.status || '').toUpperCase();
        return dec.includes(statusFilter);
      });
    }

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
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border shadow-card-light dark:shadow-card-dark overflow-hidden transition-all duration-300">
      {/* Controls Bar */}
      <div className="p-4 border-b border-light-border dark:border-white/5 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-slate-50/60 dark:bg-dark-surface/50">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search by company, vendor ID, email..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white dark:bg-dark-elevated text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-dark-elevated border border-slate-200 dark:border-white/10 rounded-xl p-1 text-xs shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            {['ALL', 'APPROVED', 'PENDING', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
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
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-semibold border-b border-light-border dark:border-white/5 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-white" onClick={() => toggleSort('vendorId')}>
                <div className="flex items-center gap-1">Vendor ID <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-white" onClick={() => toggleSort('companyName')}>
                <div className="flex items-center gap-1">Company Name <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-white" onClick={() => toggleSort('submissionDate')}>
                <div className="flex items-center gap-1">Submitted <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
              </th>
              <th className="py-3 px-4">Decision</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {paginatedVendors.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{emptyMessage}</p>
                  {searchTerm && <p className="text-xs mt-1">Try clearing your search query or filter.</p>}
                </td>
              </tr>
            ) : (
              paginatedVendors.map((vendor) => (
                <tr key={vendor.id || vendor.vendorId} className="hover:bg-brand-50/30 dark:hover:bg-white/[0.03] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                    {vendor.vendorId || vendor.id || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {vendor.companyName || '—'}
                    {vendor.country && (
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-normal">{vendor.country}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{vendor.contactPerson || '—'}</td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{vendor.email || '—'}</td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{formatDate(vendor.submissionDate || vendor.created_at)}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={vendor.decision || vendor.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {onViewDetails && (
                        <button
                          onClick={() => onViewDetails(vendor)}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onViewReport && (
                        <button
                          onClick={() => onViewReport(vendor)}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
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
        <div className="p-3.5 border-t border-light-border dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-dark-surface/40 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedVendors.length)} of {processedVendors.length} vendors
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-medium">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
