import * as XLSX from 'xlsx';
import { Invoice } from '../../types/invoice';

export function generateInvoiceExcel(invoice: Invoice) {
  if (typeof window === 'undefined') return;

  const wb = XLSX.utils.book_new();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const fmtAmount = (num?: number) => {
    return 'Rs. ' + (num || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  };

  const summaryData = [
    ['SUMAN TRAVELS - PREMIUM CHAUFFEUR SERVICES'],
    ['INVOICE'],
    [''],
    ['INVOICE DETAILS', '', 'CUSTOMER DETAILS'],
    ['Invoice Number:', invoice.invoice_number || 'ST-INV', 'Name:', invoice.customer_name || '—'],
    ['Date:', formatDate(invoice.created_at), 'Phone:', invoice.customer_phone || '—'],
    ['Status:', (invoice.payment_status || 'Pending').toUpperCase(), 'Email:', invoice.customer_email || '—'],
    [''],
    ['TRIP DETAILS'],
    ['Vehicle:', invoice.vehicle_name || '—'],
    ['Plate No:', invoice.vehicle_number || '—'],
    ['Pickup Date:', formatDate(invoice.pickup_date)],
    ['Return Date:', formatDate(invoice.return_date)],
    ['Total Distance:', `${invoice.total_distance_km || 0} km`],
    [''],
    ['CHARGES BREAKDOWN', ''],
    ['Description', 'Amount'],
    [`Base Rental (${invoice.total_days || 1} Days)`, fmtAmount(invoice.base_rental_amount)],
    ['Driver Allowance', fmtAmount(invoice.driver_allowance)],
    ['Driver Night Charges', fmtAmount(invoice.night_charges)],
    ['Toll Charges', fmtAmount(invoice.toll_charges)],
    ['Parking Charges', fmtAmount(invoice.parking_charges)],
    [`Extra KM Charges (${invoice.extra_km || 0} km)`, fmtAmount(invoice.extra_km_charges)],
    [`GST (${invoice.gst_percentage || 5}%)`, fmtAmount(invoice.gst_amount)],
    ['Discount', '- ' + fmtAmount(invoice.discount_amount)],
    [''],
    ['Subtotal:', fmtAmount(invoice.subtotal)],
    ['GST Amount:', fmtAmount(invoice.gst_amount)],
    ['Grand Total:', fmtAmount(invoice.grand_total)],
    ['Advance Paid:', fmtAmount(invoice.advance_paid)],
    ['BALANCE DUE:', fmtAmount(invoice.balance_due)],
    [''],
    ['PAYMENT INFO'],
    ['Payment Method:', invoice.payment_method || 'UPI / GPay'],
    ['UPI ID:', 'sumantravels@oksbi'],
    [''],
    ['COMPANY DETAILS'],
    ['Address:', '1st Floor, KWX 7715, Mangalwadi, Juhu Tara Road, Santacruz West, Mumbai - 400049'],
    ['Phone:', '+91 93249 99672'],
    ['Email:', 'sumantravels.mumbai@gmail.com'],
    ['Website:', 'www.sumantravels.in']
  ];

  const ws = XLSX.utils.aoa_to_sheet(summaryData);

  ws['!cols'] = [{ wch: 35 }, { wch: 25 }, { wch: 35 }];

  XLSX.utils.book_append_sheet(wb, ws, 'Invoice Summary');

  XLSX.writeFile(wb, `SumanTravels_Invoice_${invoice.invoice_number || 'ST-INV'}.xlsx`);
}
