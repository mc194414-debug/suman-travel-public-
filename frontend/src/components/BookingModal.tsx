'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBooking } from '../context/BookingContext';
import { X, ChevronRight, ChevronLeft, Calendar, Clock, MapPin, Sparkles, MessageSquare, Lock } from 'lucide-react';
import { getCookie } from '../lib/cookies';

export default function BookingModal() {
  const { isOpen, preselectedVehicle, preselectedService, closeBooking } = useBooking();
  const [step, setStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Form states
  const [vehicle, setVehicle] = useState('');
  const [service, setService] = useState('local');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Sync pre-selections and check auth session cookie
  useEffect(() => {
    if (isOpen) {
      setVehicle(preselectedVehicle);
      setService(preselectedService || 'local');
      setStep(1); // Reset step to 1
      
      const sessionUser = getCookie('suman_user');
      setIsLoggedIn(!!sessionUser);

      // Pre-fill user profile fields if cookie session exists
      if (sessionUser) {
        try {
          const userObj = JSON.parse(sessionUser);
          setName(userObj.name || '');
          setPhone(userObj.phone || '');
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, [isOpen, preselectedVehicle, preselectedService]);

  if (!isOpen) return null;

  // Intercept and prompt login/signup if user session is absent
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-md">
        <div className="glassmorphism w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6 text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-accent-primary/10 flex items-center justify-center mx-auto">
            <Lock className="h-7 w-7 text-accent-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-white font-bold text-xl">Sign In Required</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              You must have a Suman Travels client account to book a chauffeur-driven luxury vehicle. Please sign in or register to continue.
            </p>
          </div>
          <div className="flex flex-col space-y-3 pt-2">
            <Link 
              href="/login" 
              onClick={closeBooking}
              className="w-full py-3 bg-accent-primary hover:bg-accent-hover text-white text-xs font-bold rounded-xl shadow-lg transition-all text-center font-semibold"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              onClick={closeBooking}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-xl transition-all text-center font-semibold"
            >
              Create Account
            </Link>
            <button 
              onClick={closeBooking}
              className="w-full py-3 text-text-muted hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const vehicles = [
    { name: 'Toyota Innova Crysta (7 Seats)', val: 'Toyota Innova Crysta' },
    { name: 'Toyota Innova Hycross (7 Seats)', val: 'Toyota Innova Hycross' },
    { name: 'Suzuki Ertiga (6 Seats)', val: 'Suzuki Ertiga' },
    { name: 'Swift Dzire / Toyota Etios (4 Seats)', val: 'Swift Dzire' },
    { name: 'Luxury Sedan (BMW / Mercedes)', val: 'Luxury Sedan' }
  ];

  const services = [
    { name: 'Local Package (8h/80km or 12h/100km)', val: 'Local' },
    { name: 'Outstation Multi-Day Trip', val: 'Outstation' },
    { name: 'Airport Pickup / Drop (BOM)', val: 'Airport Transfer' },
    { name: 'One-Way Direct Intercity', val: 'One-Way' }
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate Pre-Filled Message Template
    const message = `Hi Suman Enterprises! I want to book a ${vehicle || 'Car'} for ${service || 'Service'}.\nPickup: ${pickup || 'Not Specified'} on ${date || 'Date'} at ${time || 'Time'}.\nDrop: ${dropoff || 'Not Specified'}.\nName: ${name} | Phone: ${phone}.\nPlease share availability and best price. Thank you!`;

    // Encode URL parameter
    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917710966660?text=${encodedText}`;

    // Redirect user
    window.open(whatsappUrl, '_blank');
    closeBooking();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-md">
      <div className="glassmorphism w-full max-w-lg rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative text-left flex flex-col justify-between">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-accent-primary animate-pulse" />
            <h3 className="text-white font-bold text-lg">Book Chauffeur Ride</h3>
          </div>
          <button 
            onClick={closeBooking}
            className="p-1 text-text-secondary hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 pt-4 flex items-center justify-between text-xs font-semibold text-text-muted">
          {[
            { label: 'Vehicle', num: 1 },
            { label: 'Service', num: 2 },
            { label: 'Trip Details', num: 3 },
            { label: 'Contact', num: 4 }
          ].map((s) => (
            <div key={s.num} className="flex items-center space-x-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                step === s.num 
                  ? 'border-accent-primary bg-accent-primary text-white' 
                  : step > s.num 
                    ? 'border-success bg-success text-white' 
                    : 'border-white/20 text-text-muted'
              }`}>
                {s.num}
              </span>
              <span className={step === s.num ? 'text-white' : ''}>{s.label}</span>
              {s.num < 4 && <span className="text-white/10">➔</span>}
            </div>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-6 flex-grow min-h-[250px] flex flex-col justify-center">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h4 className="text-white font-bold text-sm">Step 1: Choose Your Vehicle</h4>
              <p className="text-xs text-text-secondary">Select your preferred vehicle from our active premium fleet:</p>
              <div className="space-y-2">
                {vehicles.map((v) => (
                  <label 
                    key={v.val} 
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      vehicle === v.val 
                        ? 'border-accent-primary bg-accent-primary/5 text-white' 
                        : 'border-white/10 hover:border-white/20 text-text-secondary'
                    }`}
                  >
                    <span className="text-sm font-semibold">{v.name}</span>
                    <input 
                      type="radio" 
                      name="vehicle"
                      checked={vehicle === v.val}
                      onChange={() => setVehicle(v.val)}
                      className="accent-accent-primary"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h4 className="text-white font-bold text-sm">Step 2: Choose Service Type</h4>
              <p className="text-xs text-text-secondary">What type of trip are you planning?</p>
              <div className="space-y-2">
                {services.map((s) => (
                  <label 
                    key={s.val} 
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      service === s.val 
                        ? 'border-accent-primary bg-accent-primary/5 text-white' 
                        : 'border-white/10 hover:border-white/20 text-text-secondary'
                    }`}
                  >
                    <span className="text-sm font-semibold">{s.name}</span>
                    <input 
                      type="radio" 
                      name="service"
                      checked={service === s.val}
                      onChange={() => setService(s.val)}
                      className="accent-accent-primary"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h4 className="text-white font-bold text-sm">Step 3: Route & Timings</h4>
              <p className="text-xs text-text-secondary">Provide your trip route coordinates and scheduling details:</p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] text-text-muted font-bold uppercase mb-1.5">Pickup Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-accent-primary" />
                    <input 
                      type="text" 
                      required
                      placeholder="Pickup address, hotel or BOM airport terminal"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-text-muted font-bold uppercase mb-1.5">Drop-off Location (If Outstation/One-way)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-accent-primary" />
                    <input 
                      type="text" 
                      placeholder="Destination city, address or drops"
                      value={dropoff}
                      onChange={(e) => setDropoff(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-text-muted font-bold uppercase mb-1.5">Pickup Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-accent-primary" />
                      <input 
                        type="date" 
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-accent-primary focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-text-muted font-bold uppercase mb-1.5">Pickup Time *</label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-3.5 h-4 w-4 text-accent-primary" />
                      <input 
                        type="time" 
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-accent-primary focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h4 className="text-white font-bold text-sm">Step 4: Contact Verification</h4>
              <p className="text-xs text-text-secondary">Confirm passenger details for direct verification:</p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] text-text-muted font-bold uppercase mb-1.5">Passenger Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-text-muted font-bold uppercase mb-1.5">WhatsApp Mobile Number *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+91 Mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-text-muted font-bold uppercase mb-1.5">Special Instructions (Optional)</label>
                  <textarea 
                    rows={2}
                    placeholder="Enter flight number, child seat requests, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/5">
          {step > 1 ? (
            <button 
              onClick={handleBack}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button 
              onClick={handleNext}
              disabled={step === 1 && !vehicle}
              className="px-6 py-2.5 bg-accent-primary hover:bg-accent-hover text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={!name || !phone || !pickup || !date || !time}
              className="px-6 py-2.5 bg-success hover:bg-success/90 text-white text-xs font-extrabold rounded-lg transition-colors flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Confirm & Send to WhatsApp</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
