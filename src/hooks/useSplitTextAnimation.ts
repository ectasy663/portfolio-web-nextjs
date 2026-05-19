'use client';

import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { loadGSAP } from '@/utils/gsapLoader';
import { createSplitText, SplitTextInstance } from '@/utils/gsapEffects';

export type SplitTextAnimationConfig = {
  duration?: number;
  stagger?: number;
  ease?: string;
  delay?: number;
  from?: gsap.TweenVars;
  scrollTrigger?: gsap.TweenVars['scrollTrigger'];
};

export type UseSplitTextAnimationOptions = {
  scopeRef: RefObject<HTMLElement | null>;
  targetRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
  desktop: SplitTextAnimationConfig;
  mobile?: SplitTextAnimationConfig;
  breakpoints?: {
    desktop: string;
    mobile: string;
  };
};

export function useSplitTextAnimation({
  scopeRef,
  targetRef,
  enabled = true,
  desktop,
  mobile,
  breakpoints
}: UseSplitTextAnimationOptions) {
  const splitRef = useRef<SplitTextInstance | null>(null);
  const modeRef = useRef<'desktop' | 'mobile' | null>(null);
  const desktopConfigRef = useRef<SplitTextAnimationConfig>(desktop);
  const mobileConfigRef = useRef<SplitTextAnimationConfig | undefined>(mobile);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    desktopConfigRef.current = desktop;
    mobileConfigRef.current = mobile;
  }, [desktop, mobile]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!enabled) return;

    const scopeEl = scopeRef.current;
    if (!scopeEl) return;

    let gsap: any;
    let ScrollTrigger: any;
    let mm: any;
    let ctx: any;
    let cancelled = false;

    // Async initialization with dynamic GSAP loading
    const init = async () => {
      try {
        // Load GSAP dynamically
        const modules = await loadGSAP();
        if (cancelled) return;

        gsap = modules.gsap;
        ScrollTrigger = modules.ScrollTrigger;

        mm = gsap.matchMedia();
        ctx = gsap.context(() => {}, scopeRef);

        mm.add(
          {
            desktop: breakpoints?.desktop ?? '(min-width: 1024px)',
            mobile: breakpoints?.mobile ?? '(max-width: 1023px)',
            reduce: '(prefers-reduced-motion: reduce)'
          },
          (context: any) => {
            if (context.conditions?.reduce || cancelled) return;

            const mode: 'desktop' | 'mobile' = context.conditions?.desktop ? 'desktop' : 'mobile';

            const buildAnimation = () => {
              const targetEl = targetRef.current;
              if (!targetEl || cancelled) return;

                // Prevent a brief flash of mis-aligned gradient while we swap DOM nodes for SplitText.
                // We reveal it only when the animation begins.
                gsap.set(targetEl, { visibility: 'hidden' });

              // Kill previous tween if exists
              if (tweenRef.current) {
                tweenRef.current.scrollTrigger?.kill();
                tweenRef.current.kill();
                tweenRef.current = null;
              }

              // Revert and recreate split ONLY when mode changes
              if (modeRef.current !== mode) {
                splitRef.current?.revert();
                splitRef.current = null;
                modeRef.current = mode;
              }

              // Create split instance if not exists
              if (!splitRef.current) {
                splitRef.current = createSplitText(targetEl);
              }

              // Ensure parent containers don't clip animated text
              gsap.set(targetEl, { overflow: 'visible' });
              if (targetEl.parentElement) {
                gsap.set(targetEl.parentElement, { overflow: 'visible' });
              }

              const config = mode === 'desktop'
                ? desktopConfigRef.current
                : (mobileConfigRef.current ?? desktopConfigRef.current);

              const scrollTrigger = config.scrollTrigger
                ? {
                    ...(config.scrollTrigger as any),
                    trigger:
                      (config.scrollTrigger as any).trigger ||
                      scopeRef.current ||
                      targetEl
                  }
                : undefined;

              // Build fromVars with defaults
              const fromVars = { ...(config.from ?? {
                opacity: 0,
                y: 40,
                rotateX: -90,
                transformPerspective: 1000
              }) };

              // CRITICAL: Set characters to initial state WITHOUT applying transforms yet
              // This prevents the "flash" by keeping opacity at 0 until animation starts
              gsap.set(splitRef.current.chars, { 
                opacity: 0,
                clearProps: 'transform'
              });

              const speedScale = 1.6;

              const staggerValue = config.stagger ?? 0.03;
              const stagger = typeof staggerValue === 'number'
                ? ({ each: staggerValue * speedScale, from: 'center' as const })
                : staggerValue;

              // Single RAF: allows layout to settle without delaying the start too much.
              requestAnimationFrame(() => {
                if (cancelled) return;

                // Now that layout is stable, refresh gradient alignment
                splitRef.current?.refresh?.();

                // Animate from hidden state to visible
                tweenRef.current = gsap.fromTo(
                  splitRef.current!.chars,
                  {
                    ...fromVars,
                    opacity: 0
                  },
                  {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    transformPerspective: 1000,
                    duration: (config.duration ?? 1) * speedScale,
                    stagger,
                    ease: config.ease ?? 'back.out(1.7)',
                    delay: config.delay ?? 0,
                      scrollTrigger,
                    immediateRender: false,
                    overwrite: 'auto',
                    onStart: () => {
                      // Ensure visibility when animation begins
                      gsap.set(targetEl, { opacity: 1, visibility: 'visible' });
                    },
                    onComplete: () => {
                      splitRef.current?.refresh?.();
                    }
                  }
                );
              });
            };

            // Add animation to context for proper cleanup
            ctx.add(() => {
              buildAnimation();
            });

            // Wait for fonts to load before animating
            if (document.fonts?.ready) {
              document.fonts.ready
                .then(() => {
                  if (cancelled) return;
                  // Recalculate gradient backgrounds now that font metrics are stable
                  splitRef.current?.refresh?.();
                  ScrollTrigger.refresh();
                })
                .catch(() => {
                  // Ignore font loading errors
                });
            }

            return () => {
              cancelled = true;
            };
          }
        );
      } catch (error) {
        console.error('Failed to initialize GSAP animation:', error);
      }
    };

    init();

    return () => {
      cancelled = true;
      if (mm) mm.revert();
      if (tweenRef.current) {
        tweenRef.current.scrollTrigger?.kill();
        tweenRef.current.kill();
        tweenRef.current = null;
      }
      splitRef.current?.revert();
      splitRef.current = null;
      modeRef.current = null;
      if (ctx) ctx.revert();
    };
  }, [scopeRef, targetRef, enabled, breakpoints?.desktop, breakpoints?.mobile]);
}
