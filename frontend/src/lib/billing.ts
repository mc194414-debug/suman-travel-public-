// ─────────────────────────────────────────────────────────────
// Suman Travels — Auto Billing Calculation Engine
// ─────────────────────────────────────────────────────────────

export interface CarPricing {
  price_12hrs_100km: number;
  price_8hrs_80km: number;
  price_airport: number;
  extra_hour_rate: number;
  extra_km_rate: number;
  driver_night_charge: number;
  night_charge_start: string; // "23:00"
  toll_policy: 'actual' | 'included';
  parking_policy: 'actual' | 'included';
}

export interface TripInput {
  packageType: '8hrs_80km' | '12hrs_100km' | 'airport' | 'custom';
  pickupDatetime: Date;
  actualDropoff: Date;
  odometerStart: number;
  odometerEnd: number;
  tollAmount?: number;
  parkingAmount?: number;
  nightChargeApplied?: boolean;
  otherCharges?: number;
  otherDescription?: string;
  discountAmount?: number;
  discountReason?: string;
  gstRate?: number; // default 5
}

export interface BillBreakdown {
  packageAmount: number;
  packageLabel: string;
  actualHours: number;
  packageHours: number;
  extraHours: number;
  extraHoursAmount: number;
  actualKm: number;
  packageKm: number;
  extraKm: number;
  extraKmAmount: number;
  nightChargeAmount: number;
  tollAmount: number;
  parkingAmount: number;
  otherCharges: number;
  otherDescription: string;
  subtotal: number;
  discountAmount: number;
  discountReason: string;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
}

export function calculateBill(
  pricing: CarPricing,
  trip: TripInput
): BillBreakdown {
  const gstRate = trip.gstRate ?? 5;

  // ── Package base price & limits ──────────────────────────
  let packageAmount = 0;
  let packageHours = 8;
  let packageKm = 80;
  let packageLabel = '8 Hrs / 80 Km';

  if (trip.packageType === '12hrs_100km') {
    packageAmount = pricing.price_12hrs_100km;
    packageHours = 12;
    packageKm = 100;
    packageLabel = '12 Hrs / 100 Km';
  } else if (trip.packageType === 'airport') {
    packageAmount = pricing.price_airport;
    packageHours = 0;
    packageKm = 0;
    packageLabel = 'Airport Transfer';
  } else if (trip.packageType === '8hrs_80km') {
    packageAmount = pricing.price_8hrs_80km;
    packageHours = 8;
    packageKm = 80;
    packageLabel = '8 Hrs / 80 Km';
  }

  // ── Actual usage ──────────────────────────────────────────
  const actualKm = Math.max(0, trip.odometerEnd - trip.odometerStart);
  const msElapsed = trip.actualDropoff.getTime() - trip.pickupDatetime.getTime();
  const actualHours = msElapsed / (1000 * 60 * 60);

  // ── Extra hours ───────────────────────────────────────────
  const extraHours = trip.packageType === 'airport'
    ? 0
    : Math.max(0, actualHours - packageHours);
  const extraHoursAmount = parseFloat((extraHours * pricing.extra_hour_rate).toFixed(2));

  // ── Extra km ──────────────────────────────────────────────
  const extraKm = trip.packageType === 'airport'
    ? 0
    : Math.max(0, actualKm - packageKm);
  const extraKmAmount = parseFloat((extraKm * pricing.extra_km_rate).toFixed(2));

  // ── Night charge ──────────────────────────────────────────
  let nightChargeAmount = 0;
  if (trip.nightChargeApplied) {
    nightChargeAmount = pricing.driver_night_charge;
  } else {
    // Auto-detect: check if dropoff is after night start
    const [h, m] = pricing.night_charge_start.split(':').map(Number);
    const nightStart = new Date(trip.actualDropoff);
    nightStart.setHours(h, m, 0, 0);
    if (trip.actualDropoff > nightStart) {
      nightChargeAmount = pricing.driver_night_charge;
    }
  }

  // ── Other charges ─────────────────────────────────────────
  const tollAmount = trip.tollAmount ?? 0;
  const parkingAmount = trip.parkingAmount ?? 0;
  const otherCharges = trip.otherCharges ?? 0;
  const discountAmount = trip.discountAmount ?? 0;

  // ── Totals ────────────────────────────────────────────────
  const subtotalBeforeDiscount =
    packageAmount +
    extraHoursAmount +
    extraKmAmount +
    nightChargeAmount +
    tollAmount +
    parkingAmount +
    otherCharges;

  const subtotal = Math.max(0, subtotalBeforeDiscount - discountAmount);
  const gstAmount = parseFloat(((subtotal * gstRate) / 100).toFixed(2));
  const totalAmount = parseFloat((subtotal + gstAmount).toFixed(2));

  return {
    packageAmount,
    packageLabel,
    actualHours: parseFloat(actualHours.toFixed(2)),
    packageHours,
    extraHours: parseFloat(extraHours.toFixed(2)),
    extraHoursAmount,
    actualKm,
    packageKm,
    extraKm,
    extraKmAmount,
    nightChargeAmount,
    tollAmount,
    parkingAmount,
    otherCharges,
    otherDescription: trip.otherDescription ?? '',
    subtotal,
    discountAmount,
    discountReason: trip.discountReason ?? '',
    gstRate,
    gstAmount,
    totalAmount,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function inrToUsd(amountINR: number, rate: number): number {
  return parseFloat((amountINR / rate).toFixed(2));
}
