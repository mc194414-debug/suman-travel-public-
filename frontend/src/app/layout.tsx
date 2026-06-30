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
  title: "Suman Travels | Premium Chauffeur-Driven Car Rental Mumbai",
  description: "Book premium chauffeur-driven cars in Mumbai. Rent Toyota Innova, Crysta, Hycross & luxury cars. Premium airport transfers, outstation trips & local rentals. 24/7 client support.",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "Suman Travels | Premium Chauffeur-Driven Car Rental Mumbai",
    description: "Book premium chauffeur-driven cars in Mumbai. Rent Toyota Innova, Crysta, Hycross & luxury cars. Premium airport transfers, outstation trips & local rentals.",
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
    title: "Suman Travels | Premium Chauffeur-Driven Car Rental Mumbai",
    description: "Book premium chauffeur-driven cars in Mumbai. Rent Toyota Innova, Crysta, Hycross & luxury cars.",
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
