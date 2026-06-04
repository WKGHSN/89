'use client';
import Link from 'next/link';
import { ChevronRight, Quote, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { masters, services } from '@/data/mock';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Review } from '@/types';

// Initial reviews from mock (kept in module-level state)
import { reviews as initialReviews } from '@/data/mock';

function StarRating({ rating, interactive = false, onRate }: {
  rating: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn('w-5 h-5 transition-transform', interactive && 'cursor-pointer hover:scale-110')}
          fill={(interactive ? (hovered || rating) : rating) >= star ? '#F59E0B' : '#E5E7EB'}
          viewBox="0 0 20 20"
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate && onRate(star)}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ============ REVIEW FORM ============
function ReviewForm({ onSubmit }: { onSubmit: (review: Review) => void }) {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [masterId, setMasterId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  if (!user || user.role !== 'client') {
    return (
      <div className="bg-white rounded-3xl shadow-soft p-6 text-center">
        <div className="text-3xl mb-3">✍️</div>
        <h3 className="font-serif font-medium text-lumi-text text-lg mb-2">Залишити відгук</h3>
        <p className="text-lumi-muted text-sm mb-4">Щоб залишити відгук, увійдіть до свого кабінету</p>
        <Link href="/auth/login" className="btn-primary justify-center">Увійти</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) { toast.error('Напишіть текст відгуку'); return; }
    if (text.trim().length < 20) { toast.error('Відгук занадто короткий (мінімум 20 символів)'); return; }
    if (rating === 0) { toast.error('Оберіть оцінку'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const selectedMaster = masters.find(m => m.id === masterId);
    const selectedService = services.find(s => s.id === serviceId);

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      clientId: user.id,
      clientName: user.name,
      masterId: masterId || undefined,
      masterName: selectedMaster?.name,
      serviceId: serviceId || undefined,
      serviceName: selectedService?.name,
      rating,
      text: text.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSubmit(newReview);
    setText('');
    setRating(5);
    setMasterId('');
    setServiceId('');
    setLoading(false);
    toast.success('Дякуємо за відгук! 🌸');
  };

  return (
    <div className="bg-white rounded-3xl shadow-soft p-6">
      <h3 className="font-serif font-medium text-lumi-text text-xl mb-5 flex items-center gap-2">
        ✍️ Залишити відгук
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="text-xs text-lumi-muted font-medium block mb-2">Ваша оцінка *</label>
          <StarRating rating={rating} interactive onRate={setRating} />
        </div>

        {/* Master select */}
        <div>
          <label className="text-xs text-lumi-muted font-medium block mb-1.5">Майстер (необов'язково)</label>
          <select
            className="input-field"
            value={masterId}
            onChange={e => setMasterId(e.target.value)}
          >
            <option value="">— Оберіть майстра —</option>
            {masters.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Service select */}
        <div>
          <label className="text-xs text-lumi-muted font-medium block mb-1.5">Послуга (необов'язково)</label>
          <select
            className="input-field"
            value={serviceId}
            onChange={e => setServiceId(e.target.value)}
          >
            <option value="">— Оберіть послугу —</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Text */}
        <div>
          <label className="text-xs text-lumi-muted font-medium block mb-1.5">Ваш відгук *</label>
          <textarea
            className="input-field resize-none"
            rows={4}
            placeholder="Розкажіть про ваш досвід відвідування салону..."
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={500}
          />
          <p className="text-xs text-lumi-muted mt-1 text-right">{text.length}/500</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3"
        >
          {loading ? 'Відправляємо...' : (
            <>
              <Send className="w-4 h-4" />
              Опублікувати відгук
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// ============ REVIEWS PAGE ============
export default function ReviewsPage() {
  const [allReviews, setAllReviews] = useState<Review[]>(initialReviews);

  const avgRating = allReviews.reduce((a, b) => a + b.rating, 0) / allReviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: allReviews.filter(rev => rev.rating === r).length,
    pct: Math.round((allReviews.filter(rev => rev.rating === r).length / allReviews.length) * 100),
  }));

  const handleNewReview = (review: Review) => {
    setAllReviews(prev => [review, ...prev]);
  };

  return (
    <div className="bg-lumi-milk min-h-screen">
      <div className="bg-white border-b border-lumi-border">
        <div className="page-container py-10">
          <nav className="flex items-center gap-2 text-sm text-lumi-muted mb-4">
            <Link href="/" className="hover:text-lumi-text">Головна</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-lumi-text">Відгуки</span>
          </nav>
          <h1 className="section-title">Відгуки клієнтів</h1>
          <p className="text-lumi-muted mt-2">Реальні відгуки від наших клієнток.</p>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: Summary + Form */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Summary */}
              <div className="bg-white rounded-3xl shadow-soft p-6">
                <h3 className="font-serif font-medium text-lumi-text text-xl mb-6">Загальна оцінка</h3>

                <div className="flex flex-col items-center gap-3 mb-6 pb-6 border-b border-lumi-border">
                  <p className="text-6xl font-serif font-bold text-lumi-text">{avgRating.toFixed(1)}</p>
                  <StarRating rating={Math.round(avgRating)} />
                  <p className="text-sm text-lumi-muted">На основі {allReviews.length} відгуків</p>
                </div>

                <div className="space-y-2.5">
                  {ratingCounts.map(({ rating, count, pct }) => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm text-lumi-muted w-4 text-right">{rating}</span>
                      <svg className="w-3.5 h-3.5 fill-amber-400 flex-shrink-0" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div className="flex-1 bg-lumi-cream rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm text-lumi-muted w-6">{count}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-lumi-border">
                  <Link href="/booking" className="btn-primary w-full justify-center">
                    Записатись
                  </Link>
                </div>
              </div>

              {/* Review Form */}
              <ReviewForm onSubmit={handleNewReview} />
            </div>
          </div>

          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-4">
            {allReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {review.clientAvatar ? (
                      <img src={review.clientAvatar} alt={review.clientName} className="w-11 h-11 rounded-full object-cover" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-lumi-cream flex items-center justify-center text-lumi-rose font-semibold">
                        {review.clientName[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-lumi-text">{review.clientName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-lumi-muted">{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <Quote className="w-5 h-5 text-lumi-blush flex-shrink-0" />
                </div>

                <p className="text-lumi-text leading-relaxed">{review.text}</p>

                {(review.serviceName || review.masterName) && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-lumi-border">
                    {review.serviceName && (
                      <span className="text-xs bg-lumi-cream text-lumi-muted rounded-full px-3 py-1">
                        💅 {review.serviceName}
                      </span>
                    )}
                    {review.masterName && (
                      <span className="text-xs bg-lumi-cream text-lumi-muted rounded-full px-3 py-1">
                        👩‍🎨 {review.masterName}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
