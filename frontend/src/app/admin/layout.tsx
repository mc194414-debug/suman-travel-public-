'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCookie, deleteCookie } from '../../lib/cookies';
import {
  LayoutDashboard, Car, CalendarDays, FileText, Users, Truck,
  BarChart3, Settings, LogOut, ChevronLeft, ChevronRight,
  Bell, Search, Menu, X
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard',  href: '/admin',           icon: LayoutDashboard },
  { label: 'Fleet',      href: '/admin/fleet',      icon: Car },
  { label: 'Bookings',   href: '/admin/bookings',   icon: CalendarDays },
  { label: 'Billing',    href: '/admin/billing',    icon: FileText },
  { label: 'Invoices',   href: '/admin/invoices',   icon: FileText },
  { label: 'Customers',  href: '/admin/customers',  icon: Users },
  { label: 'Drivers',    href: '/admin/drivers',    icon: Truck },
  { label: 'Reports',    href: '/admin/reports',    icon: BarChart3 },
  { label: 'Settings',   href: '/admin/settings',   icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const pathname = usePathname();
  const router = useRouter();

  // Auth guard
  useEffect(() => {
    if (pathname === '/admin/login') return;
    const adminCookie = getCookie('suman_admin');
    if (!adminCookie) {
      router.replace('/admin/login');
    }
  }, [pathname, router]);

  // Load admin display name
  useEffect(() => {
    const adminCookie = getCookie('suman_admin');
    if (adminCookie) {
      try {
        const name = JSON.parse(adminCookie)?.email?.split('@')[0] || 'Admin';
        setAdminName(name);
      } catch {}
    }
  }, [pathname]);

  // Don't wrap login page — must be AFTER all hooks
  if (pathname === '/admin/login') return <>{children}</>;


  const handleLogout = () => {
    deleteCookie('suman_admin');
    deleteCookie('suman_user');
    router.push('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-4 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="w-8 h-8 rounded-lg bg-[#FF6B4A] flex items-center justify-center shrink-0">
          <Car className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div className="ml-3 overflow-hidden">
            <span className="text-white font-bold text-sm">Suman Travels</span>
            <p className="text-white/40 text-[10px] uppercase tracking-widest">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto custom-scrollbar" data-lenis-prevent="true">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group"
              style={{
                background: active ? 'rgba(255,107,74,0.15)' : 'transparent',
                border: active ? '1px solid rgba(255,107,74,0.25)' : '1px solid transparent',
              }}
            >
              <Icon
                className="shrink-0 transition-colors"
                size={18}
                style={{ color: active ? '#FF6B4A' : 'rgba(255,255,255,0.45)' }}
              />
              {!collapsed && (
                <span
                  className="ml-3 text-sm font-medium truncate transition-colors"
                  style={{ color: active ? '#FF6B4A' : 'rgba(255,255,255,0.6)' }}
                >
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user + logout */}
      <div className="px-2 pb-4 space-y-1 border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="w-7 h-7 rounded-full bg-[#FF6B4A]/20 flex items-center justify-center shrink-0 text-xs text-[#FF6B4A] font-bold">
            {adminName[0].toUpperCase()}
          </div>
          {!collapsed && (
            <div className="ml-2.5 overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">{adminName}</p>
              <p className="text-white/30 text-[10px]">Administrator</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 rounded-xl hover:bg-red-500/10 transition-colors group"
        >
          <LogOut size={16} className="text-white/30 group-hover:text-red-400 shrink-0 transition-colors" />
          {!collapsed && (
            <span className="ml-3 text-sm text-white/30 group-hover:text-red-400 transition-colors">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: '#0F0F0F' }}>
      {/* Desktop Sidebar */}
      <aside
        className="sticky top-0 h-screen hidden lg:flex flex-col shrink-0 transition-all duration-300"
        style={{
          width: collapsed ? '72px' : '240px',
          background: 'rgba(255,255,255,0.03)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-full w-5 h-10 rounded-r-lg flex items-center justify-center text-white/40 hover:text-white transition-colors z-10"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: 'none', marginLeft: collapsed ? '72px' : '240px' }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="fixed left-0 top-0 h-full w-64 z-50 lg:hidden flex flex-col"
            style={{ background: '#141414', borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 shrink-0 flex items-center justify-between px-6 h-16 backdrop-blur-xl"
          style={{
            background: 'rgba(255,255,255,0.02)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden sm:flex items-center space-x-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2 w-64">
              <Search size={14} className="text-white/30" />
              <input
                type="text"
                placeholder="Search bookings, customers..."
                className="bg-transparent text-white text-sm flex-1 focus:outline-none placeholder-white/20"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="relative p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FF6B4A] rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#FF6B4A]/20 flex items-center justify-center text-xs text-[#FF6B4A] font-bold">
              {adminName[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
