'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Users, Phone, Mail, Star, Tag, Eye, X, Edit2, Trash2, Download } from 'lucide-react';
import { getStoredItems, saveStoredItems, INITIAL_CUSTOMERS } from '../../../lib/storage';
import { exportCustomersReport } from '../../../lib/exportExcel';

const LOYALTY_COLORS: Record<string, string> = { regular: '#60A5FA', silver: '#a1a1aa', gold: '#FFB347', corporate: '#a78bfa' };

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

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    id_proof_type: 'Aadhar',
    company_name: '',
    gst_number: '',
    loyalty_status: 'regular',
    tags: '',
    notes: '',
  });

  // Load from LocalStorage
  useEffect(() => {
    setCustomers(getStoredItems('suman_customers', INITIAL_CUSTOMERS));
  }, []);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchQ = c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.company_name && c.company_name.toLowerCase().includes(q));
    const matchF = filter === 'all' || c.loyalty_status === filter;
    return matchQ && matchF;
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setForm({
      name: '',
      phone: '',
      email: '',
      id_proof_type: 'Aadhar',
      company_name: '',
      gst_number: '',
      loyalty_status: 'regular',
      tags: '',
      notes: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCustomer(c);
    setForm({
      name: c.name,
      phone: c.phone,
      email: c.email || '',
      id_proof_type: c.id_proof_type || 'Aadhar',
      company_name: c.company_name || '',
      gst_number: c.gst_number || '',
      loyalty_status: c.loyalty_status || 'regular',
      tags: c.tags ? c.tags.join(', ') : '',
      notes: c.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      const updated = customers.filter((c) => c.id !== id);
      setCustomers(updated);
      saveStoredItems('suman_customers', updated);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      alert('Please fill name and phone number.');
      return;
    }

    const tagArray = form.tags ? form.tags.split(',').map((t) => t.trim()).filter((t) => t) : [];

    let updated: any[];
    if (editingCustomer) {
      // Edit
      updated = customers.map((c) => {
        if (c.id === editingCustomer.id) {
          return {
            ...c,
            name: form.name,
            phone: form.phone,
            email: form.email,
            id_proof_type: form.id_proof_type,
            company_name: form.company_name,
            gst_number: form.gst_number,
            loyalty_status: form.loyalty_status,
            tags: tagArray,
            notes: form.notes,
          };
        }
        return c;
      });
    } else {
      // Add
      const newCust = {
        id: `C${Date.now()}`,
        name: form.name,
        phone: form.phone,
        email: form.email,
        id_proof_type: form.id_proof_type,
        company_name: form.company_name,
        gst_number: form.gst_number,
        loyalty_status: form.loyalty_status,
        total_spent: 0,
        total_bookings: 0,
        tags: tagArray,
        notes: form.notes,
      };
      updated = [...customers, newCust];
    }

    setCustomers(updated);
    saveStoredItems('suman_customers', updated);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Customer CRM</h1>
          <p className="text-white/40 text-sm">{customers.length} customers in database</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => exportCustomersReport(customers)} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ADE80' }}>
            <Download size={16} />
            <span>Export Excel</span>
          </button>
          <button onClick={handleOpenAdd} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-102" style={{ background: '#FF6B4A' }}>
            <Plus size={16} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Customers', value: customers.length, color: '#60A5FA' },
          { label: 'Corporate', value: customers.filter((c) => c.loyalty_status === 'corporate').length, color: '#a78bfa' },
          { label: 'Gold Members', value: customers.filter((c) => c.loyalty_status === 'gold').length, color: '#FFB347' },
          { label: 'Total Revenue', value: `₹ ${customers.reduce((s, c) => s + (c.total_spent || 0), 0).toLocaleString('en-IN')}`, color: '#FF6B4A' },
        ].map((s) => (
          <GlassCard key={s.label} className="px-4 py-3">
            <p className="text-white font-bold text-lg">{s.value}</p>
            <p className="text-white/40 text-xs">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex flex-wrap gap-3">
        <div className="flex items-center space-x-2 bg-white/5 rounded-xl px-3 py-2 flex-1 min-w-52 border border-white/5 focus-within:border-white/10">
          <Search size={14} className="text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, phone, company..." className="bg-transparent text-white text-sm flex-1 focus:outline-none placeholder-white/20" />
        </div>
        {['all', 'corporate', 'gold', 'silver', 'regular'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all" style={{ background: filter === f ? '#FF6B4A' : 'rgba(255,255,255,0.06)', color: filter === f ? '#fff' : 'rgba(255,255,255,0.5)' }}>
            {f}
          </button>
        ))}
      </GlassCard>

      {/* Customer Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <GlassCard key={c.id} className="p-5 hover:border-white/15 transition-colors relative flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm" style={{ background: `${LOYALTY_COLORS[c.loyalty_status || 'regular']}20`, color: LOYALTY_COLORS[c.loyalty_status || 'regular'] }}>
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{c.name}</p>
                    {c.company_name && <p className="text-white/40 text-xs">{c.company_name}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize font-semibold" style={{ color: LOYALTY_COLORS[c.loyalty_status || 'regular'], background: `${LOYALTY_COLORS[c.loyalty_status || 'regular']}18` }}>
                    {c.loyalty_status}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-white/60 mb-3">
                <div className="flex items-center space-x-2"><Phone size={11} /><span>{c.phone}</span></div>
                {c.email && <div className="flex items-center space-x-2"><Mail size={11} /><span>{c.email}</span></div>}
                {c.gst_number && <div className="flex items-center space-x-2"><Tag size={11} /><span>GST: {c.gst_number}</span></div>}
              </div>

              <div className="flex justify-between text-xs mb-3">
                <div className="text-center"><p className="text-white font-bold">{c.total_bookings || 0}</p><p className="text-white/30">Bookings</p></div>
                <div className="text-center"><p className="text-[#FF6B4A] font-bold">₹ {(c.total_spent || 0).toLocaleString('en-IN')}</p><p className="text-white/30">Total Spent</p></div>
                <div className="text-center"><p className="text-white font-bold">{c.id_proof_type || 'None'}</p><p className="text-white/30">ID Proof</p></div>
              </div>

              {c.tags && c.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {c.tags.map((t: string) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full text-white/50" style={{ background: 'rgba(255,255,255,0.06)' }}>{t}</span>
                  ))}
                </div>
              )}

              {c.notes && (
                <p className="text-[11px] text-white/40 italic bg-white/2 rounded-lg p-2 mb-4 border border-white/5">
                  Note: {c.notes}
                </p>
              )}
            </div>

            <div className="flex space-x-2 mt-auto">
              <a href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=Hi ${c.name}!`} target="_blank" rel="noopener noreferrer" className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-center text-white flex items-center justify-center" style={{ background: '#25D366' }}>
                WhatsApp
              </a>
              <button onClick={() => handleOpenEdit(c)} className="px-3 py-1.5 rounded-lg text-xs border border-white/10 hover:border-white/20 transition-all flex items-center justify-center text-white/60 hover:text-white" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="px-3 py-1.5 rounded-lg text-xs border transition-all flex items-center justify-center"
                style={{
                  background: confirmDeleteId === c.id ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.05)',
                  borderColor: confirmDeleteId === c.id ? '#EF4444' : 'rgba(239,68,68,0.2)',
                  color: confirmDeleteId === c.id ? '#EF4444' : '#F87171',
                }}
              >
                {confirmDeleteId === c.id ? 'Confirm?' : <Trash2 size={13} />}
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Add / Edit Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity">
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4 text-white flex flex-col max-h-[90vh] overflow-y-auto" style={{ background: 'rgba(17,24,39,0.95)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}>
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <h3 className="text-white font-bold text-lg">{editingCustomer ? 'Edit Customer Info' : 'Add New Customer'}</h3>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Full Name *</Label>
                  <Input required value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rahul Sharma" />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input required type="tel" value={form.phone} onChange={(e: any) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. +91 98765 43210" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} placeholder="e.g. rahul@example.com" />
                </div>
                <div>
                  <Label>Loyalty Status</Label>
                  <Select value={form.loyalty_status} onChange={(e: any) => setForm({ ...form, loyalty_status: e.target.value })}>
                    <option value="regular">Regular</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="corporate">Corporate</option>
                  </Select>
                </div>
                <div>
                  <Label>ID Proof Type</Label>
                  <Select value={form.id_proof_type} onChange={(e: any) => setForm({ ...form, id_proof_type: e.target.value })}>
                    <option value="Aadhar">Aadhar</option>
                    <option value="PAN">PAN</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="None">None</option>
                  </Select>
                </div>
                <div>
                  <Label>Company Name</Label>
                  <Input value={form.company_name} onChange={(e: any) => setForm({ ...form, company_name: e.target.value })} placeholder="e.g. Tech Mahindra Ltd" />
                </div>
                <div>
                  <Label>GST Number</Label>
                  <Input value={form.gst_number} onChange={(e: any) => setForm({ ...form, gst_number: e.target.value })} placeholder="e.g. 27AAACT1234A1Z5" />
                </div>
                <div className="col-span-2">
                  <Label>Tags (comma separated)</Label>
                  <Input value={form.tags} onChange={(e: any) => setForm({ ...form, tags: e.target.value })} placeholder="e.g. Repeat, VIP, Late Night" />
                </div>
                <div className="col-span-2">
                  <Label>Special Notes</Label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e: any) => setForm({ ...form, notes: e.target.value })}
                    placeholder="e.g. Prefers SUV, needs clean seatcovers..."
                    className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none resize-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <button type="submit" className="flex-1 py-2.5 rounded-xl font-bold text-white transition-colors" style={{ background: '#FF6B4A' }}>
                  Save
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl font-bold text-white/50" style={{ background: 'rgba(255,255,255,0.06)' }}>
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
