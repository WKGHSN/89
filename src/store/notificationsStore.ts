'use client';
import { create } from 'zustand';
import type { Booking } from '@/types';

export type NotificationType =
  | 'reminder'
  | 'confirmation'
  | 'cancellation'
  | 'status_change';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  bookingId?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsStore {
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  createBookingConfirmation: (booking: Booking) => void;
  createBookingCancellation: (booking: Booking) => void;
  createStatusChange: (booking: Booking) => void;
}

export const selectUnreadCount = (s: NotificationsStore) =>
  s.notifications.filter((n) => !n.isRead).length;

export const selectUnreadNotifications = (s: NotificationsStore) =>
  s.notifications.filter((n) => !n.isRead);

const MAX_NOTIFICATIONS = 50;

const buildNotification = (
  data: Omit<Notification, 'id' | 'createdAt' | 'isRead'>
): Notification => ({
  ...data,
  id: `notif-${crypto.randomUUID()}`,
  isRead: false,
  createdAt: new Date().toISOString(),
});


export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],

  addNotification: (n) => {
    const notification = buildNotification(n);
    set({
      notifications: [notification, ...get().notifications].slice(0, MAX_NOTIFICATIONS),
    });
  },

  markAsRead: (id) => {
    set({
      notifications: get().notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    });
  },

  markAllAsRead: () => {
    set({
      notifications: get().notifications.map((n) => ({ ...n, isRead: true })),
    });
  },

  
  removeNotification: (id) => {
    set({
      notifications: get().notifications.filter((n) => n.id !== id),
    });
  },

  clearAll: () => set({ notifications: [] }),


  
  createBookingConfirmation: (booking) => {
    get().addNotification({
      type: 'confirmation',
      title: 'Запис підтверджено! 🌸',
      message: `${booking.serviceName} до ${booking.masterName} — ${booking.date} о ${booking.time}`,
      bookingId: booking.id,
    });
  },

  
  createBookingCancellation: (booking) => {
    get().addNotification({
      type: 'cancellation',
      title: 'Запис скасовано',
      message: `Скасовано: ${booking.serviceName} до ${booking.masterName} на ${booking.date}`,
      bookingId: booking.id,
    });
  },

  
  createStatusChange: (booking) => {
    const statusLabels: Record<string, string> = {
      confirmed: 'підтверджено ✅',
      completed: 'завершено 🎉',
      cancelled: 'скасовано ❌',
      pending: 'очікує розгляду ⏳',
    };
    get().addNotification({
      type: 'status_change',
      title: 'Статус запису змінено',
      message: `${booking.serviceName} — ${statusLabels[booking.status] ?? booking.status}`,
      bookingId: booking.id,
    });
  },

  
}));