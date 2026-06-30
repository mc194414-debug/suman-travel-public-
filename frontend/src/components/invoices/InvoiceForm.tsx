'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredItems, saveStoredItems, INITIAL_BOOKINGS, INITIAL_INVOICES } from '../../lib/storage';
import { Invoice } from '../../types/invoice';
import { InvoicePreview } from './InvoicePreview';
import { FileText, Sparkles, User, MapPin, Calculator, Settings, Check } from 'lucide-react';

interface InvoiceFormProps {
  initialData?: Partial<Invoice>;
  bookingId?: string;
  onSave?: (savedInvoice: Invoice) => void;
}

export default function InvoiceForm({ initialData, bookingId, onSave }: InvoiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchBookingId, setSearchBookingId] = useState(bookingId || '');

  // Signature Pad State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    // Also save while drawing so preview updates live if wanted, or save on stop
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      handleInputChange('authorised_signature', canvas.toDataURL('image/png'));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleInputChange('authorised_signature', '');
  };

  // Form State
  const [formData, setFormData] = useState<Partial<Invoice>>({
    booking_id: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    vehicle_name: '',
    vehicle_number: '',
    driver_name: '',
    pickup_date: '',
    return_date: '',
    total_days: 1,
    total_distance_km: 0,
    extra_km: 0,
    base_rental_amount: 0,
    driver_allowance: 0,
    night_charges: 0,
    toll_charges: 0,
    parking_charges: 0,
    extra_km_charges: 0,
    gst_percentage: 5,
    discount_amount: 0,
    advance_paid: 0,
    payment_method: 'UPI / GPay',
    payment_status: 'pending',
    terms: [
      'Driver allowance after 10 PM will be extra.',
      'Toll, Parking, State Permit charges are extra.',
      'Vehicle is for point to point use only.',
      'Smoking & alcohol strictly prohibited.',
      'Damage to vehicle will be charged extra.'
    ],
    notes: '',
    customer_signature: '',
    authorised_signature: '',
    company_name: 'Suman Travels',
    company_tagline: 'Elite Chauffeur Services',
    company_address: '1st Floor, KWX 7715, Mangalwadi, Juhu Tara Road, Santacruz West, Mumbai, MH - 400049',
    company_pan: 'ABCDE1234F',
    company_phone: '+91 77109 66660',
    company_email: 'sanjayindia6666@gmail.com',
    company_website: 'www.sumantravel.com',
    ...initialData
  });

  // Load initial data or fetch booking details if bookingId is provided on mount
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    } else if (bookingId) {
      handleAutoFill(bookingId);
    }
  }, [initialData, bookingId]);

  // Handle standard input updates
  const handleInputChange = (field: keyof Invoice, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // File upload handler to convert QR code image to base64 string
  const handleQrCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleInputChange('payment_qr_code', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Helper for numeric inputs
  const handleNumberChange = (field: keyof Invoice, value: string) => {
    const numValue = parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue
    }));
  };

  // Auto-fill from local storage bookings
  const handleAutoFill = (bId: string) => {
    if (!bId) return;
    
    const bookings = getStoredItems('suman_bookings', INITIAL_BOOKINGS);
    const foundBooking = bookings.find(b => b.id === bId || b.booking_number === bId) as any;

    if (foundBooking) {
      setFormData(prev => ({
        ...prev,
        booking_id: foundBooking.booking_number || foundBooking.id,
        customer_name: foundBooking.customer_name || '',
        customer_phone: foundBooking.customer_phone || '',
        customer_email: foundBooking.passenger_email || '',
        customer_address: foundBooking.pickup_location || '',
        vehicle_name: foundBooking.car_name || '',
        vehicle_number: foundBooking.vehicle_number || '',
        driver_name: foundBooking.driver_name || 'Rajesh Kumar',
        pickup_date: foundBooking.pickup_datetime || '',
        return_date: foundBooking.expected_dropoff || '',
        total_days: 1, // default
        base_rental_amount: foundBooking.estimated_price || 0,
        advance_paid: 0,
        notes: foundBooking.special_requests || ''
      }));
      setError('');
    } else {
      setError(`Booking "${bId}" not found. You can still enter details manually.`);
    }
  };

  // Calculations derived state
  const calculateTotals = () => {
    const subtotal = 
      (formData.base_rental_amount || 0) +
      (formData.driver_allowance || 0) +
      (formData.night_charges || 0) +
      (formData.toll_charges || 0) +
      (formData.parking_charges || 0) +
      (formData.extra_km_charges || 0);

    const gstAmount = parseFloat((subtotal * (formData.gst_percentage || 5) / 100).toFixed(2));
    const grandTotal = subtotal + gstAmount - (formData.discount_amount || 0);
    const balanceDue = grandTotal - (formData.advance_paid || 0);
    
    // Automatically set payment status
    let payment_status: 'pending' | 'partial' | 'paid' = 'pending';
    if (balanceDue <= 0) {
      payment_status = 'paid';
    } else if ((formData.advance_paid || 0) > 0) {
      payment_status = 'partial';
    }

    return { subtotal, gstAmount, grandTotal, balanceDue, payment_status };
  };

  const totals = calculateTotals();

  // Save/Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const invoices = getStoredItems('suman_invoices', INITIAL_INVOICES);
      
      const newInvoice: Invoice = {
        ...formData,
        id: formData.id || `INV${Date.now()}`,
        invoice_number: formData.invoice_number || `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(5, '0')}`,
        subtotal: totals.subtotal,
        gst_amount: totals.gstAmount,
        grand_total: totals.grandTotal,
        balance_due: totals.balanceDue,
        payment_status: totals.payment_status,
        created_at: formData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Invoice;

      // Save to localStorage list
      let updatedInvoices;
      if (formData.id) {
        // Edit mode
        updatedInvoices = invoices.map(inv => inv.id === formData.id ? newInvoice : inv);
      } else {
        // Create mode
        updatedInvoices = [newInvoice, ...invoices];
      }

      saveStoredItems('suman_invoices', updatedInvoices);

      if (onSave) {
        onSave(newInvoice);
      } else {
        router.push(`/admin/invoices/${newInvoice.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save invoice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: EDITABLE FORM */}
      <form onSubmit={handleSubmit} className="lg:col-span-6 space-y-6 text-left">
        {/* Booking Auto-Fill Card */}
        <div className="glassmorphism p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent-primary" />
            Booking Reference
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5">Booking ID or Number</label>
              <input
                type="text"
                value={searchBookingId}
                onChange={(e) => setSearchBookingId(e.target.value)}
                placeholder="e.g. ST-2026-1024 or BK001"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all font-mono"
              />
            </div>
            <button
              type="button"
              onClick={() => handleAutoFill(searchBookingId)}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-xl transition-all cursor-pointer h-[40px] flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
              Auto-Fill Info
            </button>
          </div>
          {error && <p className="text-red-400 text-[11px] font-medium leading-relaxed">{error}</p>}
        </div>

        {/* Customer Details */}
        <div className="glassmorphism p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <User className="w-4 h-4 text-accent-primary" />
            Customer Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5">Customer Name *</label>
              <input
                type="text"
                required
                value={formData.customer_name || ''}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                placeholder="Name"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5">Phone Number</label>
              <input
                type="text"
                value={formData.customer_phone || ''}
                onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                placeholder="+91 Mobile number"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5">Email Address</label>
              <input
                type="email"
                value={formData.customer_email || ''}
                onChange={(e) => handleInputChange('customer_email', e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5">Billing Address</label>
              <textarea
                value={formData.customer_address || ''}
                onChange={(e) => handleInputChange('customer_address', e.target.value)}
                placeholder="Billing address details..."
                rows={2}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="glassmorphism p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent-primary" />
            Trip Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5">Vehicle Model</label>
              <input
                type="text"
                value={formData.vehicle_name || ''}
                onChange={(e) => handleInputChange('vehicle_name', e.target.value)}
                placeholder="e.g. Toyota Innova Crysta"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5">Vehicle Plate Number</label>
              <input
                type="text"
                value={formData.vehicle_number || ''}
                onChange={(e) => handleInputChange('vehicle_number', e.target.value)}
                placeholder="MH-01-AB-1234"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5">Driver Name</label>
              <input
                type="text"
                value={formData.driver_name || ''}
                onChange={(e) => handleInputChange('driver_name', e.target.value)}
                placeholder="Driver full name"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5">Total Days</label>
              <input
                type="number"
                min={1}
                value={formData.total_days || 1}
                onChange={(e) => handleNumberChange('total_days', e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5">Pickup Date & Time</label>
              <input
                type="datetime-local"
                value={formData.pickup_date ? formData.pickup_date.substring(0, 16) : ''}
                onChange={(e) => handleInputChange('pickup_date', e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5">Return Date & Time</label>
              <input
                type="datetime-local"
                value={formData.return_date ? formData.return_date.substring(0, 16) : ''}
                onChange={(e) => handleInputChange('return_date', e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5">Odometer Distance (KM)</label>
              <input
                type="number"
                value={formData.total_distance_km || 0}
                onChange={(e) => handleNumberChange('total_distance_km', e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5">Extra Distance (KM)</label>
              <input
                type="number"
                value={formData.extra_km || 0}
                onChange={(e) => handleNumberChange('extra_km', e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Charges Breakdown */}
        <div className="glassmorphism p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Calculator className="w-4 h-4 text-accent-primary" />
            Charges Breakdown
          </h3>
          <div className="space-y-3.5">
            {[
              { label: 'Base Rental Amount (₹)', field: 'base_rental_amount' },
              { label: 'Driver Allowance (₹)', field: 'driver_allowance' },
              { label: 'Driver Night Charges (₹)', field: 'night_charges' },
              { label: 'Toll Charges (₹)', field: 'toll_charges' },
              { label: 'Parking Charges (₹)', field: 'parking_charges' },
              { label: 'Extra KM Charges (₹)', field: 'extra_km_charges' },
            ].map((item) => (
              <div key={item.field} className="flex items-center justify-between gap-4">
                <label className="text-xs text-text-secondary w-1/2">{item.label}</label>
                <div className="relative w-1/2">
                  <span className="absolute left-3.5 top-2.5 text-xs text-text-muted">₹</span>
                  <input
                    type="number"
                    value={(formData as any)[item.field] || 0}
                    onChange={(e) => handleNumberChange(item.field as any, e.target.value)}
                    className="w-full pl-8 pr-10 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm text-right focus:border-accent-primary focus:outline-none transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                </div>
              </div>
            ))}

            <div className="border-t border-white/5 pt-3.5 space-y-3.5">
              <div className="flex items-center justify-between gap-4">
                <label className="text-xs text-text-secondary w-1/2 font-bold">GST Percentage (%)</label>
                <div className="relative w-1/2">
                  <input
                    type="number"
                    value={formData.gst_percentage || 0}
                    onChange={(e) => handleNumberChange('gst_percentage', e.target.value)}
                    className="w-full pl-4 pr-10 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm text-right focus:border-accent-primary focus:outline-none transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-text-muted">%</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="text-xs text-text-secondary w-1/2">Discount Amount (₹)</label>
                <div className="relative w-1/2">
                  <span className="absolute left-3.5 top-2.5 text-xs text-text-muted">₹</span>
                  <input
                    type="number"
                    value={formData.discount_amount || 0}
                    onChange={(e) => handleNumberChange('discount_amount', e.target.value)}
                    className="w-full pl-8 pr-10 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm text-right focus:border-accent-primary focus:outline-none transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-3.5">
                <label className="text-xs text-text-secondary w-1/2 font-bold">Advance Paid (₹)</label>
                <div className="relative w-1/2">
                  <span className="absolute left-3.5 top-2.5 text-xs text-text-muted">₹</span>
                  <input
                    type="number"
                    value={formData.advance_paid || 0}
                    onChange={(e) => handleNumberChange('advance_paid', e.target.value)}
                    className="w-full pl-8 pr-10 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm text-right focus:border-accent-primary focus:outline-none transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method & QR Code */}
        <div className="glassmorphism p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Settings className="w-4 h-4 text-accent-primary" />
            Payment & QR Code
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5">Payment Method</label>
              <select
                value={formData.payment_method || 'UPI / GPay'}
                onChange={(e) => handleInputChange('payment_method', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#111827] border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all font-sans"
              >
                <option value="UPI / GPay">UPI / GPay</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit / Debit Card">Credit / Debit Card</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5">Upload Custom QR Code (Any Ratio)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleQrCodeUpload}
                className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-accent-primary file:text-white hover:file:bg-accent-hover cursor-pointer"
              />
              {formData.payment_qr_code && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-emerald-400">✓ Custom QR Active</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('payment_qr_code', '')}
                    className="text-[9px] text-red-400 hover:underline cursor-pointer bg-transparent border-0"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Digital Signature Pad */}
        <div className="glassmorphism p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <User className="w-4 h-4 text-accent-primary" />
            Admin Digital Signature
          </h3>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-text-muted uppercase mb-1.5">Draw Signature Below</label>
            <div className="border border-white/20 rounded-xl overflow-hidden bg-white/90">
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="w-full h-[150px] cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={clearSignature}
                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg transition-colors border border-red-500/20"
              >
                Clear Signature
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-accent-primary hover:bg-accent-hover text-white font-bold rounded-xl shadow-lg shadow-accent-primary/20 hover:shadow-accent-primary/40 transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          {loading ? 'Saving Invoice...' : 'Save Invoice'}
        </button>
      </form>

      {/* RIGHT: LIVE STICKY PREVIEW */}
      <div className="lg:col-span-6 lg:sticky lg:top-24 max-h-[85vh] overflow-y-auto rounded-2xl border border-white/5 shadow-2xl bg-[#0B0F19]">
        <InvoicePreview data={formData} totals={totals} />
      </div>
    </div>
  );
}
