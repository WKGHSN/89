'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Clock, ArrowRight } from 'lucide-react';
import { useDataStore } from '@/store/dataStore';
import { formatPrice, formatDuration, cn } from '@/lib/utils';
import { useBookingWizardStore } from '@/store/bookingWizardStore';
import { useRouter } from 'next/navigation';
import type { Service } from '@/types';

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingStore = useBookingWizardStore();
  const serviceCategories = useDataStore(s => s.serviceCategories);
  const allServices = useDataStore(s => s.services);

  const initialCategory = searchParams.get('category') || serviceCategories[0]?.slug || '';
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const currentCategory = serviceCategories.find(c => c.slug === activeCategory) || serviceCategories[0];
  const filteredServices = allServices.filter(s => s.categoryId === activeCategory && s.isActive);

  const handleSelectService = (service: Service) => {
    bookingStore.setService(service, currentCategory);
    bookingStore.setStep(2);
    router.push('/booking');
  };

  return (
    <div className="bg-lumi-milk min-h-screen">
      <div className="bg-white border-b border-lumi-border">
        <div className="page-container py-10">
          <nav className="flex items-center gap-2 text-sm text-lumi-muted mb-4">
            <Link href="/" className="hover:text-lumi-text">Головна</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-lumi-text">Послуги</span>
          </nav>
          <h1 className="section-title">Наші послуги</h1>
          <p className="text-lumi-muted mt-2 max-w-xl">
            Оберіть категорію та послугу, яка вам потрібна. Запис онлайн за кілька хвилин.
          </p>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-soft p-4 lg:sticky lg:top-24">
              <h3 className="text-xs font-semibold text-lumi-muted uppercase tracking-wider px-4 py-2 mb-1">
                Категорії
              </h3>
              <nav className="flex flex-col gap-1">
                {serviceCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={cn(
                      'sidebar-nav-item text-left w-full',
                      activeCategory === cat.slug && 'active'
                    )}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span>{cat.name}</span>
                    <span className="ml-auto text-xs bg-lumi-cream text-lumi-muted rounded-full px-2 py-0.5">
                      {allServices.filter(s => s.categoryId === cat.id && s.isActive).length}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-soft p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-lumi-cream flex items-center justify-center text-3xl flex-shrink-0">
                  {currentCategory.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-medium text-lumi-text">{currentCategory.name}</h2>
                  <p className="text-lumi-muted text-sm mt-1">{currentCategory.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredServices.map((service) => (
                <ServiceItem key={service.id} service={service} onSelect={handleSelectService} />
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-br from-lumi-blush/20 to-lumi-cream rounded-3xl p-6 text-center">
              <p className="text-lumi-text font-medium mb-2">Не знайшли потрібне?</p>
              <p className="text-lumi-muted text-sm mb-4">
                Зв&apos;яжіться з нами, і ми підберемо найкращий варіант для вас
              </p>
              <Link href="/contacts" className="btn-secondary">
                Зв&apos;язатись <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceItem({ service, onSelect }: { service: Service; onSelect: (s: Service) => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-5 flex items-center justify-between gap-4 group hover:shadow-card transition-all duration-200">
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-lumi-text group-hover:text-lumi-rose transition-colors">
          {service.name}
        </h3>
        {service.description && (
          <p className="text-lumi-muted text-sm mt-0.5 line-clamp-1">{service.description}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-xs text-lumi-muted">
            <Clock className="w-3.5 h-3.5" />
            {formatDuration(service.duration)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right">
          <p className="font-semibold text-lumi-text text-lg">{formatPrice(service.price)}</p>
        </div>
        <button onClick={() => onSelect(service)} className="btn-primary py-2 px-4 text-sm">
          Обрати
        </button>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="bg-lumi-milk min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lumi-muted">Завантаження...</div>
      </div>
    }>
      <ServicesContent />
    </Suspense>
  );
}
