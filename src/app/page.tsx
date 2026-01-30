'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useCallback, useEffect } from 'react';
import { loadGSAP } from '@/utils/gsapLoader';
import { 
  generatePersonSchema, 
  generateWebSiteSchema, 
  generateFAQSchema 
} from '@/utils/structuredData';

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
const FAQ = dynamic(() => import('@/components/FAQ'), {
  loading: LoadingPlaceholder,
});
const AISummary = dynamic(() => import('@/components/AISummary'), {
  loading: LoadingPlaceholder,
});
const Contact = dynamic(() => import('@/components/Contact'), {
  loading: LoadingPlaceholder,
});
const PageEffects = dynamic(() => import('@/components/PageEffects'), {
  ssr: false,
});

// FAQ data for schema
const faqData = [
  {
    question: 'What technologies does Naman specialize in?',
    answer: 'Naman specializes in modern web development technologies including React.js, Next.js, TypeScript, and Tailwind CSS for frontend development. For AI/ML work, he uses TensorFlow, PyTorch, NumPy, and Pandas. He also has experience with Node.js, Python, Docker, PostgreSQL, and Git for full-stack development.',
  },
  {
    question: 'What kind of projects has Naman built?',
    answer: 'Naman has built production-grade AI consultancy platforms (Gyannetra), high-performance portfolio websites with advanced animations, Web3 DeFi applications with blockchain integration, and immersive real estate platforms with cinema-quality animations. All projects emphasize performance optimization, scalability, and professional user experience.',
  },
  {
    question: 'Does Naman have experience with AI and machine learning?',
    answer: 'Yes, Naman has substantial AI/ML experience. He worked at DRDO improving ML model accuracy by 12%, completed a Microsoft AI internship (top 5% of 10,000+ applicants), and currently works in an AI R&D Division building AI-driven applications. He has hands-on experience with TensorFlow, PyTorch, and processing large datasets for pattern recognition.',
  },
  {
    question: 'What is Naman\'s approach to web development?',
    answer: 'Naman follows a component-driven architecture approach with emphasis on performance optimization, accessibility, and SEO. He implements dynamic code splitting, lazy loading, comprehensive testing with Jest and React Testing Library, and ensures Core Web Vitals compliance. His code is modular, type-safe with TypeScript, and production-ready.',
  },
  {
    question: 'Has Naman worked with any notable organizations?',
    answer: 'Yes, Naman has worked with several prestigious organizations including DRDO (Defence Research and Development Organisation), Microsoft through the AINSI AI program, Gyannetra Pvt Ltd, and is currently working in an AI R&D Division. He has also won awards judged by industry leaders from Google, Microsoft, Meta, and Oracle.',
  },
  {
    question: 'What makes Naman stand out as a developer?',
    answer: 'Naman combines deep technical expertise in both AI/ML and full-stack development with proven ability to deliver production-grade applications. He has achieved measurable improvements (40% faster load times, 60% fewer bugs, 12% model accuracy gains) and won national recognition in hackathons. His work demonstrates attention to performance, user experience, and code quality.',
  },
  {
    question: 'Is Naman available for freelance or collaboration?',
    answer: 'Naman is open to discussing interesting projects and collaboration opportunities. You can reach out through the contact form on this website, via email, or connect on LinkedIn and GitHub. He is particularly interested in projects involving AI/ML, advanced web applications, and innovative user experiences.',
  },
];

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
      {/* Structured Data for SEO & AI Discovery */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generatePersonSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebSiteSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqData)) }}
      />

      {/* Intro animation - renders immediately, removed from DOM after completion */}
      {!introComplete && <IntroLoader onComplete={handleIntroComplete} />}

      {/* Main content - hidden during intro, revealed after */}
      <div className={`App ${introComplete ? 'app-content--ready' : 'app-content--loading'}`}>
        <Navigation />
        <main className="relative z-0" role="main">
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
            <FAQ />
          </Suspense>
          <Suspense fallback={<LoadingPlaceholder />}>
            <AISummary />
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
