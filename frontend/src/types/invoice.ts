export interface Invoice {
  id?: string;
  invoice_number?: string;
  booking_id: string;
  
  // Customer Details
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  customer_address?: string;
  
  // Trip Details
  vehicle_name: string;
  vehicle_number?: string;
  driver_name?: string;
  pickup_date?: string;
  return_date?: string;
  total_days: number;
  total_distance_km: number;
  extra_km: number;
  
  // Charges Breakdown
  base_rental_amount: number;
  driver_allowance: number;
  night_charges: number;
  toll_charges: number;
  parking_charges: number;
  extra_km_charges: number;
  gst_percentage: number;
  gst_amount: number;
  discount_amount: number;
  
  // Totals
  subtotal: number;
  grand_total: number;
  advance_paid: number;
  balance_due: number;
  
  // Payment Info
  payment_method: string;
  payment_status: 'pending' | 'partial' | 'paid' | 'overdue';
  
  // Terms & Notes
  terms: string[];
  notes?: string;
  
  // Signatures
  customer_signature?: string; // Base64 drawing
  authorised_signature?: string; // Base64 drawing
  payment_qr_code?: string; // Base64 uploaded QR code image
  
  // Company Details
  company_name: string;
  company_tagline: string;
  company_address: string;
  company_pan: string;
  company_phone: string;
  company_email: string;
  company_website: string;
  
  // Metadata
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  is_active?: boolean;
}

export interface InvoicePayment {
  id?: string;
  invoice_id: string;
  payment_date: string;
  amount: number;
  payment_method: string;
  transaction_id?: string;
  notes?: string;
  created_at?: string;
}
