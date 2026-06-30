'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Car, User, MapPin, Clock, IndianRupee } from 'lucide-react';
import { getStoredItems, saveStoredItems, INITIAL_BOOKINGS, INITIAL_CARS } from '../../../../lib/storage';

const GlassCard = ({ children, className = '' }: any) => (
  <div className={`rounded-2xl p-5 ${className}`} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
    {children}
  </div>
);

const Label = ({ children }: any) => (
  <label className="block text-xs text-white/50 font-semibold uppercase tracking-wide mb-1.5">{children}</label>
);

const Input = ({ ...props }) => (
  <input
    {...props}
    className="w-full px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none transition-colors"
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

export default function NewBookingPage() {
  const router = useRouter();
  const [fleetCars, setFleetCars] = useState<any[]>([]);
  const [form, setForm] = useState({
    customer_name: '', customer_phone: '', customer_email: '', passenger_count: '1',
    car_id: '2', trip_type: 'local', package_type: '12hrs_100km',
    pickup_location: '', drop_location: '',
    pickup_date: '', pickup_time: '', dropoff_date: '', dropoff_time: '',
    special_requests: '', source: 'whatsapp',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadedCars = getStoredItems('suman_fleet', INITIAL_CARS);
    setFleetCars(loadedCars);
    if (loadedCars.length > 0) {
      setForm((prev) => ({ ...prev, car_id: loadedCars[0].id }));
    }
  }, []);

  const set = (f: string) => (e: any) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const selectedCar = fleetCars.find((c) => c.id === form.car_id);
  
  const getEstimatedPrice = () => {
    if (!selectedCar) return 0;
    const pricing = selectedCar.pricing || {};
    
    if (form.package_type === 'airport') {
      return pricing.airport || pricing.price_airport || 0;
    } else if (form.package_type === '8hrs_80km') {
      return pricing.p8 || pricing.price_8hrs_80km || 0;
    } else if (form.package_type === '12hrs_100km') {
      return pricing.p12 || pricing.price_12hrs_100km || 0;
    }
    return 0;
  };

  const estimatedPrice = getEstimatedPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const rand = Math.floor(1000 + Math.random() * 9000);
    const booking_number = `ST-2026-${rand}`;
    
    const newBooking = {
      id: `BK-${Date.now()}`,
      booking_number,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      customer_email: form.customer_email,
      car_name: selectedCar?.name || 'Car',
      vehicle_number: selectedCar?.vehicle_number || 'MH-01-AB-1234',
      trip_type: form.trip_type,
      package_type: form.package_type,
      pickup_location: form.pickup_location,
      drop_location: form.drop_location,
      pickup_datetime: `${form.pickup_date}T${form.pickup_time}:00`,
      expected_dropoff: form.dropoff_date && form.dropoff_time ? `${form.dropoff_date}T${form.dropoff_time}:00` : `${form.pickup_date}T22:00:00`,
      status: 'pending',
      estimated_price: estimatedPrice,
      source: form.source,
      special_requests: form.special_requests
    };

    const bookings = getStoredItems('suman_bookings', INITIAL_BOOKINGS);
    const updated = [...bookings, newBooking];
    saveStoredItems('suman_bookings', updated);

    await new Promise((r) => setTimeout(r, 600));
    router.push('/admin/bookings');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center space-x-4">
        <Link href="/admin/bookings">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <ArrowLeft size={17} />
          </button>
        </Link>
        <div>
          <h1 className="text-white text-2xl font-bold">New Booking</h1>
          <p className="text-white/40 text-sm">Auto-calculates price based on package</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Customer Details */}
        <GlassCard>
          <h2 className="text-white font-semibold mb-4 flex items-center space-x-2"><User size={16} className="text-[#FF6B4A]" /><span>Customer Details</span></h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Full Name *</Label><Input required value={form.customer_name} onChange={set('customer_name')} placeholder="Rahul Sharma" /></div>
            <div><Label>Phone *</Label><Input required type="tel" value={form.customer_phone} onChange={set('customer_phone')} placeholder="+91 98765 43210" /></div>
            <div><Label>Email</Label><Input type="email" value={form.customer_email} onChange={set('customer_email')} placeholder="rahul@example.com" /></div>
            <div>
              <Label>Booking Source</Label>
              <Select value={form.source} onChange={set('source')}>
                <option value="whatsapp">WhatsApp</option>
                <option value="phone">Phone Call</option>
                <option value="website">Website</option>
                <option value="walkin">Walk-in</option>
                <option value="referral">Referral</option>
              </Select>
            </div>
          </div>
        </GlassCard>

        {/* Trip Details */}
        <GlassCard>
          <h2 className="text-white font-semibold mb-4 flex items-center space-x-2"><Car size={16} className="text-[#FF6B4A]" /><span>Trip Details</span></h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Select Car *</Label>
              <Select required value={form.car_id} onChange={set('car_id')}>
                {fleetCars.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.vehicle_number})</option>)}
              </Select>
            </div>
            <div>
              <Label>Trip Type *</Label>
              <Select value={form.trip_type} onChange={set('trip_type')}>
                <option value="local">Local</option>
                <option value="outstation">Outstation</option>
                <option value="airport">Airport Transfer</option>
                <option value="hourly">Hourly Rental</option>
              </Select>
            </div>
            <div>
              <Label>Package</Label>
              <Select value={form.package_type} onChange={set('package_type')}>
                <option value="12hrs_100km">12 Hrs / 100 Km</option>
                <option value="8hrs_80km">8 Hrs / 80 Km</option>
                <option value="airport">Airport (Fixed)</option>
              </Select>
            </div>
          </div>
        </GlassCard>

        {/* Route & Timings */}
        <GlassCard>
          <h2 className="text-white font-semibold mb-4 flex items-center space-x-2"><MapPin size={16} className="text-[#FF6B4A]" /><span>Route & Timings</span></h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Pickup Location *</Label><Input required value={form.pickup_location} onChange={set('pickup_location')} placeholder="Marine Drive, Mumbai" /></div>
            <div><Label>Drop Location</Label><Input value={form.drop_location} onChange={set('drop_location')} placeholder="Lonavala / Airport T2" /></div>
            <div><Label>Pickup Date *</Label><Input required type="date" value={form.pickup_date} onChange={set('pickup_date')} /></div>
            <div><Label>Pickup Time *</Label><Input required type="time" value={form.pickup_time} onChange={set('pickup_time')} /></div>
            <div><Label>Expected Return Date</Label><Input type="date" value={form.dropoff_date} onChange={set('dropoff_date')} /></div>
            <div><Label>Expected Return Time</Label><Input type="time" value={form.dropoff_time} onChange={set('dropoff_time')} /></div>
          </div>
          <div className="mt-4">
            <Label>Special Requests</Label>
            <textarea
              value={form.special_requests}
              onChange={(e) => setForm((f) => ({ ...f, special_requests: e.target.value }))}
              rows={2}
              placeholder="Any special requirements..."
              className="w-full px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
        </GlassCard>

        {/* Estimated Price */}
        {selectedCar && estimatedPrice > 0 && (
          <div className="rounded-2xl p-5 flex items-center justify-between" style={{ background: 'rgba(255,107,74,0.08)', border: '1px solid rgba(255,107,74,0.2)' }}>
            <div className="flex items-center space-x-3">
              <IndianRupee size={20} className="text-[#FF6B4A]" />
              <div>
                <p className="text-white font-bold text-sm">Auto-Estimated Price</p>
                <p className="text-white/50 text-xs">{selectedCar.name} · {form.package_type.replace('_', ' ')}</p>
              </div>
            </div>
            <p className="text-[#FF6B4A] font-bold text-2xl">₹ {estimatedPrice.toLocaleString('en-IN')}</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex space-x-3">
          <button type="submit" disabled={saving} className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-bold disabled:opacity-50" style={{ background: '#FF6B4A' }}>
            <Save size={16} />
            <span>{saving ? 'Creating...' : 'Create Booking'}</span>
          </button>
          <Link href="/admin/bookings">
            <button type="button" className="px-6 py-3 rounded-xl text-white/50 font-medium" style={{ background: 'rgba(255,255,255,0.05)' }}>Cancel</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
