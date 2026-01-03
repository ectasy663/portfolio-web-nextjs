'use client';

import { useEffect } from 'react';

export default function PageEffects() {
  useEffect(() => {
    // Defer GSAP initialization to after first paint
    const initGSAP = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      gsap.registerPlugin(ScrollTrigger);

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
    };

    // Initialize after DOM is painted - use typeof check for browser compatibility
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback?.(initGSAP);
    } else {
      setTimeout(initGSAP, 1);
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[1100] bg-gray-200 dark:bg-dark-800">
      <div className="scroll-progress h-full bg-gradient-to-r from-primary-400 to-primary-600 w-0"></div>
    </div>
  );
}
