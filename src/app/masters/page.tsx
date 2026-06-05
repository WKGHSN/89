'use client';
import Link from 'next/link';
import { ChevronRight, Star, Award, Clock, X, Calendar, BookOpen, CheckCircle } from 'lucide-react';
import { useDataStore } from '@/store/dataStore';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Master } from '@/types';

const CERTIFICATES: Record<string, string[]> = {
  'master-1': [
    'Сертифікат майстра манікюру (NAILS PRO Academy, 2017)',
    'Nail-art Design Professional (London Beauty School, 2019)',
    'Апаратний манікюр та педикюр (Beauty Expert, 2020)',
    'Гель-лак & Акрил майстерність (BeautyPRO, 2022)',
  ],
  'master-2': [
    'Архітектура та дизайн брів (BrowPro Academy, 2019)',
    'Класичне нарощування вій (LashMaster, 2019)',
    'Volume & Mega-Volume lashes (The Lash Academy, 2020)',
    'Перманентний макіяж — брови (PMU School Ukraine, 2021)',
    'Ламінування та ботокс вій (Beauty Expert, 2022)',
  ],
  'master-3': [
    'Диплом перукаря-стиліста (Vidal Sassoon School, Лондон, 2015)',
    'Техніки фарбування волосся (L\'Oréal Professionnel, 2016)',
    'Balayage & Ombre Masterclass (Wella Professionals, 2018)',
    'Кератинове випрямлення (Brazilian Blowout Certified, 2019)',
    'Сучасні техніки стрижки (Toni&Guy Academy, 2021)',
  ],
  'master-4': [
    'Базовий курс манікюру (Beauty Start, 2021)',
    'Мінімалістичний nail-design (NailArt Studio, 2022)',
    'Архітектура та корекція брів (BrowStyle Academy, 2022)',
    'Гель-лак та зміцнення нігтів (Kodi Professional, 2023)',
  ],
};

const WORK_EXPERIENCE: Record<string, { year: string; title: string; place: string }[]> = {
  'master-1': [
    { year: '2017–2019', title: 'Майстер манікюру', place: 'Салон "Краса" — Київ' },
    { year: '2019–2021', title: 'Старший майстер', place: 'Beauty Studio — Київ' },
    { year: '2021–тепер', title: 'Провідний майстер', place: 'LumiBeauty — Київ' },
  ],
  'master-2': [
    { year: '2019–2020', title: 'Майстер брів та вій', place: 'Brow & Lash Bar — Київ' },
    { year: '2020–2022', title: 'Фахівець PMU', place: 'Studio Visage — Київ' },
    { year: '2022–тепер', title: 'Майстер брів/вій', place: 'LumiBeauty — Київ' },
  ],
  'master-3': [
    { year: '2015–2017', title: 'Стиліст-перукар', place: 'Hair Salon Milano — Мілан, Італія' },
    { year: '2017–2019', title: 'Senior Stylist', place: 'Style House — Париж, Франція' },
    { year: '2019–2021', title: 'Провідний стиліст', place: 'Top Hair Salon — Київ' },
    { year: '2021–тепер', title: 'Топ-стиліст', place: 'LumiBeauty — Київ' },
  ],
  'master-4': [
    { year: '2021–2022', title: 'Майстер-стажер', place: 'Beauty Nails Studio — Київ' },
    { year: '2022–2023', title: 'Майстер манікюру та брів', place: 'Nail Bar — Київ' },
    { year: '2023–тепер', title: 'Майстер', place: 'LumiBeauty — Київ' },
  ],
};

function MasterModal({ master, onClose }: { master: Master; onClose: () => void }) {
  const certs = CERTIFICATES[master.id] || [];
  const experience = WORK_EXPERIENCE[master.id] || [];
  const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const workDaysLabel = days.filter((_, i) => master.workingDays.includes(i)).join(', ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-white rounded-3xl shadow-hover w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-lumi-cream hover:bg-lumi-beige transition-colors">
          <X className="w-4 h-4 text-lumi-muted" />
        </button>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-56 lg:w-64 flex-shrink-0">
            <div className="relative h-56 md:h-full md:min-h-[420px] overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
              <img src={master.avatar} alt={master.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-lumi-text/60 to-transparent" />
              <div className="md:hidden absolute bottom-4 left-4 right-12 text-white">
                <h2 className="font-serif font-semibold text-xl leading-tight">{master.name}</h2>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="hidden md:block px-6 pt-6 pb-4 border-b border-lumi-border">
              <h2 className="font-serif font-semibold text-2xl text-lumi-text leading-tight">{master.name}</h2>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {master.specializations.map(s => (
                  <span key={s} className="text-xs bg-lumi-blush/20 text-lumi-rose rounded-full px-2.5 py-0.5">{s}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-lumi-border bg-lumi-milk/50">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-lumi-text">{master.rating}</span>
                </div>
                <p className="text-xs text-lumi-muted">{master.reviewsCount} відгуків</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Award className="w-4 h-4 text-lumi-rose" />
                  <span className="font-bold text-lumi-text">{master.experience} р.</span>
                </div>
                <p className="text-xs text-lumi-muted">досвіду</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Clock className="w-4 h-4 text-lumi-rose" />
                  <span className="font-bold text-lumi-text text-xs">{master.workingHours.start}–{master.workingHours.end}</span>
                </div>
                <p className="text-xs text-lumi-muted">{workDaysLabel}</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-serif font-medium text-lumi-text text-lg mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-lumi-rose" /> Про майстра
                </h3>
                <p className="text-lumi-muted leading-relaxed">{master.bio}</p>
              </div>
              <div>
                <h3 className="font-serif font-medium text-lumi-text text-lg mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-lumi-rose" /> Спеціалізація
                </h3>
                <div className="flex flex-wrap gap-2">
                  {master.specializations.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-lumi-blush/20 text-lumi-rose rounded-full text-sm font-medium">{s}</span>
                  ))}
                </div>
              </div>
              {experience.length > 0 && (
                <div>
                  <h3 className="font-serif font-medium text-lumi-text text-lg mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-lumi-rose" /> Досвід роботи
                  </h3>
                  <div className="space-y-3">
                    {experience.map((exp, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-lumi-rose mt-1.5 flex-shrink-0" />
                          {i < experience.length - 1 && <div className="w-px flex-1 bg-lumi-border mt-1" />}
                        </div>
                        <div className="pb-3">
                          <p className="text-xs text-lumi-muted">{exp.year}</p>
                          <p className="font-medium text-lumi-text text-sm">{exp.title}</p>
                          <p className="text-xs text-lumi-muted">{exp.place}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {certs.length > 0 && (
                <div>
                  <h3 className="font-serif font-medium text-lumi-text text-lg mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-lumi-rose" /> Сертифікати та навчання
                  </h3>
                  <ul className="space-y-2">
                    {certs.map((cert, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-lumi-blush/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-lumi-rose" />
                        </div>
                        <span className="text-sm text-lumi-muted leading-relaxed">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link
                href={`/booking?master=${master.id}`}
                className="btn-primary w-full justify-center py-3 text-sm"
                onClick={onClose}
              >
                Записатись до {master.name.split(' ')[0]}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MasterCard({ master, onClick }: { master: Master; onClick: () => void }) {
  return (
    <div className="card-hover overflow-hidden group cursor-pointer" onClick={onClick}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-3xl">
        <img src={master.avatar} alt={master.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
        <div className="flex gap-2">
          <button
            onClick={e => { e.stopPropagation(); onClick(); }}
            className="btn-outline flex-1 justify-center text-xs py-1.5 px-2 min-w-0"
          >
            Детальніше
          </button>
          <Link
            href={`/booking?master=${master.id}`}
            className="btn-primary flex-1 justify-center text-xs py-1.5 px-2 min-w-0"
            onClick={e => e.stopPropagation()}
          >
            Записатись
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MastersPage() {
  const allMasters = useDataStore(s => s.masters);
  const categories = useDataStore(s => s.serviceCategories);
  const activeMasters = allMasters.filter(m => m.isActive);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);

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
              <MasterCard key={master.id} master={master} onClick={() => setSelectedMaster(master)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-lumi-muted">
            <p className="text-xl mb-2">😔</p>
            <p>Майстрів за цією категорією не знайдено</p>
          </div>
        )}
      </div>

      {selectedMaster && (
        <MasterModal master={selectedMaster} onClose={() => setSelectedMaster(null)} />
      )}
    </div>
  );
}
