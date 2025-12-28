'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import ThemeToggleButton from './ThemeToggleButton';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<string>('home');
  const [mounted, setMounted] = useState(false);
  const isScrollingRef = useRef(false);
  const activeRef = useRef('home');

  // Keep activeRef in sync
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll spy using scroll event for reliable detection
  useEffect(() => {
    if (!mounted) return;

    const sectionIds = ['home', 'about', 'skills', 'experience', 'projects', 'achievements', 'contact'];

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
    { href: '#achievements', label: 'Achievements' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleNavClick = useCallback((href: string) => {
    setIsOpen(false);
    const idFromHref = href.startsWith('#') ? href.slice(1) : href;

    // Set active immediately and lock scroll spy
    setActive(idFromHref);
    isScrollingRef.current = true;

    if (history.replaceState) {
      history.replaceState(null, '', `#${idFromHref}`);
    } else {
      window.location.hash = idFromHref;
    }

    const target = document.querySelector(href);
    if (!target) {
      isScrollingRef.current = false;
      return;
    }

    const navbarHeight = 80;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Unlock scroll spy after scroll animation completes
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-[1200] h-20 backdrop-blur-md transition-all duration-300 bg-primary-50/95 dark:bg-dark-900/95 border-b border-primary-500/20 shadow-[0_4px_6px_-1px_rgba(212,175,55,0.05)] dark:shadow-[0_4px_20px_-1px_rgba(212,175,55,0.1)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className="focus:outline-none focus-visible:outline-none focus:ring-0"
            >
              <Image
                src="/assets/Name-logo-without-bg.png"
                alt="NS Logo"
                width={40}
                height={40}
                sizes="40px"
                className="h-10 w-auto"
                priority
              />
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`relative px-3 py-2 text-body-sm font-heading font-medium transition-colors duration-200 focus:outline-none focus-visible:outline-none focus:ring-0 ${active === item.href.slice(1)
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400'
                    }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-primary-500 transition-all duration-300 ${active === item.href.slice(1) ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                      }`}
                  />
                </a>
              ))}
            </div>

            <ThemeToggleButton />
          </div>

          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggleButton />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 dark:bg-dark-900/95 backdrop-blur-md rounded-lg mt-2 border border-primary-100 dark:border-primary-900/30 shadow-lg shadow-royal-gold/10">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`block px-3 py-2 text-body-md font-heading font-medium transition-colors duration-200 focus:outline-none focus-visible:outline-none focus:ring-0 ${active === item.href.slice(1)
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-lg'
                      : 'text-gray-600 dark:text-gray-300'
                    }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
