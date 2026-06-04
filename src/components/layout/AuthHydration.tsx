'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
export default function AuthHydration() {
  const setHydrated = useAuthStore((s) => s.setHydrated);

  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  return null;
}