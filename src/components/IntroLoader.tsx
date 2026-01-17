'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface IntroLoaderProps {
  onComplete?: () => void;
}

const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'hold' | 'exit'>('enter');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAnimationComplete = useCallback(() => {
    setIsVisible(false);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    // Immediately hide the instant-loader from layout.tsx
    const instantLoader = document.getElementById('instant-loader');
    if (instantLoader) {
      instantLoader.style.display = 'none';
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      handleAnimationComplete();
      return;
    }

    // Simple CSS-based animation timing (no GSAP dependency for intro)
    // Enter phase: 0.4s
    const enterTimer = setTimeout(() => {
      setAnimationPhase('hold');
    }, 400);

    // Hold phase: 0.2s
    const holdTimer = setTimeout(() => {
      setAnimationPhase('exit');
    }, 600);

    // Exit phase: 0.3s
    const exitTimer = setTimeout(() => {
      handleAnimationComplete();
    }, 900);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
    };
  }, [handleAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className={`intro-loader intro-loader--${animationPhase}`}
      role="presentation"
      aria-hidden="true"
    >
      <div className="intro-loader__overlay" />

      <div className="intro-loader__content flex gap-3 sm:gap-6 items-center justify-center overflow-hidden px-4">
        {['Naman', 'Singh', 'Panwar'].map((word, i) => (
          <div key={word} className="overflow-hidden py-4">
            <span
              className={`intro-loader__text intro-loader__word intro-loader__word--${i} inline-block origin-center`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {word}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(IntroLoader);
