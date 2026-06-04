'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Users, Award, Calendar, ChevronRight, Quote } from 'lucide-react';
import { serviceCategories, masters, reviews } from '@/data/mock';
import { useAuthStore } from '@/store/authStore';
import { useBookingsStore } from '@/store/bookingsStore'; 
import { formatDate } from '@/lib/utils';
import { useState, useEffect } from 'react';

const STAR_PATH = 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';

const stats = [
  { icon: Users, label: 'Задоволених клієнтів', value: '2 000+' },
  { icon: Award, label: 'Досвідчених майстрів', value: '4' },
  { icon: Calendar, label: 'Завершених записів', value: '12 000+' },
  { icon: Star, label: 'Середня оцінка', value: '4.9' },
];

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={sizeClass} fill={star <= Math.round(rating) ? '#F59E0B' : '#E5E7EB'} viewBox="0 0 20 20">
          <path d={STAR_PATH} />
        </svg>
      ))}
    </div>
  );
}

function ServiceCard({ category }: { category: typeof serviceCategories[0] }) {
  return (
    <Link href={`/services?category=${category.slug}`} className="group h-full">
      <div className="card-hover p-6 flex flex-col items-center text-center gap-4 h-full">
        <div className="w-16 h-16 rounded-2xl bg-lumi-cream flex items-center justify-center text-3xl group-hover:bg-lumi-blush/40 transition-colors duration-300 flex-shrink-0">
          {category.icon}
        </div>
        <div className="flex-1 flex flex-col">
          <h3 className="font-serif font-medium text-lumi-text text-lg mb-1">{category.name}</h3>
          <p className="text-lumi-muted text-sm leading-relaxed flex-1">{category.description}</p>
        </div>
        <span className="text-lumi-rose text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all flex-shrink-0">
          Переглянути <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

function NextBookingCard() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();
  // ✅ використовуємо getUpcomingBookings з bookingsStore замість ручної фільтрації
  const getUpcomingBookings = useBookingsStore((s) => s.getUpcomingBookings);

  useEffect(() => { setMounted(true); }, []);

  const floatingCard = (emoji: string, label: string, value: string) => (
    <div className="absolute -left-8 top-1/4 glass rounded-2xl p-4 shadow-card animate-float">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-lumi-rose flex items-center justify-center text-white text-lg">
          {emoji}
        </div>
        <div>
          <p className="text-xs text-lumi-muted">{label}</p>
          <p className="text-sm font-semibold text-lumi-text">{value}</p>
        </div>
      </div>
    </div>
  );

  if (!mounted || !user) return floatingCard('💅', 'Запишіться онлайн', 'За 2 хвилини');

  const upcoming = getUpcomingBookings(user.id);
  const next = upcoming[0];

  if (!next) return floatingCard('📅', 'Немає записів', 'Записатись зараз');

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="absolute -left-8 top-1/4 glass rounded-2xl p-4 shadow-card animate-float max-w-[200px]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-lumi-rose flex items-center justify-center text-white text-lg flex-shrink-0">
          💅
        </div>
        <div className="min-w-0">
          <p className="text-xs text-lumi-muted">Наступний запис</p>
          <p className="text-sm font-semibold text-lumi-text leading-tight truncate">{next.serviceName}</p>
          <p className="text-xs text-lumi-muted mt-0.5">
            {next.date === today ? 'Сьогодні' : formatDate(next.date)} · {next.time}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============ HOME PAGE ============
export default function HomePage() {
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-lumi-milk">
        <div className="page-container py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-5rem)]">

            {/* Left: Text */}
            <div className="flex flex-col gap-6 animate-slide-up">
              <div className="inline-flex">
                <span className="section-tag">✨ Преміум салон краси у Києві</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight text-lumi-text">
                Краса, що{' '}
                <span className="relative">
                  <span className="text-lumi-rose">підкреслює</span>
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M2 6C50 2 150 2 198 6" stroke="#E8A5A5" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </span>
                {' '}твою індивідуальність
              </h1>
              <p className="text-lumi-muted text-lg leading-relaxed max-w-lg">
                Забудь про телефонні дзвінки та незручне очікування. Обирай послугу, майстра та зручний час — все онлайн за кілька хвилин.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/booking" className="btn-primary text-base px-8 py-3.5">
                  Записатись онлайн <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/services" className="btn-outline text-base px-8 py-3.5">
                  Переглянути послуги
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 pt-2">
                <div className="flex -space-x-2">
                  {masters.slice(0, 3).map((master) => (
                    <div key={master.id} className="w-9 h-9 rounded-full border-2 border-white overflow-hidden bg-lumi-nude">
                      <Image src={master.avatar} alt={master.name} width={36} height={36} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={5} />
                    <span className="text-sm font-semibold text-lumi-text">4.9</span>
                  </div>
                  <p className="text-xs text-lumi-muted">на основі 380+ відгуків</p>
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] shadow-hover">
                <Image
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=700&h=900&fit=crop"
                  alt="LumiBeauty Salon"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-lumi-text/10 to-transparent" />
              </div>
              <NextBookingCard />
              <div className="absolute -right-6 bottom-1/4 glass rounded-2xl p-4 shadow-card">
                <div className="flex flex-col gap-1.5 items-center">
                  <StarRating rating={5} size="md" />
                  <p className="text-sm font-bold text-lumi-text">4.9 / 5.0</p>
                  <p className="text-xs text-lumi-muted">380+ відгуків</p>
                </div>
              </div>
              <div className="absolute -z-10 top-10 right-10 w-32 h-32 rounded-full bg-lumi-blush/30 blur-3xl" />
              <div className="absolute -z-10 bottom-10 left-10 w-40 h-40 rounded-full bg-lumi-nude/40 blur-3xl" />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full -z-10 bg-gradient-to-l from-lumi-cream/50 to-transparent pointer-events-none" />
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="bg-white py-12 border-y border-lumi-border">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-3 text-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-lumi-blush/30 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-lumi-rose" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-serif font-bold text-lumi-text">{stat.value}</p>
                  <p className="text-sm text-lumi-muted mt-1">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="section bg-lumi-milk">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-tag">Наші послуги</span>
            <h2 className="section-title">Весь спектр бьюті-послуг</h2>
            <p className="section-subtitle mx-auto">
              Від класичного манікюру до складних технік фарбування — ми піклуємось про кожну деталь вашого образу.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 items-stretch">
            {serviceCategories.map((category) => (
              <ServiceCard key={category.id} category={category} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/services" className="btn-secondary">
              Всі послуги та ціни <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    {/* ===== MASTERS SECTION ===== */}
<section className="section bg-lumi-cream/50">
  <div className="page-container">
    <div className="text-center mb-12">
      <span className="section-tag">Наша команда</span>
      <h2 className="section-title">Майстри своєї справи</h2>
      <p className="section-subtitle mx-auto">
        Кожен наш майстер — це сертифікований фахівець із роками досвіду та любов&apos;ю до своєї роботи.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {masters.map((master) => (
        <div key={master.id} className="group card-hover overflow-hidden">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={master.avatar}
              alt={master.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-lumi-text/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-serif font-medium text-white text-lg leading-tight">{master.name}</p>
              <p className="text-white/80 text-sm mt-1">{master.specializations.join(' · ')}</p>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
              <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 20 20">
                <path d={STAR_PATH} />
              </svg>
              <span className="text-xs font-semibold text-lumi-text">{master.rating}</span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-lumi-muted">{master.experience} р. досвіду</span>
              <span className="text-xs text-lumi-muted">{master.reviewsCount} відгуків</span>
            </div>
            <Link href="/booking" className="btn-primary w-full justify-center mt-3 py-2.5 text-sm">
              Записатись
            </Link>
          </div>
        </div>
      ))}
    </div>
    <div className="text-center mt-8">
      <Link href="/masters" className="btn-outline">
        Всі майстри <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
</section>
      {/* ===== REVIEWS SECTION ===== */}
      <section className="section bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="section-tag">Відгуки клієнтів</span>
            <h2 className="section-title">Нас рекомендують</h2>
            <p className="section-subtitle mx-auto">
              Реальні відгуки від наших клієнток — найкраще свідчення нашої роботи.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="card p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <StarRating rating={review.rating} />
                  <Quote className="w-5 h-5 text-lumi-blush" />
                </div>
                <p className="text-lumi-text text-sm leading-relaxed flex-1 line-clamp-3">{review.text}</p>
                <div className="flex items-center gap-3 pt-3 border-t border-lumi-border">
                  {review.clientAvatar ? (
                    <Image src={review.clientAvatar} alt={review.clientName} width={36} height={36} className="rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-lumi-cream flex items-center justify-center text-lumi-rose font-semibold text-sm">
                      {review.clientName[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-lumi-text">{review.clientName}</p>
                    <p className="text-xs text-lumi-muted">{review.serviceName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/reviews" className="btn-secondary">
              Всі відгуки <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="section">
        <div className="page-container">
          <div className="relative bg-gradient-to-br from-lumi-text via-lumi-text to-lumi-rose/30 rounded-[3rem] overflow-hidden p-10 md:p-16 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-lumi-rose/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-lumi-blush/10 blur-3xl" />
            <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
              <span className="section-tag bg-white/10 text-white border border-white/20">Запишись зараз</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-white leading-tight">
                Твоя краса заслуговує на найкраще
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Запишись онлайн за кілька хвилин та отримай незабутній досвід у LumiBeauty
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/booking" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-lumi-rose font-medium rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200">
                  Записатись онлайн <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contacts" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-medium rounded-full border border-white/20 hover:bg-white/20 active:scale-95 transition-all duration-200">
                  Зв&apos;язатись з нами
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}