'use client';

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

export type UseInViewOnceOptions = {
  rootMargin?: string;
  threshold?: number | number[];
  disabled?: boolean;
};

export function useInViewOnce<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin = '400px', threshold = 0.1, disabled = false }: UseInViewOnceOptions = {}
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (disabled) return;
    if (inView) return;
    if (typeof window === 'undefined') return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, threshold, disabled, inView]);

  return inView;
}
