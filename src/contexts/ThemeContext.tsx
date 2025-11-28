'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

type Theme = 'light' | 'dark';

// Extend window interface for GSAP
declare global {
  interface Window {
    gsap?: {
      globalTimeline: {
        pause: () => void;
        resume: () => void;
      };
      killTweensOf: (target: unknown) => void;
      getTweensOf: (target: unknown) => unknown[];
    };
  }
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('dark'); // Default to dark theme for this portfolio
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    
    // Disable all CSS transitions temporarily to prevent conflicts
    const disableTransitions = () => {
      root.classList.add('theme-changing');
      // Don't interfere with any scroll-related animations
      // Only pause non-scroll GSAP animations
      if (window.gsap) {
        // Kill theme-related animations but preserve scroll animations
        const elementsToKill = document.querySelectorAll('[data-gsap-theme]');
        elementsToKill.forEach(el => window.gsap!.killTweensOf(el));
      }
    };

    // Re-enable transitions after theme change
    const enableTransitions = () => {
      root.classList.remove('theme-changing');
    };

    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => {
      disableTransitions();
      
      // Remove previous theme classes
      root.classList.remove('light', 'dark');
      
      // Add current theme class
      root.classList.add(theme);
      
      // Save to localStorage
      localStorage.setItem('theme', theme);
      
      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#020617' : '#ffffff');
      }
      
      // Re-enable transitions after a brief delay
      setTimeout(() => {
        enableTransitions();
      }, 100);
    });
  }, [theme, mounted]);

  // Memoize callbacks to prevent unnecessary re-renders
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  const setThemeCallback = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    theme,
    toggleTheme,
    setTheme: setThemeCallback,
  }), [theme, toggleTheme, setThemeCallback]);

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
