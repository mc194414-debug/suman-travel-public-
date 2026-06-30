'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Grid3X3, List, Edit, Trash2, Car, CheckCircle2, AlertTriangle, Wrench, Search, Download } from 'lucide-react';
import { getStoredItems, saveStoredItems, INITIAL_CARS } from '../../../lib/storage';
import { exportFleetReport } from '../../../lib/exportExcel';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  available:   { label: 'Available',   color: '#4ADE80', icon: CheckCircle2 },
  on_trip:     { label: 'On Trip',     color: '#60A5FA', icon: Car },
  maintenance: { label: 'Maintenance', color: '#FFB347', icon: Wrench },
  retired:     { label: 'Retired',     color: '#EF4444', icon: AlertTriangle },
};

const GlassCard = ({ children, className = '' }: any) => (
  <div className={`rounded-2xl ${className}`} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
    {children}
  </div>
);

export default function FleetPage() {
  const [cars, setCars]         = useState<any[]>([]);
  const [view, setView]         = useState<'grid' | 'table'>('grid');
  const [search, setSearch]     = useState('');
  const [filterStatus, setFilt] = useState('all');
  const [editPricing, setEP]    = useState<string | null>(null);
  const [pricingEdit, setPE]    = useState<any>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    setCars(getStoredItems('suman_fleet', INITIAL_CARS));
  }, []);

  const filtered = cars.filter((c) => {
    const q = search.toLowerCase();
    const matchQ = c.name.toLowerCase().includes(q) || c.vehicle_number.toLowerCase().includes(q);
    const matchS = filterStatus === 'all' || c.status === filterStatus;
    return matchQ && matchS;
  });

  const deleteCar = (id: string) => {
    if (confirmDeleteId === id) {
      const updated = cars.filter((c) => c.id !== id);
      setCars(updated);
      saveStoredItems('suman_fleet', updated);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  const startEditPricing = (car: any) => {
    setEP(car.id);
    setPE({ ...car.pricing });
  };

  const savePricing = (id: string) => {
    const updated = cars.map((c) => c.id === id ? { ...c, pricing: { ...pricingEdit } } : c);
    setCars(updated);
    saveStoredItems('suman_fleet', updated);
    setEP(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-white text-xl sm:text-2xl font-bold">Fleet Management</h1>
          <p className="text-white/40 text-sm">{cars.length} vehicles in fleet</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => exportFleetReport(cars)} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ADE80' }}>
            <Download size={16} />
            <span>Export Excel</span>
          </button>
          <Link href="/admin/fleet/new">
            <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold w-full sm:w-auto justify-center" style={{ background: '#FF6B4A' }}>
              <Plus size={16} />
              <span>Add New Car</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="p-3 sm:p-4 flex flex-wrap gap-2 sm:gap-3 items-center">
        <div className="flex items-center space-x-2 bg-white/5 rounded-xl px-3 py-2 w-full sm:flex-1 sm:min-w-52">
          <Search size={14} className="text-white/30 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or number..."
            className="bg-transparent text-white text-sm flex-1 focus:outline-none placeholder-white/20 min-w-0"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {['all', 'available', 'on_trip', 'maintenance'].map((s) => (
            <button
              key={s}
              onClick={() => setFilt(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize"
              style={{
                background: filterStatus === s ? '#FF6B4A' : 'rgba(255,255,255,0.06)',
                color: filterStatus === s ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
        {/* Grid/Table toggle — hidden on mobile */}
        <div className="hidden sm:flex space-x-1 border border-white/10 rounded-xl p-1">
          <button onClick={() => setView('grid')} className="p-1.5 rounded-lg transition-colors" style={{ background: view === 'grid' ? '#FF6B4A' : 'transparent' }}>
            <Grid3X3 size={15} className={view === 'grid' ? 'text-white' : 'text-white/40'} />
          </button>
          <button onClick={() => setView('table')} className="p-1.5 rounded-lg transition-colors" style={{ background: view === 'table' ? '#FF6B4A' : 'transparent' }}>
            <List size={15} className={view === 'table' ? 'text-white' : 'text-white/40'} />
          </button>
        </div>
      </GlassCard>

      {/* Grid View */}
      {(view === 'grid' || typeof window !== 'undefined') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((car) => {
            const st = STATUS_CONFIG[car.status];
            return (
              <GlassCard key={car.id} className="overflow-hidden">
                {/* Car photo */}
                <div
                  className="h-44 flex items-center justify-center overflow-hidden relative"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <img
                    src={car.photo}
                    alt={car.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <Car size={56} className="text-white/10 hidden absolute" />
                  {/* Status badge overlay */}
                  <span
                    className="absolute top-3 right-3 flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{ color: st.color, background: `rgba(0,0,0,0.65)`, border: `1px solid ${st.color}40`, backdropFilter: 'blur(8px)' }}
                  >
                    <st.icon size={10} />
                    <span>{st.label}</span>
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-white font-bold text-sm">{car.name}</h3>
                    <p className="text-white/40 text-xs">{car.vehicle_number} · {car.category}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { l: 'Seats', v: car.seating },
                      { l: 'Fuel', v: car.fuel.slice(0, 3) },
                      { l: 'Odo (km)', v: `${(car.odometer / 1000).toFixed(0)}k` },
                    ].map((s) => (
                      <div key={s.l} className="rounded-lg py-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <p className="text-white font-bold text-sm">{s.v}</p>
                        <p className="text-white/30 text-[10px]">{s.l}</p>
                      </div>
                    ))}
                  </div>

                  {/* Pricing — inline editor or display */}
                  {editPricing === car.id ? (
                    <div className="space-y-2 text-xs">
                      {[
                        { label: '12H/100Km (₹)', key: 'p12' },
                        { label: '8H/80Km (₹)',   key: 'p8' },
                        { label: 'Airport (₹)',    key: 'airport' },
                        { label: 'Extra Hr (₹)',   key: 'ehr' },
                        { label: 'Extra Km (₹)',   key: 'ekm' },
                      ].map(({ label, key }) => (
                        <div key={key} className="flex items-center justify-between gap-2">
                          <span className="text-white/50 shrink-0">{label}</span>
                          <input
                            type="number"
                            value={pricingEdit[key] || ''}
                            onChange={(e) => setPE((p: any) => ({ ...p, [key]: parseFloat(e.target.value) || 0 }))}
                            className="w-24 bg-white/10 border border-white/10 text-white text-right px-2 py-1 rounded-lg focus:outline-none focus:border-[#FF6B4A] text-xs"
                          />
                        </div>
                      ))}
                      <div className="flex space-x-2 pt-1">
                        <button onClick={() => savePricing(car.id)} className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: '#4ADE80' }}>Save</button>
                        <button onClick={() => setEP(null)} className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white/60" style={{ background: 'rgba(255,255,255,0.06)' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-white/50 space-y-0.5">
                      <div className="flex justify-between"><span>12H/100Km</span><span className="text-white/80 font-semibold">₹ {car.pricing.p12.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between"><span>8H/80Km</span><span className="text-white/80">₹ {car.pricing.p8.toLocaleString('en-IN')}</span></div>
                      {car.pricing.airport > 0 && <div className="flex justify-between"><span>Airport</span><span className="text-white/80">₹ {car.pricing.airport.toLocaleString('en-IN')}</span></div>}
                      <div className="flex justify-between text-white/30"><span>Extra Hr/Km</span><span>₹{car.pricing.ehr}/hr · ₹{car.pricing.ekm}/km</span></div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2 pt-1">
                    <button
                      onClick={() => editPricing === car.id ? setEP(null) : startEditPricing(car)}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold transition-colors"
                      style={{ background: 'rgba(255,107,74,0.12)', color: '#FF6B4A' }}
                    >
                      {editPricing === car.id ? 'Cancel' : 'Edit Pricing'}
                    </button>
                    <Link href={`/admin/fleet/${car.id}`}>
                      <button className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <Edit size={13} className="text-white/60" />
                      </button>
                    </Link>
                    <button
                       onClick={() => deleteCar(car.id)}
                       className="flex items-center justify-center px-2 h-9 rounded-lg transition-colors border text-xs"
                       style={{
                         background: confirmDeleteId === car.id ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)',
                         borderColor: confirmDeleteId === car.id ? '#EF4444' : 'transparent',
                         color: confirmDeleteId === car.id ? '#EF4444' : 'rgba(255,255,255,0.4)',
                       }}
                     >
                       {confirmDeleteId === car.id ? 'Confirm?' : <Trash2 size={13} />}
                     </button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Table View — only on desktop */}
      {view === 'table' && (
        <GlassCard className="overflow-x-auto hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Photo', 'Car', 'Vehicle No.', 'Category', 'Seats', 'Odometer', '12H Rate', '8H Rate', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-white/40 text-xs font-semibold uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((car) => {
                const st = STATUS_CONFIG[car.status];
                return (
                  <tr key={car.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <img src={car.photo} alt={car.name} className="w-16 h-10 object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </td>
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{car.name}</td>
                    <td className="px-4 py-3 text-white/60 font-mono text-xs">{car.vehicle_number}</td>
                    <td className="px-4 py-3 text-white/60">{car.category}</td>
                    <td className="px-4 py-3 text-white/60">{car.seating}</td>
                    <td className="px-4 py-3 text-white/60">{car.odometer.toLocaleString('en-IN')} km</td>
                    <td className="px-4 py-3 text-white/80">₹ {car.pricing.p12.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-white/80">₹ {car.pricing.p8.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: st.color, background: `${st.color}18` }}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => startEditPricing(car)} className="text-xs text-[#FF6B4A] hover:underline">Pricing</button>
                        <Link href={`/admin/fleet/${car.id}`}><Edit size={14} className="text-white/40 hover:text-[#FF6B4A] transition-colors" /></Link>
                        <button
                           onClick={() => deleteCar(car.id)}
                           className="text-xs transition-colors"
                           style={{ color: confirmDeleteId === car.id ? '#EF4444' : 'rgba(255,255,255,0.4)' }}
                         >
                           {confirmDeleteId === car.id ? 'Confirm?' : 'Delete'}
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GlassCard>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/20">
          <Car size={48} className="mx-auto mb-4 opacity-30" />
          <p>No cars found</p>
        </div>
      )}
    </div>
  );
}
