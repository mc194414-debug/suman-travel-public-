'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Car, User, MapPin, Clock, CheckCircle2, FileText, XCircle, Phone, Navigation, X, Edit2 } from 'lucide-react';
import { calculateBill, formatINR, CarPricing } from '../../../../lib/billing';
import { getStoredItems, saveStoredItems, INITIAL_BOOKINGS, INITIAL_CARS, INITIAL_BILLS } from '../../../../lib/storage';

const MOCK_PRICING: CarPricing = {
  price_12hrs_100km: 5000, price_8hrs_80km: 3800, price_airport: 2200,
  extra_hour_rate: 250, extra_km_rate: 23, driver_night_charge: 200,
  night_charge_start: '23:00', toll_policy: 'actual', parking_policy: 'actual',
};

const STATUS_FLOW: Record<string, string[]> = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['on_trip', 'cancelled'],
  on_trip:   ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const TRIP_LABELS: Record<string, string> = { local: 'Local', airport: 'Airport', outstation: 'Outstation', hourly: 'Hourly' };

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

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [fleetCars, setFleetCars] = useState<any[]>([]);

  // Completion Form State
  const [odoEnd, setOdoEnd] = useState('');
  const [endTime, setEndTime] = useState('');
  const [toll, setToll] = useState('');
  const [parking, setParking] = useState('');
  const [other, setOther] = useState('');
  const [otherDesc, setOtherDesc] = useState('');
  const [nightCharge, setNightCharge] = useState(false);
  const [bill, setBill] = useState<any>(null);
  const [completing, setCompleting] = useState(false);

  // Edit Booking Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    pickup_location: '',
    drop_location: '',
    pickup_date: '',
    pickup_time: '',
    dropoff_date: '',
    dropoff_time: '',
    trip_type: 'local',
    package_type: '12hrs_100km',
    estimated_price: '0',
    special_requests: '',
    car_name: '',
    vehicle_number: '',
  });

  // Load booking, fleet, and check for existing bill
  useEffect(() => {
    const list = getStoredItems('suman_bookings', INITIAL_BOOKINGS);
    const found = list.find((b) => b.id === id || b.booking_number === id);
    if (found) {
      setBooking(found);
    }

    const carsList = getStoredItems('suman_fleet', INITIAL_CARS);
    setFleetCars(carsList);

    const billsList = getStoredItems('suman_billing', INITIAL_BILLS);
    const existingBill = billsList.find((b) => b.id === id || b.booking_number === found?.booking_number);
    if (existingBill) {
      setBill(existingBill);
    }
  }, [id]);

  if (!booking) {
    return <div className="text-center py-20 text-white/50">Loading booking details...</div>;
  }

  const handleComplete = () => {
    if (!odoEnd || !endTime) { alert('Enter odometer end reading and actual end time'); return; }
    setCompleting(true);

    const pickupDt = new Date(booking.pickup_datetime);
    const dateStr = booking.pickup_datetime.split('T')[0];
    const dropDt   = new Date(`${dateStr}T${endTime}:00`);

    // Retrieve pricing for this specific car from fleet list if available
    const carDetails = fleetCars.find((c) => c.name === booking.car_name);
    const carPricing: CarPricing = carDetails?.pricing ? {
      price_12hrs_100km: carDetails.pricing.p12 || 5000,
      price_8hrs_80km: carDetails.pricing.p8 || 3800,
      price_airport: carDetails.pricing.airport || 2200,
      extra_hour_rate: carDetails.pricing.ehr || 250,
      extra_km_rate: carDetails.pricing.ekm || 23,
      driver_night_charge: carDetails.pricing.driver_night_charge || 200,
      night_charge_start: carDetails.pricing.night_charge_start || '23:00',
      toll_policy: carDetails.pricing.toll_policy || 'actual',
      parking_policy: carDetails.pricing.parking_policy || 'actual',
    } : MOCK_PRICING;

    const result = calculateBill(carPricing, {
      packageType: booking.package_type as any,
      pickupDatetime: pickupDt,
      actualDropoff: dropDt,
      odometerStart: booking.odometer_start,
      odometerEnd: parseInt(odoEnd),
      tollAmount: parseFloat(toll) || 0,
      parkingAmount: parseFloat(parking) || 0,
      nightChargeApplied: nightCharge,
      otherCharges: parseFloat(other) || 0,
      otherDescription: otherDesc,
    });

    // Update Booking status
    const updatedBooking = { ...booking, status: 'completed', odometer_end: parseInt(odoEnd), actual_dropoff: dropDt.toISOString() };
    setBooking(updatedBooking);
    const bookings = getStoredItems('suman_bookings', INITIAL_BOOKINGS);
    const updatedBookings = bookings.map((b) => b.id === booking.id ? updatedBooking : b);
    saveStoredItems('suman_bookings', updatedBookings);

    // Save Generated Bill to Invoices
    const bills = getStoredItems('suman_billing', INITIAL_BILLS);
    const newBill = {
      id: booking.id,
      bill_number: `INV-${booking.booking_number.split('-')[2] || 'NEW'}`,
      booking_number: booking.booking_number,
      customer_name: booking.customer_name,
      customer_phone: booking.customer_phone,
      car_name: booking.car_name,
      vehicle_number: booking.vehicle_number,
      pickup_location: booking.pickup_location,
      drop_location: booking.drop_location,
      pickup_datetime: booking.pickup_datetime,
      actual_dropoff: dropDt.toISOString(),
      odometer_start: booking.odometer_start,
      odometer_end: parseInt(odoEnd),
      packageLabel: result.packageLabel,
      packageAmount: result.packageAmount,
      actualHours: result.actualHours,
      packageHours: result.packageHours,
      extraHours: result.extraHours,
      extraHoursRate: carPricing.extra_hour_rate,
      extraHoursAmount: result.extraHoursAmount,
      actualKm: result.actualKm,
      packageKm: result.packageKm,
      extraKm: result.extraKm,
      extraKmRate: carPricing.extra_km_rate,
      extraKmAmount: result.extraKmAmount,
      nightChargeAmount: result.nightChargeAmount,
      tollAmount: result.tollAmount,
      toll_description: 'Toll Charges',
      parkingAmount: result.parkingAmount,
      otherCharges: result.otherCharges,
      otherDescription: result.otherDescription,
      discountAmount: result.discountAmount,
      discountReason: result.discountReason,
      gstRate: result.gstRate,
      gstAmount: result.gstAmount,
      totalAmount: result.totalAmount,
      amountPaid: 0,
      balanceDue: result.totalAmount,
      status: 'draft',
      created_at: new Date().toISOString().split('T')[0],
      usd_rate: 83.5
    };
    
    const updatedBills = [...bills.filter((b) => b.id !== booking.id), newBill];
    saveStoredItems('suman_billing', updatedBills);
    setBill(newBill);
    setCompleting(false);
  };

  const updateStatus = (status: string) => {
    const bookings = getStoredItems('suman_bookings', INITIAL_BOOKINGS);
    const updated = bookings.map((b) => b.id === booking.id ? { ...b, status } : b);
    saveStoredItems('suman_bookings', updated);
    setBooking((b: any) => ({ ...b, status }));
  };

  const handleOpenEdit = () => {
    const pDate = booking.pickup_datetime.split('T')[0];
    const pTime = booking.pickup_datetime.split('T')[1]?.slice(0, 5) || '10:00';
    const dDate = booking.expected_dropoff?.split('T')[0] || '';
    const dTime = booking.expected_dropoff?.split('T')[1]?.slice(0, 5) || '22:00';

    setEditForm({
      customer_name: booking.customer_name,
      customer_phone: booking.customer_phone,
      customer_email: booking.customer_email || '',
      pickup_location: booking.pickup_location,
      drop_location: booking.drop_location || '',
      pickup_date: pDate,
      pickup_time: pTime,
      dropoff_date: dDate,
      dropoff_time: dTime,
      trip_type: booking.trip_type || 'local',
      package_type: booking.package_type || '12hrs_100km',
      estimated_price: String(booking.estimated_price || 0),
      special_requests: booking.special_requests || '',
      car_name: booking.car_name,
      vehicle_number: booking.vehicle_number || '',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const carDetails = fleetCars.find((c) => c.name === editForm.car_name);
    
    const updatedBooking = {
      ...booking,
      customer_name: editForm.customer_name,
      customer_phone: editForm.customer_phone,
      customer_email: editForm.customer_email,
      pickup_location: editForm.pickup_location,
      drop_location: editForm.drop_location,
      pickup_datetime: `${editForm.pickup_date}T${editForm.pickup_time}:00`,
      expected_dropoff: editForm.dropoff_date && editForm.dropoff_time ? `${editForm.dropoff_date}T${editForm.dropoff_time}:00` : `${editForm.pickup_date}T22:00:00`,
      trip_type: editForm.trip_type,
      package_type: editForm.package_type,
      estimated_price: parseFloat(editForm.estimated_price) || 0,
      special_requests: editForm.special_requests,
      car_name: editForm.car_name,
      vehicle_number: carDetails?.vehicle_number || editForm.vehicle_number,
    };

    setBooking(updatedBooking);
    const bookings = getStoredItems('suman_bookings', INITIAL_BOOKINGS);
    const updated = bookings.map((b) => b.id === booking.id ? updatedBooking : b);
    saveStoredItems('suman_bookings', updated);
    setShowEditModal(false);
  };

  const statusColor: Record<string, string> = {
    pending: '#FFB347', confirmed: '#60A5FA', on_trip: '#4ADE80', completed: '#a78bfa', cancelled: '#EF4444',
  };

  const pickupDate = new Date(booking.pickup_datetime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const pickupTime = new Date(booking.pickup_datetime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/admin/bookings">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <ArrowLeft size={17} />
            </button>
          </Link>
          <div>
            <h1 className="text-white text-xl font-bold">{booking.booking_number}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ color: statusColor[booking.status], background: `${statusColor[booking.status]}18` }}>
              {booking.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
        {/* Status actions */}
        <div className="flex flex-wrap gap-2">
          <button onClick={handleOpenEdit} className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white flex items-center space-x-1.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Edit2 size={12} /><span>Edit Booking</span>
          </button>
          {STATUS_FLOW[booking.status]?.map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: s === 'cancelled' ? 'rgba(239,68,68,0.1)' : s === 'confirmed' ? 'rgba(96,165,250,0.1)' : s === 'on_trip' ? 'rgba(74,222,128,0.1)' : 'rgba(167,139,250,0.1)',
                color: s === 'cancelled' ? '#EF4444' : s === 'confirmed' ? '#60A5FA' : s === 'on_trip' ? '#4ADE80' : '#a78bfa',
                border: `1px solid ${s === 'cancelled' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              {s === 'on_trip' ? '🚗 Start Trip' : s === 'confirmed' ? '✅ Confirm' : s === 'completed' ? '🏁 Complete' : '❌ Cancel'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* LEFT: Trip Info + Completion Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Live Trip Tracker */}
          {booking.status === 'on_trip' && (
            <div className="rounded-2xl p-5 border" style={{ background: 'rgba(74,222,128,0.05)', borderColor: 'rgba(74,222,128,0.2)' }}>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 font-bold text-sm uppercase tracking-wide">Live Trip Active</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-white/50 text-xs mb-1">Odometer Start</p>
                  <p className="text-white font-bold text-lg">{booking.odometer_start.toLocaleString('en-IN')} km</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs mb-1">Odometer End *</p>
                  <input
                    type="number"
                    value={odoEnd}
                    onChange={(e) => setOdoEnd(e.target.value)}
                    placeholder={`Must be > ${booking.odometer_start}`}
                    className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none focus:border-green-400"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                {odoEnd && (
                  <div>
                    <p className="text-white/50 text-xs mb-1">Km Run</p>
                    <p className="text-white font-bold text-lg text-green-400">{(parseInt(odoEnd) - booking.odometer_start)} km</p>
                  </div>
                )}
                <div>
                  <p className="text-white/50 text-xs mb-1">Actual End Time *</p>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              {/* Extra Charges */}
              <div className="grid sm:grid-cols-3 gap-3 mt-4">
                {[
                  { label: 'Toll (₹)', val: toll, set: setToll },
                  { label: 'Parking (₹)', val: parking, set: setParking },
                  { label: 'Other Charges (₹)', val: other, set: setOther },
                ].map((c) => (
                  <div key={c.label}>
                    <p className="text-white/40 text-xs mb-1">{c.label}</p>
                    <input type="number" min="0" value={c.val} onChange={(e) => c.set(e.target.value)} className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  </div>
                ))}
              </div>
              {other && (
                <div className="mt-2">
                  <input value={otherDesc} onChange={(e) => setOtherDesc(e.target.value)} placeholder="Describe other charges..." className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
              )}
              <div className="flex items-center space-x-2 mt-3">
                <input type="checkbox" id="nightCharge" checked={nightCharge} onChange={(e) => setNightCharge(e.target.checked)} className="w-4 h-4 rounded text-[#FF6B4A]" />
                <label htmlFor="nightCharge" className="text-white/60 text-sm cursor-pointer">Apply Driver Night Charge (₹200)</label>
              </div>
              <button
                onClick={handleComplete}
                disabled={completing || !odoEnd || !endTime}
                className="mt-4 w-full py-3 rounded-xl text-white font-bold transition-all disabled:opacity-40"
                style={{ background: '#4ADE80' }}
              >
                {completing ? 'Generating invoice...' : '🏁 Complete Trip & Auto-Generate Invoice'}
              </button>
            </div>
          )}

          {/* Trip Details Card */}
          <GlassCard>
            <h2 className="text-white font-semibold mb-4">Trip Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin size={15} className="text-[#FF6B4A] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/40 text-xs">Pickup Location</p>
                  <p className="text-white">{booking.pickup_location}</p>
                  <p className="text-white/50 text-xs">{pickupDate} at {pickupTime}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Navigation size={15} className="text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/40 text-xs">Dropoff Location</p>
                  <p className="text-white">{booking.drop_location || 'Not Specified'}</p>
                  {booking.expected_dropoff && <p className="text-white/50 text-xs">Expected Return: {new Date(booking.expected_dropoff).toLocaleString('en-IN')}</p>}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Car size={15} className="text-white/40 shrink-0" />
                <div>
                  <p className="text-white/40 text-xs">Vehicle Assigned</p>
                  <p className="text-white">{booking.car_name} <span className="text-white/40 text-xs">({booking.vehicle_number})</span></p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock size={15} className="text-white/40 shrink-0" />
                <div>
                  <p className="text-white/40 text-xs">Selected Package</p>
                  <p className="text-white capitalize">{booking.package_type.replace('_', ' ')}</p>
                </div>
              </div>
              {booking.special_requests && (
                <div className="rounded-xl p-3 text-xs" style={{ background: 'rgba(255,179,71,0.07)', border: '1px solid rgba(255,179,71,0.15)' }}>
                  <p className="text-yellow-400 font-semibold mb-1">Special Requests</p>
                  <p className="text-white/70">{booking.special_requests}</p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Generated Bill Summary */}
          {bill && (
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Invoice Details Summary</h2>
                <Link href={`/admin/billing/${booking.id}`}>
                  <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#FF6B4A]" style={{ background: 'rgba(255,107,74,0.1)' }}>
                    <FileText size={12} />
                    <span>Go to Full Invoice</span>
                  </button>
                </Link>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/70"><span>Base Package Amount</span><span className="text-white">{formatINR(bill.packageAmount)}</span></div>
                {bill.extraHoursAmount > 0 && <div className="flex justify-between text-white/70"><span>Extra Hours ({bill.extraHours} hrs)</span><span className="text-white">{formatINR(bill.extraHoursAmount)}</span></div>}
                {bill.extraKmAmount > 0 && <div className="flex justify-between text-white/70"><span>Extra Distance ({bill.extraKm} km)</span><span className="text-white">{formatINR(bill.extraKmAmount)}</span></div>}
                {bill.nightChargeAmount > 0 && <div className="flex justify-between text-white/70"><span>Night Charge</span><span className="text-white">{formatINR(bill.nightChargeAmount)}</span></div>}
                {bill.tollAmount > 0 && <div className="flex justify-between text-white/70"><span>Toll Charges</span><span className="text-white">{formatINR(bill.tollAmount)}</span></div>}
                {bill.parkingAmount > 0 && <div className="flex justify-between text-white/70"><span>Parking</span><span className="text-white">{formatINR(bill.parkingAmount)}</span></div>}
                {bill.otherCharges > 0 && <div className="flex justify-between text-white/70"><span>{bill.otherDescription || 'Other Charges'}</span><span className="text-white">{formatINR(bill.otherCharges)}</span></div>}
                
                <div className="border-t border-white/10 pt-2 space-y-1">
                  <div className="flex justify-between text-white/60 text-xs"><span>Subtotal</span><span>{formatINR(bill.subtotal)}</span></div>
                  <div className="flex justify-between text-white/60 text-xs"><span>GST ({bill.gstRate}%)</span><span>{formatINR(bill.gstAmount)}</span></div>
                  <div className="flex justify-between text-white font-bold text-base border-t border-white/10 pt-2">
                    <span>TOTAL INVOICED</span>
                    <span className="text-[#FF6B4A]">{formatINR(bill.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* RIGHT Sidebar: Customer & Pricing */}
        <div className="space-y-4">
          <GlassCard>
            <h2 className="text-white font-semibold mb-4">Customer Details</h2>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B4A]/15 flex items-center justify-center text-[#FF6B4A] font-bold">
                {booking.customer_name[0].toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{booking.customer_name}</p>
                <p className="text-white/40 text-xs">{booking.customer_phone}</p>
              </div>
            </div>
            <a
              href={`https://wa.me/${booking.customer_phone.replace(/\D/g, '')}?text=Hi ${booking.customer_name}, regarding your booking ${booking.booking_number}...`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: '#25D366' }}
            >
              <Phone size={14} />
              <span>WhatsApp Customer</span>
            </a>
          </GlassCard>

          <GlassCard>
            <h2 className="text-white font-semibold mb-3">Pricing Reference</h2>
            <div className="space-y-2 text-xs">
              {[
                { l: '12H/100Km Rate', v: MOCK_PRICING.price_12hrs_100km },
                { l: 'Extra Hour Rate', v: MOCK_PRICING.extra_hour_rate },
                { l: 'Extra Km Rate', v: MOCK_PRICING.extra_km_rate },
                { l: 'Night Duty Charge', v: MOCK_PRICING.driver_night_charge },
              ].map((r) => (
                <div key={r.l} className="flex justify-between">
                  <span className="text-white/40">{r.l}</span>
                  <span className="text-white">₹ {r.v}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-white font-semibold mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Link href={`/admin/billing/${booking.id}`}>
                <button className="flex items-center space-x-2 w-full px-3 py-2 rounded-xl text-sm text-left text-white/70 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <FileText size={13} className="text-[#FF6B4A]" />
                  <span>View / Adjust Invoice</span>
                </button>
              </Link>
              <Link href="/admin/bookings/new">
                <button className="flex items-center space-x-2 w-full px-3 py-2 rounded-xl text-sm text-left text-white/70 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <Car size={13} className="text-[#FF6B4A]" />
                  <span>Book Another Ride</span>
                </button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Edit Booking Details Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4 text-white flex flex-col max-h-[90vh] overflow-y-auto" style={{ background: 'rgba(17,24,39,0.95)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}>
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <h3 className="text-white font-bold text-lg">Edit Booking Details</h3>
              <button onClick={() => setShowEditModal(false)} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Passenger Name *</Label>
                  <Input required value={editForm.customer_name} onChange={(e: any) => setEditForm({ ...editForm, customer_name: e.target.value })} />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input required value={editForm.customer_phone} onChange={(e: any) => setEditForm({ ...editForm, customer_phone: e.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={editForm.customer_email} onChange={(e: any) => setEditForm({ ...editForm, customer_email: e.target.value })} />
                </div>
                <div>
                  <Label>Select Car</Label>
                  <Select value={editForm.car_name} onChange={(e: any) => setEditForm({ ...editForm, car_name: e.target.value })}>
                    {fleetCars.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </Select>
                </div>
                <div>
                  <Label>Trip Type</Label>
                  <Select value={editForm.trip_type} onChange={(e: any) => setEditForm({ ...editForm, trip_type: e.target.value })}>
                    <option value="local">Local</option>
                    <option value="airport">Airport Transfer</option>
                    <option value="outstation">Outstation</option>
                    <option value="hourly">Hourly Rental</option>
                  </Select>
                </div>
                <div>
                  <Label>Package Selection</Label>
                  <Select value={editForm.package_type} onChange={(e: any) => setEditForm({ ...editForm, package_type: e.target.value })}>
                    <option value="12hrs_100km">12 Hrs / 100 Km</option>
                    <option value="8hrs_80km">8 Hrs / 80 Km</option>
                    <option value="airport">Airport (Fixed)</option>
                  </Select>
                </div>
                <div>
                  <Label>Estimated Price (₹)</Label>
                  <Input type="number" value={editForm.estimated_price} onChange={(e: any) => setEditForm({ ...editForm, estimated_price: e.target.value })} />
                </div>
                <div>
                  <Label>Pickup Date *</Label>
                  <Input required type="date" value={editForm.pickup_date} onChange={(e: any) => setEditForm({ ...editForm, pickup_date: e.target.value })} />
                </div>
                <div>
                  <Label>Pickup Time *</Label>
                  <Input required type="time" value={editForm.pickup_time} onChange={(e: any) => setEditForm({ ...editForm, pickup_time: e.target.value })} />
                </div>
                <div>
                  <Label>Expected Return Date</Label>
                  <Input type="date" value={editForm.dropoff_date} onChange={(e: any) => setEditForm({ ...editForm, dropoff_date: e.target.value })} />
                </div>
                <div>
                  <Label>Expected Return Time</Label>
                  <Input type="time" value={editForm.dropoff_time} onChange={(e: any) => setEditForm({ ...editForm, dropoff_time: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label>Pickup Location *</Label>
                  <Input required value={editForm.pickup_location} onChange={(e: any) => setEditForm({ ...editForm, pickup_location: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label>Dropoff Location</Label>
                  <Input value={editForm.drop_location} onChange={(e: any) => setEditForm({ ...editForm, drop_location: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label>Special Instructions</Label>
                  <textarea
                    rows={2}
                    value={editForm.special_requests}
                    onChange={(e: any) => setEditForm({ ...editForm, special_requests: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-white text-sm focus:outline-none resize-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <button type="submit" className="flex-1 py-2.5 rounded-xl font-bold text-white transition-colors" style={{ background: '#FF6B4A' }}>
                  Save Edits
                </button>
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 rounded-xl font-bold text-white/50" style={{ background: 'rgba(255,255,255,0.06)' }}>
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
