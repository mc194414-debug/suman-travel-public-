'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type BookingContextType = {
  isOpen: boolean;
  preselectedVehicle: string;
  preselectedService: string;
  openBooking: (vehicle?: string, service?: string) => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedVehicle, setPreselectedVehicle] = useState('');
  const [preselectedService, setPreselectedService] = useState('local');

  const openBooking = (vehicle = '', service = 'local') => {
    setPreselectedVehicle(vehicle);
    setPreselectedService(service);
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false);
  };

  return (
    <BookingContext.Provider value={{ isOpen, preselectedVehicle, preselectedService, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
