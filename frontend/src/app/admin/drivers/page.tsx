'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Phone, Car, Star, Moon, CheckCircle2, Clock, XCircle, X, Edit2, Trash2, Download } from 'lucide-react';
import { getStoredItems, saveStoredItems, INITIAL_DRIVERS } from '../../../lib/storage';
import { exportDriverReport } from '../../../lib/exportExcel';

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  available: { label: 'Available', color: '#4ADE80' },
  on_duty:   { label: 'On Duty',   color: '#60A5FA' },
  off_duty:  { label: 'Off Duty',  color: '#FFB347' },
  inactive:  { label: 'Inactive',  color: '#EF4444' },
};

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

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    license_number: '',
    license_expiry: '',
    status: 'available',
    assigned_car: '',
    total_trips: '0',
    night_duties: '0',
    avg_rating: '5.0',
    total_earnings: '0',
  });

  // Load from LocalStorage
  useEffect(() => {
    setDrivers(getStoredItems('suman_drivers', INITIAL_DRIVERS));
  }, []);

  const filtered = drivers.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.phone.includes(search));

  const toggleStatus = (id: string) => {
    const updated = drivers.map((d) => d.id === id ? { ...d, status: d.status === 'available' ? 'off_duty' : 'available' } : d);
    setDrivers(updated);
    saveStoredItems('suman_drivers', updated);
  };

  const isExpiringSoon = (expiry: string) => {
    const expiryTime = new Date(expiry).getTime();
    if (isNaN(expiryTime)) return false;
    const days = (expiryTime - Date.now()) / (1000 * 60 * 60 * 24);
    return days < 180;
  };

  const handleOpenAdd = () => {
    setEditingDriver(null);
    setForm({
      name: '',
      phone: '',
      license_number: '',
      license_expiry: '',
      status: 'available',
      assigned_car: '',
      total_trips: '0',
      night_duties: '0',
      avg_rating: '5.0',
      total_earnings: '0',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (d: any) => {
    setEditingDriver(d);
    setForm({
      name: d.name,
      phone: d.phone,
      license_number: d.license_number,
      license_expiry: d.license_expiry,
      status: d.status,
      assigned_car: d.assigned_car || '',
      total_trips: String(d.total_trips || 0),
      night_duties: String(d.night_duties || 0),
      avg_rating: String(d.avg_rating || 5.0),
      total_earnings: String(d.total_earnings || 0),
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      const updated = drivers.filter((d) => d.id !== id);
      setDrivers(updated);
      saveStoredItems('suman_drivers', updated);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.license_number || !form.license_expiry) {
      alert('Please fill out name, phone, license number, and expiry.');
      return;
    }

    let updated: any[];
    if (editingDriver) {
      // Edit
      updated = drivers.map((d) => {
        if (d.id === editingDriver.id) {
          return {
            ...d,
            name: form.name,
            phone: form.phone,
            license_number: form.license_number,
            license_expiry: form.license_expiry,
            status: form.status,
            assigned_car: form.assigned_car || null,
            total_trips: parseInt(form.total_trips) || 0,
            night_duties: parseInt(form.night_duties) || 0,
            avg_rating: parseFloat(form.avg_rating) || 5.0,
            total_earnings: parseFloat(form.total_earnings) || 0,
          };
        }
        return d;
      });
    } else {
      // Add
      const newDriver = {
        id: `D${Date.now()}`,
        name: form.name,
        phone: form.phone,
        license_number: form.license_number,
        license_expiry: form.license_expiry,
        status: form.status,
        assigned_car: form.assigned_car || null,
        total_trips: parseInt(form.total_trips) || 0,
        night_duties: parseInt(form.night_duties) || 0,
        avg_rating: parseFloat(form.avg_rating) || 5.0,
        total_earnings: parseFloat(form.total_earnings) || 0,
      };
      updated = [...drivers, newDriver];
    }

    setDrivers(updated);
    saveStoredItems('suman_drivers', updated);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Driver Management</h1>
          <p className="text-white/40 text-sm">{drivers.length} drivers registered</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => exportDriverReport(drivers)} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ADE80' }}>
            <Download size={16} />
            <span>Export Excel</span>
          </button>
          <button onClick={handleOpenAdd} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-102" style={{ background: '#FF6B4A' }}>
            <Plus size={16} />
            <span>Add Driver</span>
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Drivers', value: drivers.length, color: '#a78bfa' },
          { label: 'Available', value: drivers.filter((d) => d.status === 'available').length, color: '#4ADE80' },
          { label: 'On Duty', value: drivers.filter((d) => d.status === 'on_duty').length, color: '#60A5FA' },
          { label: 'Total Trips', value: drivers.reduce((s, d) => s + (d.total_trips || 0), 0), color: '#FF6B4A' },
        ].map((s) => (
          <GlassCard key={s.label} className="px-4 py-3">
            <p className="text-white font-bold text-xl">{s.value}</p>
            <p className="text-white/40 text-xs">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Search */}
      <GlassCard className="p-4">
        <div className="flex items-center space-x-2 bg-white/5 rounded-xl px-3 py-2 border border-white/5 focus-within:border-white/10">
          <Search size={14} className="text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search driver name or phone..." className="bg-transparent text-white text-sm flex-1 focus:outline-none placeholder-white/20" />
        </div>
      </GlassCard>

      {/* Driver Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((d) => {
          const st = STATUS_CFG[d.status || 'available'] || STATUS_CFG.available;
          const expiryWarn = isExpiringSoon(d.license_expiry);
          const expiryDate = new Date(d.license_expiry);
          return (
            <GlassCard key={d.id} className="p-5 flex flex-col justify-between hover:border-white/15 transition-colors">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FF6B4A]/15 flex items-center justify-center text-[#FF6B4A] font-bold text-lg">
                      {d.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{d.name}</p>
                      <p className="text-white/40 text-xs flex items-center space-x-1">
                        <Phone size={10} />
                        <span>{d.phone}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: st.color, background: `${st.color}18` }}>{st.label}</span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div className="rounded-xl py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <p className="text-white font-bold text-base">{d.total_trips || 0}</p>
                    <p className="text-white/30 text-[10px]">Trips</p>
                  </div>
                  <div className="rounded-xl py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <p className="text-white font-bold text-base flex items-center justify-center space-x-0.5">
                      <Moon size={11} className="text-blue-400" />
                      <span>{d.night_duties || 0}</span>
                    </p>
                    <p className="text-white/30 text-[10px]">Nights</p>
                  </div>
                  <div className="rounded-xl py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <p className="text-white font-bold text-base flex items-center justify-center space-x-0.5">
                      <Star size={11} className="text-yellow-400" />
                      <span>{d.avg_rating || 5.0}</span>
                    </p>
                    <p className="text-white/30 text-[10px]">Rating</p>
                  </div>
                </div>

                {/* Assigned car */}
                {d.assigned_car ? (
                  <div className="flex items-center space-x-2 text-xs text-white/60 mb-3">
                    <Car size={12} className="text-[#FF6B4A]" />
                    <span>Assigned: <span className="text-white">{d.assigned_car}</span></span>
                  </div>
                ) : (
                  <p className="text-white/30 text-xs mb-3">No car assigned</p>
                )}

                {/* License */}
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className="text-white/40">License: {d.license_number}</span>
                  <span className={`${expiryWarn ? 'text-orange-400' : 'text-white/40'}`}>
                    {expiryWarn && '⚠️ '}{!isNaN(expiryDate.getTime()) ? `Exp: ${expiryDate.toLocaleDateString('en-IN')}` : 'Invalid Expiry'}
                  </span>
                </div>

                {/* Earnings */}
                <div className="flex items-center justify-between text-xs border-t border-white/8 pt-3 mb-4">
                  <span className="text-white/40">Total Earnings</span>
                  <span className="text-[#FF6B4A] font-bold">₹ {(d.total_earnings || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 mt-auto">
                <a href={`https://wa.me/${d.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-lg text-xs font-semibold text-center text-white flex items-center justify-center" style={{ background: '#25D366' }}>
                  WhatsApp
                </a>
                <button onClick={() => toggleStatus(d.id)} className="flex-1 py-2 rounded-lg text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
                  Toggle Status
                </button>
                <button onClick={() => handleOpenEdit(d)} className="px-2.5 py-2 rounded-lg text-xs border border-white/10 hover:border-white/20 transition-all flex items-center justify-center text-white/60 hover:text-white" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="px-2.5 py-2 rounded-lg text-xs border transition-all flex items-center justify-center"
                  style={{
                    background: confirmDeleteId === d.id ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.05)',
                    borderColor: confirmDeleteId === d.id ? '#EF4444' : 'rgba(239,68,68,0.2)',
                    color: confirmDeleteId === d.id ? '#EF4444' : '#F87171',
                  }}
                >
                  {confirmDeleteId === d.id ? 'Confirm?' : <Trash2 size={13} />}
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Add / Edit Driver Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4 text-white flex flex-col max-h-[90vh] overflow-y-auto" style={{ background: 'rgba(17,24,39,0.95)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}>
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <h3 className="text-white font-bold text-lg">{editingDriver ? 'Edit Driver Info' : 'Add New Driver'}</h3>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Driver Name *</Label>
                  <Input required value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rajesh Kumar" />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input required type="tel" value={form.phone} onChange={(e: any) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. +91 88888 11111" />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onChange={(e: any) => setForm({ ...form, status: e.target.value })}>
                    <option value="available">Available</option>
                    <option value="on_duty">On Duty</option>
                    <option value="off_duty">Off Duty</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </div>
                <div>
                  <Label>License Number *</Label>
                  <Input required value={form.license_number} onChange={(e: any) => setForm({ ...form, license_number: e.target.value })} placeholder="e.g. MH0120150123456" />
                </div>
                <div>
                  <Label>License Expiry Date *</Label>
                  <Input required type="date" value={form.license_expiry} onChange={(e: any) => setForm({ ...form, license_expiry: e.target.value })} />
                </div>
                <div>
                  <Label>Assigned Vehicle</Label>
                  <Input value={form.assigned_car} onChange={(e: any) => setForm({ ...form, assigned_car: e.target.value })} placeholder="e.g. Toyota Innova Crysta" />
                </div>
                <div>
                  <Label>Trips Completed</Label>
                  <Input type="number" min="0" value={form.total_trips} onChange={(e: any) => setForm({ ...form, total_trips: e.target.value })} />
                </div>
                <div>
                  <Label>Night Duties</Label>
                  <Input type="number" min="0" value={form.night_duties} onChange={(e: any) => setForm({ ...form, night_duties: e.target.value })} />
                </div>
                <div>
                  <Label>Average Rating</Label>
                  <Input type="number" min="1" max="5" step="0.1" value={form.avg_rating} onChange={(e: any) => setForm({ ...form, avg_rating: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label>Total Earnings (₹)</Label>
                  <Input type="number" min="0" value={form.total_earnings} onChange={(e: any) => setForm({ ...form, total_earnings: e.target.value })} />
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
