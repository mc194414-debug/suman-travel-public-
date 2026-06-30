'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, CalendarDays, MapPin, Clock, Car, CheckCircle2, AlertCircle, XCircle, CircleDot, Eye, Edit, Download } from 'lucide-react';
import { getStoredItems, saveStoredItems, INITIAL_BOOKINGS } from '../../../lib/storage';
import { exportBookingsReport } from '../../../lib/exportExcel';

const STATUS_CFG: Record<string, { label: string; color: string; icon: any }> = {
  pending:   { label: 'Pending',   color: '#FFB347', icon: CircleDot },
  confirmed: { label: 'Confirmed', color: '#60A5FA', icon: CheckCircle2 },
  on_trip:   { label: 'On Trip',   color: '#4ADE80', icon: Car },
  completed: { label: 'Completed', color: 'rgba(255,255,255,0.4)', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: '#EF4444', icon: XCircle },
};

const TRIP_LABELS: Record<string, string> = { local: 'Local', airport: 'Airport', outstation: 'Outstation', hourly: 'Hourly' };

const GlassCard = ({ children, className = '' }: any) => (
  <div className={`rounded-2xl ${className}`} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
    {children}
  </div>
);

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilter] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Load from localStorage
  useEffect(() => {
    setBookings(getStoredItems('suman_bookings', INITIAL_BOOKINGS));
  }, []);

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchQ = b.customer_name.toLowerCase().includes(q) || b.booking_number.toLowerCase().includes(q) || b.car_name.toLowerCase().includes(q);
    const matchS = filterStatus === 'all' || b.status === filterStatus;
    const matchT = filterType === 'all' || b.trip_type === filterType;
    return matchQ && matchS && matchT;
  });

  const updateStatus = (id: string, status: string) => {
    const updated = bookings.map((b) => b.id === id ? { ...b, status } : b);
    setBookings(updated);
    saveStoredItems('suman_bookings', updated);
  };

  // Summary counts
  const counts = { total: bookings.length, on_trip: bookings.filter((b) => b.status === 'on_trip').length, pending: bookings.filter((b) => b.status === 'pending').length, completed: bookings.filter((b) => b.status === 'completed').length };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Booking Management</h1>
          <p className="text-white/40 text-sm">{bookings.length} total bookings</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => exportBookingsReport(bookings)} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ADE80' }}>
            <Download size={16} />
            <span>Export Excel</span>
          </button>
          <Link href="/admin/bookings/new">
            <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: '#FF6B4A' }}>
              <Plus size={16} />
              <span>New Booking</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total',     value: counts.total,     color: '#a78bfa' },
          { label: 'On Trip',   value: counts.on_trip,   color: '#4ADE80' },
          { label: 'Pending',   value: counts.pending,   color: '#FFB347' },
          { label: 'Completed', value: counts.completed, color: '#60A5FA' },
        ].map((s) => (
          <GlassCard key={s.label} className="px-4 py-3 flex items-center space-x-3">
            <div className="w-2 h-10 rounded-full" style={{ background: s.color }} />
            <div>
              <p className="text-white text-xl font-bold">{s.value}</p>
              <p className="text-white/40 text-xs">{s.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center space-x-2 bg-white/5 rounded-xl px-3 py-2 flex-1 min-w-52">
          <Search size={14} className="text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search booking, customer, car..." className="bg-transparent text-white text-sm flex-1 focus:outline-none placeholder-white/20" />
        </div>
        <div className="flex space-x-1">
          {['all', 'pending', 'confirmed', 'on_trip', 'completed'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{ background: filterStatus === s ? '#FF6B4A' : 'rgba(255,255,255,0.06)', color: filterStatus === s ? '#fff' : 'rgba(255,255,255,0.5)' }}>
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex space-x-1">
          {['all', 'local', 'airport', 'outstation'].map((t) => (
            <button key={t} onClick={() => setFilterType(t)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize" style={{ background: filterType === t ? 'rgba(255,107,74,0.2)' : 'rgba(255,255,255,0.04)', color: filterType === t ? '#FF6B4A' : 'rgba(255,255,255,0.4)', border: filterType === t ? '1px solid rgba(255,107,74,0.3)' : '1px solid transparent' }}>
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Bookings List */}
      <div className="space-y-3">
        {filtered.map((b) => {
          const st = STATUS_CFG[b.status] || STATUS_CFG.pending;
          const pickupDate = new Date(b.pickup_datetime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
          const pickupTime = new Date(b.pickup_datetime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
          return (
            <GlassCard key={b.id} className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Left info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-white font-bold text-sm">{b.booking_number}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ color: st.color, background: `${st.color}18` }}>
                      {st.label}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                      {TRIP_LABELS[b.trip_type]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-white/60">
                    <span className="flex items-center space-x-1"><span className="text-white/30">👤</span><span className="text-white/80 font-medium">{b.customer_name}</span></span>
                    <span className="flex items-center space-x-1"><Car size={11} /><span>{b.car_name}</span></span>
                    <span className="flex items-center space-x-1"><CalendarDays size={11} /><span>{pickupDate} at {pickupTime}</span></span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-white/50">
                    <MapPin size={11} className="text-[#FF6B4A]" />
                    <span>{b.pickup_location}</span>
                    <span className="text-white/20">→</span>
                    <span>{b.drop_location}</span>
                  </div>
                </div>

                {/* Right: price + actions */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-[#FF6B4A] font-bold text-lg">₹ {b.estimated_price.toLocaleString('en-IN')}</p>
                    <p className="text-white/30 text-xs">{b.package_type.replace('_', ' ')}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Link href={`/admin/bookings/${b.id}`}>
                      <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(255,107,74,0.12)', color: '#FF6B4A' }}>
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                    </Link>
                    {b.status === 'confirmed' && (
                      <button onClick={() => updateStatus(b.id, 'on_trip')} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-green-400" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
                        Start Trip
                      </button>
                    )}
                    {b.status === 'on_trip' && (
                      <Link href={`/admin/bookings/${b.id}`}>
                        <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-400" style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}>
                          Track Trip
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/20">
            <CalendarDays size={48} className="mx-auto mb-4 opacity-30" />
            <p>No bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
}
