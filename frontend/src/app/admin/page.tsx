'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, Car, Users, FileText, IndianRupee, AlertTriangle,
  CheckCircle2, Clock, Wrench, ArrowUpRight, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

// ── Mock data (replace with Supabase queries when live) ───────
const REVENUE_DATA = [
  { month: 'Jan', revenue: 85000 },
  { month: 'Feb', revenue: 92000 },
  { month: 'Mar', revenue: 110000 },
  { month: 'Apr', revenue: 98000 },
  { month: 'May', revenue: 125000 },
  { month: 'Jun', revenue: 143000 },
];

const BOOKING_SOURCE = [
  { name: 'WhatsApp', value: 52 },
  { name: 'Phone',    value: 28 },
  { name: 'Website',  value: 14 },
  { name: 'Walk-in',  value: 6  },
];

const PIE_COLORS = ['#FF6B4A', '#FFB347', '#4ADE80', '#60A5FA'];

const CAR_UTILIZATION = [
  { car: 'Hycross',  pct: 82 },
  { car: 'Crysta',   pct: 74 },
  { car: 'Innova',   pct: 91 },
  { car: 'Ertiga',   pct: 58 },
  { car: 'Dzire',    pct: 65 },
];

const RECENT_ACTIVITY = [
  { icon: '🚗', text: 'Toyota Crysta — Booking #ST-2026-1024 — Started 10:00 AM — Marine Drive → Lonavala', time: '10 mins ago', color: '#4ADE80' },
  { icon: '💰', text: 'Payment received ₹4,000 from Rahul Sharma (UPI)', time: '42 mins ago', color: '#FF6B4A' },
  { icon: '🌙', text: 'Driver Night Charge ₹200 applied — Booking #ST-2026-1021', time: '2 hrs ago', color: '#FFB347' },
  { icon: '✅', text: 'Booking #ST-2026-1022 completed — Dzire — Airport T2 Drop', time: '3 hrs ago', color: '#60A5FA' },
  { icon: '📋', text: 'New booking request from Priya Mehta — Ertiga Local 8Hrs', time: '5 hrs ago', color: '#C084FC' },
];

const ALERTS = [
  { type: 'danger',  icon: AlertTriangle, text: 'Booking #ST-2026-1019 — Overdue return by 2 hours', sub: 'Expected drop at 6:00 PM' },
  { type: 'warning', icon: Clock, text: 'Pending night charges on 2 completed bookings', sub: 'Review billing for ST-1017, ST-1018' },
  { type: 'info',    icon: Car, text: 'Ertiga (MH-01-AB-1003) — Service due in 500 km', sub: 'Current: 28,000 km | Next: 28,500 km' },
];

const GlassCard = ({ children, className = '', index = 0 }: { children: React.ReactNode; className?: string; index?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut", type: "spring", bounce: 0.4 }}
    className={`rounded-2xl p-5 ${className}`}
    style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(20px)',
    }}
  >
    {children}
  </motion.div>
);

const StatCard = ({ label, value, sub, icon: Icon, color, trend, index }: any) => (
  <GlassCard index={index}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
        {sub && <p className="text-white/40 text-xs mt-1">{sub}</p>}
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
        <Icon size={20} style={{ color }} />
      </div>
    </div>
    {trend && (
      <div className="mt-3 flex items-center space-x-1 text-xs text-green-400">
        <ArrowUpRight size={12} />
        <span>{trend}</span>
      </div>
    )}
  </GlassCard>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl px-4 py-2 text-sm" style={{ background: '#1F1F1F', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="text-white/60 mb-1">{label}</p>
        <p className="text-[#FF6B4A] font-bold">₹ {payload[0].value.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [todayDate] = useState(new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="text-white text-3xl font-bold flex gap-2"
          >
            <div className="overflow-hidden pb-1">
              <motion.span variants={{ hidden: { y: "100%", opacity: 0, rotateZ: 5 }, show: { y: 0, opacity: 1, rotateZ: 0, transition: { type: "spring", damping: 15, stiffness: 80 } } }} className="inline-block">Admin</motion.span>
            </div>
            <div className="overflow-hidden pb-1">
              <motion.span variants={{ hidden: { y: "100%", opacity: 0, rotateZ: 5 }, show: { y: 0, opacity: 1, rotateZ: 0, transition: { type: "spring", damping: 15, stiffness: 80 } } }} className="inline-block">Dashboard</motion.span>
            </div>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-white/40 text-sm mt-0.5"
          >
            {todayDate}
          </motion.p>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex items-center space-x-2 text-xs bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 rounded-full"
        >
          <Activity size={12} className="animate-pulse" />
          <span>Live</span>
        </motion.div>
      </div>

      {/* ── Revenue + Stats Row ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          index={0}
          label="Today's Revenue"
          value="₹ 14,800"
          sub="4 trips completed"
          icon={IndianRupee}
          color="#4ADE80"
          trend="+12% vs yesterday"
        />
        <StatCard
          index={1}
          label="Monthly Revenue"
          value="₹ 1,43,000"
          sub="June 2026"
          icon={TrendingUp}
          color="#FF6B4A"
          trend="+14% vs May"
        />
        <StatCard
          index={2}
          label="Pending Payments"
          value="₹ 8,200"
          sub="3 bills outstanding"
          icon={FileText}
          color="#FFB347"
        />
        <StatCard
          index={3}
          label="Active Bookings"
          value="6"
          sub="2 on trip right now"
          icon={Car}
          color="#60A5FA"
        />
      </div>

      {/* ── Fleet Status Row ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Cars', value: '5', icon: Car, color: '#a78bfa' },
          { label: 'Available', value: '3', icon: CheckCircle2, color: '#4ADE80' },
          { label: 'On Trip', value: '2', icon: Activity, color: '#FF6B4A' },
          { label: 'Maintenance', value: '0', icon: Wrench, color: '#FFB347' },
        ].map((s) => (
          <GlassCard key={s.label}>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-white/50 text-[11px] uppercase tracking-wide">{s.label}</p>
                <p className="text-white text-xl font-bold">{s.value}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ── Charts Row ──────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue Bar Chart */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold">Monthly Revenue</h2>
              <p className="text-white/40 text-xs">Last 6 months (₹)</p>
            </div>
            <div className="text-xs text-[#FF6B4A] bg-[#FF6B4A]/10 px-2.5 py-1 rounded-full">INR</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REVENUE_DATA} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="revenue" fill="#FF6B4A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Booking Source Pie */}
        <GlassCard>
          <h2 className="text-white font-semibold mb-1">Booking Sources</h2>
          <p className="text-white/40 text-xs mb-4">This month</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={BOOKING_SOURCE}
                cx="50%" cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {BOOKING_SOURCE.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1F1F1F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {BOOKING_SOURCE.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-white/60">{s.name}</span>
                </div>
                <span className="text-white font-semibold">{s.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── Car Utilization ─────────────────────────────────── */}
      <GlassCard>
        <h2 className="text-white font-semibold mb-4">Car Utilization This Month</h2>
        <div className="space-y-3">
          {CAR_UTILIZATION.map((c) => (
            <div key={c.car} className="flex items-center space-x-4">
              <div className="w-20 text-white/60 text-sm shrink-0">{c.car}</div>
              <div className="flex-1 bg-white/5 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${c.pct}%`, background: c.pct > 80 ? '#FF6B4A' : c.pct > 60 ? '#FFB347' : '#4ADE80' }}
                />
              </div>
              <div className="w-10 text-right text-sm font-bold" style={{ color: c.pct > 80 ? '#FF6B4A' : c.pct > 60 ? '#FFB347' : '#4ADE80' }}>
                {c.pct}%
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ── Activity + Alerts ───────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Activity Feed */}
        <GlassCard>
          <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm leading-relaxed">{a.text}</p>
                  <p className="text-white/30 text-xs mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Alerts */}
        <GlassCard>
          <h2 className="text-white font-semibold mb-4">Alerts & Notifications</h2>
          <div className="space-y-3">
            {ALERTS.map((a, i) => (
              <div
                key={i}
                className="flex items-start space-x-3 p-3 rounded-xl"
                style={{
                  background: a.type === 'danger' ? 'rgba(239,68,68,0.07)' : a.type === 'warning' ? 'rgba(255,179,71,0.07)' : 'rgba(96,165,250,0.07)',
                  border: `1px solid ${a.type === 'danger' ? 'rgba(239,68,68,0.2)' : a.type === 'warning' ? 'rgba(255,179,71,0.2)' : 'rgba(96,165,250,0.2)'}`,
                }}
              >
                <a.icon
                  size={16}
                  className="mt-0.5 shrink-0"
                  style={{ color: a.type === 'danger' ? '#EF4444' : a.type === 'warning' ? '#FFB347' : '#60A5FA' }}
                />
                <div>
                  <p className="text-white/90 text-sm">{a.text}</p>
                  <p className="text-white/40 text-xs mt-0.5">{a.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
