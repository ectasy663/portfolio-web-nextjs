'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggleButton from './ThemeToggleButton';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [active, setActive] = useState<string>('home');

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash) setActive(currentHash);

    const ids = ['home','about','skills','experience','projects','achievements','contact'];
    const sections = ids
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id) setActive(id);
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

    sections.forEach(sec => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#achievements', label: 'Achievements' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleNavClick = (href: string) => {
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
  };

  return (
    <nav className={`simple-navbar ${isDark ? 'dark-theme' : 'light-theme'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className="text-heading-md font-display gradient-text focus:outline-none focus-visible:outline-none focus:ring-0"
            >
              NS
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
                  className={`relative px-3 py-2 text-body-sm font-heading font-medium transition-colors duration-200 focus:outline-none focus-visible:outline-none focus:ring-0 ${active === item.href.slice(1) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'}`}
                >
                  {item.label}
                  <span className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full transition-all duration-300 ${active === item.href.slice(1) ? 'bg-primary-500 opacity-100' : 'opacity-0'}`}></span>
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
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-lg mt-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`block px-3 py-2 text-body-md font-heading font-medium transition-colors duration-200 focus:outline-none focus-visible:outline-none focus:ring-0 ${active === item.href.slice(1) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'} `}
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
