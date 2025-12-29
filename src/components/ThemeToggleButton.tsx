'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { LuSun, LuMoon } from 'react-icons/lu';
import { useTheme } from '@/contexts/ThemeContext';
import gsap from 'gsap';

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iconRef.current) {
      gsap.fromTo(iconRef.current,
        { rotation: -90, scale: 0.8, opacity: 0 },
        { rotation: 0, scale: 1, opacity: 1, duration: 0.2, ease: "power2.out" }
      );
    }
  }, [theme]);

  const handleToggle = useCallback(() => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.05,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
    }
    toggleTheme();
  }, [toggleTheme]);

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      className="group relative p-3 rounded-xl bg-white/10 dark:bg-dark-800/50 backdrop-blur-sm border border-primary-200/50 dark:border-primary-500/30 hover:border-primary-400 dark:hover:border-primary-400 transition-all duration-150 hover:scale-105 hover:shadow-royal-gold focus:outline-none focus:ring-0 focus-visible:ring-0"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div ref={iconRef} className="relative will-change-transform">
        {theme === 'dark' ? (
          <LuSun
            size={20}
            className="text-primary-400 group-hover:text-primary-300 transition-colors duration-150"
            aria-hidden="true"
          />
        ) : (
          <LuMoon
            size={20}
            className="text-primary-600 group-hover:text-primary-500 transition-colors duration-150"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/20 to-secondary-400/20 dark:from-primary-400/20 dark:to-secondary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 blur-xl will-change-transform"></div>
    </button>
  );
};

export default ThemeToggleButton;
