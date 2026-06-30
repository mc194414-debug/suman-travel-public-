import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BookingProvider } from "../context/BookingContext";
import BookingModal from "../components/BookingModal";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

import SmoothScroll from "../components/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Car Rental near Mumbai | Premium Chauffeur Service | Suman Travels",
  description: "Looking for car rental near Mumbai? Book premium chauffeur-driven cars. Perfect for foreigners, locals, airport transfers, and outstation trips. Safe & reliable.",
  keywords: [
    "car rental near mumbai", "mumbai rent car", "rent car in mumbai for foreigners", "luxury car rental mumbai", 
    "chauffeur driven car mumbai", "innova crysta on rent mumbai", "innova hycross on rent", 
    "premium car rental india", "mumbai airport taxi", "mumbai airport transfer", "hire car with driver mumbai",
    "best car rental in mumbai", "reliable car hire mumbai", "mumbai local sightseeing car", 
    "outstation cab from mumbai", "mumbai to pune cab", "mumbai to lonavala taxi", "mumbai to shirdi cab",
    "mumbai to mahabaleshwar car rental", "mumbai to goa taxi", "mumbai to surat cab", "mumbai to nashik taxi",
    "mumbai darshan car", "corporate car rental mumbai", "executive car hire mumbai", "foreigner friendly car rental",
    "safe taxi in mumbai for tourists", "tourist taxi mumbai", "mumbai tourist transport", "mumbai travel agency",
    "rent a car mumbai", "mumbai chauffeur service", "private driver mumbai", "hire driver mumbai",
    "luxury taxi mumbai", "innova rental near me", "7 seater car on rent in mumbai", "6 seater car on rent",
    "suv rental mumbai", "sedan rental mumbai", "swift dzire on rent mumbai", "ertiga on rent mumbai",
    "toyota etios on rent", "mumbai city tour car", "full day car rental mumbai", "half day car rental mumbai",
    "8 hours 80 km package mumbai", "12 hours 120 km car rental", "mumbai hourly car rental", "airport drop mumbai",
    "airport pickup mumbai", "chhatrapati shivaji maharaj international airport taxi", "t2 airport taxi mumbai",
    "t1 airport cab mumbai", "domestic airport taxi mumbai", "international airport cab", "mumbai premium transport",
    "vip car rental mumbai", "wedding car rental mumbai", "event transportation mumbai", "conference car hire",
    "mumbai business travel", "mumbai exotic car rental", "mercedes on rent mumbai", "bmw on rent mumbai",
    "audi on rent mumbai", "mumbai luxury cab", "affordable car rental mumbai", "cheap rent a car mumbai",
    "best travel agency in santacruz", "juhu car rental", "bandra car rental", "andheri car hire", 
    "south mumbai car rental", "navi mumbai car rental", "thane car rental", "borivali car rental",
    "powai car hire", "worli car rental", "colaba taxi", "mumbai cruise terminal taxi",
    "mumbai port trust taxi", "gateway of india taxi", "mumbai travel packages", "mumbai to gujarat taxi",
    "mumbai to vapi cab", "mumbai to ahmedabad taxi", "mumbai to daman cab", "mumbai to silvassa taxi",
    "intercity cab mumbai", "one way taxi from mumbai", "round trip taxi mumbai", "outstation taxi near me",
    "chauffeur hire for a day", "private car service mumbai", "personal driver mumbai", "mumbai transportation service",
    "holiday car rental mumbai", "weekend getaway cab mumbai", "family trip car rental", "group travel car mumbai",
    "mumbai tour operator", "customized tour mumbai", "mumbai safe travel", "verified drivers mumbai"
  ],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "Car Rental near Mumbai | Premium Chauffeur Service | Suman Travels",
    description: "Looking for car rental near Mumbai? Book premium chauffeur-driven cars. Perfect for foreigners, locals, airport transfers, and outstation trips. Safe & reliable.",
    type: "website",
    locale: "en_US",
    siteName: "Suman Travels",
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'Suman Travels Logo',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Rental near Mumbai | Premium Chauffeur Service | Suman Travels",
    description: "Looking for car rental near Mumbai? Book premium chauffeur-driven cars. Perfect for foreigners, locals, airport transfers, and outstation trips. Safe & reliable.",
    images: ['/logo.png'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-bg-primary text-text-primary antialiased">
        <BookingProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
          <BookingModal />
          <FloatingWhatsApp />
        </BookingProvider>
      </body>
    </html>
  );
}
