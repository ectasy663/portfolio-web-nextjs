'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Achievements from '@/components/Achievements';
import Contact from '@/components/Contact';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Make GSAP available globally for theme context
    if (typeof window !== 'undefined') {
      window.gsap = gsap;
    }
    
    // Initialize GSAP animations - NO navbar interference
    gsap.set("body", { visibility: "visible" });
    document.body.classList.add('gsap-loaded');
    
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Initial loading animation
      const tl = gsap.timeline({
        onComplete: () => setIsLoading(false)
      });
      
      tl.to(".loading-overlay", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        delay: 0.5
      });
      
      // Create scroll progress indicator with optimized settings
      gsap.to(".scroll-progress", {
        width: "100%",
        ease: "none",
        scrollTrigger: { 
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true
        }
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      setIsLoading(false);
      gsap.set(".loading-overlay", { opacity: 0, display: "none" });
    });

    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="App">
      {/* Initial page loading overlay */}
      <div className={`loading-overlay fixed inset-0 bg-white dark:bg-dark-900 transition-all duration-500 flex flex-col items-center justify-center ${!isLoading ? 'opacity-0 pointer-events-none z-[-1]' : 'opacity-100 z-[200]'}`}>
        <div className="text-4xl font-bold gradient-text-name">Naman Singh Panwar</div>
        <div className="mt-4 w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      {/* Scroll progress indicator */}
      <div className="fixed top-0 left-0 w-full h-1 z-[1100] bg-gray-200 dark:bg-dark-800">
        <div className="scroll-progress h-full bg-gradient-to-r from-primary-400 to-primary-600 w-0"></div>
      </div>
      
      <Navigation />
      <main className="pt-20 relative z-0">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Achievements />
        <Contact />
      </main>
    </div>
  );
}
