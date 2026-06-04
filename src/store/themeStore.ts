'use client';
import { create } from 'zustand';
const STORAGE_KEY = 'lumibeauty-theme';
const DARK_CLASS = 'dark';

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
  initTheme: () => void;
}

const applyTheme = (dark: boolean): void => {
  if (typeof window === 'undefined') return;
  document.documentElement.classList.toggle(DARK_CLASS, dark);
  localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
};

const getSavedTheme = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved === 'dark';
    // Якщо немає збереженої теми — дивимось системні налаштування користувача
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  isDark: false,
  initTheme: () => {
    const dark = getSavedTheme();
    applyTheme(dark);
    set({ isDark: dark });
  },

  toggleTheme: () => {
    const dark = !get().isDark;
    applyTheme(dark);
    set({ isDark: dark });
  },

  // Виправлено: прибрано дублювання DOM-логіки — тепер через applyTheme()
  setTheme: (dark) => {
    applyTheme(dark);
    set({ isDark: dark });
  },
}));