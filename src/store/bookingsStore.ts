'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Booking, BookingStatus } from '@/types';
import { mockBookings } from '@/data/mock';

interface BookingsStore {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  cancelBooking: (id: string) => void;
  deleteBooking: (id: string) => void;
  updateStatus: (id: string, status: BookingStatus) => void;
  getBookingById: (id: string) => Booking | undefined;
  getUserBookings: (userId: string) => Booking[];
  getMasterBookings: (masterId: string) => Booking[];
  getUpcomingBookings: (userId: string) => Booking[];
  getPastBookings: (userId: string) => Booking[];
  hasTimeConflict: (masterId: string, date: string, time: string, duration: number, excludeBookingId?: string) => boolean;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
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
        set({
          bookings: get().bookings.map((b) =>
            b.id === id ? { ...b, status: 'cancelled' as BookingStatus } : b
          ),
        });
      },

      deleteBooking: (id) => {
        set({ bookings: get().bookings.filter((b) => b.id !== id) });
      },

      updateStatus: (id, status) => {
        set({
          bookings: get().bookings.map((b) =>
            b.id === id ? { ...b, status } : b
          ),
        });
      },

      getBookingById: (id) => get().bookings.find((b) => b.id === id),
      getUserBookings: (userId) => get().bookings.filter((b) => b.clientId === userId),
      getMasterBookings: (masterId) => get().bookings.filter((b) => b.masterId === masterId),

      getUpcomingBookings: (userId) =>
        get()
          .bookings.filter(
            (b) => b.clientId === userId && b.date >= today() && b.status !== 'cancelled'
          )
          .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),

      getPastBookings: (userId) =>
        get()
          .bookings.filter(
            (b) =>
              b.clientId === userId &&
              (b.date < today() || b.status === 'completed' || b.status === 'cancelled')
          )
          .sort((a, b) => b.date.localeCompare(a.date)),

      hasTimeConflict: (masterId, date, time, duration, excludeBookingId) => {
        const newStart = timeToMinutes(time);
        const newEnd = newStart + duration;

        return get().bookings.some((b) => {
          if (b.masterId !== masterId) return false;
          if (b.date !== date) return false;
          if (b.status === 'cancelled') return false;
          if (excludeBookingId && b.id === excludeBookingId) return false;

          const existingStart = timeToMinutes(b.time);
          const existingEnd = existingStart + b.duration;

          return newStart < existingEnd && newEnd > existingStart;
        });
      },
    }),
    {
      name: 'lumibeauty-bookings',
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        if (version < 2) return undefined as unknown as BookingsStore;
        return persistedState as BookingsStore;
      },
      partialize: (state) => ({ bookings: state.bookings }),
    }
  )
);