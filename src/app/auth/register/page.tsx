'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

function RegisterPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const { register, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateEmailField = (val: string): string => {
    if (!val) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return 'Введіть коректний email (наприклад: user@gmail.com)';
    return '';
  };

  const validatePhoneField = (val: string): string => {
    if (!val) return '';
    const phoneRegex = /^[\d+()\-\s]+$/;
    if (!phoneRegex.test(val)) return 'Телефон може містити лише цифри, +, пробіл, -, ()';
    if (val.replace(/[^\d]/g, '').length < 10) return 'Номер телефону повинен містити мінімум 10 цифр';
    return '';
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (field === 'email') {
      setEmailError(validateEmailField(val));
    }
    if (field === 'phone') {
      const cleaned = val.replace(/[^\d+()\-\s]/g, '');
      setPhoneError(val !== cleaned ? 'Телефон може містити лише цифри, +, пробіл, -, ()' : validatePhoneField(cleaned));
      setForm(f => ({ ...f, phone: cleaned }));
      return;
    }
    setForm(f => ({ ...f, [field]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const emailErr = validateEmailField(form.email);
    if (emailErr) { setEmailError(emailErr); toast.error(emailErr); return; }

    const phoneErr = validatePhoneField(form.phone);
    if (phoneErr) { setPhoneError(phoneErr); toast.error(phoneErr); return; }

    if (form.password !== form.confirmPassword) {
      toast.error('Паролі не співпадають');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Пароль має бути не менше 6 символів');
      return;
    }
    const success = await register(form.name, form.email, form.phone, form.password);
    if (success) {
      toast.success('Реєстрацію успішно завершено!');
      router.push(redirectTo);
    }
  };

  const passwordStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400'];
  const strengthLabels = ['', 'Слабкий', 'Середній', 'Надійний'];

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

          <h1 className="text-2xl font-serif font-medium text-lumi-text mb-2">Створити акаунт</h1>
          <p className="text-lumi-muted text-sm mb-8">
            Вже є акаунт?{' '}
            <Link href={`/auth/login${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`} className="text-lumi-rose hover:text-lumi-deeprose font-medium">
              Увійти
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-lumi-muted block mb-1.5">Ім'я та прізвище *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Ім'я та прізвище"
                value={form.name}
                onChange={update('name')}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-lumi-muted block mb-1.5">Email *</label>
              <input
                type="email"
                required
                className={`input-field ${emailError ? 'border-red-400 focus:ring-red-200' : ''}`}
                placeholder="your@email.com"
                value={form.email}
                onChange={update('email')}
              />
              {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-lumi-muted block mb-1.5">Телефон *</label>
              <input
                type="tel"
                required
                className={`input-field ${phoneError ? 'border-red-400 focus:ring-red-200' : ''}`}
                placeholder="+38 (0__) ___-__-__"
                value={form.phone}
                onChange={update('phone')}
                inputMode="tel"
              />
              {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-lumi-muted block mb-1.5">Пароль *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pr-12"
                  placeholder="Мінімум 6 символів"
                  value={form.password}
                  onChange={update('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lumi-muted hover:text-lumi-text"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-lumi-border'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-lumi-muted">{strengthLabels[passwordStrength]}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-lumi-muted block mb-1.5">Підтвердити пароль *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pr-12"
                  placeholder="Повторіть пароль"
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                />
                {form.confirmPassword && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {form.password === form.confirmPassword
                      ? <Check className="w-4 h-4 text-emerald-500" />
                      : <span className="text-red-400 text-sm">✗</span>}
                  </div>
                )}
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
                  Реєстрація...
                </span>
              ) : 'Зареєструватись'}
            </button>
          </form>

          <p className="text-xs text-lumi-muted text-center mt-4">
            Реєструючись, ви погоджуєтесь з{' '}
            <Link href="/terms" className="text-lumi-rose">умовами використання</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-lumi-milk" />}>
      <RegisterPageInner />
    </Suspense>
  );
}