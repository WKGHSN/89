'use client';
import { create } from 'zustand';
import type { BookingState, Service, ServiceCategory, Master } from '@/types';

interface BookingWizardStore extends BookingState {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setService: (service: Service, category: ServiceCategory) => void;
  setMaster: (master: Master) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setClientInfo: (info: Partial<ClientInfo>) => void;
  reset: () => void;
  // Зручний геттер — чи заповнені всі обов'язкові поля перед підтвердженням
  isReadyToConfirm: () => boolean;
}

interface ClientInfo {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
}

const initialState: BookingState = {
  step: 1,
  selectedService: null,
  selectedCategory: null,
  selectedMaster: null,
  selectedDate: null,
  selectedTime: null,
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  notes: '',
};
// Цей стор — тільки UI стан wizard-форми бронювання (крок 1-5)
// Після підтвердження — дані передаються в bookingsStore.addBooking()
// і wizard скидається через reset()
export const useBookingWizardStore = create<BookingWizardStore>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  nextStep: () => set({ step: get().step + 1 }),

  prevStep: () => set({ step: Math.max(1, get().step - 1) }),

  // При зміні послуги — скидаємо все що нижче по воронці
  setService: (service, category) =>
    set({
      selectedService: service,
      selectedCategory: category,
      selectedMaster: null,
      selectedDate: null,
      selectedTime: null,
    }),

  // При зміні майстра — скидаємо дату та час
  setMaster: (master) =>
    set({
      selectedMaster: master,
      selectedDate: null,
      selectedTime: null,
    }),

  // При зміні дати — скидаємо час
  setDate: (date) => set({ selectedDate: date, selectedTime: null }),

  setTime: (time) => set({ selectedTime: time }),

  // Виправлено: merge з попереднім станом щоб не затерти поля
  setClientInfo: (info) => set((prev) => ({ ...prev, ...info })),

  reset: () => set(initialState),

  // Перевірка перед фінальним кроком підтвердження
  isReadyToConfirm: () => {
    const { selectedService, selectedMaster, selectedDate, selectedTime, clientName, clientPhone } =
      get();
    return Boolean(
      selectedService &&
        selectedMaster &&
        selectedDate &&
        selectedTime &&
        clientName.trim() &&
        clientPhone.trim()
    );
  },
}));