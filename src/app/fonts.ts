import localFont from 'next/font/local';

export const satoshi = localFont({
  src: [
    {
      path: '../../public/fonts/Satoshi-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Satoshi-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Satoshi-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
});

export const seasons = localFont({
  src: [
    {
      path: '../../public/fonts/the-seasons.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-seasons',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});
