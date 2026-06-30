'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Plus, X, Car, Save } from 'lucide-react';
import Link from 'next/link';
import { getStoredItems, saveStoredItems, INITIAL_CARS } from '../../../../lib/storage';

const CATEGORIES = ['Premium', 'Executive', 'Small', 'Luxury', 'SUV', 'MUV'];
const FUEL_TYPES  = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const STATUSES    = ['available', 'on_trip', 'maintenance', 'retired'];

const GlassCard = ({ children, className = '' }: any) => (
  <div className={`rounded-2xl p-6 ${className}`} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
    {children}
  </div>
);

const Label = ({ children }: any) => (
  <label className="block text-xs text-white/50 font-semibold uppercase tracking-wide mb-1.5">{children}</label>
);

const Input = ({ ...props }) => (
  <input
    {...props}
    className="w-full px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF6B4A] transition-colors"
    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
  />
);

const Select = ({ children, ...props }: any) => (
  <select
    {...props}
    className="w-full px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none appearance-none bg-[#111827] border border-white/10"
  >
    {children}
  </select>
);

const PriceInput = ({ label, note, ...props }: any) => (
  <div>
    <Label>{label}</Label>
    {note && <p className="text-white/25 text-xs mb-1">{note}</p>}
    <div className="relative">
      <span className="absolute left-3 top-2.5 text-[#FF6B4A] text-sm">₹</span>
      <Input type="number" min="0" step="50" className="pl-7" {...props} />
    </div>
  </div>
);

export default function NewCarPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', category: 'Premium', vehicle_number: '', year: '',
    seating: '4', fuel_type: 'Petrol', odometer: '0', status: 'available', notes: '',
  });
  const [pricing, setPricing] = useState({
    price_12hrs_100km: '', price_8hrs_80km: '', price_airport: '',
    extra_hour_rate: '', extra_km_rate: '', driver_night_charge: '200',
    night_charge_start: '23:00', toll_policy: 'actual', parking_policy: 'actual',
    enable_usd: false,
  });
  const [features, setFeatures] = useState<string[]>(['AC']);
  const [newFeature, setNewFeature] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (field: string) => (e: any) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setP = (field: string) => (e: any) => setPricing((p) => ({ ...p, [field]: e.target.value }));

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures((f) => [...f, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const newCar = {
      id: `CAR-${Date.now()}`,
      name: form.name,
      category: form.category,
      vehicle_number: form.vehicle_number,
      seating: parseInt(form.seating) || 4,
      fuel: form.fuel_type,
      odometer: parseInt(form.odometer) || 0,
      status: form.status,
      photo: '/assets/innova_crysta.png', // Default premium photo fallback
      pricing: {
        p12: parseFloat(pricing.price_12hrs_100km) || 0,
        p8: parseFloat(pricing.price_8hrs_80km) || 0,
        airport: parseFloat(pricing.price_airport) || 0,
        ehr: parseFloat(pricing.extra_hour_rate) || 0,
        ekm: parseFloat(pricing.extra_km_rate) || 0,
      }
    };

    const currentFleet = getStoredItems('suman_fleet', INITIAL_CARS);
    const updatedFleet = [...currentFleet, newCar];
    saveStoredItems('suman_fleet', updatedFleet);

    await new Promise((r) => setTimeout(r, 600));
    router.push('/admin/fleet');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/fleet">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <ArrowLeft size={17} />
          </button>
        </Link>
        <div>
          <h1 className="text-white text-2xl font-bold">Add New Car</h1>
          <p className="text-white/40 text-sm">Fill in car details and pricing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Basic Info ─────────────────────────────────────── */}
        <GlassCard>
          <h2 className="text-white font-semibold mb-5 flex items-center space-x-2"><Car size={16} className="text-[#FF6B4A]" /><span>Vehicle Details</span></h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Car Name *</Label>
              <Input required value={form.name} onChange={set('name')} placeholder="e.g., Toyota Innova Crysta" />
            </div>
            <div>
              <Label>Vehicle Number *</Label>
              <Input required value={form.vehicle_number} onChange={set('vehicle_number')} placeholder="MH-01-AB-1234" />
            </div>
            <div>
              <Label>Category *</Label>
              <Select value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <Label>Fuel Type</Label>
              <Select value={form.fuel_type} onChange={set('fuel_type')}>
                {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
              </Select>
            </div>
            <div>
              <Label>Year of Manufacture</Label>
              <Input type="number" min="2000" max="2030" value={form.year} onChange={set('year')} placeholder="2023" />
            </div>
            <div>
              <Label>Seating Capacity</Label>
              <Select value={form.seating} onChange={set('seating')}>
                {[4, 5, 6, 7, 8, 9, 12].map((n) => <option key={n} value={n}>{n} Seats</option>)}
              </Select>
            </div>
            <div>
              <Label>Current Odometer (km)</Label>
              <Input type="number" min="0" value={form.odometer} onChange={set('odometer')} placeholder="0" />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onChange={set('status')}>
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Label>Notes / Description</Label>
            <textarea
              value={form.notes}
              onChange={set('notes')}
              rows={2}
              placeholder="Any additional notes..."
              className="w-full px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
        </GlassCard>

        {/* ── Features ───────────────────────────────────────── */}
        <GlassCard>
          <h2 className="text-white font-semibold mb-4">Car Features</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {features.map((f) => (
              <span key={f} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs text-[#FF6B4A]" style={{ background: 'rgba(255,107,74,0.1)', border: '1px solid rgba(255,107,74,0.2)' }}>
                <span>{f}</span>
                <button type="button" onClick={() => setFeatures((fs) => fs.filter((x) => x !== f))}>
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input value={newFeature} onChange={(e: any) => setNewFeature(e.target.value)} placeholder="Add feature (e.g., GPS, Leather Seats)" onKeyDown={(e: any) => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
            <button type="button" onClick={addFeature} className="px-3 py-2 rounded-xl text-white" style={{ background: '#FF6B4A' }}><Plus size={16} /></button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['AC', 'GPS', 'Leather Seats', 'Music System', 'WiFi', 'Charging Port', 'First Aid Kit'].map((f) => (
              !features.includes(f) && (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFeatures((fs) => [...fs, f])}
                  className="px-2.5 py-1 rounded-full text-xs text-white/40 hover:text-white/70 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  + {f}
                </button>
              )
            ))}
          </div>
        </GlassCard>

        {/* ── Pricing ────────────────────────────────────────── */}
        <GlassCard>
          <h2 className="text-white font-semibold mb-5">
            Pricing Configuration
            <span className="ml-2 text-xs text-white/30 font-normal">(Client editable anytime)</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <PriceInput label="12 Hrs / 100 Km" value={pricing.price_12hrs_100km} onChange={setP('price_12hrs_100km')} placeholder="6000" />
            <PriceInput label="8 Hrs / 80 Km" value={pricing.price_8hrs_80km} onChange={setP('price_8hrs_80km')} placeholder="4500" />
            <PriceInput label="Airport Pickup & Drop" value={pricing.price_airport} onChange={setP('price_airport')} placeholder="2200" />
            <PriceInput label="Extra Hour Rate" note="Per extra hour beyond package" value={pricing.extra_hour_rate} onChange={setP('extra_hour_rate')} placeholder="300" />
            <PriceInput label="Extra Km Rate" note="Per extra km beyond package" value={pricing.extra_km_rate} onChange={setP('extra_km_rate')} placeholder="30" />
            <PriceInput label="Driver Night Charge" note="Applied after night time" value={pricing.driver_night_charge} onChange={setP('driver_night_charge')} placeholder="200" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            <div>
              <Label>Night Charge Starts At</Label>
              <Input type="time" value={pricing.night_charge_start} onChange={setP('night_charge_start')} />
            </div>
            <div>
              <Label>Toll Policy</Label>
              <Select value={pricing.toll_policy} onChange={setP('toll_policy')}>
                <option value="actual">As Actual (customer pays)</option>
                <option value="included">Included in price</option>
              </Select>
            </div>
            <div>
              <Label>Parking Policy</Label>
              <Select value={pricing.parking_policy} onChange={setP('parking_policy')}>
                <option value="actual">As Actual (customer pays)</option>
                <option value="included">Included in price</option>
              </Select>
            </div>
          </div>

          {/* USD Pricing toggle */}
          <div className="mt-5 flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setPricing((p) => ({ ...p, enable_usd: !p.enable_usd }))}
              className="relative w-11 h-6 rounded-full transition-colors"
              style={{ background: pricing.enable_usd ? '#FF6B4A' : 'rgba(255,255,255,0.1)' }}
            >
              <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" style={{ transform: pricing.enable_usd ? 'translateX(20px)' : 'translateX(0)' }} />
            </button>
            <span className="text-white/60 text-sm">Enable USD pricing for international guests</span>
          </div>
        </GlassCard>

        {/* ── Photo Upload ───────────────────────────────────── */}
        <GlassCard>
          <h2 className="text-white font-semibold mb-4">Car Photos</h2>
          <div
            className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-12 cursor-pointer transition-colors hover:border-[#FF6B4A]/50"
            style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}
          >
            <Upload size={32} className="text-white/20 mb-3" />
            <p className="text-white/50 text-sm">Drag & drop photos or click to upload</p>
            <p className="text-white/25 text-xs mt-1">PNG, JPG up to 10MB each</p>
          </div>
        </GlassCard>

        {/* Submit */}
        <div className="flex items-center space-x-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-bold transition-all disabled:opacity-50"
            style={{ background: '#FF6B4A' }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Add Car to Fleet'}</span>
          </button>
          <Link href="/admin/fleet">
            <button type="button" className="px-6 py-3 rounded-xl text-white/50 font-medium transition-colors hover:text-white" style={{ background: 'rgba(255,255,255,0.05)' }}>Cancel</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
