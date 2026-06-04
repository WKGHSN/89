'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Booking, BookingStatus } from '@/types';
import { mockBookings } from '@/data/mock';

interface BookingsStore {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  cancelBooking: (id: string) => void;
  updateStatus: (id: string, status: BookingStatus) => void;
  getBookingById: (id: string) => Booking | undefined;
  getUserBookings: (userId: string) => Booking[];
  getMasterBookings: (masterId: string) => Booking[];
  getUpcomingBookings: (userId: string) => Booking[];
  getPastBookings: (userId: string) => Booking[];
}

const today = (): string => new Date().toISOString().split('T')[0];

export const useBookingsStore = create<BookingsStore>()(
  persist(
    (set, get) => ({
      bookings: mockBookings,

      addBooking: (bookingData) => {
        const booking: Booking = {
          ...bookingData,
          id: `book-${crypto.randomUUID()}`,
          createdAt: today(),
        };
        set({ bookings: [...get().bookings, booking] });
        return booking;
      },

      cancelBooking: (id) => {
        set({ bookings: get().bookings.map((b) => b.id === id ? { ...b, status: 'cancelled' } : b) });
      },

      updateStatus: (id, status) => {
        set({ bookings: get().bookings.map((b) => b.id === id ? { ...b, status } : b) });
      },

      getBookingById: (id) => get().bookings.find((b) => b.id === id),
      getUserBookings: (userId) => get().bookings.filter((b) => b.clientId === userId),
      getMasterBookings: (masterId) => get().bookings.filter((b) => b.masterId === masterId),

      getUpcomingBookings: (userId) =>
        get().bookings
          .filter((b) => b.clientId === userId && b.date >= today() && b.status !== 'cancelled')
          .sort((a, b) => a.date.localeCompare(b.date)),

      getPastBookings: (userId) =>
        get().bookings
          .filter((b) => b.clientId === userId && (b.date < today() || b.status === 'completed' || b.status === 'cancelled'))
          .sort((a, b) => b.date.localeCompare(a.date)),
    }),
    {
      name: 'lumibeauty-bookings',
      partialize: (state) => ({ bookings: state.bookings }),
    }
  )
);