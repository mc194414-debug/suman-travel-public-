'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Menu, X, User } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openBooking } = useBooking();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Fleet', href: '/fleet' },
    { name: 'Services', href: '/services' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
    { name: 'For Foreigners', href: '/for-foreigners' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300 ${
      scrolled 
        ? 'glassmorphism bg-[#0B0F19]/80 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-[1280px] mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 text-white font-bold text-xl group">
          <img 
            src="/assets/logo.png" 
            alt="Suman Travels Logo" 
            className="h-10 w-10 object-contain rounded-full border border-white/10 group-hover:scale-105 transition-transform duration-300" 
          />
          <span>Suman <span className="text-accent-primary">Travels</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-medium transition-colors relative py-2 ${
                  isActive ? 'text-accent-primary' : 'text-text-secondary hover:text-white'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA & Auth Action */}
        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={() => openBooking()} 
            className="px-6 py-2 bg-accent-primary hover:bg-accent-hover text-white text-sm font-semibold rounded-full shadow-lg shadow-accent-primary/20 hover:shadow-accent-primary/40 hover:-translate-y-[2px] transition-all duration-300 cursor-pointer focus:outline-none"
          >
            Book Now
          </button>
          <Link 
            href="/login" 
            className="p-2 text-text-secondary hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:bg-white/5 rounded-lg focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-40 bg-[#0B0F19] flex flex-col p-6 space-y-6 md:hidden">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-semibold py-2 border-b border-white/5 ${
                    isActive ? 'text-accent-primary' : 'text-text-secondary'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="flex flex-col space-y-4 pt-6">
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                openBooking();
              }}
              className="w-full text-center py-3 bg-accent-primary hover:bg-accent-hover text-white font-semibold rounded-full cursor-pointer focus:outline-none"
            >
              Book Now
            </button>
            <Link 
              href="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full border border-white/10"
            >
              Login / Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
