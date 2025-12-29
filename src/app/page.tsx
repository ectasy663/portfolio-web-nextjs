'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Critical above-the-fold components - load immediately
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';

// Minimal loading placeholder
const LoadingPlaceholder = () => <div className="min-h-[50vh]" />;

// Lazy load below-the-fold components
const About = dynamic(() => import('@/components/About'), {
  loading: LoadingPlaceholder,
});
const Skills = dynamic(() => import('@/components/Skills'), {
  loading: LoadingPlaceholder,
});
const Experience = dynamic(() => import('@/components/Experience'), {
  loading: LoadingPlaceholder,
});
const Projects = dynamic(() => import('@/components/Projects'), {
  loading: LoadingPlaceholder,
});
const Achievements = dynamic(() => import('@/components/Achievements'), {
  loading: LoadingPlaceholder,
});
const Contact = dynamic(() => import('@/components/Contact'), {
  loading: LoadingPlaceholder,
});
const PageEffects = dynamic(() => import('@/components/PageEffects'), {
  ssr: false, // Keep PageEffects client-side only as it likely deals with window/scroll exclusively
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
