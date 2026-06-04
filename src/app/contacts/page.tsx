import Link from 'next/link';
import { ChevronRight, Phone, Mail, MapPin, Clock, Instagram, Send, ArrowRight } from 'lucide-react';
import { contactInfo } from '@/data/mock';

export default function ContactsPage() {
  return (
    <div className="bg-lumi-milk min-h-screen">
      <div className="bg-white border-b border-lumi-border">
        <div className="page-container py-10">
          <nav className="flex items-center gap-2 text-sm text-lumi-muted mb-4">
            <Link href="/" className="hover:text-lumi-text">Головна</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-lumi-text">Контакти</span>
          </nav>
          <h1 className="section-title">Контакти</h1>
          <p className="text-lumi-muted mt-2">Ми знаходимось у центрі Києва та завжди раді вас бачити.</p>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Cards */}
          <div className="lg:col-span-2 space-y-4">
            {/* Address */}
            <div className="bg-white rounded-3xl shadow-soft p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lumi-blush/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-lumi-rose" />
                </div>
                <div>
                  <h3 className="font-semibold text-lumi-text mb-1">Адреса</h3>
                  <p className="text-lumi-muted text-sm">{contactInfo.address}</p>
                  <a
                    href={`https://maps.google.com/?q=${contactInfo.coordinates.lat},${contactInfo.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-lumi-rose text-sm mt-2 hover:text-lumi-deeprose"
                  >
                    Відкрити в картах <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-3xl shadow-soft p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lumi-blush/30 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-lumi-rose" />
                </div>
                <div>
                  <h3 className="font-semibold text-lumi-text mb-1">Телефон</h3>
                  <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="text-lumi-muted text-sm hover:text-lumi-rose transition-colors">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-3xl shadow-soft p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lumi-blush/30 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-lumi-rose" />
                </div>
                <div>
                  <h3 className="font-semibold text-lumi-text mb-1">Email</h3>
                  <a href={`mailto:${contactInfo.email}`} className="text-lumi-muted text-sm hover:text-lumi-rose transition-colors">
                    {contactInfo.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-3xl shadow-soft p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lumi-blush/30 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-lumi-rose" />
                </div>
                <div>
                  <h3 className="font-semibold text-lumi-text mb-3">Години роботи</h3>
                  <div className="space-y-1.5">
                    <p className="text-sm text-lumi-muted">{contactInfo.workingHours.weekdays}</p>
                    <p className="text-sm text-lumi-muted">{contactInfo.workingHours.saturday}</p>
                    <p className="text-sm text-lumi-muted">{contactInfo.workingHours.sunday}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="bg-white rounded-3xl shadow-soft p-6">
              <h3 className="font-semibold text-lumi-text mb-4">Ми в соцмережах</h3>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 flex-1 px-4 py-3 bg-lumi-cream rounded-2xl hover:bg-lumi-blush/30 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-lumi-rose" />
                  <div>
                    <p className="text-xs text-lumi-muted">Instagram</p>
                    <p className="text-sm font-medium text-lumi-text">{contactInfo.instagram}</p>
                  </div>
                </a>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 flex-1 px-4 py-3 bg-lumi-cream rounded-2xl hover:bg-lumi-blush/30 transition-colors"
                >
                  <Send className="w-5 h-5 text-lumi-rose" />
                  <div>
                    <p className="text-xs text-lumi-muted">Telegram</p>
                    <p className="text-sm font-medium text-lumi-text">{contactInfo.telegram}</p>
                  </div>
                </a>
              </div>
            </div>

            <Link href="/booking" className="btn-primary w-full justify-center">
              Записатись онлайн <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-soft overflow-hidden h-full min-h-[500px]">
              {/* Simple map embed using iframe (no API key needed) */}
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=30.5134%2C50.4401%2C30.5334%2C50.4601&layer=mapnik&marker=${contactInfo.coordinates.lat}%2C${contactInfo.coordinates.lng}`}
                className="w-full h-full min-h-[500px] border-0"
                title="LumiBeauty на карті"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
