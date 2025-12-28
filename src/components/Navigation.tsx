'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import ThemeToggleButton from './ThemeToggleButton';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<string>('home');
  const [mounted, setMounted] = useState(false);

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll spy using scroll event for reliable detection
  useEffect(() => {
    if (!mounted) return;

    const sectionIds = ['home', 'about', 'skills', 'experience', 'projects', 'achievements', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for navbar height + buffer

      // Find which section is currently in view
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            if (active !== sectionIds[i]) {
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

    // Add scroll listener with throttling for performance
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

    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', scrollListener);
  }, [active, mounted]);

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
    setActive(idFromHref);

    if (history.replaceState) {
      history.replaceState(null, '', `#${idFromHref}`);
    } else {
      window.location.hash = idFromHref;
    }

    const target = document.querySelector(href);
    if (!target) return;

    const navbarHeight = 80;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
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
