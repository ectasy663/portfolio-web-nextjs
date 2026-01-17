'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface IntroLoaderProps {
  onComplete?: () => void;
}

const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleAnimationComplete = useCallback(() => {
    setIsVisible(false);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setTimeout(() => {
        handleAnimationComplete();
      }, 100);
      return;
    }

    const initAnimation = async () => {
      const words = wordsRef.current.filter((el): el is HTMLSpanElement => el !== null);

      if (words.length === 0) {
        handleAnimationComplete();
        return;
      }

      const gsap = (await import('gsap')).default;
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(handleAnimationComplete, 20);
        }
      });

      // Initial state
      gsap.set(words, {
        yPercent: 120,
        rotationX: -45,
        opacity: 0,
        filter: 'blur(12px)',
        transformPerspective: 500
      });

      // Animation sequence - 60% FASTER (40% of original duration)
      tl
        // 1. Staggered Entrance - was 1.2s, now 0.5s
        .to(words, {
          yPercent: 0,
          rotationX: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.5,
          stagger: 0.06, // was 0.15
          ease: 'power4.out',
        })

        // 2. Brief Hold with scale - was 0.8s, now 0.3s
        .to(words, {
          scale: 1.03,
          duration: 0.3,
          ease: 'sine.inOut',
          stagger: {
            amount: 0.08,
            from: "center"
          }
        }, "-=0.2")

        // 3. Cinematic Exit - outer words fly out (was 0.6s, now 0.25s)
        .to([words[0], words[2]], {
          xPercent: (i) => i === 0 ? -100 : 100,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 0.25,
          ease: 'power3.in'
        })
        // Middle word zooms (was 0.5s, now 0.2s)
        .to(words[1], {
          scale: 1.4,
          opacity: 0,
          filter: 'blur(15px)',
          duration: 0.2,
          ease: 'expo.in'
        }, "<")

        // 4. Background Curtain Lift (was 0.8s, now 0.3s)
        .to(overlayRef.current, {
          height: 0,
          transformOrigin: "top",
          duration: 0.3,
          ease: 'expo.inOut',
        }, "-=0.1");
    };

    const timer = requestAnimationFrame(() => {
      initAnimation();
    });

    return () => {
      cancelAnimationFrame(timer);
    };
  }, [handleAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="intro-loader"
      role="presentation"
      aria-hidden="true"
    >
      <div ref={overlayRef} className="intro-loader__overlay" />

      <div className="intro-loader__content flex gap-3 sm:gap-6 items-center justify-center overflow-hidden px-4">
        {['Naman', 'Singh', 'Panwar'].map((word, i) => (
          <div key={word} className="overflow-hidden py-4">
            <span
              ref={(el) => { if (el) wordsRef.current[i] = el; }}
              className="intro-loader__text inline-block origin-center will-change-transform"
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
