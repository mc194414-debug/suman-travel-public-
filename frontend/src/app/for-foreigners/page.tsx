'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Shield, Sparkles, CheckCircle2, DollarSign, Eye, Languages, HelpCircle } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function ForForeignersPage() {
  const { openBooking } = useBooking();
  const [inrAmount, setInrAmount] = useState('4500');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  
  const rates: { [key: string]: number } = { USD: 0.012, EUR: 0.011, GBP: 0.0094 };

  const getConvertedPrice = (inrVal: string) => {
    const val = parseFloat(inrVal.replace(/,/g, ''));
    if (isNaN(val)) return '—';
    const rate = rates[selectedCurrency];
    const symbol = selectedCurrency === 'USD' ? '$' : selectedCurrency === 'EUR' ? '€' : '£';
    return `${symbol}${Math.round(val * rate)}`;
  };

  const routes = [
    { route: 'BOM Airport ➔ South Mumbai', dist: '30 km', duration: '1 hr', inr: '2,500' },
    { route: 'Mumbai ➔ Lonavala Hill Station', dist: '85 km', duration: '2.5 hrs', inr: '6,000' },
    { route: 'Mumbai ➔ Pune City', dist: '150 km', duration: '3 hrs', inr: '8,500' },
    { route: 'Mumbai Darshan (1 Day Tour)', dist: '80 km', duration: '8 hrs', inr: '4,500' }
  ];

  return (
    <>
      <Navbar />
      <main className="bg-bg-primary min-h-screen pt-32 pb-20 text-left">
        <div className="max-w-[1280px] mx-auto px-6 space-y-16">
          
          {/* Hero */}
          <div className="glassmorphism p-8 md:p-12 rounded-3xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 bg-accent-primary/10 border border-accent-primary/30 px-3 py-1 rounded-full text-accent-primary text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                <span>International Guest Center</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                Visiting Mumbai?<br />
                <span className="bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end bg-clip-text text-transparent">
                  We've Got You Covered.
                </span>
              </h1>
              <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                No Indian driving license required. Professional English-speaking chauffeurs included. Safe airport pickups and transparent fixed pricing in your local currency.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => openBooking('', 'airport')} 
                  className="px-6 py-3 bg-accent-primary hover:bg-accent-hover text-white text-xs font-bold rounded-full shadow-lg transition-all cursor-pointer focus:outline-none"
                >
                  Book Airport Pickup
                </button>
                <a href="#how-it-works" className="px-6 py-3 border border-white/20 hover:bg-white/5 text-white text-xs font-bold rounded-full transition-all">
                  Learn How it Works
                </a>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop" 
                alt="Chauffeur driven car"
                className="w-full h-full object-cover filter brightness-[0.7]" 
              />
            </div>
          </div>

          {/* 6 Grid Value Props */}
          <div id="how-it-works" className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <h2 className="text-xs font-bold text-accent-primary uppercase tracking-widest">Safe & Simple</h2>
              <p className="text-2xl md:text-3xl font-bold text-white">Why International Guests Choose Us</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <Shield className="h-6 w-6 text-accent-primary" />, title: 'No License Needed', desc: 'Since all rentals are 100% chauffeur-driven, you do not need an International Driving Permit or local validation.' },
                { icon: <Languages className="h-6 w-6 text-accent-primary" />, title: 'English-Speaking Drivers', desc: 'Communicate with ease. All drivers assigned to international guests speak, read, and understand English.' },
                { icon: <DollarSign className="h-6 w-6 text-accent-primary" />, title: 'Transparent USD Quotes', desc: 'Check quotes and pay in USD, EUR, or GBP to avoid local currency conversions or currency scams.' },
                { icon: <Sparkles className="h-6 w-6 text-accent-primary" />, title: 'Airport Meet & Greet', desc: 'The driver meets you inside the BOM Arrival gate with a name sign, assists with luggage, and walks you to the car.' },
                { icon: <Eye className="h-6 w-6 text-accent-primary" />, title: 'GPS Tracking for Safety', desc: 'Secure location tracking link shared directly via WhatsApp. Keep family back home updated in real time.' },
                { icon: <CheckCircle2 className="h-6 w-6 text-accent-primary" />, title: '24/7 Operations Support', desc: 'Flight delayed? Immigration taking time? Our operations team tracks your flight and adjusts pickup schedules.' }
              ].map((val, idx) => (
                <div key={idx} className="glassmorphism p-6 rounded-2xl space-y-3 text-left">
                  <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center">
                    {val.icon}
                  </div>
                  <h3 className="text-white font-bold text-base">{val.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Routes with Currency Toggle */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6 text-left">
              <h3 className="text-2xl font-bold text-white">Popular Tourist Routes</h3>
              <div className="glassmorphism rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-white font-bold text-xs uppercase tracking-wider">
                      <th className="p-4">Route</th>
                      <th className="p-4">Distance</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Est. Price ({selectedCurrency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-text-secondary">
                    {routes.map((r, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 text-white font-medium">{r.route}</td>
                        <td className="p-4">{r.dist}</td>
                        <td className="p-4">{r.duration}</td>
                        <td className="p-4 font-bold text-accent-primary">{getConvertedPrice(r.inr)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Live Converter Widget */}
            <div className="glassmorphism p-6 rounded-2xl space-y-4 text-left">
              <h3 className="text-white font-bold text-base">Currency Guide</h3>
              <p className="text-xs text-text-secondary">Select your currency to convert estimates instantly:</p>
              
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-semibold">
                {['USD', 'EUR', 'GBP'].map((cur) => (
                  <button
                    key={cur}
                    onClick={() => setSelectedCurrency(cur)}
                    className={`flex-1 py-2 rounded-lg transition-colors ${selectedCurrency === cur ? 'bg-accent-primary text-white' : 'text-text-secondary hover:text-white'}`}
                  >
                    {cur}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-[10px] text-text-muted font-bold uppercase mb-1.5">Enter Price in INR (₹)</label>
                <input 
                  type="number" 
                  value={inrAmount}
                  onChange={(e) => setInrAmount(e.target.value)}
                  placeholder="e.g. 4500"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
                />
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                <p className="text-[10px] text-text-muted font-bold uppercase">Converted Price</p>
                <p className="text-white font-extrabold text-2xl mt-1">{getConvertedPrice(inrAmount)}</p>
              </div>
            </div>
          </div>

          {/* Document Checklist */}
          <div className="glassmorphism p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-left">
              <h3 className="text-2xl font-bold text-white">Document Requirements</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                We handle passenger check-in procedures with local security and luxury hotels. To secure your chauffeur booking records, we only require:
              </p>
              <ul className="space-y-2 text-xs text-text-secondary pl-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-accent-primary shrink-0" />
                  <span>Passport Copy photo page (for registration log)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-accent-primary shrink-0" />
                  <span>Hotel address or active Flight details (for terminal tracking)</span>
                </li>
              </ul>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/5 text-center space-y-2">
              <p className="text-accent-primary text-xs uppercase tracking-widest font-bold">No Stress Guarantee</p>
              <p className="text-white text-sm font-semibold">NO driving license checks. NO international driving permits needed.</p>
              <p className="text-xs text-text-muted">Your driver takes care of everything on the road.</p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
