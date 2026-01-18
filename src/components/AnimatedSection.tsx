'use client';

import React, { useRef, useEffect, useState, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Wrapper component that lazy-loads animations when section enters viewport
 * Prevents animation code from running until needed
 * Improves initial load performance
 */
export default function AnimatedSection({
  children,
  className = '',
  id,
  threshold = 0.1,
  rootMargin = '100px',
}: AnimatedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasBeenVisible) {
            setIsVisible(true);
            setHasBeenVisible(true);
            // Disconnect after first visibility to prevent re-initialization
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, hasBeenVisible]);

  return (
    <section ref={sectionRef} className={className} id={id} data-animated={isVisible}>
      {children}
    </section>
  );
}
