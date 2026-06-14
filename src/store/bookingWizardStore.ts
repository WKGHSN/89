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

export const useBookingWizardStore = create<BookingWizardStore>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  nextStep: () => set({ step: get().step + 1 }),

  prevStep: () => set({ step: Math.max(1, get().step - 1) }),


  setService: (service, category) =>
    set({
      selectedService: service,
      selectedCategory: category,
      selectedMaster: null,
      selectedDate: null,
      selectedTime: null,
    }),

  setMaster: (master) =>
    set({
      selectedMaster: master,
      selectedDate: null,
      selectedTime: null,
    }),


  setDate: (date) => set({ selectedDate: date, selectedTime: null }),

  setTime: (time) => set({ selectedTime: time }),

  
  setClientInfo: (info) => set((prev) => ({ ...prev, ...info })),

  reset: () => set(initialState),

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