'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Users, Briefcase, Sparkles } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function FleetPage() {
  const { openBooking } = useBooking();
  const fleet = [
    {
      name: 'Toyota Innova Crysta',
      category: 'MUV',
      seats: 7,
      luggage: 4,
      ac: true,
      price: '3,800',
      image: '/assets/innova_crysta.png',
      desc: 'Comfortable long distance touring MUV, ideal for corporate travel and family trips.'
    },
    {
      name: 'Toyota Innova Hycross',
      category: 'Luxury MUV',
      seats: 7,
      luggage: 4,
      ac: true,
      price: '4,500',
      image: '/assets/innova_hycross.png',
      desc: 'Premium hybrid model featuring state-of-the-art safety features and silent high-efficiency cabin comfort.'
    },
    {
      name: 'Suzuki Ertiga',
      category: 'MUV',
      seats: 6,
      luggage: 3,
      ac: true,
      price: '3,000',
      image: '/assets/ertiga.png',
      desc: 'Affordable family carrier, clean AC comfort for group airport pickups.'
    },
    {
      name: 'Swift Dzire / Toyota Etios',
      category: 'Sedan',
      seats: 4,
      luggage: 2,
      ac: true,
      price: '2,500',
      image: '/assets/dezire.png',
      desc: 'Sleek local running sedan, perfect for city traffic runs and solo business meetings.'
    }
  ];

  return (
    <>
      <Navbar />
      <main className="bg-bg-primary min-h-screen pt-32 pb-20 text-left">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center space-x-2 bg-accent-primary/10 border border-accent-primary/30 px-3 py-1 rounded-full text-accent-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>Chauffeur Included</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white">Our Premium Fleet</h1>
            <p className="text-text-secondary max-w-xl text-sm leading-relaxed">
              Explore our range of premium clean vehicles. All rentals include a professional driver, transparent pricing, and 24/7 operations dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {fleet.map((vehicle, idx) => (
              <div key={idx} className="glassmorphism p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-white/5 rounded-xl">
                  <img src={vehicle.image} alt={vehicle.name} className="max-h-36 object-contain" />
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-accent-primary uppercase tracking-widest bg-accent-primary/10 px-2 py-0.5 rounded-full">
                      {vehicle.category}
                    </span>
                    <h2 className="text-white font-bold text-xl mt-2">{vehicle.name}</h2>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{vehicle.desc}</p>
                  <div className="flex space-x-4 text-xs text-text-secondary">
                    <span className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-accent-primary" />
                      <span>{vehicle.seats} Seats</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Briefcase className="h-4 w-4 text-accent-primary" />
                      <span>{vehicle.luggage} Bags</span>
                    </span>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase font-semibold">8 Hrs / 80 Km Package</p>
                      <p className="text-white font-extrabold text-xl">₹{vehicle.price}</p>
                    </div>
                    <button 
                      onClick={() => openBooking(vehicle.name)}
                      className="px-6 py-2.5 bg-accent-primary hover:bg-accent-hover text-white text-xs font-bold rounded-lg cursor-pointer transition-all focus:outline-none"
                    >
                      Book Ride
                    </button>
                  </div>
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
