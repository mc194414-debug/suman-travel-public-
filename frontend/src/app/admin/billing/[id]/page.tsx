'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Download, FileText, CheckCircle2, Edit3, Plus, Share2, Car, Pencil, Save } from 'lucide-react';
import { formatINR } from '../../../../lib/billing';
import { getStoredItems, saveStoredItems, INITIAL_BILLS } from '../../../../lib/storage';

const CAR_PHOTOS: Record<string, string> = {
  'Toyota Innova Crysta':  '/assets/innova_crysta.png',
  'Toyota Innova Hycross': '/assets/innova_hycross.png',
  'Maruti Suzuki Ertiga':  '/assets/ertiga.png',
  'Swift Dzire':           '/assets/dezire.png',
  'Toyota Innova':         '/assets/innova.png',
};

const INITIAL_BILL_DEFAULT = {
  id: 'BILL001', bill_number: 'INV-2026-1024',
  booking_number: 'ST-2026-1024',
  customer_name: 'Rahul Sharma', customer_phone: '+91 98765 43210',
  car_name: 'Toyota Innova Crysta', vehicle_number: 'MH-01-AB-1002',
  pickup_location: 'Marine Drive, Mumbai', drop_location: 'Lonavala',
  pickup_datetime: '2026-06-26T10:00:00', actual_dropoff: '2026-06-26T23:30:00',
  odometer_start: 45230, odometer_end: 45350,
  packageLabel: '12 Hrs / 100 Km',
  packageAmount: 5000,
  actualHours: 13.5, packageHours: 12,
  extraHours: 1.5,   extraHoursRate: 250, extraHoursAmount: 375,
  actualKm: 120,     packageKm: 100,
  extraKm: 20,       extraKmRate: 23,     extraKmAmount: 460,
  nightChargeAmount: 200,
  tollAmount: 350,   toll_description: 'Bandra-Worli + Mumbai-Pune Expressway',
  parkingAmount: 100,
  otherCharges: 0,   otherDescription: '',
  discountAmount: 0, discountReason: '',
  gstRate: 5,
  amountPaid: 4000,
  status: 'partial',
  usd_rate: 83.5,
  payments: [
    { id: 'P1', amount: 4000, payment_mode: 'cash', payment_date: '2026-06-26', notes: 'Advance paid at pickup', transaction_id: '' }
  ]
};

const STATUS_COLORS: Record<string, string> = {
  draft: '#FFB347', sent: '#60A5FA', partial: '#a78bfa', paid: '#4ADE80', closed: 'rgba(255,255,255,0.3)',
};

function recalculate(b: any) {
  const extraHoursAmount = parseFloat(((b.extraHours || 0) * (b.extraHoursRate || 0)).toFixed(2));
  const extraKmAmount    = parseFloat(((b.extraKm || 0)    * (b.extraKmRate || 0)).toFixed(2));
  const subtotalBefore =
    (b.packageAmount || 0) + extraHoursAmount + extraKmAmount +
    (b.nightChargeAmount || 0) + (b.tollAmount || 0) + (b.parkingAmount || 0) + (b.otherCharges || 0);
  const subtotal    = Math.max(0, subtotalBefore - (b.discountAmount || 0));
  const gstAmount   = parseFloat(((subtotal * (b.gstRate || 0)) / 100).toFixed(2));
  const totalAmount = parseFloat((subtotal + gstAmount).toFixed(2));
  const balanceDue  = parseFloat((totalAmount - (b.amountPaid || 0)).toFixed(2));
  return { ...b, extraHoursAmount, extraKmAmount, subtotal, gstAmount, totalAmount, balanceDue };
}

const GlassCard = ({ children, className = '' }: any) => (
  <div className={`rounded-2xl p-4 sm:p-5 ${className}`} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
    {children}
  </div>
);

const NumInput = ({ label, value, unit = '₹', onChange, min = 0, step = 1, sublabel = '' }: any) => (
  <div>
    <p className="text-white/40 text-xs font-semibold uppercase mb-1">{label}</p>
    {sublabel && <p className="text-white/25 text-[10px] mb-1">{sublabel}</p>}
    <div className="flex items-center space-x-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-[#FF6B4A] transition-colors">
      <span className="text-[#FF6B4A] text-xs shrink-0">{unit}</span>
      <input
        type="number" min={min} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="bg-transparent text-white text-sm flex-1 focus:outline-none w-full"
      />
    </div>
  </div>
);

export default function BillingDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [bill, setBill]         = useState<any>(() => recalculate(INITIAL_BILL_DEFAULT));
  const [payments, setPayments] = useState<any[]>(INITIAL_BILL_DEFAULT.payments);
  const [editingCharges, setEC] = useState(false);
  const [showPayForm, setSPF]   = useState(false);
  const [showUsd, setShowUsd]   = useState(false);
  const [payForm, setPF]        = useState({ amount: '', mode: 'cash', txId: '', date: new Date().toISOString().slice(0, 10), notes: '' });

  // Load from localStorage
  useEffect(() => {
    const list = getStoredItems('suman_billing', INITIAL_BILLS);
    const found = list.find((b) => b.id === id || b.bill_number === id || b.booking_number === id);
    if (found) {
      const recalcBill = recalculate(found);
      setBill(recalcBill);
      setPayments(found.payments || [
        { id: 'P1', amount: found.amountPaid || 0, payment_mode: 'cash', payment_date: found.created_at, notes: 'Advance recorded', transaction_id: '' }
      ]);
    }
  }, [id]);

  const update = (field: string, value: any) => {
    setBill((prev: any) => {
      const next = recalculate({ ...prev, [field]: value });
      const list = getStoredItems('suman_billing', INITIAL_BILLS);
      const updated = list.map((b) => b.id === next.id ? next : b);
      saveStoredItems('suman_billing', updated);
      return next;
    });
  };

  const updateStatus = (s: string) => {
    setBill((prev: any) => {
      const next = recalculate({ ...prev, status: s });
      const list = getStoredItems('suman_billing', INITIAL_BILLS);
      const updated = list.map((b) => b.id === next.id ? next : b);
      saveStoredItems('suman_billing', updated);
      return next;
    });
  };

  const addPayment = () => {
    if (!payForm.amount) return;
    const amt = parseFloat(payForm.amount);
    const newPay = { id: `P${Date.now()}`, amount: amt, payment_mode: payForm.mode, payment_date: payForm.date, notes: payForm.notes, transaction_id: payForm.txId };
    const nextPayments = [...payments, newPay];
    setPayments(nextPayments);

    setBill((prev: any) => {
      const next = recalculate({ ...prev, amountPaid: prev.amountPaid + amt, payments: nextPayments });
      const list = getStoredItems('suman_billing', INITIAL_BILLS);
      const updated = list.map((b) => b.id === next.id ? next : b);
      saveStoredItems('suman_billing', updated);
      return next;
    });

    setPF({ amount: '', mode: 'cash', txId: '', date: new Date().toISOString().slice(0, 10), notes: '' });
    setSPF(false);
  };

  const handleExportPdf = async () => {
    const { exportBillToPdf } = await import('../../../../lib/exportPdf');
    exportBillToPdf(bill, bill);
  };

  const handleExportExcel = async () => {
    const { exportBillToExcel } = await import('../../../../lib/exportExcel');
    exportBillToExcel(bill, bill);
  };

  const whatsappBill = () => {
    const msg = `Hi ${bill.customer_name}! 🚗\n\n*SUMAN TRAVELS — Invoice ${bill.bill_number}*\n\nBooking: ${bill.booking_number}\nCar: ${bill.car_name}\nTrip: ${bill.pickup_location} → ${bill.drop_location}\n\nPackage: ${formatINR(bill.packageAmount)}\nExtra Hrs: ${formatINR(bill.extraHoursAmount)}\nExtra Km: ${formatINR(bill.extraKmAmount)}\nNight Charge: ${formatINR(bill.nightChargeAmount)}\nToll: ${formatINR(bill.tollAmount)}\nGST (${bill.gstRate}%): ${formatINR(bill.gstAmount)}\n\n*TOTAL: ${formatINR(bill.totalAmount)}*\nPaid: ${formatINR(bill.amountPaid)}\n*Balance Due: ${formatINR(bill.balanceDue)}*\n\nThank you for choosing Suman Travels! 🙏`;
    window.open(`https://wa.me/${bill.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const carPhoto = CAR_PHOTOS[bill.car_name];
  const totalUSD = bill.totalAmount / bill.usd_rate;
  const balUSD   = bill.balanceDue  / bill.usd_rate;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <Link href="/admin/billing">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <ArrowLeft size={17} />
            </button>
          </Link>
          <div>
            <h1 className="text-white text-lg sm:text-xl font-bold">{bill.bill_number}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize" style={{ color: STATUS_COLORS[bill.status], background: `${STATUS_COLORS[bill.status]}20` }}>
              {bill.status}
            </span>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportPdf} className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Download size={13} /><span>PDF</span>
          </button>
          <button onClick={handleExportExcel} className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-green-400" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
            <FileText size={13} /><span>Excel</span>
          </button>
          <button onClick={whatsappBill} className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: '#25D366' }}>
            <Share2 size={13} /><span>WhatsApp</span>
          </button>
          <button onClick={() => setEC(!editingCharges)} className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: editingCharges ? '#FF6B4A' : 'rgba(255,255,255,0.06)', color: editingCharges ? '#fff' : 'rgba(255,255,255,0.6)' }}>
            <Pencil size={13} /><span>{editingCharges ? 'Done' : 'Edit Charges'}</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* LEFT: Bill Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Car photo + trip header */}
          <GlassCard className="!p-0 overflow-hidden">
            {carPhoto && (
              <div className="h-36 sm:h-48 overflow-hidden relative">
                <img src={carPhoto} alt={bill.car_name} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
                <div className="absolute bottom-4 left-5">
                  <p className="text-white font-bold text-lg">{bill.car_name}</p>
                  <p className="text-white/60 text-sm">{bill.vehicle_number}</p>
                </div>
              </div>
            )}
            <div className="p-4 sm:p-5 grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase mb-1">Customer</p>
                <p className="text-white font-bold">{bill.customer_name}</p>
                <p className="text-white/50">{bill.customer_phone}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase mb-1">Trip</p>
                <p className="text-white/80">{bill.pickup_location}</p>
                <p className="text-white/50 text-xs">→ {bill.drop_location}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase mb-1">Odometer</p>
                <p className="text-white/80">{bill.odometer_start?.toLocaleString('en-IN')} → {bill.odometer_end?.toLocaleString('en-IN')} km</p>
                <p className="text-white/40 text-xs">{bill.actualKm} km run · {bill.actualHours} hrs</p>
              </div>
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase mb-1">Date</p>
                <p className="text-white/80">{new Date(bill.pickup_datetime).toLocaleDateString('en-IN')}</p>
                <p className="text-white/40 text-xs">{new Date(bill.pickup_datetime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} → {new Date(bill.actual_dropoff).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </GlassCard>

          {/* Editable Extra Charges */}
          {editingCharges && (
            <div className="rounded-2xl p-4 sm:p-5 space-y-4" style={{ background: 'rgba(255,107,74,0.06)', border: '1px solid rgba(255,107,74,0.2)' }}>
              <div className="flex items-center space-x-2">
                <Pencil size={15} className="text-[#FF6B4A]" />
                <h2 className="text-white font-semibold">Edit Charges</h2>
                <span className="text-white/30 text-xs">(Auto-recalculates total)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <NumInput label="Package Amount" value={bill.packageAmount} onChange={(v: number) => update('packageAmount', v)} sublabel="Base fare" />
                <NumInput label="Extra Hours" value={bill.extraHours} unit="hrs" step={0.5} onChange={(v: number) => update('extraHours', v)} sublabel={`@ ₹${bill.extraHoursRate}/hr`} />
                <NumInput label="Extra Hr Rate" value={bill.extraHoursRate} onChange={(v: number) => update('extraHoursRate', v)} sublabel="Per extra hour" />
                <NumInput label="Extra KM" value={bill.extraKm} unit="km" onChange={(v: number) => update('extraKm', v)} sublabel={`@ ₹${bill.extraKmRate}/km`} />
                <NumInput label="Extra KM Rate" value={bill.extraKmRate} onChange={(v: number) => update('extraKmRate', v)} sublabel="Per extra km" />
                <NumInput label="Night Charge" value={bill.nightChargeAmount} onChange={(v: number) => update('nightChargeAmount', v)} sublabel="After 23:00" />
                <NumInput label="Toll Amount" value={bill.tollAmount} onChange={(v: number) => update('tollAmount', v)} />
                <NumInput label="Parking" value={bill.parkingAmount} onChange={(v: number) => update('parkingAmount', v)} />
                <NumInput label="Other Charges" value={bill.otherCharges} onChange={(v: number) => update('otherCharges', v)} />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-white/40 text-xs font-semibold uppercase mb-1">Toll Description</p>
                  <input value={bill.toll_description} onChange={(e) => update('toll_description', e.target.value)} placeholder="e.g. Bandra-Worli, Sea Link..." className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
                <div>
                  <p className="text-white/40 text-xs font-semibold uppercase mb-1">Other Charges Description</p>
                  <input value={bill.otherDescription} onChange={(e) => update('otherDescription', e.target.value)} placeholder="e.g. State permit, helper..." className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <NumInput label="Discount Amount" value={bill.discountAmount} onChange={(v: number) => update('discountAmount', v)} sublabel="Applied before GST" />
                <div>
                  <p className="text-white/40 text-xs font-semibold uppercase mb-1">Discount Reason</p>
                  <input value={bill.discountReason} onChange={(e) => update('discountReason', e.target.value)} placeholder="Loyalty / Coupon code..." className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <NumInput label="GST Rate (%)" value={bill.gstRate} unit="%" step={0.5} onChange={(v: number) => update('gstRate', v)} />
              </div>
            </div>
          )}

          {/* Bill Breakdown */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Bill Breakdown</h2>
              {showUsd && <span className="text-xs text-white/40">Rate: 1 USD = ₹{bill.usd_rate}</span>}
            </div>
            <div className="space-y-0 text-sm">
              {[
                { label: bill.packageLabel || 'Package', detail: 'Base package', amount: bill.packageAmount, show: true },
                { label: `Extra Hours (${bill.extraHours || 0} hrs)`, detail: `× ₹${bill.extraHoursRate || 0}/hr`, amount: bill.extraHoursAmount, show: (bill.extraHoursAmount || 0) > 0 },
                { label: `Extra KM (${bill.extraKm || 0} km)`, detail: `× ₹${bill.extraKmRate || 0}/km`, amount: bill.extraKmAmount, show: (bill.extraKmAmount || 0) > 0 },
                { label: 'Driver Night Charge', detail: 'After 23:00', amount: bill.nightChargeAmount, show: (bill.nightChargeAmount || 0) > 0 },
                { label: 'Toll Charges', detail: bill.toll_description, amount: bill.tollAmount, show: (bill.tollAmount || 0) > 0 },
                { label: 'Parking', detail: '', amount: bill.parkingAmount, show: (bill.parkingAmount || 0) > 0 },
                { label: 'Other Charges', detail: bill.otherDescription, amount: bill.otherCharges, show: (bill.otherCharges || 0) > 0 },
                { label: `Discount${bill.discountReason ? ` (${bill.discountReason})` : ''}`, detail: '', amount: -bill.discountAmount, negative: true, show: (bill.discountAmount || 0) > 0 },
              ].filter((r) => r.show).map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex-1 min-w-0 pr-4">
                    <span className="text-white/75">{r.label}</span>
                    {r.detail && <span className="ml-2 text-white/30 text-xs hidden sm:inline">{r.detail}</span>}
                  </div>
                  <span style={{ color: (r as any).negative ? '#EF4444' : 'rgba(255,255,255,0.85)' }} className="shrink-0">
                    {formatINR(Math.abs(r.amount))}
                  </span>
                </div>
              ))}

              {/* Totals */}
              <div className="pt-2 space-y-1 border-t border-white/10 mt-1">
                {[
                  { label: 'Subtotal', amount: bill.subtotal, bold: false },
                  { label: `GST (${bill.gstRate}%)`, amount: bill.gstAmount, bold: false },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between text-sm py-1">
                    <span className="text-white/60">{r.label}</span>
                    <span className="text-white/80">{formatINR(r.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-base py-1.5 border-t border-white/10">
                  <span className="text-white">TOTAL</span>
                  <span className="text-[#FF6B4A]">{formatINR(bill.totalAmount)}</span>
                </div>
                {showUsd && <div className="flex justify-between text-xs text-white/40"><span>Total (USD)</span><span>${totalUSD.toFixed(2)}</span></div>}
                <div className="flex justify-between text-sm py-1">
                  <span className="text-white/60">Amount Paid</span>
                  <span className="text-green-400">{formatINR(bill.amountPaid)}</span>
                </div>
                <div className="flex justify-between font-bold text-base py-1.5 border-t border-white/10">
                  <span className="text-white">BALANCE DUE</span>
                  <span style={{ color: bill.balanceDue > 0 ? '#FF6B4A' : '#4ADE80' }}>{formatINR(bill.balanceDue)}</span>
                </div>
                {showUsd && bill.balanceDue > 0 && <div className="flex justify-between text-xs text-[#FF6B4A]/60"><span>Balance (USD)</span><span>${balUSD.toFixed(2)}</span></div>}
              </div>
            </div>
          </GlassCard>

          {/* Payment History */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Payment History</h2>
              <button onClick={() => setSPF(!showPayForm)} className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#FF6B4A]" style={{ background: 'rgba(255,107,74,0.1)' }}>
                <Plus size={12} /><span>Record Payment</span>
              </button>
            </div>

            {showPayForm && (
              <div className="mb-4 p-4 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-white/40 text-xs mb-1">Amount (₹)</p>
                    <input type="number" value={payForm.amount} onChange={(e) => setPF((f) => ({ ...f, amount: e.target.value }))} placeholder="0" className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-1">Payment Mode</p>
                    <select value={payForm.mode} onChange={(e) => setPF((f) => ({ ...f, mode: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none bg-[#111827] border border-white/10">
                      {['cash', 'upi', 'card', 'bank_transfer', 'cheque'].map((m) => <option key={m} value={m} className="bg-[#111827] text-white">{m.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-1">Date</p>
                    <input type="date" value={payForm.date} onChange={(e) => setPF((f) => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-1">Transaction ID</p>
                    <input value={payForm.txId} onChange={(e) => setPF((f) => ({ ...f, txId: e.target.value }))} placeholder="UPI ref / Cheque no." className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  </div>
                </div>
                <input value={payForm.notes} onChange={(e) => setPF((f) => ({ ...f, notes: e.target.value }))} placeholder="Notes..." className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                <div className="flex space-x-2">
                  <button onClick={addPayment} className="flex-1 py-2 rounded-xl text-sm font-bold text-white" style={{ background: '#4ADE80' }}>Save Payment</button>
                  <button onClick={() => setSPF(false)} className="flex-1 py-2 rounded-xl text-sm text-white/50" style={{ background: 'rgba(255,255,255,0.06)' }}>Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div>
                    <p className="text-white text-sm font-semibold">{formatINR(p.amount)}</p>
                    <p className="text-white/40 text-xs capitalize">{p.payment_mode.replace('_', ' ')} · {p.payment_date}{p.transaction_id ? ` · ${p.transaction_id}` : ''}</p>
                    {p.notes && <p className="text-white/30 text-xs">{p.notes}</p>}
                  </div>
                  <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* RIGHT Sidebar */}
        <div className="space-y-4">
          {/* Balance summary */}
          <div className="rounded-2xl p-5 text-center" style={{ background: bill.balanceDue > 0 ? 'rgba(255,107,74,0.08)' : 'rgba(74,222,128,0.08)', border: `1px solid ${bill.balanceDue > 0 ? 'rgba(255,107,74,0.2)' : 'rgba(74,222,128,0.2)'}` }}>
            <p className="text-white/50 text-xs uppercase tracking-wide mb-1">Balance Due</p>
            <p className="text-3xl font-bold" style={{ color: bill.balanceDue > 0 ? '#FF6B4A' : '#4ADE80' }}>{formatINR(bill.balanceDue)}</p>
            {bill.balanceDue <= 0 && <p className="text-green-400 text-xs mt-1">✅ Fully Paid</p>}
            <p className="text-white/30 text-xs mt-2">Total: {formatINR(bill.totalAmount)}</p>
          </div>

          {/* USD Toggle */}
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-semibold">Show USD Price</p>
                <p className="text-white/30 text-xs">1 USD = ₹{bill.usd_rate}</p>
              </div>
              <button onClick={() => setShowUsd(!showUsd)} className="relative w-11 h-6 rounded-full transition-colors" style={{ background: showUsd ? '#FF6B4A' : 'rgba(255,255,255,0.1)' }}>
                <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" style={{ transform: showUsd ? 'translateX(20px)' : 'translateX(0)' }} />
              </button>
            </div>
            {showUsd && (
              <div className="mt-3 pt-3 border-t border-white/8 space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-white/50">Total (USD)</span><span className="text-white">${totalUSD.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Balance (USD)</span><span className="text-[#FF6B4A]">${balUSD.toFixed(2)}</span></div>
              </div>
            )}
          </GlassCard>

          {/* Bill status */}
          <GlassCard>
            <p className="text-white/50 text-xs uppercase mb-3">Bill Status</p>
            <div className="space-y-1.5">
              {['draft', 'sent', 'partial', 'paid', 'closed'].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs capitalize transition-all"
                  style={{
                    background: bill.status === s ? `${STATUS_COLORS[s]}18` : 'transparent',
                    border: bill.status === s ? `1px solid ${STATUS_COLORS[s]}30` : '1px solid transparent',
                    color: bill.status === s ? STATUS_COLORS[s] : 'rgba(255,255,255,0.35)',
                  }}
                >
                  {s}
                  {bill.status === s && <CheckCircle2 size={12} />}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Edit charges hint */}
          {!editingCharges && (
            <button onClick={() => setEC(true)} className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2" style={{ background: 'rgba(255,107,74,0.08)', border: '1px solid rgba(255,107,74,0.2)', color: '#FF6B4A' }}>
              <Pencil size={14} />
              <span>Edit Extra Charges</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
