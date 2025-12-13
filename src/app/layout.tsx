import type { Metadata, Viewport } from 'next';
import { Outfit, Poppins, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import './globals.css';

const outfit = Outfit({ 
  subsets: ['latin'], 
  variable: '--font-outfit',
  display: 'swap',
});

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700', '800', '900'], 
  subsets: ['latin'], 
  variable: '--font-poppins',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#050505' },
  ],
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
    <html lang="en" className={`dark ${outfit.variable} ${poppins.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="gsap-loaded">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
