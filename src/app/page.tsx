'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Critical above-the-fold components - load immediately
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';

// Minimal loading placeholder
const LoadingPlaceholder = () => <div className="min-h-[50vh]" />;

// Lazy load below-the-fold components with SSR disabled for faster initial load
const About = dynamic(() => import('@/components/About'), {
  loading: LoadingPlaceholder,
  ssr: false,
});
const Skills = dynamic(() => import('@/components/Skills'), {
  loading: LoadingPlaceholder,
  ssr: false,
});
const Experience = dynamic(() => import('@/components/Experience'), {
  loading: LoadingPlaceholder,
  ssr: false,
});
const Projects = dynamic(() => import('@/components/Projects'), {
  loading: LoadingPlaceholder,
  ssr: false,
});
const Achievements = dynamic(() => import('@/components/Achievements'), {
  loading: LoadingPlaceholder,
  ssr: false,
});
const Contact = dynamic(() => import('@/components/Contact'), {
  loading: LoadingPlaceholder,
  ssr: false,
});
const PageEffects = dynamic(() => import('@/components/PageEffects'), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div className="App">
      <Navigation />
      <main className="pt-20 relative z-0">
        <Hero />
        <Suspense fallback={<LoadingPlaceholder />}>
          <About />
        </Suspense>
        <Suspense fallback={<LoadingPlaceholder />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<LoadingPlaceholder />}>
          <Experience />
        </Suspense>
        <Suspense fallback={<LoadingPlaceholder />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<LoadingPlaceholder />}>
          <Achievements />
        </Suspense>
        <Suspense fallback={<LoadingPlaceholder />}>
          <Contact />
        </Suspense>
      </main>
      <PageEffects />
    </div>
  );
}
