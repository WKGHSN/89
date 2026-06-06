'use client';
import { create } from 'zustand';
import type { AuthUser, UserRole } from '@/types';
import { mockUsers } from '@/data/mock';

const AUTH_KEY = 'lumibeauty-auth';
const USERS_KEY = 'lumibeauty-users';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d+()\-\s]+$/;

interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  masterId?: string;
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  setHydrated: () => void;
}

function getAllUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const initial: StoredUser[] = mockUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    password: u.password,
    role: u.role,
    masterId: 'masterId' in u ? (u as StoredUser).masterId : undefined,
  }));
  localStorage.setItem(USERS_KEY, JSON.stringify(initial));
  return initial;
}

function saveUsers(users: StoredUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
}

const authStorage = {
  get: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.user ?? null;
    } catch {
      return null;
    }
  },
  set: (user: AuthUser): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ user }));
    } catch {}
  },
  remove: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {}
  },
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  hydrated: false,

  setHydrated: () => {
    const user = authStorage.get();
    set({ user, hydrated: true });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 400));

    const users = getAllUsers();
    const found = users.find((u) => u.email === email && u.password === password);

    if (!found) {
      set({ error: 'Невірний email або пароль', isLoading: false });
      return false;
    }

    const user: AuthUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    };

    authStorage.set(user);
    set({ user, isLoading: false });
    return true;
  },

  register: async (name, email, phone, password) => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 400));

    if (!EMAIL_REGEX.test(email)) {
      set({ error: 'Введіть коректний email (наприклад: user@gmail.com)', isLoading: false });
      return false;
    }

    if (phone && !PHONE_REGEX.test(phone)) {
      set({ error: 'Телефон може містити лише цифри, +, пробіл, -, ()', isLoading: false });
      return false;
    }

    if (phone && phone.replace(/[^\d]/g, '').length < 10) {
      set({ error: 'Номер телефону повинен містити мінімум 10 цифр', isLoading: false });
      return false;
    }

    const users = getAllUsers();
    const exists = users.find((u) => u.email === email);
    if (exists) {
      set({ error: 'Користувач з таким email вже існує', isLoading: false });
      return false;
    }

    const newUser: StoredUser = {
      id: `client-${crypto.randomUUID()}`,
      name,
      email,
      phone,
      password,
      role: 'client',
    };

    users.push(newUser);
    saveUsers(users);

    const authUser: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    authStorage.set(authUser);
    set({ user: authUser, isLoading: false });
    return true;
  },

  logout: () => {
    authStorage.remove();
    set({ user: null });
  },

  clearError: () => set({ error: null }),
}));