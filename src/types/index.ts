
export type UserRole = 'client' | 'master' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  image?: string;
  order: number;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  duration: number; 
  price: number; 
  isActive: boolean;
}


export interface Master {
  id: string;
  userId: string;
  name: string;
  specializations: string[];
  bio: string;
  avatar: string;
  experience: number; 
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  workingDays: number[]; 
  workingHours: { start: string; end: string };
}


export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  masterId: string;
  masterName: string;
  serviceId: string;
  serviceName: string;
  categoryName: string;
  date: string; 
  time: string; 
  duration: number;
  price: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}


export interface Review {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  masterId?: string;
  masterName?: string;
  serviceId?: string;
  serviceName?: string;
  rating: number;
  text: string;
  createdAt: string;
}


export interface GalleryItem {
  id: string;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
  masterId?: string;
  masterName?: string;
  description?: string;
  createdAt: string;
}


export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  instagram?: string;
  telegram?: string;
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}


export interface BookingState {
  step: number;
  selectedService: Service | null;
  selectedCategory: ServiceCategory | null;
  selectedMaster: Master | null;
  selectedDate: string | null;
  selectedTime: string | null;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
}


export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}
