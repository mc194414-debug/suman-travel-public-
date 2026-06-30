'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Car, Trash2 } from 'lucide-react';
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

export default function EditCarPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState({
    name: '', category: 'Premium', vehicle_number: '', year: '',
    seating: '4', fuel_type: 'Petrol', odometer: '0', status: 'available', notes: '',
    photo: '/assets/innova_crysta.png',
  });
  
  const [pricing, setPricing] = useState({
    price_12hrs_100km: '', price_8hrs_80km: '', price_airport: '',
    extra_hour_rate: '', extra_km_rate: '', driver_night_charge: '200',
    night_charge_start: '23:00', toll_policy: 'actual', parking_policy: 'actual',
  });

  const [saving, setSaving] = useState(false);

  const set = (field: string) => (e: any) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setP = (field: string) => (e: any) => setPricing((p) => ({ ...p, [field]: e.target.value }));

  // Load car data
  useEffect(() => {
    const fleet = getStoredItems('suman_fleet', INITIAL_CARS);
    const car = fleet.find((c) => c.id === id);
    if (car) {
      setForm({
        name: car.name || '',
        category: car.category || 'Premium',
        vehicle_number: car.vehicle_number || '',
        year: String(car.year || 2023),
        seating: String(car.seating || 7),
        fuel_type: car.fuel || 'Petrol',
        odometer: String(car.odometer || 0),
        status: car.status || 'available',
        notes: car.notes || '',
        photo: car.photo || '/assets/innova_crysta.png',
      });
      setPricing({
        price_12hrs_100km: String(car.pricing?.p12 || ''),
        price_8hrs_80km: String(car.pricing?.p8 || ''),
        price_airport: String(car.pricing?.airport || ''),
        extra_hour_rate: String(car.pricing?.ehr || ''),
        extra_km_rate: String(car.pricing?.ekm || ''),
        driver_night_charge: String(car.pricing?.driver_night_charge || '200'),
        night_charge_start: car.pricing?.night_charge_start || '23:00',
        toll_policy: car.pricing?.toll_policy || 'actual',
        parking_policy: car.pricing?.parking_policy || 'actual',
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const fleet = getStoredItems('suman_fleet', INITIAL_CARS);
    const updated = fleet.map((car) => {
      if (car.id === id) {
        return {
          ...car,
          name: form.name,
          category: form.category,
          vehicle_number: form.vehicle_number,
          year: parseInt(form.year) || 2023,
          seating: parseInt(form.seating) || 7,
          fuel: form.fuel_type,
          odometer: parseInt(form.odometer) || 0,
          status: form.status,
          notes: form.notes,
          photo: form.photo,
          pricing: {
            p12: parseFloat(pricing.price_12hrs_100km) || 0,
            p8: parseFloat(pricing.price_8hrs_80km) || 0,
            airport: parseFloat(pricing.price_airport) || 0,
            ehr: parseFloat(pricing.extra_hour_rate) || 0,
            ekm: parseFloat(pricing.extra_km_rate) || 0,
            driver_night_charge: parseFloat(pricing.driver_night_charge) || 200,
            night_charge_start: pricing.night_charge_start,
            toll_policy: pricing.toll_policy,
            parking_policy: pricing.parking_policy,
          }
        };
      }
      return car;
    });

    saveStoredItems('suman_fleet', updated);

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
          <h1 className="text-white text-2xl font-bold">Edit Car Details</h1>
          <p className="text-white/40 text-sm">Update specifications and rates</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
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
            <div className="col-span-2">
              <Label>Photo URL</Label>
              <Input value={form.photo} onChange={set('photo')} placeholder="/assets/innova_crysta.png" />
            </div>
          </div>
          <div className="mt-4">
            <Label>Notes / Description</Label>
            <textarea
              value={form.notes}
              onChange={set('notes')}
              rows={3}
              placeholder="e.g. Assigned to driver Rajesh, regular inspection done..."
              className="w-full px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
        </GlassCard>

        {/* Pricing Info */}
        <GlassCard>
          <h2 className="text-white font-semibold mb-5 flex items-center space-x-2"><span>₹</span><span>Pricing Packages (INR)</span></h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <PriceInput label="12 Hrs / 100 Km Rate *" required value={pricing.price_12hrs_100km} onChange={setP('price_12hrs_100km')} />
            <PriceInput label="8 Hrs / 80 Km Rate *" required value={pricing.price_8hrs_80km} onChange={setP('price_8hrs_80km')} />
            <PriceInput label="Airport Pick & Drop Rate" value={pricing.price_airport} onChange={setP('price_airport')} note="0 if not applicable" />
            <PriceInput label="Extra Hour Rate (per hr) *" required value={pricing.extra_hour_rate} onChange={setP('extra_hour_rate')} />
            <PriceInput label="Extra Km Rate (per km) *" required value={pricing.extra_km_rate} onChange={setP('extra_km_rate')} />
            <PriceInput label="Driver Night Charge *" required value={pricing.driver_night_charge} onChange={setP('driver_night_charge')} />
            
            <div>
              <Label>Night Charge Start Time</Label>
              <Input type="time" value={pricing.night_charge_start} onChange={(e: any) => setPricing({ ...pricing, night_charge_start: e.target.value })} />
            </div>
            <div>
              <Label>Toll Policy</Label>
              <Select value={pricing.toll_policy} onChange={(e: any) => setPricing({ ...pricing, toll_policy: e.target.value })}>
                <option value="actual">Charged at actuals</option>
                <option value="included">Included in package</option>
              </Select>
            </div>
            <div>
              <Label>Parking Policy</Label>
              <Select value={pricing.parking_policy} onChange={(e: any) => setPricing({ ...pricing, parking_policy: e.target.value })}>
                <option value="actual">Charged at actuals</option>
                <option value="included">Included in package</option>
              </Select>
            </div>
          </div>
        </GlassCard>

        {/* Save/Cancel buttons */}
        <div className="flex space-x-3">
          <button type="submit" disabled={saving} className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-bold disabled:opacity-50" style={{ background: '#FF6B4A' }}>
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
          <Link href="/admin/fleet">
            <button type="button" className="px-6 py-3 rounded-xl text-white/50 font-medium" style={{ background: 'rgba(255,255,255,0.05)' }}>Cancel</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
