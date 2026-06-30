'use client';

import { useState, useEffect } from 'react';
import { Download, BarChart3, Calendar, Car, AlertCircle, Users } from 'lucide-react';
import { exportDailyReport, exportMonthlyReport, exportCarReport, exportOutstandingReport, exportDriverReport } from '../../../lib/exportExcel';
import { getStoredItems, INITIAL_BILLS, INITIAL_CARS, INITIAL_DRIVERS } from '../../../lib/storage';

const TABS = ['Daily Collection', 'Monthly Revenue', 'Car Performance', 'Outstanding Payments', 'Driver Earnings'];

const GlassCard = ({ children, className = '' }: any) => (
  <div className={`rounded-2xl ${className}`} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
    {children}
  </div>
);

const Th = ({ children }: any) => (
  <th className="text-left px-4 py-3 text-white/40 text-xs font-semibold uppercase tracking-wide">{children}</th>
);

const Td = ({ children, highlight = false }: any) => (
  <td className={`px-4 py-3 text-sm ${highlight ? 'text-[#FF6B4A] font-bold' : 'text-white/70'}`}>{children}</td>
);

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [dateFrom, setDateFrom] = useState('2026-06-01');
  const [dateTo, setDateTo] = useState('2026-06-30');

  const [dailyData, setDailyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [carData, setCarData] = useState<any[]>([]);
  const [outstandingData, setOutstandingData] = useState<any[]>([]);
  const [driverData, setDriverData] = useState<any[]>([]);

  useEffect(() => {
    const bills = getStoredItems('suman_billing', INITIAL_BILLS);
    const fleet = getStoredItems('suman_fleet', INITIAL_CARS);
    const drivers = getStoredItems('suman_drivers', INITIAL_DRIVERS);

    // Map daily data
    setDailyData(bills.map((b) => ({
      booking_number: b.booking_number,
      customer_name: b.customer_name,
      car_name: b.car_name,
      package_type: b.packageLabel || 'Custom',
      pickup_location: b.pickup_location || 'Mumbai',
      drop_location: b.drop_location || 'Mumbai',
      extra_charges: (b.extraHoursAmount || 0) + (b.extraKmAmount || 0) + (b.nightChargeAmount || 0) + (b.tollAmount || 0) + (b.parkingAmount || 0) + (b.otherCharges || 0),
      total_amount: b.totalAmount,
      payment_mode: b.payments && b.payments.length > 0 ? b.payments.map((p: any) => p.payment_mode).join('+') : 'UPI',
      status: b.status
    })));

    // Map monthly data
    const months: Record<string, any> = {};
    bills.forEach((b) => {
      const dateObj = new Date(b.created_at || '2026-06-28');
      const mName = isNaN(dateObj.getTime()) ? 'June 2026' : dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!months[mName]) {
        months[mName] = { month: mName, total_bookings: 0, total_revenue: 0, gst_collected: 0, pending_amount: 0 };
      }
      months[mName].total_bookings += 1;
      months[mName].total_revenue += b.totalAmount || 0;
      months[mName].gst_collected += b.gstAmount || 0;
      months[mName].pending_amount += b.balanceDue || 0;
    });
    setMonthlyData(Object.values(months));

    // Map car performance data
    setCarData(fleet.map((c) => {
      const carBills = bills.filter((b) => b.car_name === c.name || b.vehicle_number === c.vehicle_number);
      return {
        car_name: c.name,
        vehicle_number: c.vehicle_number,
        total_trips: c.total_trips || carBills.length || 0,
        total_km: c.odometer || 1200,
        revenue: carBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0) || c.total_earnings || 0,
        status: c.status
      };
    }));

    // Map outstanding payments data
    setOutstandingData(bills.filter((b) => b.balanceDue > 0).map((b) => {
      const createdTime = new Date(b.created_at || '2026-06-28').getTime();
      const diff = Math.floor((Date.now() - createdTime) / (1000 * 60 * 60 * 24));
      return {
        customer_name: b.customer_name,
        booking_number: b.booking_number,
        total_amount: b.totalAmount,
        amount_paid: b.amountPaid,
        balance_due: b.balanceDue,
        days_overdue: isNaN(diff) || diff < 0 ? 1 : diff || 1,
        status: b.status
      };
    }));

    // Map driver earnings data
    setDriverData(drivers.map((d) => ({
      name: d.name,
      phone: d.phone,
      total_trips: d.total_trips || 0,
      night_duties: d.night_duties || 0,
      total_earnings: d.total_earnings || 0,
      status: d.status
    })));
  }, []);

  const handleExport = () => {
    const date = `${dateFrom}_${dateTo}`;
    switch (activeTab) {
      case 0: exportDailyReport(dailyData, date); break;
      case 1: exportMonthlyReport(monthlyData, date); break;
      case 2: exportCarReport(carData); break;
      case 3: exportOutstandingReport(outstandingData); break;
      case 4: exportDriverReport(driverData); break;
    }
  };

  const TAB_ICONS = [Calendar, BarChart3, Car, AlertCircle, Users];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-white/40 text-sm">CA-level business reports with export</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs text-white/50">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-2 py-1.5 rounded-lg text-white text-xs focus:outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
            <span>to</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-2 py-1.5 rounded-lg text-white text-xs focus:outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
          <button onClick={handleExport} className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-green-400" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
            <Download size={15} />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex space-x-1 overflow-x-auto pb-1">
        {TABS.map((t, i) => {
          const Icon = TAB_ICONS[i];
          return (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
              style={{
                background: activeTab === i ? '#FF6B4A' : 'rgba(255,255,255,0.04)',
                color: activeTab === i ? '#fff' : 'rgba(255,255,255,0.5)',
                border: `1px solid ${activeTab === i ? 'transparent' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <Icon size={14} />
              <span>{t}</span>
            </button>
          );
        })}
      </div>

      {/* Tab contents */}
      {activeTab === 0 && (
        <GlassCard className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Booking #', 'Customer', 'Car', 'Package', 'Pickup', 'Drop', 'Extra Charges', 'Total', 'Payment Mode', 'Status'].map((h) => <Th key={h}>{h}</Th>)}
              </tr>
            </thead>
            <tbody>
              {dailyData.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="hover:bg-white/2">
                  <Td>{row.booking_number}</Td>
                  <Td>{row.customer_name}</Td>
                  <Td>{row.car_name}</Td>
                  <Td>{row.package_type}</Td>
                  <Td>{row.pickup_location}</Td>
                  <Td>{row.drop_location}</Td>
                  <Td>₹ {row.extra_charges.toLocaleString('en-IN')}</Td>
                  <Td highlight>₹ {row.total_amount.toLocaleString('en-IN')}</Td>
                  <Td className="capitalize">{row.payment_mode}</Td>
                  <Td><span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: 'rgba(255,255,255,0.06)' }}>{row.status}</span></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {activeTab === 1 && (
        <GlassCard className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Month', 'Total Bookings', 'Total Revenue', 'GST Collected', 'Outstanding Pending'].map((h) => <Th key={h}>{h}</Th>)}
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="hover:bg-white/2">
                  <Td>{row.month}</Td>
                  <Td>{row.total_bookings}</Td>
                  <Td highlight>₹ {row.total_revenue.toLocaleString('en-IN')}</Td>
                  <Td>₹ {row.gst_collected.toLocaleString('en-IN')}</Td>
                  <Td style={{ color: '#FF6B4A' }}>₹ {row.pending_amount.toLocaleString('en-IN')}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {activeTab === 2 && (
        <GlassCard className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Car Name', 'Vehicle No.', 'Total Trips', 'Total KM', 'Revenue Generated', 'Status'].map((h) => <Th key={h}>{h}</Th>)}
              </tr>
            </thead>
            <tbody>
              {carData.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="hover:bg-white/2">
                  <Td>{row.car_name}</Td>
                  <Td className="font-mono text-xs">{row.vehicle_number}</Td>
                  <Td>{row.total_trips}</Td>
                  <Td>{row.total_km.toLocaleString('en-IN')} km</Td>
                  <Td highlight>₹ {row.revenue.toLocaleString('en-IN')}</Td>
                  <Td><span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: 'rgba(255,255,255,0.06)' }}>{row.status}</span></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {activeTab === 3 && (
        <GlassCard className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Customer', 'Booking #', 'Bill Amount', 'Amount Paid', 'Balance Due', 'Days Overdue', 'Status'].map((h) => <Th key={h}>{h}</Th>)}
              </tr>
            </thead>
            <tbody>
              {outstandingData.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="hover:bg-white/2">
                  <Td>{row.customer_name}</Td>
                  <Td className="font-mono text-xs">{row.booking_number}</Td>
                  <Td>₹ {row.total_amount.toLocaleString('en-IN')}</Td>
                  <Td className="text-green-400">₹ {row.amount_paid.toLocaleString('en-IN')}</Td>
                  <Td highlight>₹ {row.balance_due.toLocaleString('en-IN')}</Td>
                  <Td className="text-red-400 font-semibold">{row.days_overdue} days</Td>
                  <Td><span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: 'rgba(255,255,255,0.06)' }}>{row.status}</span></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {activeTab === 4 && (
        <GlassCard className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Driver Name', 'Phone', 'Total Trips', 'Night Duties', 'Total Earnings', 'Status'].map((h) => <Th key={h}>{h}</Th>)}
              </tr>
            </thead>
            <tbody>
              {driverData.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="hover:bg-white/2">
                  <Td>{row.name}</Td>
                  <Td>{row.phone}</Td>
                  <Td>{row.total_trips}</Td>
                  <Td>{row.night_duties}</Td>
                  <Td highlight>₹ {row.total_earnings.toLocaleString('en-IN')}</Td>
                  <Td><span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: 'rgba(255,255,255,0.06)' }}>{row.status}</span></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
}
