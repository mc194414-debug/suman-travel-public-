'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Sparkles, Info, HelpCircle } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function PricingPage() {
  const { openBooking } = useBooking();
  const pricingData = [
    {
      vehicle: 'Toyota Hycross',
      local8: '4,500',
      local12: '6,000',
      extraHr: '300',
      extraKm: '30',
      night: '—',
      airport: '—'
    },
    {
      vehicle: 'Toyota Innova',
      local8: '3,000',
      local12: '4,000',
      extraHr: '200',
      extraKm: '20',
      night: '200',
      airport: '2,800'
    },
    {
      vehicle: 'Toyota Crysta',
      local8: '3,800',
      local12: '5,000',
      extraHr: '250',
      extraKm: '23',
      night: '200',
      airport: '2,200'
    },
    {
      vehicle: 'Small Car (Dzire/Etios)',
      local8: '2,500',
      local12: '3,200',
      extraHr: '200',
      extraKm: '15',
      night: '200',
      airport: '1,500'
    },
    {
      vehicle: 'Maruti Ertiga',
      local8: '3,000',
      local12: '4,000',
      extraHr: '200',
      extraKm: '18',
      night: '200',
      airport: '2,000'
    },
    {
      vehicle: 'Luxury (BMW, Audi, Merc)',
      local8: 'On Request',
      local12: 'On Request',
      extraHr: 'On Request',
      extraKm: 'On Request',
      night: 'On Request',
      airport: 'On Request'
    }
  ];

  return (
    <>
      <Navbar />
      <main className="bg-bg-primary min-h-screen pt-32 pb-20 text-left">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="space-y-4 mb-12 text-center max-w-xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-accent-primary/10 border border-accent-primary/30 px-3 py-1 rounded-full text-accent-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>Transparent Rates</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white">Tariff & Pricing</h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              No hidden fees, no driver allowance surprise charges. Check our standard pricing below. Toll and parking are charged at actuals.
            </p>
          </div>

          {/* Pricing Table Desktop */}
          <div className="glassmorphism rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-white font-bold text-sm">
                    <th className="p-4 md:p-6">Vehicle</th>
                    <th className="p-4 md:p-6">8 Hrs / 80 Km</th>
                    <th className="p-4 md:p-6">12 Hrs / 100 Km</th>
                    <th className="p-4 md:p-6">Extra Hour</th>
                    <th className="p-4 md:p-6">Extra Km</th>
                    <th className="p-4 md:p-6">Night Charge</th>
                    <th className="p-4 md:p-6">Airport Pick/Drop</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-text-secondary">
                  {pricingData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 md:p-6 font-semibold text-white">{row.vehicle}</td>
                      <td className="p-4 md:p-6">{row.local8 !== 'On Request' && row.local8 !== '—' ? `₹${row.local8}` : row.local8}</td>
                      <td className="p-4 md:p-6">{row.local12 !== 'On Request' && row.local12 !== '—' ? `₹${row.local12}` : row.local12}</td>
                      <td className="p-4 md:p-6">{row.extraHr !== 'On Request' && row.extraHr !== '—' ? `₹${row.extraHr}/hr` : row.extraHr}</td>
                      <td className="p-4 md:p-6">{row.extraKm !== 'On Request' && row.extraKm !== '—' ? `₹${row.extraKm}/km` : row.extraKm}</td>
                      <td className="p-4 md:p-6">{row.night !== 'On Request' && row.night !== '—' ? `₹${row.night}` : row.night}</td>
                      <td className="p-4 md:p-6">{row.airport !== 'On Request' && row.airport !== '—' ? `₹${row.airport}` : row.airport}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes Card */}
          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start space-x-3">
            <Info className="h-5 w-5 text-accent-primary shrink-0 mt-0.5" />
            <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
              <h4 className="text-white font-bold text-sm">Tariff Terms & Conditions</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Night charges apply for trips running between 23:00 and 05:00.</li>
                <li>Tolls, parking, and state border permits are charged at actuals upon booking closure.</li>
                <li>GST of 5% is applicable on all billing invoices.</li>
                <li>Prices are inclusive of driver allowances, fuel costs, and local permits.</li>
              </ul>
            </div>
          </div>

          {/* Custom Quote CTA */}
          <div className="mt-12 text-center">
            <button
              onClick={() => openBooking()}
              className="px-8 py-3.5 bg-accent-primary hover:bg-accent-hover text-white font-bold rounded-full shadow-lg shadow-accent-primary/20 hover:shadow-accent-primary/40 hover:-translate-y-[2px] transition-all duration-300 cursor-pointer focus:outline-none"
            >
              Get Custom Quote
            </button>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
