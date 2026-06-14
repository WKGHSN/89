'use client';
import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Clock } from 'lucide-react';
import { useDataStore } from '@/store/dataStore';

const NAV_LINKS = [
  { href: '/', label: 'Головна' },
  { href: '/services', label: 'Послуги' },
  { href: '/masters', label: 'Майстри' },
  { href: '/gallery', label: 'Галерея' },
  { href: '/reviews', label: 'Відгуки' },
  { href: '/contacts', label: 'Контакти' },
  { href: '/booking', label: 'Записатись' },
];

const SERVICE_LINKS = [
  { href: '/services?category=manicure', label: 'Манікюр' },
  { href: '/services?category=pedicure', label: 'Педикюр' },
  { href: '/services?category=eyebrows', label: 'Брови' },
  { href: '/services?category=lashes', label: 'Вії' },
  { href: '/services?category=haircare', label: 'Стрижки та укладки' },
];

const FlowerLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="2" ry="3.5" />
    <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(120 12 12)" />
    <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(180 12 12)" />
    <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(240 12 12)" />
    <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(300 12 12)" />
    <circle cx="12" cy="12" r="2.5" fill="white" />
  </svg>
);

export default function Footer() {
  const contactInfo = useDataStore(s => s.contactInfo);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-lumi-text text-white">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lumi-blush to-lumi-rose flex items-center justify-center">
                <FlowerLogo />
              </div>
              <span className="font-serif text-xl font-semibold text-white">LumiBeauty</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Місце, де краса зустрічається з турботою. Ми підкреслюємо вашу природну красу з любов&apos;ю до деталей.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-lumi-rose transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-lumi-rose transition-colors duration-200"
                aria-label="Telegram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>
          </div>

          {}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Навігація</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-white text-sm transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Послуги</h4>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/60 hover:text-white text-sm transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Контакти</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-lumi-rose mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">{contactInfo.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors"
                >
                  <Phone className="w-4 h-4 text-lumi-rose flex-shrink-0" />
                  {contactInfo.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors"
                >
                  <Mail className="w-4 h-4 text-lumi-rose flex-shrink-0" />
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-lumi-rose mt-0.5 flex-shrink-0" />
                <div className="text-white/60 text-sm">
                  <p>{contactInfo.workingHours.weekdays}</p>
                  <p>{contactInfo.workingHours.saturday}</p>
                  <p>{contactInfo.workingHours.sunday}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {currentYear} LumiBeauty. Усі права захищені.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-white/40 hover:text-white/70 text-xs transition-colors">
              Політика конфіденційності
            </Link>
            <Link href="/terms" className="text-white/40 hover:text-white/70 text-xs transition-colors">
              Умови використання
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
