'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import ThemeToggleButton from './ThemeToggleButton';
import { useTheme } from '../contexts/ThemeContext';
import { scrollToId } from '@/utils/scroll';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<string>('home');
  const [mounted, setMounted] = useState(false);
  const isScrollingRef = useRef(false);
  const activeRef = useRef('home');
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();

  // Keep activeRef in sync
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Mount effect
  useEffect(() => {
    setMounted(true);

    // Check initial scroll
    const checkScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    checkScroll();
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);



  // Scroll spy using scroll event for reliable detection
  useEffect(() => {
    if (!mounted) return;

    const sectionIds = ['home', 'about', 'skills', 'experience', 'projects', 'ai-studio', 'achievements', 'contact'];

    const handleScroll = () => {
      // Skip scroll spy during programmatic scrolling
      if (isScrollingRef.current) return;

      const scrollPosition = window.scrollY + 200;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if we're near the bottom of the page
      const isNearBottom = windowHeight + window.scrollY >= documentHeight - 100;

      if (isNearBottom) {
        const lastSection = sectionIds[sectionIds.length - 1];
        if (activeRef.current !== lastSection) {
          setActive(lastSection);
        }
        return;
      }

      // Find which section is currently in view
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          const sectionBottom = sectionTop + sectionHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            if (activeRef.current !== sectionIds[i]) {
              setActive(sectionIds[i]);
            }
            break;
          }
        }
      }
    };

    // Check hash on load
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash && sectionIds.includes(currentHash)) {
      setActive(currentHash);
    }

    // Throttled scroll listener
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', scrollListener);
  }, [mounted]);

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#ai-studio', label: 'AI Studio' },
    { href: '#achievements', label: 'Awards' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    const targetId = href.replace(/.*\#/, "");
    if (!targetId) return;

    // Set active state immediately for visual feedback
    setActive(targetId);

    // Lock scroll spy so it doesn't fight the programmatic scroll
    isScrollingRef.current = true;

    // Single, authoritative scroll call — scrollToId handles offset + layout-shift correction.
    // Do NOT also call scrollIntoView here; two competing scroll APIs fight each other
    // and the one that fires last (scrollIntoView) ignores the navbar offset entirely.
    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollToId(`#${targetId}`);
    }

    // Update URL hash cleanly without router re-render or page reload
    if (typeof window !== 'undefined' && window.history.pushState) {
      window.history.pushState(null, '', `#${targetId}`);
    }

    // Unlock scroll spy after scroll settles. Must be longer than performScroll's last
    // adjustment timeout (currently 1600ms in scroll.ts) to prevent the spy re-enabling
    // mid-correction and jumping active state.
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1800);
  }, []);

  if (!mounted) return null;

  // Dynamic glass colors based on theme
  const isDark = theme === 'dark';

  return (
    <>
      {/* Mobile Menu Backdrop Overlay - Must be outside the nav container */}
      <div
        className={`
          fixed inset-0 md:hidden z-[1198]
          transition-all duration-500
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        style={{
          background: isDark
            ? 'rgba(0, 0, 0, 0.5)'
            : 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Dropdown - Must be outside nav container for visibility */}
      <div
        className={`
          fixed top-20 left-1/2 -translate-x-1/2 md:hidden z-[1201]
          w-[calc(100%-2rem)] max-w-[340px]
          rounded-[24px]
          overflow-hidden
          transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] origin-top
          ${isOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-6 scale-90 pointer-events-none'}
        `}
        style={{
          background: isDark
            ? `linear-gradient(180deg, 
                rgba(18, 18, 24, 0.98) 0%, 
                rgba(22, 22, 30, 0.95) 100%)`
            : `linear-gradient(180deg, 
                rgba(255, 255, 255, 0.98) 0%, 
                rgba(250, 250, 252, 0.95) 100%)`,
          backdropFilter: 'blur(60px) saturate(200%)',
          WebkitBackdropFilter: 'blur(60px) saturate(200%)',
          border: isDark
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: isDark
            ? `0 0 0 1px rgba(255, 255, 255, 0.05),
               0 25px 80px -15px rgba(0, 0, 0, 0.6),
               inset 0 1px 0 0 rgba(255, 255, 255, 0.06)`
            : `0 0 0 1px rgba(255, 255, 255, 1),
               0 25px 80px -15px rgba(0, 0, 0, 0.2),
               inset 0 1px 0 0 rgba(255, 255, 255, 1)`,
        }}
      >
        {/* Top edge highlight */}
        <div
          className="absolute top-0 left-8 right-8 h-[1px]"
          style={{
            background: isDark
              ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 1), transparent)',
          }}
        />

        <div className="p-3 space-y-1.5 max-h-[70vh] overflow-y-auto relative z-10">
          {navItems.map((item, idx) => {
            const isActiveItem = active === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  handleNavClick(e, item.href);
                }}
                className="block px-5 py-4 rounded-2xl text-base font-medium transition-all duration-500 flex items-center justify-between group active:scale-[0.98] focus:outline-none focus-visible:outline-none"
                style={{
                  transitionDelay: isOpen ? `${idx * 40}ms` : '0ms',
                  transform: isOpen ? 'translateX(0)' : 'translateX(-10px)',
                  opacity: isOpen ? 1 : 0,
                  background: isActiveItem
                    ? isDark
                      ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.04) 100%)'
                    : 'transparent',
                  color: isActiveItem
                    ? isDark ? '#F9E076' : '#AA8C2C'
                    : isDark ? '#a1a1aa' : '#52525b',
                  boxShadow: isActiveItem
                    ? isDark
                      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 1px 3px rgba(0, 0, 0, 0.2)'
                      : 'inset 0 1px 0 rgba(255, 255, 255, 1), 0 1px 3px rgba(0, 0, 0, 0.04)'
                    : 'none',
                  border: isActiveItem
                    ? isDark
                      ? '1px solid rgba(212, 175, 55, 0.2)'
                      : '1px solid rgba(212, 175, 55, 0.15)'
                    : '1px solid transparent',
                }}
              >
                <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-medium">
                  {item.label}
                </span>
                {isActiveItem && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full transition-all duration-500"
                      style={{
                        background: 'linear-gradient(135deg, #D4AF37, #F9E076)',
                        boxShadow: '0 0 12px rgba(212, 175, 55, 0.7)',
                      }}
                    />
                  </div>
                )}
              </a>
            );
          })}
        </div>

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none"
          style={{
            background: isDark
              ? 'linear-gradient(to top, rgba(22, 22, 30, 0.9), transparent)'
              : 'linear-gradient(to top, rgba(250, 250, 252, 0.9), transparent)',
          }}
        />
      </div>

      <div className="fixed top-4 sm:top-6 left-0 right-0 z-[1200] flex justify-center px-4 pointer-events-none">


        <nav
          ref={navRef}
          aria-label="Main navigation"
          role="navigation"
          className={`
          pointer-events-auto
          relative flex items-center justify-between
          overflow-hidden
          transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]
          py-3 pl-4 pr-3 sm:py-3 sm:pl-6 sm:pr-4
          rounded-[28px]
        `}
          style={{
            width: 'min(95%, 900px)',
            maxWidth: '100%',
            // Wandor Liquid Glass Effect
            background: isDark
              ? 'rgba(255, 255, 255, 0.06)'
              : 'rgba(255, 255, 255, 0.6)',
            backgroundBlendMode: 'normal', // Removed luminosity as it makes it too dark on dark bg
            backdropFilter: 'blur(24px) saturate(150%)',
            WebkitBackdropFilter: 'blur(24px) saturate(150%)',
            border: 'none',
            boxShadow: isDark
              ? 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.6)'
              : 'inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >

          {/* Liquid Glass Border Mask */}
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-0"
            style={{
              padding: '1.4px',
              background: isDark
                ? 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%)'
                : 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.02) 20%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.02) 80%, rgba(0,0,0,0.1) 100%)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />


          {/* Logo Section - Removed hover effects */}
          <div className="flex-shrink-0 mr-3 sm:mr-4 ml-1 relative z-10">
            <a
              href="#home"
              onClick={(e) => {
                handleNavClick(e, '#home');
              }}
              className="group block relative rounded-2xl overflow-visible transition-all duration-500 active:scale-95 focus:outline-none focus-visible:outline-none"
            >
              <div
                className="relative p-1.5 rounded-2xl transition-all duration-500"
                style={{
                  background: isDark
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.03)',
                  boxShadow: isDark
                    ? '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
                    : '0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
                }}
              >
                <Image
                  src="/assets/Name-logo-without-bg.png"
                  alt="NS Logo"
                  width={36}
                  height={36}
                  sizes="36px"
                  className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
                  priority
                />
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 relative z-10">
            <div
              className="flex items-center p-1 rounded-full transition-all duration-500"
              style={{
                background: isDark
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(0, 0, 0, 0.02)',
                border: isDark
                  ? '1px solid rgba(255, 255, 255, 0.03)'
                  : '1px solid rgba(0, 0, 0, 0.02)',
              }}
            >
              {navItems.map((item) => {
                const isActive = active === item.href.slice(1);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      handleNavClick(e, item.href);
                    }}
                    className={`
                    relative px-3 lg:px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap
                    transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                    flex items-center justify-center
                    focus:outline-none focus-visible:outline-none
                    ${isActive
                        ? isDark ? 'text-white' : 'text-gray-900'
                        : isDark
                          ? 'text-gray-400 hover:text-gray-200'
                          : 'text-gray-500 hover:text-gray-800'
                      }
                  `}
                  >
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                        style={{
                          zIndex: -1,
                          background: isDark
                            ? 'linear-gradient(135deg, rgba(45, 45, 55, 0.9) 0%, rgba(35, 35, 45, 0.8) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 252, 0.9) 100%)',
                          boxShadow: isDark
                            ? '0 2px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                            : '0 2px 12px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 1)',
                          border: isDark
                            ? '1px solid rgba(255, 255, 255, 0.05)'
                            : '1px solid rgba(0, 0, 0, 0.03)',
                        }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 relative z-10">
            <ThemeToggleButton />

            {/* Mobile Menu Button - Animated Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-500 active:scale-90 focus:outline-none focus-visible:outline-none"
              style={{
                background: isDark
                  ? 'rgba(255, 255, 255, 0.06)'
                  : 'rgba(0, 0, 0, 0.04)',
                boxShadow: isOpen
                  ? isDark
                    ? 'inset 0 1px 2px rgba(0,0,0,0.3)'
                    : 'inset 0 1px 2px rgba(0,0,0,0.1)'
                  : 'none',
              }}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <div className="w-5 h-4 flex flex-col justify-between items-center">
                {/* Top bar */}
                <span
                  className="block w-full h-[2px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-center"
                  style={{
                    background: isDark ? '#e5e7eb' : '#374151',
                    transform: isOpen ? 'translateY(7px) rotate(45deg)' : 'translateY(0) rotate(0)',
                  }}
                />
                {/* Middle bar */}
                <span
                  className="block w-full h-[2px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  style={{
                    background: isDark ? '#e5e7eb' : '#374151',
                    opacity: isOpen ? 0 : 1,
                    transform: isOpen ? 'scaleX(0)' : 'scaleX(1)',
                  }}
                />
                {/* Bottom bar */}
                <span
                  className="block w-full h-[2px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-center"
                  style={{
                    background: isDark ? '#e5e7eb' : '#374151',
                    transform: isOpen ? 'translateY(-7px) rotate(-45deg)' : 'translateY(0) rotate(0)',
                  }}
                />
              </div>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navigation;
