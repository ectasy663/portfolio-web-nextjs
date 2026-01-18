'use client';

/**
 * GSAP Lazy Loader - Loads GSAP only when needed
 * Prevents GSAP from being in the main bundle
 * Ensures single instance across all components
 */

let gsapInstance: typeof import('gsap').default | null = null;
let scrollTriggerInstance: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null;
let loadingPromise: Promise<void> | null = null;

export async function loadGSAP() {
  // Return existing instance if already loaded
  if (gsapInstance && scrollTriggerInstance) {
    return { gsap: gsapInstance, ScrollTrigger: scrollTriggerInstance };
  }

  // Return existing promise if currently loading
  if (loadingPromise) {
    await loadingPromise;
    return { gsap: gsapInstance!, ScrollTrigger: scrollTriggerInstance! };
  }

  // Start loading
  loadingPromise = (async () => {
    try {
      const [gsapModule, scrollTriggerModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger')
      ]);

      gsapInstance = gsapModule.default;
      scrollTriggerInstance = scrollTriggerModule.ScrollTrigger;

      // Register plugins once
      if (typeof window !== 'undefined') {
        gsapInstance.registerPlugin(scrollTriggerInstance);
      }
    } catch (error) {
      console.error('Failed to load GSAP:', error);
      loadingPromise = null;
      throw error;
    }
  })();

  await loadingPromise;
  return { gsap: gsapInstance!, ScrollTrigger: scrollTriggerInstance! };
}

/**
 * Hook for using GSAP in components
 */
export function useGSAP() {
  return { loadGSAP };
}

/**
 * Check if GSAP is already loaded (synchronous)
 */
export function isGSAPLoaded() {
  return gsapInstance !== null && scrollTriggerInstance !== null;
}

/**
 * Get GSAP instance (only if already loaded)
 */
export function getGSAPInstance() {
  if (!gsapInstance || !scrollTriggerInstance) {
    throw new Error('GSAP not loaded yet. Call loadGSAP() first.');
  }
  return { gsap: gsapInstance, ScrollTrigger: scrollTriggerInstance };
}
