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
  metadataBase: new URL('https://namansinghpanwar.vercel.app'),
  title: {
    default: 'Naman Singh Panwar | Web Developer & AI-Augmented Engineer',
    template: '%s | Naman Singh Panwar',
  },
  description: 'Naman Singh Panwar is a Full Stack Web Developer and App Developer who leverages AI as a powerful tool for enhanced development. Specializing in React, Next.js, TypeScript, and AI-assisted engineering. Building production-grade web and mobile applications with cutting-edge technologies.',
  keywords: [
    'Naman Singh Panwar',
    'Web Developer',
    'Full Stack Developer',
    'App Developer',
    'AI-Augmented Engineer',
    'React Developer',
    'Next.js Developer',
    'TypeScript',
    'Frontend Developer',
    'React Native',
    'Mobile App Development',
    'AI-Assisted Development',
    'Web Development',
    'JavaScript Developer',
    'Portfolio',
    'Software Engineer'
  ],
  authors: [{ name: 'Naman Singh Panwar', url: 'https://namansinghpanwar.vercel.app' }],
  creator: 'Naman Singh Panwar',
  publisher: 'Naman Singh Panwar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/assets/Name-logo-without-bg.png',
    apple: '/assets/Name-logo-without-bg.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://namansinghpanwar.vercel.app',
    siteName: 'Naman Singh Panwar Portfolio',
    title: 'Naman Singh Panwar | Web Developer & AI-Augmented Engineer',
    description: 'Full Stack Web & App Developer leveraging AI for enhanced development workflows. Expert in React, Next.js, TypeScript, and modern web technologies. Building production-grade applications with AI-assisted precision.',
    images: [
      {
        url: '/assets/Name-logo-without-bg.png',
        width: 1200,
        height: 630,
        alt: 'Naman Singh Panwar - AI Engineer & Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naman Singh Panwar | Web Developer & AI-Augmented Engineer',
    description: 'Full Stack Web & App Developer using AI as a powerful tool for development. Specializing in React, Next.js, TypeScript, and modern web technologies.',
    images: ['/assets/Name-logo-without-bg.png'],
    creator: '@namansinghpanwar',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://namansinghpanwar.vercel.app',
  },
  category: 'technology',
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
