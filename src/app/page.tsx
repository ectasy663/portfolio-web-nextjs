'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useCallback } from 'react';

// Import IntroLoader directly (not dynamically) so it renders immediately
import IntroLoader from '@/components/IntroLoader';

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
  ssr: false,
});

export default function HomePage() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <>
      {/* Intro animation - renders immediately, removed from DOM after completion */}
      {!introComplete && <IntroLoader onComplete={handleIntroComplete} />}

      {/* Main content - hidden during intro, revealed after */}
      <div className={`App ${introComplete ? 'app-content--ready' : 'app-content--loading'}`}>
        <Navigation />
        <main className="relative z-0">
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
    </>
  );
}
