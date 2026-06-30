// ─────────────────────────────────────────────────────────────
// Suman Travels — Local Storage State Persistence Utility
// ─────────────────────────────────────────────────────────────

export const INITIAL_CARS = [
  { id: '1', name: 'Toyota Innova Hycross', category: 'Luxury',   vehicle_number: 'MH-01-AB-1001', seating: 7, fuel: 'Hybrid', odometer: 12500, status: 'available',    photo: '/assets/innova_hycross.png', pricing: { p12: 6000, p8: 4500, airport: 0,    ehr: 300, ekm: 30 } },
  { id: '2', name: 'Toyota Innova Crysta',  category: 'Premium',  vehicle_number: 'MH-01-AB-1002', seating: 7, fuel: 'Diesel', odometer: 45000, status: 'on_trip',       photo: '/assets/innova_crysta.png', pricing: { p12: 5000, p8: 3800, airport: 2200, ehr: 250, ekm: 23 } },
  { id: '3', name: 'Maruti Suzuki Ertiga',  category: 'MUV',      vehicle_number: 'MH-01-AB-1003', seating: 6, fuel: 'Petrol', odometer: 28000, status: 'available',    photo: '/assets/ertiga.png',        pricing: { p12: 4000, p8: 3000, airport: 2000, ehr: 200, ekm: 18 } },
  { id: '4', name: 'Swift Dzire',           category: 'Small',    vehicle_number: 'MH-01-AB-1004', seating: 4, fuel: 'Petrol', odometer: 33000, status: 'available',    photo: '/assets/dezire.png',        pricing: { p12: 3200, p8: 2500, airport: 1500, ehr: 200, ekm: 15 } },
  { id: '5', name: 'Toyota Innova',         category: 'Premium',  vehicle_number: 'MH-01-AB-1005', seating: 7, fuel: 'Diesel', odometer: 52000, status: 'maintenance',  photo: '/assets/innova.png',        pricing: { p12: 4000, p8: 3000, airport: 2800, ehr: 200, ekm: 20 } },
];

export const INITIAL_CUSTOMERS = [
  { id: 'C1', name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul@example.com', id_proof_type: 'Aadhar', company_name: '', gst_number: '', loyalty_status: 'gold', total_spent: 28500, total_bookings: 7, tags: ['Repeat', 'VIP'], notes: 'Prefers AC cars, usually books Crysta' },
  { id: 'C2', name: 'Priya Mehta',  phone: '+91 91234 56789', email: 'priya@example.com',  id_proof_type: 'PAN', company_name: 'Tech Mahindra Ltd', gst_number: '27AAACT1234A1Z5', loyalty_status: 'corporate', total_spent: 95000, total_bookings: 24, tags: ['Corporate', 'Monthly Billing'], notes: '' },
  { id: 'C3', name: 'Amit Patel',   phone: '+91 77777 66666', email: '',                   id_proof_type: 'Driving License', company_name: '', gst_number: '', loyalty_status: 'silver', total_spent: 12300, total_bookings: 3, tags: [], notes: '' },
  { id: 'C4', name: 'Sunita Rao',   phone: '+91 88888 55555', email: 'sunita@gmail.com',   id_proof_type: 'Passport', company_name: 'Rao Exports', gst_number: '', loyalty_status: 'regular', total_spent: 5200, total_bookings: 1, tags: ['Foreign Client'], notes: '' },
];

export const INITIAL_DRIVERS = [
  { id: 'D1', name: 'Rajesh Kumar', phone: '+91 88888 11111', license_number: 'MH0120150123456', license_expiry: '2029-03-15', status: 'on_duty', assigned_car: 'Toyota Innova Crysta', total_trips: 145, night_duties: 32, avg_rating: 4.8, total_earnings: 185000 },
  { id: 'D2', name: 'Suresh Yadav', phone: '+91 77777 22222', license_number: 'MH0120180654321', license_expiry: '2031-07-20', status: 'available', assigned_car: null, total_trips: 89, night_duties: 18, avg_rating: 4.6, total_earnings: 112000 },
  { id: 'D3', name: 'Deepak Nair',  phone: '+91 99999 33333', license_number: 'MH0120190987654', license_expiry: '2027-11-10', status: 'off_duty', assigned_car: null, total_trips: 234, night_duties: 67, avg_rating: 4.9, total_earnings: 298000 },
  { id: 'D4', name: 'Anil Gupta',   phone: '+91 66666 44444', license_number: 'MH0120211234567', license_expiry: '2032-05-30', status: 'available', assigned_car: null, total_trips: 12, night_duties: 2, avg_rating: 4.4, total_earnings: 15000 },
];

export const INITIAL_BOOKINGS = [
  { id: 'BK001', booking_number: 'ST-2026-1024', customer_name: 'Rahul Sharma', customer_phone: '+91 98765 43210', car_name: 'Toyota Innova Crysta', vehicle_number: 'MH-01-AB-1002', trip_type: 'local', package_type: '12hrs_100km', pickup_location: 'Marine Drive, Mumbai', drop_location: 'Lonavala', pickup_datetime: '2026-06-26T10:00:00', expected_dropoff: '2026-06-26T22:00:00', status: 'on_trip', estimated_price: 5000, source: 'whatsapp' },
  { id: 'BK002', booking_number: 'ST-2026-1023', customer_name: 'Priya Mehta',   customer_phone: '+91 91234 56789', car_name: 'Swift Dzire', vehicle_number: 'MH-01-AB-1004', trip_type: 'airport', package_type: 'airport', pickup_location: 'Andheri West', drop_location: 'Mumbai Airport T2', pickup_datetime: '2026-06-26T06:00:00', expected_dropoff: '2026-06-26T08:00:00', status: 'completed', estimated_price: 1500, source: 'phone' },
  { id: 'BK003', booking_number: 'ST-2026-1025', customer_name: 'Amit Patel',    customer_phone: '+91 77777 66666', car_name: 'Maruti Ertiga', vehicle_number: 'MH-01-AB-1003', trip_type: 'outstation', package_type: '12hrs_100km', pickup_location: 'Bandra, Mumbai', drop_location: 'Pune', pickup_datetime: '2026-06-27T08:00:00', expected_dropoff: '2026-06-27T22:00:00', status: 'confirmed', estimated_price: 4200, source: 'whatsapp' },
  { id: 'BK004', booking_number: 'ST-2026-1022', customer_name: 'Sunita Rao',    customer_phone: '+91 88888 55555', car_name: 'Toyota Hycross', vehicle_number: 'MH-01-AB-1001', trip_type: 'local', package_type: '8hrs_80km', pickup_location: 'Juhu', drop_location: 'BKC, Mumbai', pickup_datetime: '2026-06-25T09:00:00', expected_dropoff: '2026-06-25T17:00:00', status: 'completed', estimated_price: 4500, source: 'website' },
  { id: 'BK005', booking_number: 'ST-2026-1026', customer_name: 'Ravi Kumar',    customer_phone: '+91 99991 22222', car_name: 'Toyota Innova Crysta', vehicle_number: 'MH-01-AB-1002', trip_type: 'local', package_type: '8hrs_80km', pickup_location: 'Santacruz West', drop_location: 'Nariman Point', pickup_datetime: '2026-06-28T10:00:00', expected_dropoff: '2026-06-28T18:00:00', status: 'pending', estimated_price: 3800, source: 'phone' },
];

export const INITIAL_BILLS = [
  { id: 'BILL001', bill_number: 'INV-2026-1024', booking_number: 'ST-2026-1024', customer_name: 'Rahul Sharma', customer_phone: '+91 98765 43210', car_name: 'Toyota Innova Crysta', vehicle_number: 'MH-01-AB-1002', pickup_location: 'Marine Drive, Mumbai', drop_location: 'Lonavala', pickup_datetime: '2026-06-26T10:00:00', actual_dropoff: '2026-06-26T23:30:00', odometer_start: 45230, odometer_end: 45350, packageLabel: '12 Hrs / 100 Km', packageAmount: 5000, actualHours: 13.5, packageHours: 12, extraHours: 1.5, extraHoursRate: 250, extraHoursAmount: 375, actualKm: 120, packageKm: 100, extraKm: 20, extraKmRate: 23, extraKmAmount: 460, nightChargeAmount: 200, tollAmount: 350, toll_description: 'Bandra-Worli + Mumbai-Pune Expressway', parkingAmount: 100, otherCharges: 0, otherDescription: '', discountAmount: 0, discountReason: '', gstRate: 5, gstAmount: 320.25, totalAmount: 6809.25, amountPaid: 4000, balanceDue: 2809.25, status: 'partial', created_at: '2026-06-26', usd_rate: 83.5 },
  { id: 'BILL002', bill_number: 'INV-2026-1023', booking_number: 'ST-2026-1023', customer_name: 'Priya Mehta', customer_phone: '+91 91234 56789', car_name: 'Swift Dzire', vehicle_number: 'MH-01-AB-1004', pickup_location: 'Andheri West', drop_location: 'Mumbai Airport T2', pickup_datetime: '2026-06-26T06:00:00', actual_dropoff: '2026-06-26T08:00:00', odometer_start: 33000, odometer_end: 33040, packageLabel: 'Airport Transfer', packageAmount: 1500, actualHours: 2, packageHours: 0, extraHours: 0, extraHoursRate: 200, extraHoursAmount: 0, actualKm: 40, packageKm: 0, extraKm: 0, extraKmRate: 15, extraKmAmount: 0, nightChargeAmount: 0, tollAmount: 0, toll_description: '', parkingAmount: 0, otherCharges: 0, otherDescription: '', discountAmount: 0, discountReason: '', gstRate: 0, gstAmount: 0, totalAmount: 1500, amountPaid: 1500, balanceDue: 0, status: 'paid', created_at: '2026-06-26', usd_rate: 83.5 },
  { id: 'BILL003', bill_number: 'INV-2026-1022', booking_number: 'ST-2026-1022', customer_name: 'Sunita Rao', customer_phone: '+91 88888 55555', car_name: 'Toyota Hycross', vehicle_number: 'MH-01-AB-1001', pickup_location: 'Juhu', drop_location: 'BKC, Mumbai', pickup_datetime: '2026-06-25T09:00:00', actual_dropoff: '2026-06-25T17:00:00', odometer_start: 12500, odometer_end: 12580, packageLabel: '8 Hrs / 80 Km', packageAmount: 4500, actualHours: 8, packageHours: 8, extraHours: 0, extraHoursRate: 300, extraHoursAmount: 0, actualKm: 80, packageKm: 80, extraKm: 0, extraKmRate: 30, extraKmAmount: 0, nightChargeAmount: 0, tollAmount: 500, toll_description: 'Toll', parkingAmount: 200, otherCharges: 0, otherDescription: '', discountAmount: 0, discountReason: '', gstRate: 0, gstAmount: 0, totalAmount: 5200, amountPaid: 0, balanceDue: 5200, status: 'draft', created_at: '2026-06-25', usd_rate: 83.5 },
  { id: 'BILL004', bill_number: 'INV-2026-1021', booking_number: 'ST-2026-1021', customer_name: 'Vikram Singh', customer_phone: '+91 99991 22222', car_name: 'Swift Dzire', vehicle_number: 'MH-01-AB-1004', pickup_location: 'Santacruz', drop_location: 'Nariman Point', pickup_datetime: '2026-06-24T10:00:00', actual_dropoff: '2026-06-24T18:00:00', odometer_start: 32000, odometer_end: 32060, packageLabel: '8 Hrs / 80 Km', packageAmount: 3800, actualHours: 8, packageHours: 8, extraHours: 0, extraHoursRate: 200, extraHoursAmount: 0, actualKm: 60, packageKm: 80, extraKm: 0, extraKmRate: 15, extraKmAmount: 0, nightChargeAmount: 0, tollAmount: 0, toll_description: '', parkingAmount: 0, otherCharges: 0, otherDescription: '', discountAmount: 0, discountReason: '', gstRate: 0, gstAmount: 0, totalAmount: 3800, amountPaid: 3800, balanceDue: 0, status: 'closed', created_at: '2026-06-24', usd_rate: 83.5 },
];

import { Invoice } from '../types/invoice';

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV001',
    invoice_number: 'INV-2026-00125',
    booking_id: 'BK001',
    customer_name: 'Rahul Sharma',
    customer_phone: '+91 98765 43210',
    customer_email: 'rahul@example.com',
    customer_address: 'Flat 402, Sea Breeze Apartments, Bandra West, Mumbai - 400050',
    vehicle_name: 'Toyota Innova Crysta',
    vehicle_number: 'MH-01-AB-1002',
    driver_name: 'Rajesh Kumar',
    pickup_date: '2026-06-26T10:00:00.000Z',
    return_date: '2026-06-26T23:30:00.000Z',
    total_days: 1,
    total_distance_km: 120,
    extra_km: 20,
    base_rental_amount: 5000,
    driver_allowance: 375,
    night_charges: 200,
    toll_charges: 350,
    parking_charges: 100,
    extra_km_charges: 460,
    gst_percentage: 5,
    gst_amount: 324.25,
    discount_amount: 0,
    subtotal: 6485,
    grand_total: 6809.25,
    advance_paid: 5000,
    balance_due: 1809.25,
    payment_method: 'UPI / GPay',
    payment_status: 'partial',
    terms: [
      'Driver allowance after 10 PM will be extra.',
      'Toll, Parking, State Permit charges are extra.',
      'Vehicle is for point to point use only.',
      'Smoking & alcohol strictly prohibited.',
      'Damage to vehicle will be charged extra.'
    ],
    notes: 'Airport transfer + outstation run to Lonavala.',
    company_name: 'Suman Travels',
    company_tagline: 'Elite Chauffeur Services',
    company_address: '1st Floor, KWX 7715, Mangalwadi, Juhu Tara Road, Santacruz West, Mumbai, MH - 400049',
    company_pan: 'ABCDE1234F',
    company_phone: '+91 77109 66660',
    company_email: 'sanjayindia6666@gmail.com',
    company_website: 'www.sumantravel.com',
    created_at: '2026-06-26T10:00:00.000Z',
    updated_at: '2026-06-26T10:00:00.000Z'
  }
];

export function getStoredItems<T>(key: string, defaultItems: T[]): T[] {
  if (typeof window === 'undefined') return defaultItems;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultItems));
    return defaultItems;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultItems;
  }
}

export function saveStoredItems<T>(key: string, items: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(items));
}
