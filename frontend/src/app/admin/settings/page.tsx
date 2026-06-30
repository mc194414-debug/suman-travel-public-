'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCcw, Globe, Building2, FileText, Shield, Bell, DollarSign, IndianRupee } from 'lucide-react';
import { fetchLiveUsdRate, setManualUsdRate, getManualUsdRate } from '../../../lib/usdRate';

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
    className="w-full px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none appearance-none"
    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
  >
    {children}
  </select>
);

const SECTION_TABS = [
  { label: 'Business Info',  icon: Building2 },
  { label: 'Billing Config', icon: FileText },
  { label: 'Currency & USD', icon: DollarSign },
  { label: 'User Roles',     icon: Shield },
  { label: 'Notifications',  icon: Bell },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState(0);
  const [saved, setSaved] = useState(false);

  // ── Business Info ─────────────────────────────────────────
  const [business, setBusiness] = useState({
    company_name: 'Suman Travels',
    address: '1st Floor, KWX 7715, Mangalwadi, Juhu Tara Road, Opp. Union Bank of India, Santacruz West, Mumbai – 400049',
    phone: '+91 77109 66660',
    email: 'sanjayindia6666@gmail.com',
    gst_number: '',
    bill_terms: 'Toll, parking & state permit charges at actuals. GST applicable as per government norms. Prices subject to change without notice.',
  });

  // ── Billing Config ────────────────────────────────────────
  const [billing, setBilling] = useState({
    default_gst_rate: '5',
    night_charge_start: '23:00',
    night_charge_amount: '200',
    airport_zone_t1: '1500',
    airport_zone_t2: '1800',
    airport_zone_international: '2200',
  });

  // ── USD / Currency ────────────────────────────────────────
  const [liveRate, setLiveRate]         = useState<number | null>(null);
  const [manualRate, setManualRate]     = useState<string>('83.50');
  const [useLive, setUseLive]           = useState(true);
  const [fetchingRate, setFetchingRate] = useState(false);
  const [rateLastFetch, setRateFetch]   = useState<string>('');
  const [enableUsdSite, setEnableUsd]   = useState(false);

  useEffect(() => {
    const saved = getManualUsdRate();
    setManualRate(saved.toString());
  }, []);

  const fetchRate = async () => {
    setFetchingRate(true);
    try {
      const r = await fetchLiveUsdRate();
      setLiveRate(r);
      setRateFetch(new Date().toLocaleTimeString('en-IN'));
    } finally {
      setFetchingRate(false);
    }
  };

  const saveManualRate = () => {
    setManualUsdRate(parseFloat(manualRate) || 83.5);
    alert(`Manual USD rate saved: ₹${manualRate}`);
  };

  const effectiveRate = useLive && liveRate ? liveRate : parseFloat(manualRate) || 83.5;

  // ── User Roles ────────────────────────────────────────────
  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    const accountsStr = localStorage.getItem('suman_admin_accounts');
    if (accountsStr) {
      setUsers(JSON.parse(accountsStr));
    } else {
      setUsers([
        { name: 'Sanjay Choudhary', email: 'sanjayindia6666@gmail.com', role: 'admin', password: 'SumanAdmin@2026' },
        { name: 'Shiva Choudhary',  email: 'shivachoudhary4235@gmail.com', role: 'admin', password: 'SuMAN#@20092@project' },
      ]);
    }
  }, []);

  const saveUser = () => {
    let newUsers = [...users];
    if (editingUser.isNew) {
      newUsers.push({ name: editingUser.name, email: editingUser.email, role: editingUser.role, password: editingUser.password });
    } else {
      newUsers = newUsers.map(u => u.email === editingUser.oldEmail ? { name: editingUser.name, email: editingUser.email, role: editingUser.role, password: editingUser.password } : u);
    }
    setUsers(newUsers);
    localStorage.setItem('suman_admin_accounts', JSON.stringify(newUsers));
    setEditingUser(null);
  };

  const deleteUser = (email: string) => {
    if(confirm('Are you sure you want to remove this user?')) {
      const newUsers = users.filter(u => u.email !== email);
      setUsers(newUsers);
      localStorage.setItem('suman_admin_accounts', JSON.stringify(newUsers));
    }
  };

  // ── Notifications ─────────────────────────────────────────
  const [notif, setNotif] = useState({
    booking_confirm_template: 'Hi {name}! ✅ Your booking #{booking_number} for {car} on {date} is confirmed. Pickup: {pickup}. Questions? Call +91 77109 66660.',
    bill_reminder_template: 'Hi {name}! 🧾 Invoice {invoice_number} of ₹{balance_due} is pending for booking #{booking_number}. Please settle at your earliest. - Suman Travels',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-white text-2xl font-bold">Settings & Configuration</h1>
        <p className="text-white/40 text-sm">Business settings, billing rules, and system preferences</p>
      </div>

      {/* Section tabs */}
      <div className="flex space-x-1 overflow-x-auto pb-1">
        {SECTION_TABS.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActiveSection(i)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
            style={{
              background: activeSection === i ? '#FF6B4A' : 'rgba(255,255,255,0.04)',
              color: activeSection === i ? '#fff' : 'rgba(255,255,255,0.5)',
              border: `1px solid ${activeSection === i ? 'transparent' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <t.icon size={14} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Section 0: Business Info ───────────────────────── */}
      {activeSection === 0 && (
        <GlassCard>
          <h2 className="text-white font-semibold mb-5 flex items-center space-x-2">
            <Building2 size={16} className="text-[#FF6B4A]" />
            <span>Business Information</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input value={business.company_name} onChange={(e: any) => setBusiness((b) => ({ ...b, company_name: e.target.value }))} />
            </div>
            <div>
              <Label>GST Number</Label>
              <Input value={business.gst_number} onChange={(e: any) => setBusiness((b) => ({ ...b, gst_number: e.target.value }))} placeholder="27AAAAA0000A1Z5" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={business.phone} onChange={(e: any) => setBusiness((b) => ({ ...b, phone: e.target.value }))} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={business.email} onChange={(e: any) => setBusiness((b) => ({ ...b, email: e.target.value }))} />
            </div>
          </div>
          <div className="mt-4">
            <Label>Company Address</Label>
            <textarea
              value={business.address}
              onChange={(e) => setBusiness((b) => ({ ...b, address: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
          <div className="mt-4">
            <Label>Bill Footer / Terms</Label>
            <textarea
              value={business.bill_terms}
              onChange={(e) => setBusiness((b) => ({ ...b, bill_terms: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
        </GlassCard>
      )}

      {/* ── Section 1: Billing Config ──────────────────────── */}
      {activeSection === 1 && (
        <GlassCard>
          <h2 className="text-white font-semibold mb-5 flex items-center space-x-2">
            <FileText size={16} className="text-[#FF6B4A]" />
            <span>Billing & Pricing Rules</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Default GST Rate (%)</Label>
              <Select value={billing.default_gst_rate} onChange={(e: any) => setBilling((b) => ({ ...b, default_gst_rate: e.target.value }))}>
                <option value="5">5% (Standard Cab Rental)</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
              </Select>
            </div>
            <div>
              <Label>Night Charge Starts At</Label>
              <Input type="time" value={billing.night_charge_start} onChange={(e: any) => setBilling((b) => ({ ...b, night_charge_start: e.target.value }))} />
            </div>
            <div>
              <Label>Default Night Charge Amount (₹)</Label>
              <Input type="number" value={billing.night_charge_amount} onChange={(e: any) => setBilling((b) => ({ ...b, night_charge_amount: e.target.value }))} />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-white/70 text-sm font-semibold mb-3">Airport Pricing Zones</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'T1 / Domestic Arrival', key: 'airport_zone_t1' },
                { label: 'T2 / BOM Domestic',     key: 'airport_zone_t2' },
                { label: 'T2 International',       key: 'airport_zone_international' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[#FF6B4A] text-sm">₹</span>
                    <Input type="number" value={(billing as any)[key]} onChange={(e: any) => setBilling((b) => ({ ...b, [key]: e.target.value }))} className="pl-7" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* ── Section 2: Currency & USD ──────────────────────── */}
      {activeSection === 2 && (
        <div className="space-y-4">
          {/* Live Rate Card */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,107,74,0.06)', border: '1px solid rgba(255,107,74,0.15)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Globe size={18} className="text-[#FF6B4A]" />
                <h2 className="text-white font-semibold">Live USD → INR Rate</h2>
              </div>
              <button onClick={fetchRate} disabled={fetchingRate} className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(255,107,74,0.15)', color: '#FF6B4A' }}>
                <RefreshCcw size={12} className={fetchingRate ? 'animate-spin' : ''} />
                <span>{fetchingRate ? 'Fetching...' : 'Refresh Rate'}</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-white/40 text-xs mb-1">Live Rate (API)</p>
                <p className="text-white text-2xl font-bold">{liveRate ? `₹ ${liveRate.toFixed(2)}` : '—'}</p>
                {rateLastFetch && <p className="text-white/30 text-xs mt-1">Updated {rateLastFetch}</p>}
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-white/40 text-xs mb-1">Manual Rate</p>
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-[#FF6B4A]">₹</span>
                  <input
                    type="number"
                    value={manualRate}
                    onChange={(e) => setManualRate(e.target.value)}
                    step="0.01"
                    className="w-24 bg-transparent text-white text-2xl font-bold text-center focus:outline-none"
                  />
                </div>
                <button onClick={saveManualRate} className="text-xs text-[#FF6B4A] hover:underline mt-1">Save Manual Rate</button>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-white/40 text-xs mb-1">Effective Rate</p>
                <p className="text-[#FF6B4A] text-2xl font-bold">₹ {effectiveRate.toFixed(2)}</p>
                <p className="text-white/30 text-xs mt-1">{useLive && liveRate ? 'Using live rate' : 'Using manual rate'}</p>
              </div>
            </div>

            {/* Use live toggle */}
            <div className="flex items-center space-x-3 mt-4">
              <button onClick={() => setUseLive(!useLive)} className="relative w-11 h-6 rounded-full transition-colors" style={{ background: useLive ? '#FF6B4A' : 'rgba(255,255,255,0.1)' }}>
                <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" style={{ transform: useLive ? 'translateX(20px)' : 'translateX(0)' }} />
              </button>
              <span className="text-white/60 text-sm">Use live API rate (auto-refreshes every 6 hours)</span>
            </div>
          </div>

          <GlassCard>
            <h2 className="text-white font-semibold mb-4">USD Pricing Display</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <button onClick={() => setEnableUsd(!enableUsdSite)} className="relative w-11 h-6 rounded-full transition-colors" style={{ background: enableUsdSite ? '#FF6B4A' : 'rgba(255,255,255,0.1)' }}>
                  <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" style={{ transform: enableUsdSite ? 'translateX(20px)' : 'translateX(0)' }} />
                </button>
                <span className="text-white/60 text-sm">Show USD price alongside INR on bills and bookings</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-white/50">
                <IndianRupee size={14} className="text-[#FF6B4A]" />
                <span>₹ 6,000 = <span className="text-white">${(6000 / effectiveRate).toFixed(2)} USD</span> at current rate</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-white/50">
                <IndianRupee size={14} className="text-[#FF6B4A]" />
                <span>₹ 4,500 = <span className="text-white">${(4500 / effectiveRate).toFixed(2)} USD</span> at current rate</span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── Section 3: User Roles ──────────────────────────── */}
      {activeSection === 3 && (
        <GlassCard>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">User Roles & Permissions</h2>
            <button onClick={() => setEditingUser({ isNew: true, name: '', email: '', role: 'admin', password: '' })} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FF6B4A]/10 text-[#FF6B4A] hover:bg-[#FF6B4A]/20 transition-colors">
              + Add User
            </button>
          </div>
          <div className="space-y-3 mb-6">
            {users.map((u, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FF6B4A]/15 flex items-center justify-center text-[#FF6B4A] font-bold text-sm">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{u.name}</p>
                    <p className="text-white/40 text-xs">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs px-2.5 py-1 rounded-full capitalize font-semibold" style={{ background: u.role === 'admin' ? 'rgba(255,107,74,0.15)' : 'rgba(255,255,255,0.08)', color: u.role === 'admin' ? '#FF6B4A' : 'rgba(255,255,255,0.5)' }}>
                    {u.role}
                  </span>
                  <button onClick={() => setEditingUser({ ...u, oldEmail: u.email })} className="text-xs text-[#FF6B4A] hover:underline px-2">Edit</button>
                  <button onClick={() => deleteUser(u.email)} className="text-xs text-red-400 hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </div>

          {editingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-[#1A1A1A] p-6 rounded-2xl w-full max-w-md border border-white/10 space-y-4">
                <h3 className="text-white font-semibold text-lg">{editingUser.isNew ? 'Add User' : 'Edit User Profile'}</h3>
                <div>
                  <Label>Name</Label>
                  <Input value={editingUser.name} onChange={(e: any) => setEditingUser({ ...editingUser, name: e.target.value })} />
                </div>
                <div>
                  <Label>Email (Login ID)</Label>
                  <Input type="email" value={editingUser.email} onChange={(e: any) => setEditingUser({ ...editingUser, email: e.target.value })} />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="text" value={editingUser.password} onChange={(e: any) => setEditingUser({ ...editingUser, password: e.target.value })} placeholder="Leave blank to keep unchanged" />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={editingUser.role} onChange={(e: any) => setEditingUser({ ...editingUser, role: e.target.value })}>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="accountant">Accountant</option>
                  </Select>
                </div>
                <div className="flex space-x-3 pt-3">
                  <button onClick={() => setEditingUser(null)} className="flex-1 py-2 rounded-xl text-white/70 font-semibold hover:bg-white/5 transition-colors">Cancel</button>
                  <button onClick={saveUser} className="flex-1 py-2 rounded-xl bg-[#FF6B4A] text-white font-semibold hover:bg-[#ff5530] transition-colors">Save Details</button>
                </div>
              </div>
            </div>
          )}

          {/* Role Permissions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th className="text-left px-3 py-2 text-white/40 uppercase">Permission</th>
                  <th className="text-center px-3 py-2 text-[#FF6B4A] uppercase">Admin</th>
                  <th className="text-center px-3 py-2 text-blue-400 uppercase">Staff</th>
                  <th className="text-center px-3 py-2 text-purple-400 uppercase">Accountant</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['View Dashboard', '✅', '✅', '✅'],
                  ['Manage Fleet', '✅', '❌', '❌'],
                  ['Edit Pricing', '✅', '❌', '❌'],
                  ['Create Bookings', '✅', '✅', '❌'],
                  ['View Bookings', '✅', '✅', '✅'],
                  ['Generate Bills', '✅', '✅', '✅'],
                  ['Record Payments', '✅', '✅', '✅'],
                  ['View Reports', '✅', '❌', '✅'],
                  ['Manage Users', '✅', '❌', '❌'],
                  ['Edit Settings', '✅', '❌', '❌'],
                ].map(([perm, ...vals]) => (
                  <tr key={perm} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="px-3 py-2 text-white/60">{perm}</td>
                    {vals.map((v, i) => (
                      <td key={i} className="px-3 py-2 text-center">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* ── Section 4: Notifications ───────────────────────── */}
      {activeSection === 4 && (
        <GlassCard>
          <h2 className="text-white font-semibold mb-5">WhatsApp Message Templates</h2>
          <p className="text-white/40 text-xs mb-5">
            Use placeholders: <span className="text-[#FF6B4A]">{'{'}</span>name{'}'}, {'{'}<span className="text-[#FF6B4A]">booking_number</span>{'}'}, {'{'}<span className="text-[#FF6B4A]">car</span>{'}'}, {'{'}<span className="text-[#FF6B4A]">date</span>{'}'}, {'{'}<span className="text-[#FF6B4A]">pickup</span>{'}'}, {'{'}<span className="text-[#FF6B4A]">balance_due</span>{'}'}
          </p>
          <div className="space-y-4">
            <div>
              <Label>Booking Confirmation Template</Label>
              <textarea
                value={notif.booking_confirm_template}
                onChange={(e) => setNotif((n) => ({ ...n, booking_confirm_template: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <p className="text-white/30 text-xs mt-1">Sent when a booking is confirmed</p>
            </div>
            <div>
              <Label>Payment Reminder Template</Label>
              <textarea
                value={notif.bill_reminder_template}
                onChange={(e) => setNotif((n) => ({ ...n, bill_reminder_template: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <p className="text-white/30 text-xs mt-1">Sent for outstanding payment reminders</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-bold transition-all"
        style={{ background: saved ? '#4ADE80' : '#FF6B4A' }}
      >
        <Save size={16} />
        <span>{saved ? '✓ Saved!' : 'Save Settings'}</span>
      </button>
    </div>
  );
}
