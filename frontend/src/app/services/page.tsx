'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Plane, Building, Compass, Briefcase, Sparkles, CheckCircle } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function ServicesPage() {
  const { openBooking } = useBooking();
  const services = [
    {
      icon: <Plane className="h-8 w-8 text-accent-primary" />,
      title: 'Airport Transfers (BOM)',
      description: 'Stress-free transfers to and from Chhatrapati Shivaji Maharaj International Airport.',
      points: [
        'Meet & Greet service (driver waits with your name board inside terminal)',
        'Complimentary flight tracking (adjust pickup automatically for delays)',
        'Helper assistance with heavy bags and luggage loading',
        'Fixed upfront fares including airport parking charges'
      ]
    },
    {
      icon: <Building className="h-8 w-8 text-accent-primary" />,
      title: 'Local Rentals (Within Mumbai)',
      description: 'Chauffeur-driven local running packages for shopping, meetings, or sightseeing.',
      points: [
        'Flexible 8 Hours / 80 Km and 12 Hours / 100 Km packages',
        'Hourly extra rates clearly detailed upfront',
        'Zero fuel charge, zero driver allowance headaches',
        'Clean air-conditioned fleet with professional drivers'
      ]
    },
    {
      icon: <Compass className="h-8 w-8 text-accent-primary" />,
      title: 'Outstation Trips',
      description: 'Intercity travel made easy. Reach nearby cities with experienced highway drivers.',
      points: [
        'Popular weekend routes: Pune, Lonavala, Nashik, Shirdi, Alibaug',
        'One-way drops or multi-day roundtrip bookings',
        'Well-maintained high-speed MUVs and sedans',
        'GPS tracking enabled on all outstation routes for safety'
      ]
    },
    {
      icon: <Briefcase className="h-8 w-8 text-accent-primary" />,
      title: 'Corporate Travel Solutions',
      description: 'Premium transport logistics for employees, managers, and corporate guests.',
      points: [
        'Seamless B2B booking portal with company dashboard',
        'Consolidated monthly invoicing (GST compliant invoices)',
        'Luxury vehicles (BMW, Audi, Mercedes) available on demand',
        '24/7 dedicated account manager for emergencies'
      ]
    }
  ];

  return (
    <>
      <Navbar />
      <main className="bg-bg-primary min-h-screen pt-32 pb-20 text-left">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="space-y-4 mb-16 text-center max-w-xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-accent-primary/10 border border-accent-primary/30 px-3 py-1 rounded-full text-accent-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>Full Coverage</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white">Our Premium Services</h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              From airport greetings to long-distance highway cruises, Suman Travels handles your travel requirements with absolute precision.
            </p>
          </div>

          <div className="space-y-12">
            {services.map((srv, idx) => (
              <div 
                key={idx} 
                className="glassmorphism p-8 rounded-2xl flex flex-col lg:flex-row gap-8 items-start lg:items-center"
              >
                <div className="lg:w-1/3 space-y-4 text-left">
                  <div className="w-16 h-16 rounded-full bg-accent-primary/10 flex items-center justify-center">
                    {srv.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{srv.title}</h2>
                  <p className="text-sm text-text-secondary leading-relaxed">{srv.description}</p>
                  <button 
                    onClick={() => openBooking('', srv.title)}
                    className="inline-block px-6 py-2.5 bg-accent-primary hover:bg-accent-hover text-white text-xs font-bold rounded-lg cursor-pointer transition-colors mt-2 focus:outline-none"
                  >
                    Book This Service
                  </button>
                </div>

                <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {srv.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start space-x-3 text-left">
                      <CheckCircle className="h-4.5 w-4.5 text-accent-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-text-secondary leading-relaxed">{pt}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
