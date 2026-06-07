'use client';
import Link from 'next/link';
import { ChevronRight, Star, Award, Clock } from 'lucide-react';
import { useDataStore } from '@/store/dataStore';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Master } from '@/types';

function MasterCard({ master }: { master: Master }) {
  return (
    <div className="card-hover overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-3xl">
        <img src={master.avatar} alt={master.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-soft">
          <svg className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-bold text-lumi-text">{master.rating}</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-serif font-semibold text-lg leading-tight">{master.name}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {master.specializations.map((spec) => (
              <span key={spec} className="text-[11px] bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">{spec}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-lumi-rose flex-shrink-0" />
            <span className="text-xs text-lumi-muted">{master.experience} р. досвіду</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-lumi-rose flex-shrink-0" />
            <span className="text-xs text-lumi-muted">{master.reviewsCount} відгуків</span>
          </div>
        </div>
        <p className="text-lumi-muted text-xs leading-relaxed line-clamp-2 mb-3">{master.bio}</p>
        <div className="flex items-center gap-1.5 mb-3 text-xs text-lumi-muted">
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {master.workingHours.start}–{master.workingHours.end} · {['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].filter((_, i) => master.workingDays.includes(i)).join(', ')}
          </span>
        </div>
        <Link
          href={`/booking?master=${master.id}`}
          className="btn-primary w-full justify-center text-xs py-1.5 px-2"
        >
          Записатись
        </Link>
      </div>
    </div>
  );
}

export default function MastersPage() {
  const allMasters = useDataStore(s => s.masters);
  const categories = useDataStore(s => s.serviceCategories);
  const activeMasters = allMasters.filter(m => m.isActive);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'Всі' },
    ...categories.map(c => ({ id: c.id, label: c.name })),
  ];

  const filteredMasters = activeFilter === 'all'
    ? activeMasters
    : activeMasters.filter(m =>
        m.specializations.some(s =>
          categories.find(c => c.id === activeFilter)?.name === s
        )
      );

  return (
    <div className="bg-lumi-milk min-h-screen">
      <div className="bg-white border-b border-lumi-border">
        <div className="page-container py-10">
          <nav className="flex items-center gap-2 text-sm text-lumi-muted mb-4">
            <Link href="/" className="hover:text-lumi-text">Головна</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-lumi-text">Майстри</span>
          </nav>
          <h1 className="section-title">Наша команда</h1>
          <p className="text-lumi-muted mt-2 max-w-xl">
            Познайомтесь із нашими талановитими майстрами — клікніть на карточку, щоб дізнатись більше.
          </p>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                activeFilter === filter.id
                  ? 'bg-lumi-rose text-white shadow-pink'
                  : 'bg-white text-lumi-muted hover:bg-lumi-cream hover:text-lumi-text shadow-soft'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {filteredMasters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMasters.map((master) => (
              <MasterCard key={master.id} master={master} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-lumi-muted">
            <p className="text-xl mb-2">😔</p>
            <p>Майстрів за цією категорією не знайдено</p>
          </div>
        )}
      </div>
    </div>
  );
}