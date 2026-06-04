import { useDataStore } from '@/store/dataStore';
import { useBookingsStore } from '@/store/bookingsStore';

export const useMaster = (masterId: string) => {
  const getMasterById = useDataStore(s => s.getMasterById);
  const getMasterBookings = useBookingsStore(s => s.getMasterBookings);

  const master = getMasterById(masterId);
  const bookings = getMasterBookings(masterId);

  const today = new Date().toISOString().split('T')[0];
  const upcomingBookings = bookings
    .filter(b => b.date >= today && b.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date));

  const todayBookings = bookings.filter(b => b.date === today);

  return { master, bookings, upcomingBookings, todayBookings };
};