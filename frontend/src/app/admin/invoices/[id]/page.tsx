'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredItems, saveStoredItems, INITIAL_INVOICES } from '../../../../lib/storage';
import { Invoice } from '../../../../types/invoice';
import { InvoicePreview } from '../../../../components/invoices/InvoicePreview';
import InvoiceForm from '../../../../components/invoices/InvoiceForm';
import { generateInvoicePDF } from '../../../../lib/invoices/generatePDF';
import { generateInvoiceExcel } from '../../../../lib/invoices/generateExcel';
import { 
  ArrowLeft, Edit, Download, FileSpreadsheet, 
  Check, X, FileText 
} from 'lucide-react';

export default function InvoiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = () => {
    const invoices = getStoredItems('suman_invoices', INITIAL_INVOICES);
    const found = invoices.find(inv => inv.id === id);
    if (found) {
      setInvoice(found);
    }
    setIsLoading(false);
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    setPdfGenerating(true);
    try {
      await generateInvoicePDF(invoice);
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleDownloadExcel = () => {
    if (!invoice) return;
    generateInvoiceExcel(invoice);
  };

  if (isLoading) {
    return (
      <div className="glassmorphism p-12 text-center text-text-secondary font-medium rounded-2xl border border-white/5">
        Loading Invoice Details...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="glassmorphism p-12 text-center text-red-400 font-semibold rounded-2xl border border-white/5 space-y-4">
        <p>Invoice not found in system.</p>
        <Link href="/admin/invoices">
          <button className="px-5 py-2.5 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">
            Back to Invoices
          </button>
        </Link>
      </div>
    );
  }

  // Calculate totals for previews
  const totals = {
    subtotal: invoice.subtotal || 0,
    gstAmount: invoice.gst_amount || 0,
    grandTotal: invoice.grand_total || 0,
    balanceDue: invoice.balance_due || 0,
  };

  return (
    <div className="space-y-6 text-left pb-12">
      {/* ACTION BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Link href="/admin/invoices">
            <button className="flex items-center gap-1 text-xs text-text-secondary hover:text-white border border-white/10 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Invoices
            </button>
          </Link>
          <div className="pt-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-accent-primary" />
              {isEditing ? 'Modify Invoice Details' : `Invoice ${invoice.invoice_number}`}
            </h1>
            <p className="text-xs text-text-secondary">
              {isEditing 
                ? 'Update invoice fields and apply digital signatures.' 
                : `Review, print, and export options for booking reference ${invoice.booking_id}.`
              }
            </p>
          </div>
        </div>

        {/* Dynamic button changes based on Edit vs View Mode */}
        <div className="flex flex-wrap gap-2.5 self-start md:self-center">
          {isEditing ? (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-white/10 hover:bg-white/5 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <X className="w-4 h-4 text-red-400" />
              Cancel Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-white/10 hover:bg-white/5 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit className="w-4 h-4 text-accent-primary" />
                Edit Invoice
              </button>
              
              <button
                onClick={handleDownloadExcel}
                className="px-4 py-2 border border-emerald-500/30 hover:bg-emerald-500/5 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Export Excel
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={pdfGenerating}
                className="px-4 py-2 bg-accent-primary hover:bg-accent-hover text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {pdfGenerating ? 'Generating PDF...' : 'Download PDF'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* DYNAMIC CONTENT */}
      {isEditing ? (
        <InvoiceForm 
          initialData={invoice} 
          onSave={(saved) => {
            setInvoice(saved);
            setIsEditing(false);
          }}
        />
      ) : (
        <div className="glassmorphism p-6 sm:p-8 rounded-3xl border border-white/5 bg-[#0B0F19] shadow-2xl overflow-x-auto">
          <div className="min-w-[794px] max-w-[800px] mx-auto">
            <InvoicePreview data={invoice} totals={totals} />
          </div>
        </div>
      )}
    </div>
  );
}
