'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, ChevronLeft, Clock, Star, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBookingWizardStore } from '@/store/bookingWizardStore';
import { useBookingsStore } from '@/store/bookingsStore';
import { useAuthStore } from '@/store/authStore';
import { useNotificationsStore } from '@/store/notificationsStore';
import { useDataStore } from '@/store/dataStore';
import { serviceCategories, generateTimeSlots } from '@/data/mock';
import { formatPrice, formatDuration, formatDate, cn, generateCalendarDays, MONTHS_UK, WEEKDAYS_UK } from '@/lib/utils';
import type { Service, Master } from '@/types';

// ============ STEP INDICATOR ============
const STEPS = [
  { id: 1, label: 'Послуга' },
  { id: 2, label: 'Майстер' },
  { id: 3, label: 'Дата' },
  { id: 4, label: 'Час' },
  { id: 5, label: 'Підтвердження' },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, idx) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
              step.id < currentStep ? 'bg-lumi-rose text-white'
                : step.id === currentStep ? 'bg-lumi-rose text-white ring-4 ring-lumi-blush/40'
                : 'bg-lumi-cream text-lumi-muted'
            )}>
              {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
            </div>
            <span className={cn(
              'text-xs hidden sm:block',
              step.id === currentStep ? 'text-lumi-rose font-medium' : 'text-lumi-muted'
            )}>
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={cn(
              'w-8 sm:w-16 h-px mx-1 sm:mx-2 mb-4 transition-all duration-300',
              step.id < currentStep ? 'bg-lumi-rose' : 'bg-lumi-border'
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

// ============ BOOKING SUMMARY SIDEBAR ============
function BookingSummary() {
  const { selectedService, selectedCategory, selectedMaster, selectedDate, selectedTime } = useBookingWizardStore();
  if (!selectedService && !selectedMaster && !selectedDate) return null;

  return (
    <div className="bg-white rounded-3xl shadow-soft p-5 sticky top-24">
      <h3 className="font-serif font-medium text-lumi-text mb-4">Ваш запис</h3>
      <div className="space-y-3">
        {selectedService && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl bg-lumi-cream flex items-center justify-center flex-shrink-0 text-base">
              {selectedCategory?.icon}
            </div>
            <div>
              <p className="text-xs text-lumi-muted">Послуга</p>
              <p className="text-sm font-medium text-lumi-text">{selectedService.name}</p>
              <p className="text-xs text-lumi-muted mt-0.5">{formatDuration(selectedService.duration)} · {formatPrice(selectedService.price)}</p>
            </div>
          </div>
        )}
        {selectedMaster && (
          <div className="flex gap-3 items-start border-t border-lumi-border pt-3">
            <Image src={selectedMaster.avatar} alt={selectedMaster.name} width={32} height={32} className="rounded-xl object-cover flex-shrink-0" />
            <div>
              <p className="text-xs text-lumi-muted">Майстер</p>
              <p className="text-sm font-medium text-lumi-text">{selectedMaster.name}</p>
            </div>
          </div>
        )}
        {selectedDate && (
          <div className="flex gap-3 items-start border-t border-lumi-border pt-3">
            <div className="w-8 h-8 rounded-xl bg-lumi-cream flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-lumi-rose" />
            </div>
            <div>
              <p className="text-xs text-lumi-muted">Дата{selectedTime && ' та час'}</p>
              <p className="text-sm font-medium text-lumi-text">
                {formatDate(selectedDate)}{selectedTime && ` о ${selectedTime}`}
              </p>
            </div>
          </div>
        )}
        {selectedService && (
          <div className="border-t border-lumi-border pt-3 flex justify-between items-center">
            <span className="text-sm text-lumi-muted">Вартість:</span>
            <span className="font-semibold text-lumi-text">{formatPrice(selectedService.price)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ STEP 1: SELECT SERVICE ============
function Step1({ onNext }: { onNext: () => void }) {
  const [activeCategory, setActiveCategory] = useState<string>(serviceCategories[0].id);
  const { setService } = useBookingWizardStore();
  const allServices = useDataStore(s => s.services);

  const currentCategory = serviceCategories.find(c => c.id === activeCategory)!;
  const filteredServices = allServices.filter(s => s.categoryId === activeCategory && s.isActive);

  const handleSelect = (service: Service) => {
    setService(service, currentCategory);
    onNext();
  };

  return (
    <div>
      <h2 className="text-xl font-serif font-medium text-lumi-text mb-6">Оберіть послугу</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {serviceCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
              activeCategory === cat.id
                ? 'bg-lumi-rose text-white shadow-pink'
                : 'bg-lumi-cream text-lumi-muted hover:bg-lumi-beige hover:text-lumi-text'
            )}
          >
            <span>{cat.icon}</span> {cat.name}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filteredServices.map(service => (
          <div
            key={service.id}
            onClick={() => handleSelect(service)}
            className="bg-lumi-milk border border-lumi-border hover:border-lumi-rose hover:bg-white rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 group"
          >
            <div className="flex-1">
              <p className="font-medium text-lumi-text group-hover:text-lumi-rose transition-colors">{service.name}</p>
              {service.description && <p className="text-xs text-lumi-muted mt-0.5 line-clamp-1">{service.description}</p>}
              <div className="flex items-center gap-1 mt-1.5 text-xs text-lumi-muted">
                <Clock className="w-3 h-3" />
                {formatDuration(service.duration)}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-lumi-text">{formatPrice(service.price)}</p>
              <p className="text-xs text-lumi-rose mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Обрати →</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ STEP 2: SELECT MASTER ============
function Step2({ onNext }: { onNext: () => void }) {
  const { selectedCategory, setMaster } = useBookingWizardStore();
  const allMasters = useDataStore(s => s.masters);

  const availableMasters = allMasters.filter(m => {
    if (m.isActive === false) return false;
    if (!selectedCategory) return true;
    return m.specializations.includes(selectedCategory.name);
  });

  const handleSelect = (master: Master) => {
    setMaster(master);
    onNext();
  };

  return (
    <div>
      <h2 className="text-xl font-serif font-medium text-lumi-text mb-6">Оберіть майстра</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableMasters.map(master => (
          <div
            key={master.id}
            onClick={() => handleSelect(master)}
            className="bg-lumi-milk border border-lumi-border hover:border-lumi-rose rounded-2xl p-4 flex gap-4 cursor-pointer transition-all duration-200 group hover:bg-white"
          >
            <Image src={master.avatar} alt={master.name} width={64} height={64} className="rounded-2xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-lumi-text group-hover:text-lumi-rose transition-colors">{master.name}</p>
              <p className="text-xs text-lumi-muted mt-0.5 line-clamp-1">{master.specializations.join(', ')}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold text-lumi-text">{master.rating}</span>
                </div>
                <span className="text-xs text-lumi-muted">·</span>
                <span className="text-xs text-lumi-muted">{master.experience} р. досвіду</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ STEP 3: SELECT DATE ============
function Step3({ onNext }: { onNext: () => void }) {
  const { setDate, selectedMaster } = useBookingWizardStore();
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const days = generateCalendarDays(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const isWorkingDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const dow = date.getDay();
    return selectedMaster?.workingDays.includes(dow) ?? true;
  };

  const handleSelect = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const date = new Date(currentYear, currentMonth, day);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (date < today || !isWorkingDay(day)) return;
    setDate(dateStr);
    onNext();
  };

  const today = new Date();

  return (
    <div>
      <h2 className="text-xl font-serif font-medium text-lumi-text mb-6">Оберіть дату</h2>
      <div className="bg-lumi-milk rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-lumi-cream transition-colors">
            <ChevronLeft className="w-4 h-4 text-lumi-muted" />
          </button>
          <h3 className="font-serif font-medium text-lumi-text text-lg">
            {MONTHS_UK[currentMonth]} {currentYear}
          </h3>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-lumi-cream transition-colors">
            <ChevronRight className="w-4 h-4 text-lumi-muted" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-3">
          {WEEKDAYS_UK.map(wd => (
            <div key={wd} className="text-center text-xs font-medium text-lumi-muted py-1">{wd}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (!day) return <div key={idx} />;
            const date = new Date(currentYear, currentMonth, day);
            const isToday_ = date.toDateString() === today.toDateString();
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
            const isWorking = isWorkingDay(day);
            const isDisabled = isPast || !isWorking;

            return (
              <button
                key={idx}
                onClick={() => !isDisabled && handleSelect(day)}
                className={cn(
                  'calendar-day w-full',
                  isDisabled ? 'disabled' : '',
                  isToday_ ? 'today' : '',
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
        {selectedMaster && (
          <div className="mt-4 pt-4 border-t border-lumi-border text-xs text-lumi-muted text-center">
            Майстер приймає: {['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
              .filter((_, i) => selectedMaster.workingDays.includes(i))
              .join(', ')}
            {' · '} {selectedMaster.workingHours.start}–{selectedMaster.workingHours.end}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ STEP 4: SELECT TIME ============
function Step4({ onNext }: { onNext: () => void }) {
  const { selectedDate, selectedMaster, selectedTime, setTime } = useBookingWizardStore();
  const allBookings = useBookingsStore(s => s.bookings);

  if (!selectedDate || !selectedMaster) return null;

  const slots = generateTimeSlots(selectedDate, selectedMaster.id, allBookings);

  const handleSelect = (time: string) => {
    setTime(time);
    onNext();
  };

  return (
    <div>
      <h2 className="text-xl font-serif font-medium text-lumi-text mb-2">Оберіть час</h2>
      <p className="text-lumi-muted text-sm mb-6">{formatDate(selectedDate)}</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
        {slots.map(slot => (
          <button
            key={slot.time}
            onClick={() => slot.available && handleSelect(slot.time)}
            disabled={!slot.available}
            className={cn(
              'time-slot',
              slot.available ? (selectedTime === slot.time ? 'selected' : 'available') : 'busy'
            )}
          >
            {slot.time}
            {!slot.available && <span className="block text-[10px] opacity-70">зайнято</span>}
          </button>
        ))}
      </div>
      {slots.every(s => !s.available) && (
        <div className="text-center py-8 text-lumi-muted">
          <p className="text-2xl mb-2">😔</p>
          <p>На цей день немає вільних слотів</p>
          <p className="text-sm mt-1">Спробуйте обрати інший день</p>
        </div>
      )}
    </div>
  );
}

// ============ STEP 5: CONFIRM ============
function Step5({ onConfirm }: { onConfirm: () => void }) {
  const store = useBookingWizardStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setEmailError(val && !val.includes('@') ? 'Email повинен містити символ @' : '');
  };

  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/[^\d+()\-\s]/g, '');
    setPhone(cleaned);
    setPhoneError(cleaned && cleaned.replace(/[^\d]/g, '').length < 10 ? 'Введіть коректний номер телефону' : '');
  };

  const handleSubmit = () => {
    const n = name.trim();
    const p = phone.trim();
    const e = email.trim();
    if (!n) { toast.error("Введіть ваше ім'я"); return; }
    if (!p) { toast.error('Введіть номер телефону'); return; }
    if (p.replace(/[^\d]/g, '').length < 10) { toast.error('Введіть коректний номер телефону'); return; }
    if (e && !e.includes('@')) { toast.error('Email повинен містити символ @'); return; }
    if (!agreed) { toast.error('Підтвердіть згоду з правилами'); return; }
    store.setClientInfo({ clientName: n, clientPhone: p, clientEmail: e, notes: notes.trim() });
    onConfirm();
  };

  const { selectedService, selectedCategory, selectedMaster, selectedDate, selectedTime } = store;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif font-medium text-lumi-text">Підтвердіть запис</h2>
      <div className="bg-lumi-cream/50 rounded-2xl p-5 space-y-3">
        <h3 className="font-medium text-lumi-text text-sm uppercase tracking-wider mb-3">Деталі запису</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-lumi-muted text-xs">Послуга</p>
            <p className="font-medium text-lumi-text mt-0.5">{selectedService?.name}</p>
          </div>
          <div>
            <p className="text-lumi-muted text-xs">Категорія</p>
            <p className="font-medium text-lumi-text mt-0.5">{selectedCategory?.name}</p>
          </div>
          <div>
            <p className="text-lumi-muted text-xs">Майстер</p>
            <p className="font-medium text-lumi-text mt-0.5">{selectedMaster?.name}</p>
          </div>
          <div>
            <p className="text-lumi-muted text-xs">Тривалість</p>
            <p className="font-medium text-lumi-text mt-0.5">{selectedService && formatDuration(selectedService.duration)}</p>
          </div>
          <div>
            <p className="text-lumi-muted text-xs">Дата</p>
            <p className="font-medium text-lumi-text mt-0.5">{selectedDate && formatDate(selectedDate)}</p>
          </div>
          <div>
            <p className="text-lumi-muted text-xs">Час</p>
            <p className="font-medium text-lumi-text mt-0.5">{selectedTime}</p>
          </div>
        </div>
        <div className="border-t border-lumi-border pt-3 flex justify-between">
          <span className="text-lumi-muted text-sm">Вартість:</span>
          <span className="font-bold text-lumi-text text-lg">{selectedService && formatPrice(selectedService.price)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lumi-text">Ваші дані</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-lumi-muted font-medium block mb-1.5">Ім&apos;я та прізвище *</label>
            <input className="input-field" placeholder="Наприклад: Анна Мороз" value={name} onChange={e => setName(e.target.value)} autoComplete="off" />
          </div>
          <div>
            <label className="text-xs text-lumi-muted font-medium block mb-1.5">Телефон *</label>
            <input
              className={cn('input-field', phoneError && 'border-red-400 focus:ring-red-200')}
              placeholder="+38 (0__) ___-__-__"
              value={phone}
              onChange={e => handlePhoneChange(e.target.value)}
              inputMode="tel"
              type="tel"
              autoComplete="off"
            />
            {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-lumi-muted font-medium block mb-1.5">Email</label>
            <input
              type="text"
              inputMode="email"
              className={cn('input-field', emailError && 'border-red-400 focus:ring-red-200')}
              placeholder="your@email.com"
              value={email}
              onChange={e => handleEmailChange(e.target.value)}
              autoComplete="off"
            />
            {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-lumi-muted font-medium block mb-1.5">Коментар (необов&apos;язково)</label>
            <textarea className="input-field resize-none" rows={3} placeholder="Алергія на матеріали, побажання..." value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          onClick={() => setAgreed(!agreed)}
          className={cn(
            'w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
            agreed ? 'bg-lumi-rose border-lumi-rose' : 'border-lumi-border group-hover:border-lumi-rose'
          )}
        >
          {agreed && <Check className="w-3 h-3 text-white" />}
        </div>
        <p className="text-sm text-lumi-muted">
          Я погоджуюсь з{' '}
          <Link href="/privacy" className="text-lumi-rose hover:underline">політикою конфіденційності</Link>
          {' '}та{' '}
          <Link href="/terms" className="text-lumi-rose hover:underline">правилами салону</Link>
        </p>
      </label>

      <button onClick={handleSubmit} className="btn-primary w-full justify-center py-4 text-base">
        Підтвердити запис <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ============ SUCCESS POPUP ============
function SuccessPopup({ onClose, onGoBookings }: { onClose: () => void; onGoBookings: () => void }) {
  const { selectedService, selectedMaster, selectedDate, selectedTime } = useBookingWizardStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-hover w-full max-w-md p-8 text-center animate-slide-up">
        <div className="w-20 h-20 rounded-full bg-lumi-blush/30 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-lumi-rose" />
        </div>
        <h2 className="text-2xl font-serif font-medium text-lumi-text mb-3">Запис підтверджено!</h2>
        <div className="bg-lumi-milk rounded-2xl p-4 mb-5 text-left space-y-2">
          {selectedService && (
            <div className="flex justify-between text-sm">
              <span className="text-lumi-muted">Послуга:</span>
              <span className="font-medium text-lumi-text">{selectedService.name}</span>
            </div>
          )}
          {selectedMaster && (
            <div className="flex justify-between text-sm">
              <span className="text-lumi-muted">Майстер:</span>
              <span className="font-medium text-lumi-text">{selectedMaster.name}</span>
            </div>
          )}
          {selectedDate && (
            <div className="flex justify-between text-sm">
              <span className="text-lumi-muted">Дата:</span>
              <span className="font-medium text-lumi-text">{formatDate(selectedDate)}</span>
            </div>
          )}
          {selectedTime && (
            <div className="flex justify-between text-sm">
              <span className="text-lumi-muted">Час:</span>
              <span className="font-medium text-lumi-text">{selectedTime}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-lumi-muted mb-6">🌸 Вітаємо! Очікуємо на вас у визначений час.</p>
        <div className="flex flex-col gap-3">
          <button onClick={onGoBookings} className="btn-primary w-full justify-center">Мої записи</button>
          <button onClick={onClose} className="btn-outline w-full justify-center">На головну</button>
        </div>
      </div>
    </div>
  );
}

// ============ ROLE BLOCK PAGE ============
function RoleBlockedPage({ role }: { role: string }) {
  const dashLink = role === 'admin' ? '/dashboard/admin' : '/dashboard/master';
  return (
    <div className="bg-lumi-milk min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6">🚫</div>
        <h2 className="font-serif text-2xl font-medium text-lumi-text mb-3">
          {role === 'admin' ? 'Адміністратори' : 'Майстри'} не можуть бронювати
        </h2>
        <p className="text-lumi-muted mb-6">
          {role === 'admin'
            ? 'Адміністратори можуть створювати записи через адмін-панель.'
            : 'Майстри не можуть записуватись як клієнти. Перегляньте свій розклад.'}
        </p>
        <Link href={dashLink} className="btn-primary justify-center">Перейти до кабінету</Link>
      </div>
    </div>
  );
}

// ============ MAIN BOOKING PAGE ============
export default function BookingPage() {
  const store = useBookingWizardStore();
  const { addBooking } = useBookingsStore();
  const { user } = useAuthStore();
  const { createBookingConfirmation } = useNotificationsStore();
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { step, nextStep, prevStep, selectedService, selectedMaster, selectedDate, selectedTime } = store;

  const handleConfirm = () => {
    if (!selectedService || !selectedMaster || !selectedDate || !selectedTime) return;

    const newBooking = addBooking({
      clientId: user?.id || 'guest',
      clientName: store.clientName,
      clientPhone: store.clientPhone,
      masterId: selectedMaster.id,
      masterName: selectedMaster.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      categoryName: store.selectedCategory?.name || '',
      date: selectedDate,
      time: selectedTime,
      duration: selectedService.duration,
      price: selectedService.price,
      status: 'confirmed',
      notes: store.notes,
    });

    // Виправлено: використовуємо createBookingConfirmation замість createBookingReminders
    createBookingConfirmation(newBooking);
    setIsSuccess(true);
    toast.success('Запис успішно створено!');
  };

  if (mounted && user && (user.role === 'admin' || user.role === 'master')) {
    return <RoleBlockedPage role={user.role} />;
  }

  if (mounted && !user) {
    return (
      <div className="bg-lumi-milk min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md bg-white rounded-3xl shadow-soft p-10">
          <div className="text-5xl mb-6">🔐</div>
          <h2 className="font-serif text-2xl font-medium text-lumi-text mb-3">Увійдіть, щоб записатися</h2>
          <p className="text-lumi-muted mb-6">Для онлайн-запису необхідно увійти до свого акаунту або зареєструватися.</p>
          <div className="flex flex-col gap-3">
            <Link href="/auth/login?redirect=/booking" className="btn-primary justify-center py-3">Увійти</Link>
            <Link href="/auth/register?redirect=/booking" className="btn-outline justify-center py-3">Зареєструватися</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-lumi-milk min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="section-title text-center">Онлайн-запис</h1>
          <p className="text-lumi-muted text-center mt-2">Запишіться до салону за кілька простих кроків</p>
        </div>

        <StepIndicator currentStep={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-soft p-6 md:p-8">
              {step === 1 && <Step1 onNext={nextStep} />}
              {step === 2 && <Step2 onNext={nextStep} />}
              {step === 3 && <Step3 onNext={nextStep} />}
              {step === 4 && <Step4 onNext={nextStep} />}
              {step === 5 && <Step5 onConfirm={handleConfirm} />}

              {step > 1 && !isSuccess && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 text-lumi-muted hover:text-lumi-text mt-6 transition-colors text-sm"
                >
                  <ChevronLeft className="w-4 h-4" /> Назад
                </button>
              )}
            </div>
          </div>
          <div className="lg:col-span-1">
            <BookingSummary />
          </div>
        </div>
      </div>

      {isSuccess && (
        <SuccessPopup
          onClose={() => { store.reset(); router.push('/'); }}
          onGoBookings={() => { store.reset(); router.push('/dashboard/client'); }}
        />
      )}
    </div>
  );
}
