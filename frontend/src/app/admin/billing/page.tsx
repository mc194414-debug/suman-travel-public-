'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Search, Download, CheckCircle2, Clock, AlertCircle, Plus, X } from 'lucide-react';
import { formatINR } from '../../../lib/billing';
import { exportInvoicesReport } from '../../../lib/exportExcel';
import { getStoredItems, saveStoredItems, INITIAL_BILLS, INITIAL_CARS } from '../../../lib/storage';

const STATUS_COLORS: Record<string, string> = { draft: '#FFB347', sent: '#60A5FA', partial: '#a78bfa', paid: '#4ADE80', closed: 'rgba(255,255,255,0.3)' };

const GlassCard = ({ children, className = '' }: any) => (
  <div className={`rounded-2xl ${className}`} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
    {children}
  </div>
);

const Label = ({ children }: any) => (
  <label className="block text-xs text-white/50 font-semibold uppercase tracking-wide mb-1">{children}</label>
);

const Input = ({ ...props }) => (
  <input
    {...props}
    className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none transition-colors"
    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
  />
);

const Select = ({ children, ...props }: any) => (
  <select
    {...props}
    className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none bg-[#111827] border border-white/10"
  >
    {children}
  </select>
);

export default function BillingPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [fleetCars, setFleetCars] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    car_name: '',
    booking_number: '',
    package_label: 'Custom Rental',
    package_amount: '',
    toll_amount: '0',
    parking_amount: '0',
    other_charges: '0',
    amount_paid: '0',
    status: 'draft',
  });

  // Load from localStorage
  useEffect(() => {
    setBills(getStoredItems('suman_billing', INITIAL_BILLS));
    const cars = getStoredItems('suman_fleet', INITIAL_CARS);
    setFleetCars(cars);
    if (cars.length > 0) {
      setForm((prev) => ({ ...prev, car_name: cars[0].name }));
    }
  }, []);

  const filtered = bills.filter((b) => {
    const q = search.toLowerCase();
    const matchQ = b.customer_name.toLowerCase().includes(q) || b.bill_number.toLowerCase().includes(q);
    const matchF = filter === 'all' || b.status === filter;
    return matchQ && matchF;
  });

  const totalRevenue = bills.reduce((s, b) => s + (b.amountPaid || 0), 0);
  const totalPending = bills.reduce((s, b) => s + (b.balanceDue || 0), 0);

  const handleOpenAdd = () => {
    setForm({
      customer_name: '',
      customer_phone: '',
      car_name: fleetCars[0]?.name || 'Toyota Innova Crysta',
      booking_number: `ST-MOCK-${Math.floor(100 + Math.random() * 900)}`,
      package_label: 'Custom Rental',
      package_amount: '',
      toll_amount: '0',
      parking_amount: '0',
      other_charges: '0',
      amount_paid: '0',
      status: 'draft',
    });
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name || !form.package_amount) {
      alert('Please fill out Customer Name and Base Package Amount.');
      return;
    }

    const baseAmt = parseFloat(form.package_amount) || 0;
    const tollAmt = parseFloat(form.toll_amount) || 0;
    const parkAmt = parseFloat(form.parking_amount) || 0;
    const otherAmt = parseFloat(form.other_charges) || 0;
    const paidAmt = parseFloat(form.amount_paid) || 0;

    const subtotal = baseAmt + tollAmt + parkAmt + otherAmt;
    const gstRate = 5;
    const gstAmount = (subtotal * gstRate) / 100;
    const totalAmount = subtotal + gstAmount;
    const balanceDue = totalAmount - paidAmt;

    const selectedCar = fleetCars.find((c) => c.name === form.car_name);

    const newBill = {
      id: `BILL-${Date.now()}`,
      bill_number: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      booking_number: form.booking_number,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone || '+91 99999 99999',
      car_name: form.car_name,
      vehicle_number: selectedCar?.vehicle_number || 'MH-01-AB-9999',
      pickup_location: 'Mumbai City',
      drop_location: 'Mumbai City',
      pickup_datetime: new Date().toISOString(),
      actual_dropoff: new Date().toISOString(),
      odometer_start: selectedCar?.odometer || 0,
      odometer_end: (selectedCar?.odometer || 0) + 100,
      packageLabel: form.package_label,
      packageAmount: baseAmt,
      actualHours: 8,
      packageHours: 8,
      extraHours: 0,
      extraHoursRate: 200,
      extraHoursAmount: 0,
      actualKm: 80,
      packageKm: 80,
      extraKm: 0,
      extraKmRate: 15,
      extraKmAmount: 0,
      nightChargeAmount: 0,
      tollAmount: tollAmt,
      toll_description: 'Tolls',
      parkingAmount: parkAmt,
      otherCharges: otherAmt,
      otherDescription: 'Other fees',
      discountAmount: 0,
      discountReason: '',
      gstRate,
      gstAmount,
      totalAmount,
      amountPaid: paidAmt,
      balanceDue,
      status: form.status,
      created_at: new Date().toISOString().split('T')[0],
      usd_rate: 83.5
    };

    const updated = [newBill, ...bills];
    setBills(updated);
    saveStoredItems('suman_billing', updated);
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      const updated = bills.filter(b => b.id !== id);
      setBills(updated);
      saveStoredItems('suman_billing', updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Billing & Invoices</h1>
          <p className="text-white/40 text-sm">{bills.length} invoices generated</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleOpenAdd} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:scale-102 transition-all" style={{ background: '#FF6B4A' }}>
            <Plus size={16} />
            <span>Create Invoice</span>
          </button>
          <button onClick={() => exportInvoicesReport(bills)} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ADE80' }}>
            <Download size={16} />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Invoices', value: bills.length, color: '#a78bfa' },
          { label: 'Revenue Collected', value: formatINR(totalRevenue), color: '#4ADE80' },
          { label: 'Pending Amount', value: formatINR(totalPending), color: '#FF6B4A' },
          { label: 'Fully Paid', value: bills.filter((b) => b.status === 'paid' || b.status === 'closed').length, color: '#60A5FA' },
        ].map((s) => (
          <GlassCard key={s.label} className="px-4 py-3">
            <p className="text-white font-bold text-lg">{s.value}</p>
            <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex flex-wrap gap-3">
        <div className="flex items-center space-x-2 bg-white/5 rounded-xl px-3 py-2 flex-1 min-w-52 border border-white/5 focus-within:border-white/10">
          <Search size={14} className="text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoice, customer..." className="bg-transparent text-white text-sm flex-1 focus:outline-none placeholder-white/20" />
        </div>
        {['all', 'draft', 'partial', 'paid', 'closed'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize" style={{ background: filter === s ? '#FF6B4A' : 'rgba(255,255,255,0.06)', color: filter === s ? '#fff' : 'rgba(255,255,255,0.5)' }}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </GlassCard>

      {/* Bills table */}
      <GlassCard className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Invoice #', 'Booking', 'Customer', 'Car', 'Total', 'Paid', 'Balance', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-white/40 text-xs font-semibold uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="hover:bg-white/2 transition-colors">
                <td className="px-4 py-3 text-white font-mono text-xs">{b.bill_number}</td>
                <td className="px-4 py-3 text-white/50 text-xs">{b.booking_number}</td>
                <td className="px-4 py-3 text-white">{b.customer_name}</td>
                <td className="px-4 py-3 text-white/60">{b.car_name}</td>
                <td className="px-4 py-3 text-white font-semibold">{formatINR(b.totalAmount)}</td>
                <td className="px-4 py-3 text-green-400">{formatINR(b.amountPaid)}</td>
                <td className="px-4 py-3" style={{ color: b.balanceDue > 0 ? '#FF6B4A' : 'rgba(255,255,255,0.3)' }}>{formatINR(b.balanceDue)}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ color: STATUS_COLORS[b.status], background: `${STATUS_COLORS[b.status]}18` }}>{b.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <Link href={`/admin/billing/${b.id}`}><button className="text-xs text-[#4ADE80] hover:underline font-semibold transition-all">View / Edit</button></Link>
                    <button onClick={() => handleDelete(b.id)} className="text-xs text-red-400 hover:text-red-300 hover:underline font-semibold transition-all">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* Manual Invoice Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4 text-white flex flex-col max-h-[90vh] overflow-y-auto" style={{ background: 'rgba(17,24,39,0.95)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}>
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <h3 className="text-white font-bold text-lg">Create Manual Invoice</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Customer Name *</Label>
                  <Input required value={form.customer_name} onChange={(e: any) => setForm({ ...form, customer_name: e.target.value })} placeholder="e.g. Rahul Sharma" />
                </div>
                <div>
                  <Label>Customer Phone</Label>
                  <Input value={form.customer_phone} onChange={(e: any) => setForm({ ...form, customer_phone: e.target.value })} placeholder="e.g. +91 98765 43210" />
                </div>
                <div>
                  <Label>Booking Number</Label>
                  <Input value={form.booking_number} onChange={(e: any) => setForm({ ...form, booking_number: e.target.value })} />
                </div>
                <div>
                  <Label>Select Car</Label>
                  <Select value={form.car_name} onChange={(e: any) => setForm({ ...form, car_name: e.target.value })}>
                    {fleetCars.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </Select>
                </div>
                <div>
                  <Label>Invoice Status</Label>
                  <Select value={form.status} onChange={(e: any) => setForm({ ...form, status: e.target.value })}>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                    <option value="closed">Closed</option>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Package / Rental Label</Label>
                  <Input value={form.package_label} onChange={(e: any) => setForm({ ...form, package_label: e.target.value })} placeholder="e.g. Local 8 Hrs / 80 Km" />
                </div>
                <div>
                  <Label>Base Package Price (₹) *</Label>
                  <Input type="number" required value={form.package_amount} onChange={(e: any) => setForm({ ...form, package_amount: e.target.value })} placeholder="0" />
                </div>
                <div>
                  <Label>Toll Charges (₹)</Label>
                  <Input type="number" value={form.toll_amount} onChange={(e: any) => setForm({ ...form, toll_amount: e.target.value })} />
                </div>
                <div>
                  <Label>Parking (₹)</Label>
                  <Input type="number" value={form.parking_amount} onChange={(e: any) => setForm({ ...form, parking_amount: e.target.value })} />
                </div>
                <div>
                  <Label>Other Charges (₹)</Label>
                  <Input type="number" value={form.other_charges} onChange={(e: any) => setForm({ ...form, other_charges: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label>Amount Paid (₹)</Label>
                  <Input type="number" value={form.amount_paid} onChange={(e: any) => setForm({ ...form, amount_paid: e.target.value })} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <button type="submit" className="flex-1 py-2.5 rounded-xl font-bold text-white transition-colors" style={{ background: '#FF6B4A' }}>
                  Generate Invoice
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl font-bold text-white/50" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
