'use client';

import { useLayoutEffect } from 'react';
import { loadGSAP } from '@/utils/gsapLoader';

export default function PageEffects() {
  useLayoutEffect(() => {
    // Initialize GSAP with dynamic loading
    const initGSAP = async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGSAP();

        // Create scroll progress indicator
        gsap.to(".scroll-progress", {
          width: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          }
        });
      } catch (error) {
        console.error('Failed to initialize PageEffects:', error);
      }
    };

    // Initialize GSAP immediately to prevent lag
    initGSAP();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[1100] bg-gray-200 dark:bg-dark-800">
      <div className="scroll-progress h-full bg-gradient-to-r from-primary-400 to-primary-600 w-0"></div>
    </div>
  );
}
