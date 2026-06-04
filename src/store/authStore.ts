'use client';
import { create } from 'zustand';
import type { AuthUser } from '@/types';
import { mockUsers } from '@/data/mock';

const STORAGE_KEY = 'lumibeauty-auth';


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
// Єдине місце для роботи з localStorage — використовується скрізь
const storage = {
  get: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
    } catch {}
  },

  remove: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  },
};

// ============ STORE ============
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  hydrated: false,

  // Викликається в AuthHydration.tsx один раз при старті — відновлює сесію
  setHydrated: () => {
    const user = storage.get();
    set({ user, hydrated: true });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    // TODO: замінити на реальний API-запит
    await new Promise((r) => setTimeout(r, 600));

    const found = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      set({ error: 'Невірний email або пароль', isLoading: false });
      return false;
    }

    // Видаляємо пароль перед збереженням у стані та localStorage
    const { password: _password, ...userWithoutPassword } = found;
    const user = userWithoutPassword as AuthUser;

    storage.set(user);
    set({ user, isLoading: false });
    return true;
  },

  register: async (name, email, phone, password) => {
    set({ isLoading: true, error: null });

    // TODO: замінити на реальний API-запит
    await new Promise((r) => setTimeout(r, 600));

    const exists = mockUsers.find((u) => u.email === email);
    if (exists) {
      set({ error: 'Користувач з таким email вже існує', isLoading: false });
      return false;
    }

    const user: AuthUser = {
      id: `client-${crypto.randomUUID()}`,
      name,
      email,
      // phone зберігається в AuthUser — додай поле в types/index.ts якщо нема
      role: 'client',
    };

    // TODO: у реальному застосунку — зберігати користувача на бекенді
    // mockUsers не оновлюємо бо це readonly дані розробки
    storage.set(user);
    set({ user, isLoading: false });
    return true;
  },

  logout: () => {
    storage.remove();
    set({ user: null });
  },

  clearError: () => set({ error: null }),
}));