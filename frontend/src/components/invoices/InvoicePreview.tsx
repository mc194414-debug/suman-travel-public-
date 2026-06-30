import React, { forwardRef } from 'react';
import { Invoice } from '../../types/invoice';
import { User, MapPin, CreditCard, Receipt, FileText, Handshake, Building, Phone, Mail, Globe, Plane, Car, Briefcase, Check } from 'lucide-react';

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
};

interface InvoicePreviewProps {
  data: Invoice;
  totals: {
    subtotal: number;
    gstAmount: number;
    grandTotal: number;
    balanceDue: number;
  };
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ data, totals }, ref) => {
    
    // Default Terms
    const terms = data.terms && data.terms.length > 0 ? data.terms : [
      "Driver allowance after 10 PM will be extra.",
      "Toll, Parking, State Permit charges are extra.",
      "Vehicle is for point to point use only.",
      "Smoking & alcohol strictly prohibited.",
      "Damage to vehicle will be charged extra."
    ];

    const charges = [
      { num: 1, label: `Base Rental Amount`, amount: data.base_rental_amount || 0 },
      { num: 2, label: 'Driver Allowance', amount: data.driver_allowance || 0 },
      { num: 3, label: 'Night Charges', amount: data.night_charges || 0 },
      { num: 4, label: 'Toll Charges', amount: data.toll_charges || 0 },
      { num: 5, label: 'Parking Charges', amount: data.parking_charges || 0 },
      { num: 6, label: `Extra KM Charges`, amount: data.extra_km_charges || 0 },
      { num: 7, label: `GST (${data.gst_percentage || 5}%)`, amount: totals.gstAmount || 0 },
      { num: 8, label: 'Discount', amount: -(data.discount_amount || 0) }
    ];

    return (
      <div 
        ref={ref} 
        id="invoice-print-area"
        className="mx-auto bg-[#ffffff] text-[#1a1a1a] flex flex-col box-border shrink-0 overflow-hidden relative"
        // EXACT inline pixel sizes to permanently defeat mobile CSS/REM squishing
        style={{ width: '794px', minWidth: '794px', maxWidth: '794px', height: '1123px', minHeight: '1123px', maxHeight: '1123px', fontFamily: 'Inter, Roboto, system-ui, sans-serif' }}
      >
        {/* HEADER */}
        <div 
          className="bg-[#0B0F19] text-[#ffffff] flex justify-between items-center shrink-0"
          style={{ paddingLeft: '32px', paddingRight: '32px', height: '130px', borderBottom: '4px solid #FF6B35' }}
        >
          {/* Left: Logo and Name */}
          <div className="flex items-center shrink-0" style={{ gap: '12px' }}>
            <div 
              className="bg-black rounded-full flex items-center justify-center shrink-0 overflow-hidden"
              style={{ width: '64px', height: '64px', border: '2px solid #FF6B35' }}
            >
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" style={{ padding: '4px' }} />
            </div>
            <div className="flex flex-col shrink-0">
              <h1 className="font-black tracking-widest uppercase leading-none whitespace-nowrap" style={{ fontSize: '20px', marginBottom: '4px' }}>SUMAN TRAVELS</h1>
              <div className="flex items-center" style={{ gap: '6px' }}>
                <div className="h-px bg-[#FF6B35] flex-1"></div>
                <h2 className="text-[#FF6B35] font-bold uppercase tracking-widest whitespace-nowrap" style={{ fontSize: '8px' }}>Elite Chauffeur Services</h2>
                <div className="h-px bg-[#FF6B35] flex-1"></div>
              </div>
            </div>
          </div>
          
          {/* Middle: Icons */}
          <div className="flex items-end shrink-0" style={{ gap: '12px', height: '48px' }}>
            <div className="flex flex-col items-center" style={{ gap: '4px', width: '48px' }}>
              <Plane className="text-[#FF6B35]" style={{ width: '20px', height: '20px' }} />
              <span className="font-bold text-center text-white uppercase leading-tight tracking-wider whitespace-nowrap" style={{ fontSize: '7px' }}>Airport<br/>Transfers</span>
            </div>
            <div className="flex flex-col items-center" style={{ gap: '4px', width: '48px' }}>
              <Car className="text-[#FF6B35]" style={{ width: '20px', height: '20px' }} />
              <span className="font-bold text-center text-white uppercase leading-tight tracking-wider whitespace-nowrap" style={{ fontSize: '7px' }}>Local<br/>Rentals</span>
            </div>
            <div className="flex flex-col items-center" style={{ gap: '4px', width: '48px' }}>
              <MapPin className="text-[#FF6B35]" style={{ width: '20px', height: '20px' }} />
              <span className="font-bold text-center text-white uppercase leading-tight tracking-wider whitespace-nowrap" style={{ fontSize: '7px' }}>Outstation<br/>Trips</span>
            </div>
            <div className="flex flex-col items-center" style={{ gap: '4px', width: '48px' }}>
              <Briefcase className="text-[#FF6B35]" style={{ width: '20px', height: '20px' }} />
              <span className="font-bold text-center text-white uppercase leading-tight tracking-wider whitespace-nowrap" style={{ fontSize: '7px' }}>Corporate<br/>Travel</span>
            </div>
          </div>
          
          {/* Right: Invoice Info */}
          <div className="flex flex-col items-end shrink-0">
            <h1 className="font-black tracking-widest text-white uppercase leading-none whitespace-nowrap" style={{ fontSize: '26px', marginBottom: '4px' }}>INVOICE</h1>
            <div className="flex items-center justify-end w-full shrink-0" style={{ marginBottom: '8px' }}>
              <span className="text-[#FF6B35] font-black whitespace-nowrap" style={{ fontSize: '12px', marginRight: '6px' }}># INV-</span>
              <div className="text-white font-bold text-right whitespace-nowrap overflow-hidden" style={{ fontSize: '12px', width: '90px', borderBottom: '1px solid #FF6B35', paddingBottom: '2px' }}>
                {data.invoice_number || '00000'}
              </div>
            </div>
            <div className="grid font-medium text-[#d1d5db] items-center text-left w-full shrink-0" style={{ gridTemplateColumns: '70px 6px 90px', rowGap: '4px', fontSize: '9px' }}>
              <span className="text-right whitespace-nowrap">Invoice Date</span><span className="text-center">:</span>
              <span className="text-white font-bold whitespace-nowrap overflow-hidden" style={{ borderBottom: '1px solid #4b5563', paddingBottom: '2px' }}>{formatDate(data.created_at)}</span>
              
              <span className="text-right whitespace-nowrap">Booking ID</span><span className="text-center">:</span>
              <span className="text-white font-bold whitespace-nowrap overflow-hidden" style={{ borderBottom: '1px solid #4b5563', paddingBottom: '2px' }}>{data.booking_id || '—'}</span>
              
              <span className="text-right whitespace-nowrap">Status</span><span className="text-center">:</span>
              <span className="text-white font-bold uppercase whitespace-nowrap overflow-hidden" style={{ borderBottom: '1px solid #4b5563', paddingBottom: '2px' }}>{data.payment_status || 'PENDING'}</span>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT PADDING */}
        <div className="flex flex-col flex-1 shrink-0" style={{ paddingLeft: '32px', paddingRight: '32px', paddingTop: '24px', paddingBottom: '24px', gap: '20px', width: '794px' }}>
          
          {/* ROW 1: Top Boxes (Fixed Height: 180px) */}
          <div className="grid shrink-0 w-full" style={{ gridTemplateColumns: '1fr 1fr 1.2fr', gap: '16px', height: '180px' }}>
            
            {/* BILL TO */}
            <div className="bg-[#f8f9fa] flex flex-col relative overflow-hidden" style={{ borderRadius: '12px', border: '1px solid #e5e7eb', padding: '16px' }}>
              <div className="flex items-center" style={{ gap: '8px', marginBottom: '12px' }}>
                <User className="text-[#FF6B35]" style={{ width: '16px', height: '16px' }} />
                <h3 className="font-bold uppercase tracking-wider text-[#1a1a1a] whitespace-nowrap" style={{ fontSize: '12px' }}>BILL TO</h3>
              </div>
              <div className="grid text-[#4b5563] font-medium items-end" style={{ gridTemplateColumns: '50px 5px 1fr', rowGap: '12px', fontSize: '10px' }}>
                <span className="whitespace-nowrap" style={{ paddingBottom: '2px' }}>Name</span><span style={{ paddingBottom: '2px' }}>:</span>
                <span className="text-[#1a1a1a] font-bold truncate" style={{ borderBottom: '1px solid #d1d5db', paddingBottom: '2px' }}>{data.customer_name || '—'}</span>
                
                <span className="whitespace-nowrap" style={{ paddingBottom: '2px' }}>Phone</span><span style={{ paddingBottom: '2px' }}>:</span>
                <span className="text-[#1a1a1a] font-bold truncate" style={{ borderBottom: '1px solid #d1d5db', paddingBottom: '2px' }}>{data.customer_phone || '—'}</span>
                
                <span className="whitespace-nowrap" style={{ paddingBottom: '2px' }}>Email</span><span style={{ paddingBottom: '2px' }}>:</span>
                <span className="text-[#1a1a1a] font-bold truncate" style={{ borderBottom: '1px solid #d1d5db', paddingBottom: '2px' }}>{data.customer_email || '—'}</span>
                
                <span className="whitespace-nowrap" style={{ paddingBottom: '2px' }}>Address</span><span style={{ paddingBottom: '2px' }}>:</span>
                <span className="text-[#1a1a1a] font-bold truncate" style={{ borderBottom: '1px solid #d1d5db', paddingBottom: '2px' }}>{data.customer_address || '—'}</span>
              </div>
            </div>

            {/* TRIP DETAILS */}
            <div className="bg-[#f8f9fa] flex flex-col relative overflow-hidden" style={{ borderRadius: '12px', border: '1px solid #e5e7eb', padding: '16px' }}>
              <div className="flex items-center" style={{ gap: '8px', marginBottom: '12px' }}>
                <MapPin className="text-[#FF6B35]" style={{ width: '16px', height: '16px' }} />
                <h3 className="font-bold uppercase tracking-wider text-[#1a1a1a] whitespace-nowrap" style={{ fontSize: '12px' }}>TRIP DETAILS</h3>
              </div>
              <div className="grid text-[#4b5563] font-medium items-end" style={{ gridTemplateColumns: '70px 5px 1fr', rowGap: '8px', fontSize: '10px' }}>
                <span className="whitespace-nowrap" style={{ paddingBottom: '2px' }}>Vehicle</span><span style={{ paddingBottom: '2px' }}>:</span>
                <span className="text-[#1a1a1a] font-bold truncate" style={{ borderBottom: '1px solid #d1d5db', paddingBottom: '2px' }}>{data.vehicle_name || '—'}</span>
                
                <span className="whitespace-nowrap" style={{ paddingBottom: '2px' }}>Driver</span><span style={{ paddingBottom: '2px' }}>:</span>
                <span className="text-[#1a1a1a] font-bold truncate" style={{ borderBottom: '1px solid #d1d5db', paddingBottom: '2px' }}>{data.driver_name || '—'}</span>
                
                <span className="whitespace-nowrap" style={{ paddingBottom: '2px' }}>Pickup</span><span style={{ paddingBottom: '2px' }}>:</span>
                <span className="text-[#1a1a1a] font-bold truncate" style={{ borderBottom: '1px solid #d1d5db', paddingBottom: '2px' }}>{formatDate(data.pickup_date)}</span>
                
                <span className="whitespace-nowrap" style={{ paddingBottom: '2px' }}>Return</span><span style={{ paddingBottom: '2px' }}>:</span>
                <span className="text-[#1a1a1a] font-bold truncate" style={{ borderBottom: '1px solid #d1d5db', paddingBottom: '2px' }}>{formatDate(data.return_date) || '—'}</span>
                
                <span className="whitespace-nowrap" style={{ paddingBottom: '2px' }}>Total Days</span><span style={{ paddingBottom: '2px' }}>:</span>
                <span className="text-[#1a1a1a] font-bold truncate" style={{ borderBottom: '1px solid #d1d5db', paddingBottom: '2px' }}>{data.total_days || 1}</span>
                
                <span className="whitespace-nowrap" style={{ paddingBottom: '2px' }}>Distance</span><span style={{ paddingBottom: '2px' }}>:</span>
                <span className="text-[#1a1a1a] font-bold truncate" style={{ borderBottom: '1px solid #d1d5db', paddingBottom: '2px' }}>{data.total_distance_km ? `${data.total_distance_km} KM` : '—'}</span>
              </div>
            </div>

            {/* TOTAL SUMMARY */}
            <div className="bg-[#0B0F19] flex flex-col relative shadow-md overflow-hidden" style={{ borderRadius: '12px' }}>
              <div className="flex flex-col flex-1 justify-center" style={{ padding: '20px' }}>
                <h3 className="font-bold uppercase tracking-wider text-white whitespace-nowrap" style={{ fontSize: '12px', marginBottom: '16px' }}>TOTAL SUMMARY</h3>
                <div className="grid text-[#d1d5db] items-end" style={{ gridTemplateColumns: '80px 10px 1fr', rowGap: '16px', fontSize: '11px' }}>
                  <span className="whitespace-nowrap" style={{ paddingBottom: '2px' }}>Grand Total</span><span style={{ paddingBottom: '2px' }}>:</span>
                  <span className="font-bold text-right text-white whitespace-nowrap" style={{ borderBottom: '1px solid #4b5563', paddingBottom: '2px' }}>₹{totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  
                  <span className="whitespace-nowrap" style={{ paddingBottom: '2px' }}>Advance Paid</span><span style={{ paddingBottom: '2px' }}>:</span>
                  <span className="font-bold text-right text-white whitespace-nowrap" style={{ borderBottom: '1px solid #4b5563', paddingBottom: '2px' }}>₹{(data.advance_paid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className="bg-[#FF6B35] flex justify-between items-center shrink-0" style={{ padding: '12px 20px', margin: '0 16px 16px 16px', borderRadius: '8px' }}>
                <span className="font-bold uppercase tracking-wider text-white whitespace-nowrap" style={{ fontSize: '11px' }}>Balance Due</span>
                <span className="font-bold text-white whitespace-nowrap" style={{ fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.5)', paddingBottom: '2px' }}>
                  ₹{totals.balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* ROW 2: Middle Boxes (Fixed Height: 420px) MASSIVE SPACE TO PREVENT ANY CUTS */}
          <div className="grid shrink-0 w-full" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '20px', height: '420px' }}>
            
            {/* CHARGES BREAKDOWN TABLE */}
            <div className="flex flex-col h-full bg-[#f8f9fa] overflow-hidden" style={{ borderRadius: '12px', border: '1px solid #e5e7eb', padding: '16px' }}>
              <h3 className="font-bold text-[#FF6B35] uppercase tracking-wider whitespace-nowrap" style={{ fontSize: '12px', marginBottom: '12px' }}>CHARGES BREAKDOWN</h3>
              <div className="flex-1">
                <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr className="text-[#1a1a1a] font-bold uppercase tracking-wider" style={{ borderBottom: '1px solid #d1d5db', fontSize: '10px' }}>
                      <th className="whitespace-nowrap" style={{ padding: '8px', width: '10%' }}>#</th>
                      <th className="whitespace-nowrap" style={{ padding: '8px', width: '60%', borderLeft: '1px solid #d1d5db' }}>Description</th>
                      <th className="text-right whitespace-nowrap" style={{ padding: '8px', width: '30%', borderLeft: '1px solid #d1d5db' }}>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '10px' }}>
                    {charges.map((charge, index) => (
                      <tr key={index} style={{ borderBottom: index === charges.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                        <td className="text-[#6b7280] font-medium whitespace-nowrap" style={{ padding: '10px 8px' }}>{charge.num}</td>
                        <td className="font-bold text-[#1a1a1a] whitespace-nowrap" style={{ padding: '10px 8px', borderLeft: '1px solid #e5e7eb' }}>{charge.label}</td>
                        <td className="text-right font-bold text-[#1a1a1a] whitespace-nowrap" style={{ padding: '10px 8px', borderLeft: '1px solid #e5e7eb' }}>
                          {charge.amount < 0 ? '-' : ''}
                          {Math.abs(charge.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: '2px solid #1a1a1a' }}>
                      <td colSpan={2} className="text-right font-bold uppercase text-[#FF6B35] whitespace-nowrap" style={{ padding: '12px 8px', fontSize: '10px' }}>TOTAL</td>
                      <td className="text-right font-bold text-[#1a1a1a] bg-[#f3f4f6] whitespace-nowrap" style={{ padding: '12px 8px', fontSize: '11px', borderLeft: '1px solid #e5e7eb' }}>
                        {totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* PAYMENT SECTION */}
            <div className="flex flex-col h-full" style={{ gap: '16px' }}>
              {/* PAYMENT METHOD (No QR Code) */}
              <div className="bg-[#f8f9fa] flex flex-col justify-center shrink-0" style={{ borderRadius: '12px', border: '1px solid #e5e7eb', padding: '16px', height: '90px' }}>
                <div className="flex items-center" style={{ gap: '8px', marginBottom: '8px' }}>
                  <CreditCard className="text-[#1a1a1a]" style={{ width: '16px', height: '16px' }} />
                  <h3 className="font-bold uppercase tracking-wider text-[#1a1a1a] whitespace-nowrap" style={{ fontSize: '11px' }}>PAYMENT METHOD</h3>
                </div>
                <div className="grid text-[#4b5563] font-medium items-end" style={{ gridTemplateColumns: '50px 5px 1fr', rowGap: '4px', fontSize: '10px' }}>
                  <span className="whitespace-nowrap" style={{ paddingBottom: '2px' }}>Method</span><span style={{ paddingBottom: '2px' }}>:</span>
                  <span className="text-[#1a1a1a] font-bold truncate" style={{ borderBottom: '1px solid #d1d5db', paddingBottom: '2px' }}>{data.payment_method || 'UPI / Bank Transfer'}</span>
                </div>
                <div className="text-[#1a1a1a] font-medium whitespace-nowrap" style={{ fontSize: '9px', marginTop: '8px' }}>
                  Txn ID : <span className="inline-block" style={{ width: '100px', borderBottom: '1px solid #d1d5db', paddingBottom: '2px' }}></span>
                </div>
              </div>

              {/* PAYMENT HISTORY */}
              <div className="bg-[#f8f9fa] flex-1 overflow-hidden" style={{ borderRadius: '12px', border: '1px solid #e5e7eb', padding: '16px' }}>
                <div className="flex items-center" style={{ gap: '8px', marginBottom: '12px', borderBottom: '1px solid #d1d5db', paddingBottom: '8px' }}>
                  <Receipt className="text-[#1a1a1a]" style={{ width: '16px', height: '16px' }} />
                  <h3 className="font-bold uppercase tracking-wider text-[#1a1a1a] whitespace-nowrap" style={{ fontSize: '11px' }}>PAYMENT HISTORY</h3>
                </div>
                <table className="w-full text-left" style={{ fontSize: '9px' }}>
                  <thead>
                    <tr className="text-[#1a1a1a] font-bold" style={{ borderBottom: '1px solid #d1d5db' }}>
                      <th className="whitespace-nowrap" style={{ paddingBottom: '6px', width: '30%' }}>Date</th>
                      <th className="whitespace-nowrap" style={{ paddingBottom: '6px', width: '40%' }}>Particulars</th>
                      <th className="text-right whitespace-nowrap" style={{ paddingBottom: '6px', width: '30%' }}>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#4b5563] font-medium">
                    {data.advance_paid && data.advance_paid > 0 ? (
                      <tr>
                        <td className="whitespace-nowrap" style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>{formatDate(data.created_at)}</td>
                        <td className="text-[#1a1a1a] font-bold whitespace-nowrap" style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>Advance</td>
                        <td className="text-right whitespace-nowrap" style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>{data.advance_paid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center text-[#9ca3af] italic whitespace-nowrap" style={{ padding: '16px 0' }}>No payments recorded</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ROW 3: Bottom Boxes (Fixed Height: 150px) */}
          <div className="grid shrink-0 w-full" style={{ gridTemplateColumns: '1fr 1fr 1.2fr', gap: '16px', height: '150px', marginTop: '8px' }}>
            
            {/* TERMS & CONDITIONS */}
            <div className="bg-[#f8f9fa] flex flex-col justify-between overflow-hidden" style={{ borderRadius: '12px', border: '1px solid #e5e7eb', padding: '12px' }}>
              <div>
                <div className="flex items-center" style={{ gap: '8px', marginBottom: '6px', borderBottom: '1px solid #d1d5db', paddingBottom: '6px' }}>
                  <FileText className="text-[#FF6B35]" style={{ width: '14px', height: '14px' }} />
                  <h3 className="font-bold uppercase tracking-wider text-[#FF6B35] whitespace-nowrap" style={{ fontSize: '10px' }}>TERMS & CONDITIONS</h3>
                </div>
                <ul className="text-[#4b5563] font-medium" style={{ fontSize: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {terms.slice(0,5).map((term, i) => (
                    <li key={i} className="flex items-start" style={{ gap: '4px' }}>
                      <Check className="text-[#FF6B35] shrink-0" style={{ width: '8px', height: '8px', marginTop: '2px' }} />
                      <span className="leading-tight">{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center shrink-0" style={{ marginTop: '4px', paddingTop: '6px' }}>
                <div className="bg-[#d1d5db] mx-auto" style={{ width: '112px', height: '1px', marginBottom: '4px' }}></div>
                <p className="font-medium text-[#1a1a1a] uppercase tracking-widest whitespace-nowrap" style={{ fontSize: '7px' }}>Customer Signature</p>
              </div>
            </div>

            {/* THANK YOU */}
            <div className="bg-[#f8f9fa] flex flex-col items-center justify-between text-center relative overflow-hidden" style={{ borderRadius: '12px', border: '1px solid #e5e7eb', padding: '12px' }}>
              <div className="w-full" style={{ marginTop: '4px' }}>
                <div className="flex items-center justify-center" style={{ gap: '6px', marginBottom: '4px' }}>
                  <Handshake className="text-[#FF6B35]" style={{ width: '16px', height: '16px' }} />
                  <h3 className="font-black uppercase tracking-wider text-[#1a1a1a] whitespace-nowrap" style={{ fontSize: '12px' }}>THANK YOU!</h3>
                </div>
                <p className="text-[#1a1a1a] font-medium whitespace-nowrap" style={{ fontSize: '8px', marginBottom: '2px' }}>Thank you for choosing</p>
                <p className="text-[#FF6B35] font-black tracking-widest uppercase whitespace-nowrap" style={{ fontSize: '11px', marginBottom: '4px' }}>SUMAN TRAVELS.</p>
                <p className="text-[#6b7280] font-medium whitespace-nowrap" style={{ fontSize: '7px' }}>We look forward to serve you again.</p>
              </div>
              <div className="w-full flex flex-col items-center shrink-0">
                <div className="bg-[#d1d5db]" style={{ width: '112px', height: '1px', marginBottom: '4px' }}></div>
                <p className="font-medium text-[#1a1a1a] uppercase tracking-widest whitespace-nowrap" style={{ fontSize: '7px' }}>Authorised Signature</p>
              </div>
            </div>

            {/* COMPANY DETAILS */}
            <div className="bg-[#f8f9fa] flex flex-col justify-between overflow-hidden" style={{ borderRadius: '12px', border: '1px solid #e5e7eb', padding: '12px' }}>
              <div>
                <div className="flex items-center" style={{ gap: '8px', marginBottom: '6px', borderBottom: '1px solid #d1d5db', paddingBottom: '6px' }}>
                  <Building className="text-[#FF6B35]" style={{ width: '14px', height: '14px' }} />
                  <h3 className="font-bold uppercase tracking-wider text-[#FF6B35] whitespace-nowrap" style={{ fontSize: '10px' }}>COMPANY DETAILS</h3>
                </div>
                <h4 className="font-bold text-[#1a1a1a] tracking-wider whitespace-nowrap" style={{ fontSize: '10px', marginBottom: '2px' }}>Suman Travels</h4>
                <p className="font-bold text-[#FF6B35] uppercase tracking-widest whitespace-nowrap" style={{ fontSize: '8px', marginBottom: '4px' }}>Elite Chauffeur Services</p>
                <p className="text-[#4b5563] font-medium leading-tight" style={{ fontSize: '8px', marginBottom: '4px' }}>
                  {data.company_address || '1st Floor, KWX 7715, Mangalwadi, Juhu Tara Road, Santacruz West, Mumbai, MH - 400049'}
                </p>
              </div>
            </div>
          </div>
          
        </div>

        {/* FOOTER BAR */}
        <div className="bg-[#0B0F19] flex justify-between items-center text-[#ffffff] mt-auto shrink-0" style={{ width: '794px', height: '60px', padding: '12px 32px', borderTop: '4px solid #FF6B35' }}>
          <div className="flex items-center" style={{ gap: '12px' }}>
            <div className="rounded-full bg-[#FF6B35]/20 flex items-center justify-center shrink-0" style={{ width: '24px', height: '24px' }}>
              <Phone className="text-[#FF6B35]" style={{ width: '12px', height: '12px' }} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#9ca3af] tracking-wider uppercase whitespace-nowrap" style={{ fontSize: '8px', marginBottom: '2px' }}>24/7 Available</span>
              <span className="font-bold tracking-wide whitespace-nowrap" style={{ fontSize: '10px' }}>{data.company_phone || '+91 77109 66660'}</span>
            </div>
          </div>
          
          <div className="flex items-center" style={{ gap: '12px' }}>
            <div className="rounded-full bg-[#FF6B35]/20 flex items-center justify-center shrink-0" style={{ width: '24px', height: '24px' }}>
              <Mail className="text-[#FF6B35]" style={{ width: '12px', height: '12px' }} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#9ca3af] tracking-wider uppercase whitespace-nowrap" style={{ fontSize: '8px', marginBottom: '2px' }}>Email Us</span>
              <span className="font-bold tracking-wide whitespace-nowrap" style={{ fontSize: '10px' }}>{data.company_email || 'sanjayindia6666@gmail.com'}</span>
            </div>
          </div>
          
          <div className="flex items-center" style={{ gap: '12px' }}>
            <div className="rounded-full bg-[#FF6B35]/20 flex items-center justify-center shrink-0" style={{ width: '24px', height: '24px' }}>
              <Globe className="text-[#FF6B35]" style={{ width: '12px', height: '12px' }} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#9ca3af] tracking-wider uppercase whitespace-nowrap" style={{ fontSize: '8px', marginBottom: '2px' }}>Visit Our Website</span>
              <span className="font-bold tracking-wide whitespace-nowrap" style={{ fontSize: '10px' }}>{data.company_website || 'www.sumantravel.com'}</span>
            </div>
          </div>
        </div>

      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';
