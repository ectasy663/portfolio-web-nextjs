'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useCallback, useEffect } from 'react';
import { loadGSAP } from '@/utils/gsapLoader';

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

  // Warm GSAP in the background so animations don't feel "late"
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let cancelled = false;

    const run = () => {
      loadGSAP().catch(() => {
        // Ignore preload failures (user may be offline)
      });
    };

    const anyWindow = window as any;
    const id = typeof anyWindow.requestIdleCallback === 'function'
      ? anyWindow.requestIdleCallback(() => {
          if (!cancelled) run();
        }, { timeout: 1500 })
      : window.setTimeout(() => {
          if (!cancelled) run();
        }, 300);

    return () => {
      cancelled = true;
      if (typeof anyWindow.cancelIdleCallback === 'function' && typeof id === 'number') {
        anyWindow.cancelIdleCallback(id);
      } else {
        window.clearTimeout(id as any);
      }
    };
  }, []);

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
