import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { satoshi, seasons } from './fonts';
import './globals.css';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#050505' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Naman Singh Panwar - Portfolio',
  description: 'AI/ML Engineer & Full Stack Developer crafting intelligent digital experiences',
  keywords: ['AI', 'ML', 'Full Stack', 'React', 'Next.js', 'TypeScript', 'Portfolio'],
  authors: [{ name: 'Naman Singh Panwar' }],
  icons: {
    icon: '/assets/Name-logo-without-bg.png',
    apple: '/assets/Name-logo-without-bg.png',
  },
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${satoshi.variable} ${seasons.variable}`}
      suppressHydrationWarning
    >
      <body className="gsap-loaded">
        <ErrorBoundary>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
