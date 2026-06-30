// ─────────────────────────────────────────────────────────────
// Suman Travels — Excel Export Utility (SheetJS)
// ─────────────────────────────────────────────────────────────
import * as XLSX from 'xlsx';

function saveWorkbook(wb: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(wb, filename);
}

const fmtAmount = (num?: number) => {
  return 'Rs. ' + (num || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
};

// ── Daily Collection Report ───────────────────────────────────
export function exportDailyReport(data: any[], date: string) {
  const rows = data.map((b) => ({
    'Booking #': b.booking_number,
    'Customer': b.customer_name,
    'Car': b.car_name,
    'Package': b.package_type,
    'Pickup': b.pickup_location,
    'Drop': b.drop_location,
    'Extra Charges (Rs)': b.extra_charges,
    'Total (Rs)': b.total_amount,
    'Payment Mode': b.payment_mode,
    'Status': b.status,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Daily Report');
  saveWorkbook(wb, `Suman_Daily_Report_${date}.xlsx`);
}

// ── Monthly Revenue Report ────────────────────────────────────
export function exportMonthlyReport(data: any[], month: string) {
  const rows = data.map((m) => ({
    'Month': m.month,
    'Total Bookings': m.total_bookings,
    'Total Revenue (Rs)': m.total_revenue,
    'GST Collected (Rs)': m.gst_collected,
    'Pending Amount (Rs)': m.pending_amount,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Monthly Revenue');
  saveWorkbook(wb, `Suman_Monthly_Revenue_${month}.xlsx`);
}

// ── Car Performance Report ────────────────────────────────────
export function exportCarReport(data: any[]) {
  const rows = data.map((c) => ({
    'Car Name': c.car_name,
    'Vehicle No.': c.vehicle_number,
    'Total Trips': c.total_trips,
    'Total Km': c.total_km,
    'Revenue Generated (Rs)': c.revenue,
    'Status': c.status,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Car Performance');
  saveWorkbook(wb, `Suman_Car_Performance.xlsx`);
}

// ── Outstanding Payments Report ───────────────────────────────
export function exportOutstandingReport(data: any[]) {
  const rows = data.map((o) => ({
    'Customer': o.customer_name,
    'Booking #': o.booking_number,
    'Bill Amount (Rs)': o.total_amount,
    'Amount Paid (Rs)': o.amount_paid,
    'Balance Due (Rs)': o.balance_due,
    'Days Overdue': o.days_overdue,
    'Status': o.status,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Outstanding Payments');
  saveWorkbook(wb, `Suman_Outstanding_Payments.xlsx`);
}

// ── Full Bill Export ──────────────────────────────────────────
export function exportBillToExcel(bill: any, booking: any) {
  const rows = [
    { 'Item': 'Package', 'Details': bill.packageLabel, 'Amount': fmtAmount(bill.packageAmount) },
    { 'Item': 'Extra Hours', 'Details': `${bill.extraHours} hrs × Rs. ${bill.extra_hour_rate}/hr`, 'Amount': fmtAmount(bill.extraHoursAmount) },
    { 'Item': 'Extra Km', 'Details': `${bill.extraKm} km × Rs. ${bill.extra_km_rate}/km`, 'Amount': fmtAmount(bill.extraKmAmount) },
    { 'Item': 'Driver Night Charge', 'Details': 'After 23:00', 'Amount': fmtAmount(bill.nightChargeAmount) },
    { 'Item': 'Toll Charges', 'Details': bill.toll_description || '', 'Amount': fmtAmount(bill.tollAmount) },
    { 'Item': 'Parking', 'Details': '', 'Amount': fmtAmount(bill.parkingAmount) },
    { 'Item': 'Other Charges', 'Details': bill.otherDescription || '', 'Amount': fmtAmount(bill.otherCharges) },
    { 'Item': 'Discount', 'Details': bill.discountReason || '', 'Amount': '- ' + fmtAmount(bill.discountAmount) },
    { 'Item': '─────────────────', 'Details': '', 'Amount': '' },
    { 'Item': 'Subtotal', 'Details': '', 'Amount': fmtAmount(bill.subtotal) },
    { 'Item': `GST (${bill.gstRate}%)`, 'Details': '', 'Amount': fmtAmount(bill.gstAmount) },
    { 'Item': 'TOTAL', 'Details': '', 'Amount': fmtAmount(bill.totalAmount) },
    { 'Item': 'Amount Paid', 'Details': '', 'Amount': fmtAmount(bill.amountPaid) },
    { 'Item': 'BALANCE DUE', 'Details': '', 'Amount': fmtAmount(bill.balanceDue) },
  ];
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [{ wch: 30 }, { wch: 40 }, { wch: 25 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Invoice');
  saveWorkbook(wb, `Suman_Invoice_${bill.bill_number}.xlsx`);
}

// ── Invoices / Billing Report ─────────────────────────────────
export function exportInvoicesReport(data: any[]) {
  const rows = data.map((b) => ({
    'Invoice #': b.bill_number,
    'Booking #': b.booking_number,
    'Customer Name': b.customer_name,
    'Customer Phone': b.customer_phone,
    'Car Name': b.car_name,
    'Vehicle Number': b.vehicle_number,
    'Total Amount (Rs)': b.totalAmount || b.total_amount,
    'Amount Paid (Rs)': b.amountPaid,
    'Balance Due (Rs)': b.balanceDue,
    'Status': b.status,
    'Created At': b.created_at,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
  saveWorkbook(wb, 'Suman_Invoices_Report.xlsx');
}

// ── Bookings Report ───────────────────────────────────────────
export function exportBookingsReport(data: any[]) {
  const rows = data.map((b) => ({
    'Booking #': b.booking_number,
    'Customer Name': b.customer_name,
    'Customer Phone': b.customer_phone,
    'Car': b.car_name,
    'Vehicle No.': b.vehicle_number,
    'Trip Type': b.trip_type,
    'Package': b.package_type,
    'Pickup Location': b.pickup_location,
    'Drop Location': b.drop_location,
    'Pickup Date-Time': b.pickup_datetime,
    'Expected Dropoff': b.expected_dropoff,
    'Estimated Price (Rs)': b.estimated_price,
    'Status': b.status,
    'Source': b.source,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
  saveWorkbook(wb, 'Suman_Bookings_Report.xlsx');
}

// ── Customers Report ──────────────────────────────────────────
export function exportCustomersReport(data: any[]) {
  const rows = data.map((c) => ({
    'Customer Name': c.name,
    'Phone': c.phone,
    'Email': c.email || '',
    'Company': c.company_name || '',
    'GST Number': c.gst_number || '',
    'Loyalty Status': c.loyalty_status,
    'ID Proof Type': c.id_proof_type,
    'Total Bookings': c.total_bookings || 0,
    'Total Spent (Rs)': c.total_spent || 0,
    'Tags': Array.isArray(c.tags) ? c.tags.join(', ') : '',
    'Notes': c.notes || '',
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Customers');
  saveWorkbook(wb, 'Suman_Customers_Report.xlsx');
}

// ── Fleet Report ──────────────────────────────────────────────
export function exportFleetReport(data: any[]) {
  const rows = data.map((c) => ({
    'Car Name': c.name,
    'Vehicle No.': c.vehicle_number,
    'Category': c.category,
    'Fuel Type': c.fuel_type,
    'Seating': c.seating,
    'Odometer (km)': c.odometer,
    'Status': c.status,
    '12H Rate (Rs)': c.pricing?.p12 || 0,
    '8H Rate (Rs)': c.pricing?.p8 || 0,
    'Airport Rate (Rs)': c.pricing?.airport || 0,
    'Extra Hour Rate (Rs)': c.pricing?.ehr || 0,
    'Extra KM Rate (Rs)': c.pricing?.ekm || 0,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Fleet');
  saveWorkbook(wb, 'Suman_Fleet_Report.xlsx');
}

// ── Driver Report (comprehensive — used by Drivers page & Reports page) ──
export function exportDriverReport(data: any[]) {
  const rows = data.map((d) => ({
    'Driver Name': d.name,
    'Phone': d.phone,
    'License No.': d.license_number || '',
    'License Expiry': d.license_expiry || '',
    'Experience (yrs)': d.experience || 0,
    'Rating': d.rating || 0,
    'Status': d.status,
    'Assigned Car': d.assigned_car || '',
    'Languages': Array.isArray(d.languages) ? d.languages.join(', ') : '',
    'Total Trips': d.total_trips || 0,
    'Night Duties': d.night_duties || d.night_trips || 0,
    'Total Earnings (Rs)': d.total_earnings || 0,
    'Address': d.address || '',
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Drivers');
  saveWorkbook(wb, 'Suman_Drivers_Report.xlsx');
}
