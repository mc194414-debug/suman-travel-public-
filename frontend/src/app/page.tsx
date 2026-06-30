'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Shield, 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  Briefcase, 
  Star, 
  ArrowRight,
  Plane, 
  Building, 
  Compass, 
  Sparkles,
  ChevronRight,
  Phone
} from 'lucide-react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useBooking } from '../context/BookingContext';

export default function Home() {
  const { openBooking } = useBooking();
  const [bookingType, setBookingType] = useState('local');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [vehicleCategory, setVehicleCategory] = useState('All');

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

  const frameRef = useRef<HTMLImageElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  // Scroll animations observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-12');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const fleet = [
    {
      name: 'Toyota Innova Crysta',
      category: 'MUV',
      seats: 7,
      luggage: 4,
      ac: true,
      price: '3,800',
      image: '/assets/innova_crysta.png'
    },
    {
      name: 'Toyota Innova Hycross',
      category: 'Luxury',
      seats: 7,
      luggage: 4,
      ac: true,
      price: '4,500',
      image: '/assets/innova_hycross.png'
    },
    {
      name: 'Suzuki Ertiga',
      category: 'MUV',
      seats: 6,
      luggage: 3,
      ac: true,
      price: '3,000',
      image: '/assets/ertiga.png'
    },
    {
      name: 'Swift Dzire / Toyota Etios',
      category: 'Sedan',
      seats: 4,
      luggage: 2,
      ac: true,
      price: '2,500',
      image: '/assets/dezire.png'
    }
  ];

  const filteredFleet = vehicleCategory === 'All' 
    ? fleet 
    : fleet.filter(v => v.category === vehicleCategory);

  return (
    <>
      <Navbar />
      
      {/* 1. Hero Section */}
      <div className="relative h-screen bg-black z-10 w-full flex items-center overflow-hidden">
        {/* Static Animated Background with Parallax */}
        <div className="absolute inset-0 w-full h-full z-0 bg-black overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/80 via-black/40 to-bg-primary z-10"></div>
          <motion.img 
            style={{ y, scale: 1.1 }}
            src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=2000&auto=format&fit=crop" 
            alt="Mumbai Skyline Sunset" 
            className="w-full h-full object-cover object-center opacity-70 origin-top"
          />
        </div>

        {/* Foreground text and forms (starts at opacity 0, fades in on scroll) */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center transition-all duration-700 ease-out">
            {/* Hero Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: "backOut" }}
                className="inline-flex px-5 py-2 rounded-full border border-accent-primary/30 bg-black/40 backdrop-blur-sm"
              >
                <span className="text-accent-primary font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-primary animate-ping"></span> 
                  Premium Chauffeur Service
                </span>
              </motion.div>
              
              <motion.h1 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                  }
                }}
                className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-white drop-shadow-xl flex flex-col items-start"
              >
                <div className="flex gap-4 flex-wrap">
                  <div className="overflow-hidden pb-2"><motion.span variants={{ hidden: { y: "100%", opacity: 0, rotateZ: 5 }, show: { y: 0, opacity: 1, rotateZ: 0, transition: { type: "spring", damping: 15, stiffness: 80 } } }} className="inline-block text-white">Premium Car</motion.span></div>
                  <div className="overflow-hidden pb-2"><motion.span variants={{ hidden: { y: "100%", opacity: 0, rotateZ: 5 }, show: { y: 0, opacity: 1, rotateZ: 0, transition: { type: "spring", damping: 15, stiffness: 80 } } }} className="inline-block text-white">Rental</motion.span></div>
                </div>
                <div className="flex gap-4 mt-2 flex-wrap">
                  <div className="overflow-hidden pb-4">
                    <motion.span variants={{ hidden: { y: "100%", opacity: 0, rotateZ: 5 }, show: { y: 0, opacity: 1, rotateZ: 0, transition: { type: "spring", damping: 15, stiffness: 80 } } }} className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-orange-400 to-yellow-400 drop-shadow-[0_0_30px_rgba(255,107,71,0.3)]">
                      Near Mumbai
                    </motion.span>
                  </div>
                </div>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed drop-shadow-md"
              >
                Top-rated luxury chauffeur & car rental near Mumbai. Trusted by foreigners & locals for safe airport transfers, local trips, and outstation rides across Maharashtra.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <button 
                  onClick={() => openBooking()} 
                  className="px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-hover text-white font-bold text-lg rounded-full shadow-[0_0_40px_rgba(255,107,71,0.3)] hover:shadow-[0_0_60px_rgba(255,107,71,0.6)] hover:scale-105 transition-all duration-300 flex items-center space-x-2 cursor-pointer focus:outline-none group"
                >
                  <span>Book Your Ride</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </motion.div>
            </motion.div>

              {/* Hero Right Widget (Quick Booking) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6, type: "spring", bounce: 0.4 }}
                className="lg:col-span-5 w-full"
                style={{ perspective: 1000 }}
              >
                <div className="glassmorphism p-6 rounded-2xl w-full text-left space-y-4 shadow-2xl border border-white/10 bg-[#0B0F19]/40 backdrop-blur-md">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h3 className="text-white font-bold text-lg">Quick Booking</h3>
                    <div className="flex bg-white/5 p-1 rounded-full border border-white/10 text-xs">
                      <button 
                        onClick={() => setBookingType('local')}
                        className={`px-3 py-1 rounded-full transition-colors ${bookingType === 'local' ? 'bg-accent-primary text-white' : 'text-text-secondary hover:text-white'}`}
                      >
                        Local
                      </button>
                      <button 
                        onClick={() => setBookingType('airport')}
                        className={`px-3 py-1 rounded-full transition-colors ${bookingType === 'airport' ? 'bg-accent-primary text-white' : 'text-text-secondary hover:text-white'}`}
                      >
                        Airport
                      </button>
                      <button 
                        onClick={() => setBookingType('outstation')}
                        className={`px-3 py-1 rounded-full transition-colors ${bookingType === 'outstation' ? 'bg-accent-primary text-white' : 'text-text-secondary hover:text-white'}`}
                      >
                        Outstation
                      </button>
                    </div>
                  </div>

                  {/* Foreigner Visitor Toggle */}
                  <div className="flex items-center justify-between bg-white/5 px-4 py-2.5 rounded-xl border border-white/10">
                    <span className="text-xs font-medium text-white">Are you a foreign visitor?</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-primary"></div>
                    </label>
                  </div>

                  {/* Booking Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">Pick-up Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-accent-primary" />
                        <input 
                          type="text" 
                          placeholder="Enter pickup area in Mumbai"
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">Drop-off Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-accent-primary" />
                        <input 
                          type="text" 
                          placeholder="Destination city or airport"
                          value={dropoff}
                          onChange={(e) => setDropoff(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-accent-primary" />
                          <input 
                            type="date" 
                            className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/20 transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">Time</label>
                        <div className="relative">
                          <Clock className="absolute left-3.5 top-3 h-4 w-4 text-accent-primary" />
                          <input 
                            type="time" 
                            className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">Vehicle Type</label>
                      <select className="w-full px-3 py-2.5 bg-[#111827] border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all">
                        <option>All Vehicles</option>
                        <option>SUV</option>
                        <option>Sedan</option>
                        <option>Luxury MUV</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={() => openBooking('', bookingType)}
                    className="block w-full text-center py-3 bg-accent-primary hover:bg-accent-hover text-white font-bold rounded-xl shadow-lg cursor-pointer transition-all duration-300 focus:outline-none"
                  >
                    Search Available Fleet
                  </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 2. Stats Bar */}
      <section className="bg-bg-primary py-12 relative z-20">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Happy Customers', val: '5,000+' },
            { label: 'Premium Vehicles', val: '50+' },
            { label: 'Destinations', val: '100+' },
            { label: 'Customer Support', val: '24/7' }
          ].map((stat, i) => (
            <div key={i} className="glassmorphism p-6 rounded-2xl text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.val}</p>
              <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Services Section */}
      <section className="py-20 bg-bg-secondary relative">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-accent-primary uppercase tracking-widest">Our Premium Services</h2>
            <p className="text-3xl md:text-4xl font-bold text-white">Tailored Chauffeur Services</p>
            <p className="text-sm text-text-secondary">We deliver clean, safe, and modern travel solutions matching your specific routing requests.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                icon: <Plane className="h-6 w-6 text-accent-primary" />, 
                title: 'Airport Transfers', 
                desc: 'Reliable BOM Terminal pickups and drops with flight tracking and meet & greet support.' 
              },
              { 
                icon: <Building className="h-6 w-6 text-accent-primary" />, 
                title: 'Local Rentals', 
                desc: 'Flexible 8 Hrs/80 Km & 12 Hrs/100 Km packages for business runs or shopping trips in Mumbai.' 
              },
              { 
                icon: <Compass className="h-6 w-6 text-accent-primary" />, 
                title: 'Outstation Trips', 
                desc: 'Travel safely to Pune, Lonavala, Nashik, Alibaug, and Shirdi with premium drivers.' 
              },
              { 
                icon: <Briefcase className="h-6 w-6 text-accent-primary" />, 
                title: 'Corporate Travel', 
                desc: 'Streamlined corporate logins, dedicated managers, monthly billing, and luxury cars.' 
              }
            ].map((srv, idx) => (
              <div key={idx} className="glassmorphism p-6 rounded-2xl glassmorphism-card-hover flex flex-col text-left justify-between h-full">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center">
                    {srv.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg">{srv.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{srv.desc}</p>
                </div>
                <div className="pt-6">
                  <a href="/services" className="text-accent-primary text-xs font-semibold flex items-center space-x-1.5 hover:text-white transition-colors group">
                    <span>Explore Details</span>
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Fleet Section */}
      <section className="py-20 bg-bg-primary">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3 text-left">
              <h2 className="text-xs font-bold text-accent-primary uppercase tracking-widest">Our Premium Fleet</h2>
              <p className="text-3xl md:text-4xl font-bold text-white">Select Your Luxury Carriage</p>
            </div>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 bg-white/5 p-1 rounded-xl border border-white/10 self-start text-xs font-semibold">
              {['All', 'Sedan', 'MUV', 'Luxury'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setVehicleCategory(cat)}
                  className={`px-4 py-2 rounded-lg transition-colors ${vehicleCategory === cat ? 'bg-accent-primary text-white' : 'text-text-secondary hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Fleet Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFleet.map((vehicle, idx) => (
              <div key={idx} className="glassmorphism rounded-2xl overflow-hidden text-left flex flex-col justify-between">
                <div className="p-4 bg-white/5 relative h-48 flex items-center justify-center overflow-hidden">
                  <span className="absolute top-3 left-3 bg-accent-primary/10 border border-accent-primary/30 text-accent-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    {vehicle.category}
                  </span>
                  <div className="w-full h-full relative flex items-center justify-center">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name} 
                      className="max-h-36 object-contain hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-white font-bold text-base">{vehicle.name}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-secondary">
                      <span className="flex items-center space-x-1">
                        <Users className="h-3.5 w-3.5 text-accent-primary" />
                        <span>{vehicle.seats} Seats</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Briefcase className="h-3.5 w-3.5 text-accent-primary" />
                        <span>{vehicle.luggage} Bags</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Shield className="h-3.5 w-3.5 text-accent-primary" />
                        <span>AC</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase font-semibold">Starting From</p>
                      <p className="text-white font-extrabold text-lg">₹{vehicle.price}</p>
                    </div>
                    <button 
                      onClick={() => openBooking(vehicle.name)}
                      className="px-4 py-2 bg-accent-primary hover:bg-accent-hover text-white text-xs font-bold rounded-lg cursor-pointer transition-colors focus:outline-none"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="py-20 bg-bg-secondary">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden aspect-video w-full h-[400px] border border-white/5 shadow-2xl">
            <img 
              src="/assets/shooting_time.png" 
              alt="Suman Travels Fleet Chauffeur" 
              className="w-full h-full object-cover filter brightness-[0.75]"
            />
          </div>

          <div className="text-left space-y-6">
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-accent-primary uppercase tracking-widest">Why Choose Us</h2>
              <p className="text-3xl md:text-4xl font-bold text-white">Mumbai's Elite Chauffeurs</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Suman Travels is built on reliability, absolute pricing transparency, and hospitality. We cater to domestic travelers and foreign visitors with unmatched class.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Verified Professional Drivers', desc: 'All drivers pass safety checks and have 5+ years of experience with English language communication.' },
                { title: 'Absolute Transparency', desc: 'No hidden toll, night, or driver allowance fees. Our quotes are final.' },
                { title: 'Live Ride Tracking', desc: 'Family members can monitor locations in real time via secure WhatsApp shareable links.' },
                { title: '24/7 Dedicated Concierge', desc: 'Got a delayed flight or need a change? Our operations team handles backups instantly.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3.5">
                  <div className="mt-1 bg-accent-primary/15 border border-accent-primary/30 p-1.5 rounded-lg text-accent-primary text-xs">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base">{item.title}</h4>
                    <p className="text-xs text-text-secondary leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-20 bg-bg-primary">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <div className="max-w-xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-bold text-accent-primary uppercase tracking-widest">Testimonials</h2>
            <p className="text-3xl md:text-4xl font-bold text-white">What Our Guests Say</p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                quote: "Absolutely professional! Our driver was waiting at BOM Airport arrivals terminal with a nameboard, helped with luggage, and spoke perfect English. As a foreigner, this was a relief.",
                author: "Sarah Jenkins",
                country: "United Kingdom",
                stars: 5
              },
              {
                quote: "Rented the Toyota Hycross for a business trip in Mumbai. The vehicle was clean and modern with Wi-Fi, and the driver navigated Mumbai traffic masterfully. Will book again.",
                author: "Amit Mehra",
                country: "NRI - Singapore",
                stars: 5
              },
              {
                quote: "Flew from New York for a wedding in Mumbai. Suman Travels handled all transfers for our family. Extremely reliable, and the transparent billing meant no local bargaining issues.",
                author: "Michael Chang",
                country: "United States",
                stars: 5
              }
            ].map((t, i) => (
              <div key={i} className="glassmorphism p-6 rounded-2xl flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="flex text-accent-primary space-x-1">
                    {[...Array(t.stars)].map((_, sIdx) => (
                      <Star key={sIdx} className="h-4 w-4 fill-accent-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed italic">"{t.quote}"</p>
                </div>
                <div className="pt-6 border-t border-white/5 mt-6">
                  <p className="text-white font-bold text-sm">{t.author}</p>
                  <p className="text-xs text-text-muted">{t.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
