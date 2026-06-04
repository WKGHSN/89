import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const { user, login, logout, register, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const loginAndRedirect = async (email: string, password: string) => {
    const success = await login(email, password);
    if (success) {
      if (user?.role === 'admin') router.push('/dashboard/admin');
      else if (user?.role === 'master') router.push('/dashboard/master');
      else router.push('/dashboard/client');
    }
    return success;
  };

  const logoutAndRedirect = () => {
    logout();
    router.push('/');
  };

  return { user, isLoading, error, clearError, loginAndRedirect, logoutAndRedirect };
};