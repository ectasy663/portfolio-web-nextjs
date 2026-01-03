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
        { rotation: 0, scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, [theme]);

  const handleToggle = useCallback(() => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.9,
        duration: 0.1,
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
      className="group relative p-2.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all duration-300 focus:outline-none"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div ref={iconRef} className="relative will-change-transform">
        {theme === 'dark' ? (
          <LuSun
            size={20}
            className="text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
            aria-hidden="true"
          />
        ) : (
          <LuMoon
            size={20}
            className="text-slate-700 group-hover:text-slate-900 transition-colors duration-300"
            aria-hidden="true"
          />
        )}
      </div>
    </button>
  );
};

export default ThemeToggleButton;
