'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, Phone, MapPin, Clock, MessageSquare, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <Navbar />
      <main className="bg-bg-primary min-h-screen pt-32 pb-20 text-left">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="space-y-4 mb-12 text-center max-w-xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-accent-primary/10 border border-accent-primary/30 px-3 py-1 rounded-full text-accent-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>Get in Touch</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white">Contact Our Team</h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              Have a special request, wedding query, or corporate alignment? Reach out to our 24/7 client dispatch office.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glassmorphism p-8 rounded-2xl space-y-6">
              <h2 className="text-2xl font-bold text-white">Send a Message</h2>
              {submitted && (
                <div className="bg-success/15 border border-success/30 text-success p-4 rounded-xl text-xs font-semibold">
                  Thank you! Your enquiry has been sent successfully. We will reach back within 1 hour.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">Phone Number *</label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">Subject</label>
                    <select 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#111827] border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all"
                    >
                      <option>General Inquiry</option>
                      <option>Booking Modification</option>
                      <option>Corporate Contract</option>
                      <option>Wedding Events</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase">Message *</label>
                  <textarea 
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your query..."
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-accent-primary focus:outline-none transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-accent-primary hover:bg-accent-hover text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Direct Details */}
            <div className="space-y-8 text-left">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Direct Information</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Skip the form and chat with our booking team directly. We are online 24/7 to clear queries and schedule airport transfers.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent-primary/10 p-3 rounded-xl text-accent-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Call Center</h4>
                    <p className="text-sm text-text-secondary mt-1">+91 77109 66660</p>
                    <p className="text-sm text-text-secondary mt-0.5">+91 81084 42009</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-accent-primary/10 p-3 rounded-xl text-accent-primary">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">WhatsApp Live Chat</h4>
                    <p className="text-sm text-text-secondary mt-1">
                      <a href="https://wa.me/917710966660?text=Hi!%20I%20want%20to%20rent%20a%20car.%20Please%20share%20your%20fleet%20and%20best%20rates." target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline font-semibold">
                        Chat with Sanjay Choudhary (MD)
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-accent-primary/10 p-3 rounded-xl text-accent-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Email Bookings</h4>
                    <p className="text-sm text-text-secondary mt-1">sanjayindia6666@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-accent-primary/10 p-3 rounded-xl text-accent-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Mumbai HQ Office</h4>
                    <p className="text-xs text-text-secondary leading-relaxed mt-1">1st Floor, KWX 7715, Mangalwadi, Juhu Tara Road, Opp. Union Bank of India, Santacruz West, Mumbai, Maharashtra – 400049</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-accent-primary/10 p-3 rounded-xl text-accent-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Operating Hours</h4>
                    <p className="text-sm text-text-secondary mt-1">24/7 Available (All Year Round)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
