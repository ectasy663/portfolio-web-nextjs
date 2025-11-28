'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface UseAnimationOptions {
  duration?: number;
  delay?: number;
  respectThemeChange?: boolean;
}

/**
 * Custom hook to manage animations that respect theme changes
 * Prevents animation conflicts during theme transitions
 */
export const useAnimation = (options: UseAnimationOptions = {}) => {
  const { theme } = useTheme();
  const animationRef = useRef<HTMLElement>(null);
  const {
    duration = 300,
    delay = 0,
    respectThemeChange = true
  } = options;

  useEffect(() => {
    if (!animationRef.current || !respectThemeChange) return;

    const element = animationRef.current;
    
    const transitionValue = `all ${duration}ms ease-out${delay > 0 ? ` ${delay}ms` : ''}`;
    
    const isThemeChanging = document.documentElement.classList.contains('theme-changing');
    
    if (isThemeChanging) {
      element.style.transition = 'none';
    } else {
      element.style.transition = transitionValue;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement;
          const isChanging = target.classList.contains('theme-changing');
          
          if (isChanging) {
            element.style.transition = 'none';
          } else {
            setTimeout(() => {
              element.style.transition = transitionValue;
            }, 50);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      observer.disconnect();
    };
  }, [theme, duration, delay, respectThemeChange]);

  return animationRef;
};

/**
 * Hook for GSAP animations that respect theme changes
 */
export const useGSAPAnimation = () => {
  const { theme } = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timelineRef = useRef<any>(null);

  useEffect(() => {
    const handleThemeChange = () => {
      if (timelineRef.current && typeof window !== 'undefined' && window.gsap) {
        const isThemeChanging = document.documentElement.classList.contains('theme-changing');
        
        if (isThemeChanging) {
          timelineRef.current.pause();
        } else {
          setTimeout(() => {
            if (timelineRef.current) {
              timelineRef.current.resume();
            }
          }, 50);
        }
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      observer.disconnect();
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [theme]);

  return timelineRef;
};
