import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AuthHydration from '@/components/layout/AuthHydration';
import ThemeInit from '@/components/layout/ThemeInit';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'LumiBeauty — Салон краси в Києві',
  description: 'Онлайн-запис до салону краси LumiBeauty. Манікюр, педикюр, брови, вії, стрижки та укладки. Записатись просто та зручно.',
  keywords: 'салон краси, манікюр, педикюр, брови, вії, стрижки, Київ, LumiBeauty',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans bg-lumi-milk`} suppressHydrationWarning>
        <ThemeInit />
        <AuthHydration />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FAFAF8',
              border: '1px solid #E8E0D8',
              color: '#3D2B2B',
              borderRadius: '16px',
              padding: '12px 16px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#D4848A', secondary: '#FAFAF8' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#FAFAF8' },
            },
          }}
        />
      </body>
    </html>
  );
}
