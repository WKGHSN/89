'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  services as mockServices,
  masters as mockMasters,
  galleryItems as mockGallery,
  reviews as mockReviews,
  serviceCategories as mockCategories,
  contactInfo as mockContact,
} from '@/data/mock';
import type { Service, Master, GalleryItem, Review, ServiceCategory, ContactInfo } from '@/types';

interface DataStore {
  serviceCategories: ServiceCategory[];

  services: Service[];
  addService: (data: Omit<Service, 'id'>) => Service;
  updateService: (id: string, updates: Partial<Service>) => void;
  toggleServiceActive: (id: string) => void;
  getActiveServices: () => Service[];
  getServicesByCategory: (categoryId: string) => Service[];

  masters: Master[];
  updateMaster: (id: string, updates: Partial<Master>) => void;
  toggleMasterActive: (id: string) => void;
  updateMasterAvatar: (id: string, avatarUrl: string) => void;
  getActiveMasters: () => Master[];
  getMasterById: (id: string) => Master | undefined;

  gallery: GalleryItem[];
  addGalleryItem: (data: Omit<GalleryItem, 'id' | 'createdAt'>) => GalleryItem;
  removeGalleryItem: (id: string) => void;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => void;
  reorderGallery: (items: GalleryItem[]) => void;
  getGalleryByCategory: (categoryId: string) => GalleryItem[];

  reviews: Review[];
  addReview: (data: Omit<Review, 'id' | 'createdAt'>) => Review;
  getReviews: () => Review[];

  contactInfo: ContactInfo;
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      serviceCategories: mockCategories.map((c) => ({ ...c })),

      services: mockServices.map((s) => ({ ...s })),
      masters: mockMasters.map((m) => ({ ...m, isActive: true })),
      gallery: mockGallery.map((g) => ({ ...g })),
      reviews: mockReviews.map((r) => ({ ...r })),
      contactInfo: { ...mockContact },

      addService: (data) => {
        const service: Service = { ...data, id: `svc-${crypto.randomUUID()}` };
        set({ services: [...get().services, service] });
        return service;
      },

      updateService: (id, updates) => {
        set({ services: get().services.map((s) => (s.id === id ? { ...s, ...updates } : s)) });
      },

      toggleServiceActive: (id) => {
        set({ services: get().services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)) });
      },

      getActiveServices: () => get().services.filter((s) => s.isActive),

      getServicesByCategory: (categoryId) =>
        get().services.filter((s) => s.categoryId === categoryId && s.isActive),

      updateMaster: (id, updates) => {
        set({ masters: get().masters.map((m) => (m.id === id ? { ...m, ...updates } : m)) });
      },

      toggleMasterActive: (id) => {
        set({ masters: get().masters.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m)) });
      },

      updateMasterAvatar: (id, avatarUrl) => {
        set({ masters: get().masters.map((m) => (m.id === id ? { ...m, avatar: avatarUrl } : m)) });
      },

      getActiveMasters: () => get().masters.filter((m) => m.isActive),

      getMasterById: (id) => get().masters.find((m) => m.id === id),

      addGalleryItem: (data) => {
        const item: GalleryItem = {
          ...data,
          id: `gal-${crypto.randomUUID()}`,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set({ gallery: [item, ...get().gallery] });
        return item;
      },

      removeGalleryItem: (id) => {
        set({ gallery: get().gallery.filter((g) => g.id !== id) });
      },

      updateGalleryItem: (id, updates) => {
        set({ gallery: get().gallery.map((g) => (g.id === id ? { ...g, ...updates } : g)) });
      },

      reorderGallery: (items) => set({ gallery: items }),

      getGalleryByCategory: (categoryId) =>
        get().gallery.filter((g) => g.categoryId === categoryId),

      addReview: (data) => {
        const review: Review = {
          ...data,
          id: `rev-${crypto.randomUUID()}`,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set({ reviews: [review, ...get().reviews] });
        return review;
      },

      getReviews: () => get().reviews,
    }),
    {
      name: 'lumibeauty-data',
      partialize: (state) => ({
        serviceCategories: state.serviceCategories,
        services: state.services,
        masters: state.masters,
        gallery: state.gallery,
        reviews: state.reviews,
        contactInfo: state.contactInfo,
      }),
    }
  )
);
