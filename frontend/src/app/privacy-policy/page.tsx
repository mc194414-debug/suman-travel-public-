'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl md:text-5xl font-black mb-8 text-white">Privacy Policy</h1>
          <p className="text-text-secondary mb-8">Last updated: June 30, 2026</p>

          <div className="space-y-8 text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p>We collect personal information that you provide to us when booking a ride, including your name, email address, phone number, pickup/drop-off locations, and payment details. We also collect data on your usage of our website to improve our services.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p>Your information is used strictly to provide you with reliable chauffeur services, process payments, send booking confirmations, and communicate important updates regarding your ride. We do not sell your personal data to third parties.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
              <p>We implement top-tier security measures, including SSL encryption, to protect your personal and payment information against unauthorized access or disclosure.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Contact Us</h2>
              <p>If you have questions about this Privacy Policy or how we handle your data, please contact us at privacy@sumantravels.com or call our 24/7 support line.</p>
            </section>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
