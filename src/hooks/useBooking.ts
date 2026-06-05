import { useBookingWizardStore } from '@/store/bookingWizardStore';
import { useBookingsStore } from '@/store/bookingsStore';
import { useAuthStore } from '@/store/authStore';
import { useNotificationsStore } from '@/store/notificationsStore';

export const useBooking = () => {
  const wizard = useBookingWizardStore();
  const { addBooking } = useBookingsStore();
  const { user } = useAuthStore();
  const { createBookingConfirmation } = useNotificationsStore();

  const confirmBooking = () => {
    const { selectedService, selectedMaster, selectedDate, selectedTime, selectedCategory, clientName, clientPhone, clientEmail, notes } = wizard;
    if (!selectedService || !selectedMaster || !selectedDate || !selectedTime) return null;

    const booking = addBooking({
      clientId: user?.id || 'guest',
      clientName,
      clientPhone,
      masterId: selectedMaster.id,
      masterName: selectedMaster.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      categoryName: selectedCategory?.name || '',
      date: selectedDate,
      time: selectedTime,
      duration: selectedService.duration,
      price: selectedService.price,
      status: 'pending',
      notes,
    });

    createBookingConfirmation(booking);
    wizard.reset();
    return booking;
  };

  const isReadyToConfirm = wizard.isReadyToConfirm();

  return { wizard, confirmBooking, isReadyToConfirm };
};