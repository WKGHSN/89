'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, Star, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useBookingsStore } from '@/store/bookingsStore';
import { useDataStore } from '@/store/dataStore';
import { mockUsers } from '@/data/mock';
import { formatDate, formatPrice, getStatusLabel, getStatusBadgeClass, generateCalendarDays, MONTHS_UK, WEEKDAYS_UK, cn } from '@/lib/utils';
import type { Booking } from '@/types';

const STAR_PATH = 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';

export default function MasterDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const allBookings = useBookingsStore(s => s.bookings);
  const getMasterBookings = useBookingsStore(s => s.getMasterBookings);
  // ✅ беремо майстрів з dataStore а не з mock напряму
  const masters = useDataStore(s => s.masters);

  const [activeTab, setActiveTab] = useState<'schedule' | 'bookings' | 'profile'>('schedule');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="min-h-screen bg-lumi-milk" />;

  if (!user || user.role !== 'master') {
    router.push('/auth/login');
    return null;
  }

  const masterUser = mockUsers.find(u => u.id === user.id);
  const master = masters.find(m => m.id === (masterUser as any)?.masterId) || masters[0];

  // ✅ використовуємо getMasterBookings зі стору
  const masterBookings = getMasterBookings(master.id);
  const today = new Date().toISOString().split('T')[0];
  const upcomingBookings = masterBookings
    .filter(b => b.date >= today && b.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-lumi-milk min-h-screen">
      {/* Header */}
      <div className="bg-lumi-text text-white sticky top-0 z-40">
        <div className="page-container">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Image src={master.avatar} alt={master.name} width={32} height={32} className="rounded-full object-cover" />
              <div>
                <p className="font-medium text-white text-sm">{master.name}</p>
                <p className="text-white/50 text-xs">Майстер</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-white/60 hover:text-white text-sm">Сайт ↗</Link>
              <button onClick={() => { logout(); router.push('/'); }} className="text-white/60 hover:text-white">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Записів сьогодні', value: masterBookings.filter(b => b.date === today).length, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
            { label: 'На цьому тижні', value: upcomingBookings.slice(0, 7).length, icon: Clock, color: 'bg-amber-50 text-amber-600' },
            { label: 'Всього записів', value: masterBookings.length, icon: User, color: 'bg-lumi-blush/40 text-lumi-rose' },
            { label: 'Середня оцінка', value: master.rating, icon: Star, color: 'bg-emerald-50 text-emerald-600' },
          ].map(stat => (
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

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-soft p-4">
              <div className="flex flex-col items-center text-center gap-3 p-3 mb-3 border-b border-lumi-border">
                <Image src={master.avatar} alt={master.name} width={64} height={64} className="rounded-full object-cover" />
                <div>
                  <p className="font-medium text-lumi-text text-sm">{master.name}</p>
                  <p className="text-xs text-lumi-muted">{master.specializations.join(', ')}</p>
                  <div className="flex items-center gap-1 justify-center mt-1">
                    <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 20 20">
                      <path d={STAR_PATH} />
                    </svg>
                    <span className="text-xs font-semibold text-lumi-text">{master.rating}</span>
                    <span className="text-xs text-lumi-muted">({master.reviewsCount})</span>
                  </div>
                </div>
              </div>

              <nav className="flex flex-col gap-1">
                {[
                  { id: 'schedule' as const, label: 'Розклад', icon: Calendar },
                  { id: 'bookings' as const, label: 'Мої записи', icon: Clock },
                  { id: 'profile' as const, label: 'Профіль', icon: User },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn('sidebar-nav-item text-left w-full', activeTab === item.id && 'active')}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'schedule' && <ScheduleTab master={master} bookings={masterBookings} />}
            {activeTab === 'bookings' && <BookingsTab bookings={upcomingBookings} />}
            {activeTab === 'profile' && <MasterProfileTab master={master} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleTab({ master, bookings }: { master: any; bookings: Booking[] }) {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(now.toISOString().split('T')[0]);

  const days = generateCalendarDays(currentYear, currentMonth);

  const getDayBookings = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings.filter(b => b.date === dateStr && b.status !== 'cancelled');
  };

  const selectedBookings = selectedDate
    ? bookings.filter(b => b.date === selectedDate && b.status !== 'cancelled').sort((a, b) => a.time.localeCompare(b.time))
    : [];

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  return (
    <div className="space-y-4">
      <h2 className="font-serif font-medium text-lumi-text text-2xl">Мій розклад</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-lumi-cream">
              <ChevronLeft className="w-4 h-4 text-lumi-muted" />
            </button>
            <h3 className="font-serif font-medium text-lumi-text">{MONTHS_UK[currentMonth]} {currentYear}</h3>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-lumi-cream">
              <ChevronRight className="w-4 h-4 text-lumi-muted" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS_UK.map(wd => (
              <div key={wd} className="text-center text-xs font-medium text-lumi-muted py-1">{wd}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (!day) return <div key={idx} />;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayBookings = getDayBookings(day);
              const isSelected = selectedDate === dateStr;
              const isToday = new Date(currentYear, currentMonth, day).toDateString() === now.toDateString();

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(dateStr)}
                  className={cn('calendar-day relative', isSelected && 'selected', !isSelected && isToday && 'today')}
                >
                  {day}
                  {dayBookings.length > 0 && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-lumi-rose" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day bookings */}
        <div className="bg-white rounded-2xl shadow-soft p-5">
          <h3 className="font-medium text-lumi-text mb-4">
            {selectedDate ? formatDate(selectedDate) : 'Оберіть день'}
          </h3>
          {selectedBookings.length === 0 ? (
            <div className="text-center py-8 text-lumi-muted">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">На цей день записів немає</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedBookings.map(b => (
                <div key={b.id} className="flex gap-3 p-3 bg-lumi-milk rounded-xl">
                  <div className="text-center flex-shrink-0">
                    <p className="text-lg font-bold text-lumi-rose">{b.time}</p>
                  </div>
                  <div>
                    <p className="font-medium text-lumi-text text-sm">{b.serviceName}</p>
                    <p className="text-xs text-lumi-muted">{b.clientName} · {b.clientPhone}</p>
                    <span className={cn(getStatusBadgeClass(b.status), 'mt-1 inline-block text-xs')}>
                      {getStatusLabel(b.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookingsTab({ bookings }: { bookings: Booking[] }) {
  return (
    <div>
      <h2 className="font-serif font-medium text-lumi-text text-2xl mb-4">Майбутні записи</h2>
      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft p-10 text-center text-lumi-muted">
          <p className="text-2xl mb-2">📅</p>
          <p>Майбутніх записів немає</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.id} className="bg-white rounded-2xl shadow-soft p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-medium text-lumi-text">{b.serviceName}</h3>
                    <span className={getStatusBadgeClass(b.status)}>{getStatusLabel(b.status)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    <p className="text-lumi-muted flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> {b.clientName}
                    </p>
                    <p className="text-lumi-muted">{b.clientPhone}</p>
                    <p className="text-lumi-muted flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {formatDate(b.date)}
                    </p>
                    <p className="text-lumi-muted flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {b.time}
                    </p>
                  </div>
                  {b.notes && <p className="text-xs text-lumi-muted mt-2 italic">&quot;{b.notes}&quot;</p>}
                </div>
                <p className="font-bold text-lumi-text flex-shrink-0">{formatPrice(b.price)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MasterProfileTab({ master }: { master: any }) {
  return (
    <div>
      <h2 className="font-serif font-medium text-lumi-text text-2xl mb-4">Мій профіль</h2>
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <div className="flex items-start gap-5 mb-6 pb-6 border-b border-lumi-border">
          <Image src={master.avatar} alt={master.name} width={80} height={80} className="rounded-2xl object-cover flex-shrink-0" />
          <div>
            <h3 className="font-serif font-medium text-lumi-text text-xl">{master.name}</h3>
            <p className="text-lumi-muted text-sm mt-1">{master.specializations.join(' · ')}</p>
            <p className="text-lumi-muted text-sm mt-1">{master.experience} р. досвіду · {master.reviewsCount} відгуків</p>
          </div>
        </div>
        <p className="text-lumi-muted text-sm leading-relaxed">{master.bio}</p>
        <div className="mt-4 pt-4 border-t border-lumi-border">
          <p className="text-xs text-lumi-muted font-medium uppercase tracking-wider mb-2">Графік роботи</p>
          <p className="text-sm text-lumi-text">
            {['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
              .filter((_, i) => master.workingDays.includes(i))
              .join(', ')}
            {' · '} {master.workingHours.start}–{master.workingHours.end}
          </p>
        </div>
        <p className="text-xs text-lumi-muted mt-4 italic">
          Для зміни профілю зверніться до адміністратора
        </p>
      </div>
    </div>
  );
}