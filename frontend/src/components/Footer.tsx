import Link from 'next/link';
import { Car, Phone, Mail, MapPin, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B0F19] border-t border-white/5 pt-16 pb-8 text-text-secondary">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-white font-bold text-xl">
            <img 
              src="/assets/logo.png" 
              alt="Suman Travels Logo" 
              className="h-12 w-12 object-contain rounded-full border border-white/10" 
            />
            <span>Suman <span className="text-accent-primary">Travels</span></span>
          </div>
          <p className="text-sm">
            Premium chauffeur-driven car rental services based in Mumbai. Experience comfort, luxury, and reliability.
          </p>
          <div className="flex space-x-4 pt-2">
            {/* Social Links Placeholders */}
            <span className="text-xs text-text-muted">Skip traffic, own the road.</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/fleet" className="hover:text-white transition-colors">Our Fleet</Link></li>
            <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing Matrix</Link></li>
            <li><Link href="/for-foreigners" className="hover:text-white transition-colors">International Guests</Link></li>
          </ul>
        </div>

        {/* Services & Support */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Our Services</h4>
          <ul className="space-y-2 text-sm">
            <li>Airport Transfers (BOM)</li>
            <li>Local Half/Full Day Rental</li>
            <li>Outstation Multi-Day Trips</li>
            <li>Corporate Travels</li>
            <li>Wedding & Special Events</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact Us</h4>
          <div className="flex items-start space-x-3 text-sm">
            <Phone className="h-5 w-5 text-accent-primary shrink-0" />
            <div>
              <p className="text-white font-medium">+91 77109 66660</p>
              <p className="text-white font-medium">+91 81084 42009</p>
              <p className="text-xs text-text-muted">Sanjay Choudhary (MD)</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 text-sm">
            <Mail className="h-5 w-5 text-accent-primary shrink-0" />
            <a href="mailto:sanjayindia6666@gmail.com" className="hover:text-white transition-colors">sanjayindia6666@gmail.com</a>
          </div>
          <div className="flex items-start space-x-3 text-sm">
            <MapPin className="h-5 w-5 text-accent-primary shrink-0" />
            <p className="text-xs leading-relaxed">1st Floor, KWX 7715, Mangalwadi, Juhu Tara Road, Opp. Union Bank of India, Santacruz West, Mumbai, MH - 400049</p>
          </div>
        </div>
      </div>

      {/* Underbar */}
      <div className="max-w-[1280px] mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-text-muted space-y-4 md:space-y-0">
        <p>© 2026 Suman Travels Mumbai. Elite Chauffeur Services.</p>
        <div className="flex space-x-6">
          <Link href="/privacy-policy" className="hover:text-white transition-colors flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>Privacy Policy</span>
          </Link>
          <Link href="/terms-of-service" className="hover:text-white transition-colors flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>Terms of Service</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
