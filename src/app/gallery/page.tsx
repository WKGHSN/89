'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, X, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useDataStore } from '@/store/dataStore';
import { cn } from '@/lib/utils';
import type { GalleryItem } from '@/types';

function Lightbox({ items, index, onClose, onPrev, onNext }: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative rounded-2xl overflow-hidden bg-black">
          <img
            src={item.imageUrl}
            alt={item.description}
            className="w-full max-h-[70vh] object-contain"
          />
        </div>

        <div className="mt-4 px-2 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block bg-lumi-rose/80 text-white text-xs px-3 py-1 rounded-full">
              {item.categoryName}
            </span>
            {item.masterName && (
              <span className="text-white/60 text-sm">👩‍🎨 {item.masterName}</span>
            )}
          </div>
          {item.description && (
            <p className="text-white text-base font-medium">{item.description}</p>
          )}
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2">
          <button
            onClick={onPrev}
            className="pointer-events-auto w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            className="pointer-events-auto w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mt-3 text-white/50 text-sm">
          {index + 1} / {items.length}
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const galleryItems = useDataStore(s => s.gallery);
  const categories = useDataStore(s => s.serviceCategories);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filters = [
    { id: 'all', label: 'Всі роботи' },
    ...categories.map(c => ({ id: c.id, label: c.name })),
  ];

  const filtered = galleryItems
    .filter(g => activeFilter === 'all' || g.categoryId === activeFilter);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null);
  const nextImage = () => setLightboxIndex(i => i !== null ? (i + 1) % filtered.length : null);

  return (
    <div className="bg-lumi-milk min-h-screen">
      <div className="bg-white border-b border-lumi-border">
        <div className="page-container py-10">
          <nav className="flex items-center gap-2 text-sm text-lumi-muted mb-4">
            <Link href="/" className="hover:text-lumi-text">Головна</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-lumi-text">Галерея</span>
          </nav>
          <h1 className="section-title">Галерея робіт</h1>
          <p className="text-lumi-muted mt-2">Результати наших майстрів — якість, яка говорить сама за себе.</p>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                activeFilter === f.id
                  ? 'bg-lumi-rose text-white shadow-pink'
                  : 'bg-white text-lumi-muted hover:bg-lumi-cream hover:text-lumi-text shadow-soft'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="break-inside-avoid cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              <div className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300">
                <img
                  src={item.imageUrl}
                  alt={item.description}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block bg-lumi-rose/90 text-white text-xs px-2.5 py-1 rounded-full mb-1">
                    {item.categoryName}
                  </span>
                  {item.masterName && (
                    <p className="text-white/80 text-xs">👩‍🎨 {item.masterName}</p>
                  )}
                </div>
              </div>
              {item.description && (
                <div className="px-1 pt-2 pb-3">
                  <p className="text-lumi-text text-sm font-medium leading-snug">{item.description}</p>
                  {item.masterName && (
                    <p className="text-lumi-muted text-xs mt-0.5">{item.masterName}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-lumi-muted">
            <p className="text-xl mb-2">🖼️</p>
            <p>Фото за цією категорією ще немає</p>
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
}