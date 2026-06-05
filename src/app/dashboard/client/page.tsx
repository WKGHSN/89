'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User, LogOut, Plus, ChevronRight, Star, Upload, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useBookingsStore } from '@/store/bookingsStore';
import { formatDate, formatPrice, getStatusLabel, getStatusBadgeClass, cn, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Booking, AuthUser } from '@/types';

type TabType = 'upcoming' | 'past' | 'profile';

export default function ClientDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const allBookings = useBookingsStore(s => s.bookings);
  const cancelBooking = useBookingsStore(s => s.cancelBooking);
  const getUpcomingBookings = useBookingsStore(s => s.getUpcomingBookings);
  const getPastBookings = useBookingsStore(s => s.getPastBookings);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && (!user || user.role !== 'client')) {
      if (!user) router.push('/auth/login');
      else if (user.role === 'admin') router.push('/dashboard/admin');
      else if (user.role === 'master') router.push('/dashboard/master');
    }
  }, [mounted, user, router]);

  if (!mounted) return <div className="min-h-screen bg-lumi-milk" />;
  if (!user || user.role !== 'client') return <div className="min-h-screen bg-lumi-milk" />;

  const userBookings = allBookings.filter(b => b.clientId === user.id);
  const upcoming = getUpcomingBookings(user.id);
  const past = getPastBookings(user.id);

  const handleCancel = (id: string) => {
    cancelBooking(id);
    toast.success('Запис скасовано');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'upcoming', label: 'Майбутні записи', icon: Calendar },
    { id: 'past', label: 'Історія', icon: Clock },
    { id: 'profile', label: 'Профіль', icon: User },
  ];

  return (
    <div className="bg-lumi-milk min-h-screen">
      <div className="bg-white border-b border-lumi-border">
        <div className="page-container py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <UserAvatar user={user} size="lg" />
              <div>
                <h1 className="font-serif font-medium text-lumi-text text-xl">
                  Привіт, {user.name.split(' ')[0]}!
                </h1>
                <p className="text-lumi-muted text-sm">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/booking" className="btn-primary">
                <Plus className="w-4 h-4" /> Новий запис
              </Link>
              <button onClick={handleLogout} className="btn-ghost text-lumi-muted">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Всього записів', value: userBookings.length, icon: Calendar, color: 'text-blue-500 bg-blue-50' },
            { label: 'Майбутніх', value: upcoming.length, icon: Clock, color: 'text-amber-500 bg-amber-50' },
            { label: 'Завершено', value: userBookings.filter(b => b.status === 'completed').length, icon: Star, color: 'text-emerald-500 bg-emerald-50' },
            { label: 'Скасовано', value: userBookings.filter(b => b.status === 'cancelled').length, icon: ChevronRight, color: 'text-red-400 bg-red-50' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow-soft p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-lumi-text">{stat.value}</p>
                <p className="text-xs text-lumi-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-soft p-4">
              <nav className="flex flex-col gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn('sidebar-nav-item text-left w-full', activeTab === tab.id && 'active')}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.id === 'upcoming' && upcoming.length > 0 && (
                      <span className="ml-auto text-xs bg-lumi-rose text-white rounded-full w-5 h-5 flex items-center justify-center">
                        {upcoming.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1">
            {activeTab === 'upcoming' && (
              <div>
                <h2 className="font-serif font-medium text-lumi-text text-xl mb-4">Майбутні записи</h2>
                {upcoming.length === 0 ? (
                  <EmptyState
                    message="У вас немає майбутніх записів"
                    action={<Link href="/booking" className="btn-primary">Записатись <Plus className="w-4 h-4" /></Link>}
                  />
                ) : (
                  <div className="space-y-3">
                    {upcoming.map(b => (
                      <BookingCard key={b.id} booking={b} onCancel={handleCancel} showCancel />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'past' && (
              <div>
                <h2 className="font-serif font-medium text-lumi-text text-xl mb-4">Історія записів</h2>
                {past.length === 0 ? (
                  <EmptyState message="Ваша історія записів порожня" />
                ) : (
                  <div className="space-y-3">
                    {past.map(b => <BookingCard key={b.id} booking={b} />)}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && <ProfileTab user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ USER AVATAR — показує фото або ініціали ============
function UserAvatar({ user, size = 'md' }: { user: AuthUser; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-14 h-14 text-xl' : size === 'md' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm';

  if (user.avatar) {
    return (
      <Image
        src={user.avatar}
        alt={user.name}
        width={size === 'lg' ? 56 : size === 'md' ? 40 : 32}
        height={size === 'lg' ? 56 : size === 'md' ? 40 : 32}
        className={cn('rounded-full object-cover flex-shrink-0', sizeClass)}
      />
    );
  }

  return (
    <div className={cn('rounded-full bg-gradient-to-br from-lumi-blush to-lumi-rose flex items-center justify-center text-white font-semibold flex-shrink-0', sizeClass)}>
      {getInitials(user.name)}
    </div>
  );
}

// ============ BOOKING CARD ============
function BookingCard({ booking, onCancel, showCancel }: {
  booking: Booking;
  onCancel?: (id: string) => void;
  showCancel?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h3 className="font-medium text-lumi-text">{booking.serviceName}</h3>
            <span className={getStatusBadgeClass(booking.status)}>
              {getStatusLabel(booking.status)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <p className="text-lumi-muted flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> {booking.masterName}
            </p>
            <p className="text-lumi-muted flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {formatDate(booking.date)}
            </p>
            <p className="text-lumi-muted flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {booking.time}
            </p>
            <p className="font-semibold text-lumi-text">{formatPrice(booking.price)}</p>
          </div>
        </div>
        {showCancel && onCancel && (booking.status === 'pending' || booking.status === 'confirmed') && (
          <button
            onClick={() => onCancel(booking.id)}
            className="text-red-400 hover:text-red-600 text-xs border border-red-200 hover:border-red-400 rounded-xl px-3 py-1.5 transition-colors flex-shrink-0"
          >
            Скасувати
          </button>
        )}
      </div>
    </div>
  );
}

// ============ EMPTY STATE ============
function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-10 text-center">
      <p className="text-3xl mb-3">📅</p>
      <p className="text-lumi-muted mb-4">{message}</p>
      {action}
    </div>
  );
}

// ============ PROFILE TAB ============
function ProfileTab({ user }: { user: AuthUser }) {
  const { setHydrated } = useAuthStore();
  const updateUser = useAuthStore(s => s.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>(user.avatar);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Оберіть файл зображення'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Файл занадто великий (максимум 5 МБ)'); return; }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 400;
        let { width, height } = img;
        if (width > height) { if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; } }
        else { if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; } }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/webp', 0.85);
        setAvatar(compressed);
        setIsUploading(false);
        toast.success('Фото завантажено — збережіть зміни');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // Оновлюємо дані в localStorage через authStore
    const updated = { ...user, name, email, avatar };
    localStorage.setItem('lumibeauty-auth', JSON.stringify({ user: updated }));
    // Перезавантажуємо стан
    setHydrated();
    toast.success('Профіль оновлено!');
  };

  return (
    <div>
      <h2 className="font-serif font-medium text-lumi-text text-xl mb-4">Мій профіль</h2>
      <div className="bg-white rounded-2xl shadow-soft p-6">

        {/* Avatar section */}
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-lumi-border">
          <div className="relative group flex-shrink-0">
            {avatar ? (
              <Image
                src={avatar}
                alt={user.name}
                width={80}
                height={80}
                className="rounded-full object-cover w-20 h-20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-lumi-blush to-lumi-rose flex items-center justify-center text-white text-2xl font-semibold">
                {getInitials(user.name)}
              </div>
            )}

            {/* Overlay для завантаження */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={isUploading}
            >
              <Upload className="w-5 h-5 text-white" />
            </button>

            {/* Кнопка видалення фото */}
            {avatar && (
              <button
                onClick={() => setAvatar(undefined)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
          />

          <div>
            <h3 className="font-medium text-lumi-text">{user.name}</h3>
            <p className="text-sm text-lumi-muted mb-2">
              {user.role === 'client' ? 'Клієнт' : user.role === 'admin' ? 'Адміністратор' : 'Майстер'}
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-lumi-rose hover:underline flex items-center gap-1"
              disabled={isUploading}
            >
              <Upload className="w-3 h-3" />
              {isUploading ? 'Завантаження...' : avatar ? 'Змінити фото' : 'Завантажити фото'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-lumi-muted block mb-1.5">
              Ім&apos;я та прізвище
            </label>
            <input className="input-field" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-lumi-muted block mb-1.5">Email</label>
            <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-lumi-muted block mb-1.5">Телефон</label>
            <input
              className="input-field"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+38 (0__) ___-__-__"
            />
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary mt-6">
          Зберегти зміни
        </button>
      </div>
    </div>
  );
}
