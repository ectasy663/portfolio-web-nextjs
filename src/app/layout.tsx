import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import './globals.css';

// Single optimized font - reduce font loading overhead
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

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
    <html lang="en" className={`dark ${outfit.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        {/* Preload critical assets */}
        <link rel="preload" href="/fonts/the-seasons.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="gsap-loaded">
        {/* Instant CSS-only splash screen - shows before React hydrates */}
        <div id="instant-loader" style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
        }}>
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            fontFamily: "'The Seasons', Georgia, serif",
            fontSize: 'clamp(1.5rem, 5vw, 3.5rem)',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #8A7324 0%, #C5A02F 20%, #E6CD68 40%, #F0D475 50%, #E6CD68 60%, #C5A02F 80%, #8A7324 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            opacity: 0.9,
          }}>
            <span>Naman</span>
            <span>Singh</span>
            <span>Panwar</span>
          </div>
        </div>
        <ErrorBoundary>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
