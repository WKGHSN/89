'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen bg-lumi-milk flex items-center justify-center p-8">
      <div className="text-center max-w-md bg-white rounded-3xl shadow-soft p-10">
        <p className="text-5xl mb-6">😔</p>
        <h2 className="font-serif text-2xl font-medium text-lumi-text mb-3">
          Щось пішло не так
        </h2>
        <p className="text-lumi-muted mb-6">
          Сталась помилка. Спробуйте ще раз або поверніться на головну.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={reset} className="btn-primary justify-center">
            Спробувати ще раз
          </button>
          <Link href="/" className="btn-outline justify-center">
            На головну
          </Link>
        </div>
      </div>
    </div>
  );
}