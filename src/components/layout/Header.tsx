'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, ChevronDown, Sun, Moon, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useNotificationsStore, selectUnreadCount } from '@/store/notificationsStore';
import { cn, getInitials } from '@/lib/utils';
import type { AuthUser } from '@/types';

const NAV_LINKS = [
  { href: '/', label: 'Головна' },
  { href: '/services', label: 'Послуги' },
  { href: '/masters', label: 'Майстри' },
  { href: '/gallery', label: 'Галерея' },
  { href: '/reviews', label: 'Відгуки' },
  { href: '/contacts', label: 'Контакти' },
];


const getDashboardLink = (user: AuthUser | null): string => {
  if (!user) return '/auth/login';
  const routes: Record<string, string> = {
    admin: '/dashboard/admin',
    master: '/dashboard/master',
    client: '/dashboard/client',
  };
  return routes[user.role] ?? '/dashboard/client';
};

const FlowerLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="2" ry="3.5" />
    <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(120 12 12)" />
    <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(180 12 12)" />
    <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(240 12 12)" />
    <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(300 12 12)" />
    <circle cx="12" cy="12" r="2.5" fill="white" />
    <circle cx="12" cy="12" r="1.2" fill="rgba(232,165,165,0.6)" />
  </svg>
);

interface UserMenuProps {
  user: AuthUser;
  onClose: () => void;
  onLogout: () => void;
}

const UserMenu = ({ user, onClose, onLogout }: UserMenuProps) => (
  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-hover border border-lumi-border/50 overflow-hidden z-50">
    <div className="px-4 py-3 border-b border-lumi-border">
      <p className="text-sm font-semibold text-lumi-text truncate">{user.name}</p>
      <p className="text-xs text-lumi-muted truncate">{user.email}</p>
    </div>
    <Link
      href={getDashboardLink(user)}
      className="flex items-center gap-3 px-4 py-3 text-sm text-lumi-muted hover:bg-lumi-cream hover:text-lumi-text transition-colors"
      onClick={onClose}
    >
      <User className="w-4 h-4" />
      Мій кабінет
    </Link>
    <button
      onClick={onLogout}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Вийти
    </button>
  </div>
);

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { isDark, toggleTheme } = useThemeStore();

  
  const unreadCount = useNotificationsStore(selectUnreadCount);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  
  const currentUser = mounted ? user : null;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  const bookingHref = currentUser ? '/booking' : '/auth/login?redirect=/booking';

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-lumi-border/50'
          : 'bg-white/90 backdrop-blur-sm'
      )}>
        <div className="page-container">
          <div className="flex items-center justify-between h-16 md:h-18">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lumi-blush to-lumi-rose flex items-center justify-center shadow-pink group-hover:shadow-hover transition-all duration-300">
                <FlowerLogo />
              </div>
              <span className="font-serif text-xl font-semibold text-lumi-text group-hover:text-lumi-rose transition-colors duration-200">
                LumiBeauty
              </span>
            </Link>

            {}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    pathname === link.href
                      ? 'text-lumi-rose bg-lumi-blush/30'
                      : 'text-lumi-muted hover:text-lumi-text hover:bg-lumi-cream'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {}
            <div className="hidden lg:flex items-center gap-3">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-lumi-cream transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lumi-blush to-lumi-rose flex items-center justify-center text-white text-xs font-semibold">
                      {getInitials(currentUser.name)}
                    </div>
                    <span className="text-sm font-medium text-lumi-text max-w-24 truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <ChevronDown className={cn('w-4 h-4 text-lumi-muted transition-transform', isUserMenuOpen && 'rotate-180')} />
                  </button>

                  {isUserMenuOpen && (
                    <UserMenu
                      user={currentUser}
                      onClose={() => setIsUserMenuOpen(false)}
                      onLogout={handleLogout}
                    />
                  )}
                </div>
              ) : (
                <Link href="/auth/login" className="btn-ghost text-sm">Увійти</Link>
              )}

              {}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-lumi-cream transition-colors"
                aria-label={isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
              >
                {isDark
                  ? <Sun className="w-4 h-4 text-amber-400" />
                  : <Moon className="w-4 h-4 text-lumi-muted" />}
              </button>

              {}
              {currentUser?.role === 'client' && (
                <Link
                  href="/dashboard/client"
                  className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-lumi-cream transition-colors"
                  aria-label={`Нотифікації${unreadCount > 0 ? `, ${unreadCount} непрочитаних` : ''}`}
                >
                  <Bell className="w-4 h-4 text-lumi-muted" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-lumi-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}

              <Link href={bookingHref} className="btn-primary">Записатись</Link>
            </div>

            {}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-lumi-cream transition-colors"
              aria-label={isMobileMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
            >
              {isMobileMenuOpen
                ? <X className="w-5 h-5 text-lumi-text" />
                : <Menu className="w-5 h-5 text-lumi-text" />}
            </button>
          </div>
        </div>

        {}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-lumi-border animate-fade-in">
            <div className="page-container py-4">
              <nav className="flex flex-col gap-1 mb-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-4 py-3 rounded-2xl text-sm font-medium transition-all',
                      pathname === link.href
                        ? 'text-lumi-rose bg-lumi-blush/30'
                        : 'text-lumi-muted hover:text-lumi-text hover:bg-lumi-cream'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-2 pt-3 border-t border-lumi-border">
                {currentUser ? (
                  <>
                    <Link href={getDashboardLink(currentUser)} className="btn-outline w-full justify-center">
                      Мій кабінет
                    </Link>
                    <button onClick={handleLogout} className="btn-ghost w-full justify-center text-red-500">
                      Вийти
                    </button>
                  </>
                ) : (
                  <Link href="/auth/login" className="btn-outline w-full justify-center">Увійти</Link>
                )}
                <Link href={bookingHref} className="btn-primary w-full justify-center">
                  Записатись
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {}
      <div className="h-16 md:h-18" />

      {}
      {isUserMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
      )}
    </>
  );
}