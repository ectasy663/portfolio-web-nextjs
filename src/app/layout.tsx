import type { Metadata } from 'next';
import { ThemeProvider } from '@/contexts/ThemeContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Naman Singh Panwar - Portfolio',
  description: 'AI/ML Engineer & Full Stack Developer crafting intelligent digital experiences',
  keywords: ['AI', 'ML', 'Full Stack', 'React', 'Next.js', 'TypeScript', 'Portfolio'],
  authors: [{ name: 'Naman Singh Panwar' }],
  openGraph: {
    title: 'Naman Singh Panwar - Portfolio',
    description: 'AI/ML Engineer & Full Stack Developer crafting intelligent digital experiences',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naman Singh Panwar - Portfolio',
    description: 'AI/ML Engineer & Full Stack Developer crafting intelligent digital experiences',
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* NAVBAR POSITION FIX - Cannot be overridden */}
        <style>{`
          nav, .simple-navbar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            z-index: 999999 !important;
          }
        `}</style>
      </head>
      <body className="gsap-loaded">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
