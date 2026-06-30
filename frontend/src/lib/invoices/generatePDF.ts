import React from 'react';
import { createRoot } from 'react-dom/client';
import { Invoice } from '../../types/invoice';
import { InvoicePreview } from '../../components/invoices/InvoicePreview';

export async function generateInvoicePDF(invoice: Invoice) {
  if (typeof window === 'undefined') return;

  try {
    // Dynamically import jsPDF and html2canvas
    const { jsPDF } = await import('jspdf');
    const html2canvasModule = await import('html2canvas');
    const html2canvas = html2canvasModule.default || html2canvasModule;

    // Calculate totals to pass into the Preview
    const subtotal = 
      (invoice.base_rental_amount || 0) +
      (invoice.driver_allowance || 0) +
      (invoice.night_charges || 0) +
      (invoice.toll_charges || 0) +
      (invoice.parking_charges || 0) +
      (invoice.extra_km_charges || 0);

    const gstAmount = invoice.gst_amount ?? parseFloat((subtotal * (invoice.gst_percentage || 5) / 100).toFixed(2));
    const grandTotal = invoice.grand_total ?? (subtotal + gstAmount - (invoice.discount_amount || 0));
    const balanceDue = invoice.balance_due ?? (grandTotal - (invoice.advance_paid || 0));

    const totals = { subtotal, gstAmount, grandTotal, balanceDue };

    // Create a detached container to render the React component
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    container.style.width = '794px'; // EXACT A4 Pixel width at 96 DPI
    container.style.minWidth = '794px';
    container.style.maxWidth = '794px';
    container.style.height = '1123px';
    container.style.minHeight = '1123px';
    container.style.maxHeight = '1123px';
    container.style.zIndex = '-9999';
    
    // Do NOT inherit body classes as they contain OKLCH colors which crash html2canvas
    // container.className = document.body.className;
    
    document.body.appendChild(container);

    const root = createRoot(container);
    
    // Render the InvoicePreview component
    root.render(
      React.createElement(InvoicePreview, { data: invoice, totals: totals })
    );

    // Wait for the DOM to paint, images to load, and fonts to be ready
    await document.fonts.ready;
    await new Promise((resolve) => setTimeout(resolve, 800));

    const element = container.querySelector('#invoice-print-area');

    if (!element) {
      console.error('Invoice print area not found');
      root.unmount();
      document.body.removeChild(container);
      return;
    }

    // CRITICAL FIX: html2canvas crashes on OKLCH/LAB colors used by modern Tailwind v4.
    // We walk the DOM and force any unsupported computed colors to safe fallbacks via inline styles.
    const sanitizeColors = (node: HTMLElement) => {
      const computed = window.getComputedStyle(node);
      
      const isUnsupported = (val: string) => val.includes('oklch') || val.includes('lab') || val.includes('color(');

      if (isUnsupported(computed.borderColor)) node.style.borderColor = 'rgba(0,0,0,0)';
      if (isUnsupported(computed.color)) node.style.color = '#1a1a1a';
      if (isUnsupported(computed.backgroundColor)) node.style.backgroundColor = 'rgba(0,0,0,0)';
      if (isUnsupported(computed.outlineColor)) node.style.outlineColor = 'rgba(0,0,0,0)';
      if (isUnsupported(computed.textDecorationColor)) node.style.textDecorationColor = 'rgba(0,0,0,0)';

      Array.from(node.children).forEach(child => sanitizeColors(child as HTMLElement));
    };

    sanitizeColors(element as HTMLElement);

    // Generate canvas at exact A4 natural pixel dimensions (96 DPI)
    const canvas = await html2canvas(element as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: 794,
      height: 1123,
      windowWidth: 794,
      windowHeight: 1123,
    });

    // Convert canvas to image
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Draw the image filling the entire A4 page (210x297mm)
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    pdf.save(`${invoice.invoice_number || 'INV-001'}.pdf`);

    // Cleanup
    root.unmount();
    document.body.removeChild(container);
  } catch (error) {
    console.error('PDF generation failed:', error);
  }
}
