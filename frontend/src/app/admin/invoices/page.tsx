'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredItems, saveStoredItems, INITIAL_INVOICES } from '../../../lib/storage';
import { Invoice } from '../../../types/invoice';
import { 
  FileText, Plus, Search, Filter, Trash2, Eye, 
  DollarSign, Clock, CheckCircle, AlertTriangle, FileSpreadsheet, Download 
} from 'lucide-react';
import { generateInvoiceExcel } from '../../../lib/invoices/generateExcel';
import { generateInvoicePDF } from '../../../lib/invoices/generatePDF';
import { format } from 'date-fns';

export default function InvoicesDashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    // Load invoices from localStorage
    setInvoices(getStoredItems('suman_invoices', INITIAL_INVOICES));
  }, []);

  const handleDownloadPDF = async (inv: Invoice) => {
    setDownloadingId(inv.id || '');
    try {
      await generateInvoicePDF(inv);
    } finally {
      setDownloadingId(null);
    }
  };

  // Delete invoice handler
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      const updated = invoices.filter(inv => inv.id !== id);
      setInvoices(updated);
      saveStoredItems('suman_invoices', updated);
    }
  };

  const handleMarkPaid = (id: string) => {
    if (confirm('Mark this invoice as fully paid?')) {
      const updated = invoices.map(inv => {
        if (inv.id === id) {
          return { ...inv, payment_status: 'paid', advance_paid: inv.grand_total, balance_due: 0 };
        }
        return inv;
      });
      setInvoices(updated);
      saveStoredItems('suman_invoices', updated);
    }
  };

  // Filter and Search logic
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.booking_id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      inv.payment_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    totalInvoiced: invoices.reduce((acc, curr) => acc + (curr.grand_total || 0), 0),
    totalCollected: invoices.reduce((acc, curr) => acc + (curr.advance_paid || 0), 0),
    totalOutstanding: invoices.reduce((acc, curr) => acc + (curr.balance_due || 0), 0),
    pendingCount: invoices.filter(inv => inv.payment_status === 'pending').length,
    partialCount: invoices.filter(inv => inv.payment_status === 'partial').length,
    paidCount: invoices.filter(inv => inv.payment_status === 'paid').length
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'partial':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'overdue':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      default: // pending
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    }
  };

  return (
    <div className="space-y-6 text-left pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Invoice Dashboard</h1>
          <p className="text-xs text-text-secondary mt-1">Manage, generate, and track corporate and local guest billing.</p>
        </div>
        <Link href="/admin/invoices/new">
          <button className="px-5 py-2.5 bg-accent-primary hover:bg-accent-hover text-white text-xs font-bold rounded-xl shadow-lg shadow-accent-primary/20 transition-all flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </Link>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Invoiced */}
        <div className="glassmorphism p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Total Invoiced</p>
            <p className="text-xl font-extrabold text-white">₹{stats.totalInvoiced.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            <p className="text-[9px] text-text-secondary">{invoices.length} invoices generated</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20 shrink-0">
            <FileText className="w-5 h-5 text-accent-primary" />
          </div>
        </div>

        {/* Card 2: Total Collected */}
        <div className="glassmorphism p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Total Collected</p>
            <p className="text-xl font-extrabold text-emerald-400">₹{stats.totalCollected.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            <p className="text-[9px] text-text-secondary">{stats.paidCount} fully paid</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        {/* Card 3: Total Outstanding */}
        <div className="glassmorphism p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Outstanding Balance</p>
            <p className="text-xl font-extrabold text-amber-500">₹{stats.totalOutstanding.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            <p className="text-[9px] text-text-secondary">{stats.partialCount} partially paid</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        {/* Card 4: Accounts Overview */}
        <div className="glassmorphism p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-2 w-full">
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Invoice Overview</p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-emerald-500/5 py-1 px-1.5 rounded-lg border border-emerald-500/10">
                <p className="font-extrabold text-emerald-400">{stats.paidCount}</p>
                <p className="text-[8px] text-text-muted uppercase">Paid</p>
              </div>
              <div className="bg-blue-500/5 py-1 px-1.5 rounded-lg border border-blue-500/10">
                <p className="font-extrabold text-blue-400">{stats.partialCount}</p>
                <p className="text-[8px] text-text-muted uppercase">Partial</p>
              </div>
              <div className="bg-amber-500/5 py-1 px-1.5 rounded-lg border border-amber-500/10">
                <p className="font-extrabold text-amber-400">{stats.pendingCount}</p>
                <p className="text-[8px] text-text-muted uppercase">Pend.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="glassmorphism p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice #, name, booking ID..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-text-muted focus:border-accent-primary focus:outline-none transition-all font-mono"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-[10px] font-semibold uppercase tracking-wider">
          {[
            { label: 'All Invoices', val: 'all' },
            { label: 'Paid', val: 'paid' },
            { label: 'Partial', val: 'partial' },
            { label: 'Pending', val: 'pending' },
            { label: 'Overdue', val: 'overdue' },
          ].map((filt) => (
            <button
              key={filt.val}
              onClick={() => setStatusFilter(filt.val)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                statusFilter === filt.val 
                  ? 'bg-accent-primary text-white' 
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              {filt.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE LISTING */}
      <div className="glassmorphism rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-white font-extrabold uppercase tracking-wider text-[10px]">
                <th className="p-4 w-12 text-center">#</th>
                <th className="p-4">Invoice No</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Booking ID</th>
                <th className="p-4 text-right">Grand Total</th>
                <th className="p-4 text-right">Balance Due</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-text-secondary">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv, index) => (
                  <tr key={inv.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 text-center text-text-muted font-mono">{index + 1}</td>
                    <td className="p-4 text-white font-bold font-mono">{inv.invoice_number}</td>
                    <td className="p-4 font-medium">
                      {inv.created_at ? format(new Date(inv.created_at), 'dd MMM yyyy') : '—'}
                    </td>
                    <td className="p-4 text-white font-semibold">{inv.customer_name}</td>
                    <td className="p-4 font-mono">{inv.booking_id}</td>
                    <td className="p-4 text-right text-white font-bold font-mono">
                      ₹{(inv.grand_total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right text-white font-bold font-mono">
                      ₹{(inv.balance_due || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getStatusBadgeClass(inv.payment_status)}`}>
                        {inv.payment_status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/admin/invoices/${inv.id}`}>
                          <button 
                            title="View Invoice"
                            className="p-2 text-text-secondary hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button 
                          title="Download PDF"
                          onClick={() => handleDownloadPDF(inv)}
                          disabled={downloadingId === inv.id}
                          className="p-2 text-accent-primary hover:text-accent-hover rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          title="Export Excel"
                          onClick={() => generateInvoiceExcel(inv)}
                          className="p-2 text-emerald-400 hover:text-emerald-300 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          title="Mark as Paid"
                          onClick={() => handleMarkPaid(inv.id!)}
                          className="p-2 text-emerald-400 hover:text-emerald-300 rounded-lg bg-white/5 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          title="Delete Invoice"
                          onClick={() => handleDelete(inv.id!)}
                          className="p-2 text-text-secondary hover:text-red-400 rounded-lg bg-white/5 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-text-muted font-medium">
                    No invoices found. Generate a new invoice to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
