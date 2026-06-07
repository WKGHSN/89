'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) {
      toast.success('Вхід виконано успішно!');
      router.push(redirectTo);
    }
  };

  return (
    <div className="min-h-screen bg-lumi-milk flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-lumi-muted hover:text-lumi-text mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Повернутись
        </Link>

        <div className="bg-white rounded-3xl shadow-card p-8 md:p-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lumi-blush to-lumi-rose flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="2" ry="3.5" />
                <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(60 12 12)" />
                <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(120 12 12)" />
                <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(180 12 12)" />
                <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(240 12 12)" />
                <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(300 12 12)" />
                <circle cx="12" cy="12" r="2.5" fill="white" />
              </svg>
            </div>
            <span className="font-serif text-xl font-semibold text-lumi-text">LumiBeauty</span>
          </div>

          <h1 className="text-2xl font-serif font-medium text-lumi-text mb-2">Вхід до кабінету</h1>
          <p className="text-lumi-muted text-sm mb-8">
            Немає акаунту?{' '}
            <Link href={`/auth/register${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`} className="text-lumi-rose hover:text-lumi-deeprose font-medium">
              Зареєструватись
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-lumi-muted block mb-1.5">Email</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-lumi-muted block mb-1.5">Пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pr-12"
                  placeholder="Введіть пароль"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lumi-muted hover:text-lumi-text transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3.5 text-base"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Входимо...
                </span>
              ) : 'Увійти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-lumi-milk" />}>
      <LoginPageInner />
    </Suspense>
  );
}