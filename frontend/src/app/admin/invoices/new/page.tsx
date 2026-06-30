'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import InvoiceForm from '../../../../components/invoices/InvoiceForm';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

function NewInvoiceFormContainer() {
  const searchParams = useSearchParams();
  const bookingId = searchParams?.get('bookingId') || '';

  return <InvoiceForm bookingId={bookingId} />;
}

export default function CreateNewInvoicePage() {
  return (
    <div className="space-y-6 text-left pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Link href="/admin/invoices">
            <button className="flex items-center gap-1 text-xs text-text-secondary hover:text-white border border-white/10 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </button>
          </Link>
          <div className="pt-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent-primary animate-pulse" />
              Generate Commercial Invoice
            </h1>
            <p className="text-xs text-text-secondary">Create a billing invoice manually or auto-fill customer Details from a Booking reference.</p>
          </div>
        </div>
      </div>

      {/* RENDER FORM BLOCK */}
      <Suspense fallback={
        <div className="glassmorphism p-12 text-center text-text-secondary font-medium rounded-2xl border border-white/5">
          Loading Invoicing Module...
        </div>
      }>
        <NewInvoiceFormContainer />
      </Suspense>
    </div>
  );
}
