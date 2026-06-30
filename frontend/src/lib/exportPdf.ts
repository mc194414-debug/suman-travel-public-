import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportBillToPdf(bill: any, booking: any) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;

  // Premium White Theme Colors
  const TEXT_MAIN = [30, 41, 59] as [number, number, number]; // slate-800
  const TEXT_MUTED = [100, 116, 139] as [number, number, number]; // slate-500
  const ACCENT = [234, 88, 12] as [number, number, number]; // orange-600
  const PANEL = [248, 250, 252] as [number, number, number]; // slate-50
  const BORDER = [226, 232, 240] as [number, number, number]; // slate-200

  // ── Header ──────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...ACCENT);
  doc.text('SUMAN TRAVELS', 15, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Premium Chauffeur-Driven Car Rental', 15, 26);
  doc.text('1st Floor, KWX 7715, Mangalwadi, Juhu Tara Road, Santacruz West, Mumbai - 400049', 15, 32);
  doc.text('Phone: +91 93249 99672 | Email: sumantravels.mumbai@gmail.com', 15, 37);

  // Invoice label (top-right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...TEXT_MAIN);
  doc.text('INVOICE', W - 15, 20, { align: 'right' });
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_MUTED);
  doc.text(`Invoice No: ${bill.bill_number || 'INV-DRAFT'}`, W - 15, 28, { align: 'right' });
  doc.text(`Date: ${new Date(bill.created_at || Date.now()).toLocaleDateString('en-IN')}`, W - 15, 34, { align: 'right' });

  // ── Bill To ───────────────────────────────────────────────
  doc.setFillColor(...PANEL);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(15, 45, W - 30, 25, 2, 2, 'FD');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...ACCENT);
  doc.text('BILL TO', 20, 52);
  
  doc.setTextColor(...TEXT_MAIN);
  doc.setFontSize(11);
  doc.text(booking.passenger_name || booking.customer_name || 'Customer', 20, 59);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_MUTED);
  doc.text(`Phone: ${booking.passenger_phone || '—'}`, 20, 65);

  // Booking info (right side inside panel)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...ACCENT);
  doc.text('BOOKING DETAILS', W - 85, 52);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_MUTED);
  doc.text(`Booking #: ${booking.booking_number || '—'}`, W - 85, 59);
  doc.text(`Vehicle: ${booking.car_name || '—'}`, W - 85, 65);

  // ── Trip summary ──────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_MAIN);
  doc.text('Trip Summary', 15, 82);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.5);
  doc.line(15, 85, W - 15, 85);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_MUTED);
  const pickup = booking.pickup_datetime ? new Date(booking.pickup_datetime).toLocaleString('en-IN') : '—';
  const dropoff = booking.actual_dropoff ? new Date(booking.actual_dropoff).toLocaleString('en-IN') : '—';
  doc.text(`Start: ${pickup}`, 15, 92);
  doc.text(`End:   ${dropoff}`, 15, 98);
  doc.text(`From: ${booking.pickup_location || '—'}`, 15, 104);
  doc.text(`To:   ${booking.drop_location || '—'}`, 15, 110);
  doc.text(`Odometer: ${booking.odometer_start || 0} km → ${booking.odometer_end || 0} km (${bill.actualKm || 0} km run)`, 15, 116);

  // ── Line items table ──────────────────────────────────────
  const rows = [];

  if (bill.packageAmount > 0) {
    rows.push([bill.packageLabel || 'Package', '—', `Rs. ${bill.packageAmount?.toLocaleString('en-IN')}`]);
  }
  if (bill.extraHoursAmount > 0) {
    rows.push([`Extra Hours`, `${bill.extraHours} hrs × Rs. ${bill.extra_hour_rate || 0}/hr`, `Rs. ${bill.extraHoursAmount?.toLocaleString('en-IN')}`]);
  }
  if (bill.extraKmAmount > 0) {
    rows.push([`Extra Km`, `${bill.extraKm} km × Rs. ${bill.extra_km_rate || 0}/km`, `Rs. ${bill.extraKmAmount?.toLocaleString('en-IN')}`]);
  }
  if (bill.nightChargeAmount > 0) {
    rows.push([`Driver Night Charge`, 'After 23:00', `Rs. ${bill.nightChargeAmount?.toLocaleString('en-IN')}`]);
  }
  if (bill.tollAmount > 0) {
    rows.push([`Toll Charges`, bill.toll_description || '', `Rs. ${bill.tollAmount?.toLocaleString('en-IN')}`]);
  }
  if (bill.parkingAmount > 0) {
    rows.push([`Parking Charges`, '', `Rs. ${bill.parkingAmount?.toLocaleString('en-IN')}`]);
  }
  if (bill.otherCharges > 0) {
    rows.push([`Other Charges`, bill.otherDescription || '', `Rs. ${bill.otherCharges?.toLocaleString('en-IN')}`]);
  }
  if (bill.discountAmount > 0) {
    rows.push([`Discount`, bill.discountReason || '', `- Rs. ${bill.discountAmount?.toLocaleString('en-IN')}`]);
  }

  autoTable(doc, {
    startY: 125,
    head: [['Description', 'Details', 'Amount']],
    body: rows,
    styles: { fontSize: 9, cellPadding: 5, textColor: TEXT_MAIN },
    headStyles: { fillColor: ACCENT, textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 80, textColor: TEXT_MUTED },
      2: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
    },
    theme: 'grid',
    alternateRowStyles: { fillColor: [250, 250, 250] },
    tableLineColor: BORDER,
    tableLineWidth: 0.1,
  });

  // ── Totals block ──────────────────────────────────────────
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const totalsX = W - 90;

  doc.setFillColor(...PANEL);
  doc.rect(totalsX - 5, finalY - 5, 80, 52, 'F');

  const addTotalRow = (label: string, value: string, y: number, bold = false, color?: [number, number, number]) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(bold ? 11 : 9);
    doc.setTextColor(...(color || TEXT_MUTED));
    doc.text(label, totalsX, y);
    doc.text(value, W - 20, y, { align: 'right' });
  };

  addTotalRow('Subtotal:', `Rs. ${bill.subtotal?.toLocaleString('en-IN') || '0'}`, finalY + 2);
  addTotalRow(`GST (${bill.gstRate || 5}%):`, `Rs. ${bill.gstAmount?.toLocaleString('en-IN') || '0'}`, finalY + 10);
  doc.setDrawColor(...BORDER);
  doc.line(totalsX - 5, finalY + 14, W - 15, finalY + 14);
  addTotalRow('TOTAL:', `Rs. ${bill.totalAmount?.toLocaleString('en-IN') || '0'}`, finalY + 22, true, TEXT_MAIN);
  addTotalRow('Amount Paid:', `Rs. ${bill.amountPaid?.toLocaleString('en-IN') || '0'}`, finalY + 31, false, [34, 197, 94]);
  doc.line(totalsX - 5, finalY + 35, W - 15, finalY + 35);
  addTotalRow('BALANCE DUE:', `Rs. ${bill.balanceDue?.toLocaleString('en-IN') || '0'}`, finalY + 44, true, ACCENT);

  // ── Footer ────────────────────────────────────────────────
  const footerY = 275;
  doc.setFillColor(...PANEL);
  doc.rect(0, footerY, W, 22, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Terms: Toll, parking & state permit at actuals. GST @ 5% applicable. Thank you for choosing Suman Travels!', W / 2, footerY + 9, { align: 'center' });

  doc.save(`Suman_Invoice_${bill.bill_number || 'DRAFT'}.pdf`);
}
