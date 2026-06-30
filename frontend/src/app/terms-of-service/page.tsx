'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function TermsOfService() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bg-primary pt-32 pb-24 text-text-primary px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-[800px] mx-auto glassmorphism p-8 md:p-12 rounded-3xl border border-white/5"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-8 text-white">Terms of Service</h1>
          <p className="text-text-secondary mb-8">Last updated: June 30, 2026</p>

          <div className="space-y-8 text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Booking and Cancellation</h2>
              <p>All bookings are subject to availability. Cancellations made within 24 hours of the scheduled pickup time may incur a cancellation fee equivalent to 50% of the base fare.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Payment Terms</h2>
              <p>We accept major credit cards, UPI, and bank transfers. A deposit may be required to confirm your booking. Final payment, including any extra kilometers, hours, or tolls, is due upon completion of the trip.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Passenger Responsibilities</h2>
              <p>Passengers are expected to behave respectfully towards the chauffeur. Any damage caused to the vehicle interior or exterior by the passenger will result in additional repair and cleaning fees.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Liability</h2>
              <p>Suman Travels is not liable for delays caused by traffic, weather, or unforeseen circumstances. Our maximum liability in any event shall not exceed the total cost of your booking.</p>
            </section>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
