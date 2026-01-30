'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { LuArrowDown, LuGithub, LuLinkedin, LuMail, LuCode, LuZap, LuRocket, LuSparkles, LuBrain, LuGlobe, LuPalette, LuLightbulb } from 'react-icons/lu';
import { scrollToId } from '@/utils/scroll';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import ResumeButton from './ResumeButton';
import dynamic from 'next/dynamic';
import { loadGSAP } from '@/utils/gsapLoader';

// Lazy load heavy dependencies
const Typewriter = dynamic(() => import('typewriter-effect'), { ssr: false });

interface TechStackItem {
  color: string;
  name: string;
}

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const techBadgesRef = useRef<HTMLDivElement>(null);

  useSplitTextAnimation({
    scopeRef: heroRef,
    targetRef: nameRef,
    desktop: {
      duration: 1,
      stagger: 0.04,
      ease: 'back.out(1.7)',
      delay: 0.1,
      from: {
        y: 28
      }
    },
    mobile: {
      duration: 0.9,
      stagger: 0.035,
      ease: 'back.out(1.7)',
      delay: 0.05,
      from: {
        y: 20
      }
    }
  });

  // Initialize GSAP after first paint (avoid blocking)
  useEffect(() => {
    let cancelled = false;
    let mm: any;
    let mouseRaf = 0;
    let lastMouseEvent: MouseEvent | null = null;

    const initAnimations = async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGSAP();
        if (cancelled) return;

        mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
        // === SUBTITLE ANIMATION ===
        if (subtitleRef.current) {
          gsap.fromTo(subtitleRef.current,
            {
              opacity: 0,
              y: 40,
              filter: "blur(10px)"
            },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1.2,
              ease: "power4.out",
              delay: 0.2 // Reduced from 0.8
            }
          );
        }

        // === DESCRIPTION WITH SCRAMBLE EFFECT ===
        if (descriptionRef.current) {
          gsap.fromTo(descriptionRef.current,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              delay: 0.4 // Reduced from 1.2
            }
          );
        }

        // === BUTTONS STAGGERED ENTRANCE ===
        if (buttonsRef.current) {
          const buttons = buttonsRef.current.querySelectorAll('button, a');
          gsap.fromTo(buttons,
            {
              opacity: 0,
              y: 30, // Reduced movement distance
              scale: 0.9, // Less extreme scale
              rotateY: 0 // Removed rotation for cleaner entry
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateY: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "back.out(1.7)",
              delay: 0.8 // Reduced from 1.5
            }
          );
        }

        // === SOCIAL LINKS POP-IN ===
        if (socialRef.current) {
          const socialLinks = socialRef.current.querySelectorAll('a');
          gsap.fromTo(socialLinks,
            {
              opacity: 0,
              scale: 0,
              rotation: -90 // Reduced rotation
            },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "back.out(2)",
              delay: 1.0 // Reduced from 1.8
            }
          );
        }

        // === TECH BADGES ENTRANCE ===
        if (techBadgesRef.current) {
          const badges = techBadgesRef.current.querySelectorAll('.tech-badge');
          gsap.fromTo(badges,
            {
              opacity: 0,
              y: 20,
              scale: 0.8,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.05,
              ease: "power2.out",
              delay: 0.6 // Reduced from 1.3
            }
          );
        }

        // === PROFILE IMAGE REVEAL ===
        if (imageRef.current) {
          gsap.fromTo(imageRef.current,
            {
              opacity: 0,
              scale: 0.8,
              x: 100,
              rotateY: 25
            },
            {
              opacity: 1,
              scale: 1,
              x: 0,
              rotateY: 0,
              duration: 1.5,
              ease: "expo.out",
              delay: 0.1 // Reduced from 0.5
            }
          );
        }

        // === PARTICLES FLOATING ANIMATION ===
        // Removed as per design request


        // === MOUSE PARALLAX FOR HERO ===
        const handleMouseMove = (e: MouseEvent) => {
          lastMouseEvent = e;
          if (mouseRaf) return;
          mouseRaf = window.requestAnimationFrame(() => {
            mouseRaf = 0;
            const evt = lastMouseEvent;
            if (!evt) return;
          if (!heroRef.current) return;

          const rect = heroRef.current.getBoundingClientRect();
          const x = (evt.clientX - rect.left - rect.width / 2) / rect.width;
          const y = (evt.clientY - rect.top - rect.height / 2) / rect.height;

          // Parallax on background elements
          const overlays = heroRef.current.querySelectorAll('.parallax-layer');
          overlays.forEach((overlay, index) => {
            const depth = (index + 1) * 15;
            gsap.to(overlay, {
              x: x * depth,
              y: y * depth,
              duration: 0.8,
              ease: "power2.out"
            });
          });

          // Subtle tilt on image
          if (imageRef.current) {
            gsap.to(imageRef.current, {
              rotateY: x * 10,
              rotateX: -y * 10,
              duration: 0.5,
              ease: "power2.out"
            });
          }
          });
        };

        heroRef.current?.addEventListener('mousemove', handleMouseMove);

        // === SCROLL INDICATOR BOUNCE ===
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
          gsap.to(scrollIndicator, {
            y: 10,
            duration: 1.2,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
          });
        }

        return () => {
          heroRef.current?.removeEventListener('mousemove', handleMouseMove);
        };
      });
      } catch (error) {
        console.error('Failed to initialize Hero animations:', error);
      }
    };

    // Kick off after paint
    const raf = window.requestAnimationFrame(() => {
      initAnimations();
    });

    return () => {
      cancelled = true;
      if (raf) window.cancelAnimationFrame(raf);
      if (mouseRaf) window.cancelAnimationFrame(mouseRaf);
      if (mm) mm.revert();
    };
  }, []);

  const scrollToProjects = useCallback(() => {
    scrollToId('#projects', 80);
  }, []);

  const scrollToContact = useCallback(() => {
    scrollToId('#contact', 80);
  }, []);

  // Tech stack for displaying technology badges
  const technologyStack: TechStackItem[] = [
    { color: 'text-cyan-400', name: 'React' },
    { color: 'text-blue-400', name: 'TypeScript' },
    { color: 'text-yellow-400', name: 'Python' },
    { color: 'text-yellow-300', name: 'JavaScript' },
    { color: 'text-green-400', name: 'Node.js' },
    { color: 'text-blue-500', name: 'Docker' },
    { color: 'text-orange-500', name: 'Git' },
    { color: 'text-orange-400', name: 'TensorFlow' },
  ];

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300"
      aria-label="Hero section"
    >
      {/* Background Video - Only visible in dark theme - Extended to cover all borders */}
      <video
        id="heroVideo"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 will-change-transform transform-gpu scale-110 dark:opacity-100 dark:brightness-75 dark:contrast-125"
        aria-hidden="true"
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Light theme background - Full viewport */}
      <div className="absolute inset-0 h-full bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:opacity-0 opacity-100 transition-opacity duration-300 z-0" aria-hidden="true"></div>

      {/* Light Rays Effect */}
      <div className="light-ray z-0" aria-hidden="true"></div>

      {/* Video overlay for better text readability - Only in dark theme */}
      <div className="pointer-events-none absolute inset-0 h-full bg-gradient-to-b from-black/60 via-black/35 to-black/70 backdrop-blur-[2px] dark:opacity-100 opacity-0 transition-opacity duration-300 z-10" aria-hidden="true"></div>

      {/* Subtle glow overlay (no blob/ball shapes) */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-10 dark:opacity-15 transition-opacity duration-300" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 via-transparent to-secondary-500/10" />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-50 pt-28 sm:pt-32">
        <div ref={heroRef} className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-12">
            {/* Left side - Text content */}
            <div className="flex-1 lg:flex-[1.3] text-left lg:pr-8">
              {/* Main heading with gradient text - SplitText Animation */}
              <h1 ref={titleRef} className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-seasons font-normal tracking-[0.01em] leading-[1.15] overflow-visible relative z-50 mb-3 pb-1">
                <span ref={nameRef} className="hero-name gradient-text-name font-seasons font-normal tracking-[0.01em] opacity-0 transition-colors duration-300 whitespace-nowrap">
                  Naman Singh Panwar
                </span>
              </h1>

              {/* Subtitle with typewriter effect */}
              <h2 ref={subtitleRef} className="font-body font-normal text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700/90 dark:text-gray-200/90 transition-colors duration-300 flex items-center gap-2.5 sm:gap-3 flex-wrap mb-5">
                <LuRocket className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-500/90 animate-pulse-slow flex-shrink-0" aria-hidden="true" />
                <span className="min-w-0">
                  <Typewriter
                    options={{
                      strings: [
                        'Web Developer',
                        'Full Stack Developer',
                        'App Developer',
                        'AI-Augmented Engineer',
                        'React Specialist',
                        'Problem Solver',
                        'Creative Technologist'
                      ],
                      autoStart: true,
                      loop: true,
                      deleteSpeed: 30,
                      delay: 100,
                      wrapperClassName: "gradient-text-gold",
                    }}
                  />
                </span>
              </h2>

              {/* Description */}
              <p ref={descriptionRef} className="font-body font-normal text-base xs:text-lg sm:text-xl md:text-[1.375rem] text-gray-700 dark:text-gray-200 leading-[1.8] transition-colors duration-300 max-w-[60ch] mb-6">
                Crafting exceptional web and mobile applications with <strong className="text-gray-900 dark:text-gray-100 font-medium transition-colors duration-300">modern JavaScript technologies</strong>.{' '}
                Leveraging <strong className="text-gray-900 dark:text-gray-100 font-medium transition-colors duration-300">AI as a powerful development tool</strong> to enhance productivity, code quality, and innovation.{' '}
                Transforming ideas into high-performance, user-centered digital experiences.
              </p>

              {/* Tech highlights - Enhanced with floating animation */}
              <div ref={techBadgesRef} className="flex flex-wrap gap-2.5 xs:gap-3 sm:gap-4 mb-2" role="list" aria-label="Primary technologies">
                {technologyStack.slice(0, 4).map((tech, index) => (
                  <div
                    key={index}
                    role="listitem"
                    className="tech-badge group flex items-center bg-white/80 dark:bg-dark-800/50 backdrop-blur-xl border border-primary-200/50 dark:border-primary-500/30 rounded-full px-2.5 xs:px-3 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 hover:border-primary-400 dark:hover:border-primary-400 hover:shadow-royal-gold transition-all duration-300 will-change-transform cursor-pointer"
                  >
                    <span className={`text-[10px] xs:text-xs sm:text-sm font-medium tracking-[0.02em] ${tech.color} transition-colors duration-300`}>{tech.name}</span>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <nav ref={buttonsRef} className="flex flex-col gap-3 mb-4 max-w-md" aria-label="Primary actions">
                <div className="flex gap-3 w-full">
                  <button
                    onClick={scrollToProjects}
                    className="flex-1 group font-body font-medium bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-gray-200/50 dark:border-white/20 text-gray-800 dark:text-white rounded-xl hover:border-gray-300 dark:hover:border-white/40 hover:shadow-md transition-all duration-300 py-3 px-4 flex items-center justify-center space-x-2"
                    aria-label="View my portfolio projects"
                  >
                    <LuCode size={18} className="sm:w-5 sm:h-5" aria-hidden="true" />
                    <span className="text-sm sm:text-base">View Work</span>
                  </button>

                  <ResumeButton variant="secondary" className="flex-1 font-body font-medium py-3 px-4 text-sm sm:text-base justify-center" />
                </div>

                <button
                  onClick={scrollToContact}
                  className="w-full group font-body font-medium bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-gray-200/50 dark:border-white/20 text-gray-800 dark:text-white rounded-xl hover:border-gray-300 dark:hover:border-white/40 hover:shadow-md transition-all duration-300 py-3 px-4 flex items-center justify-center space-x-2"
                  aria-label="Navigate to contact section"
                >
                  <LuZap size={18} className="sm:w-5 sm:h-5" aria-hidden="true" />
                  <span className="text-sm sm:text-base">Let's Connect</span>
                </button>
              </nav>

              {/* Social links */}
              <nav ref={socialRef} className="flex items-center gap-3 sm:gap-4" aria-label="Social media links">
                {[
                  { icon: LuGithub, href: 'https://github.com/ectasy663', label: 'Visit GitHub profile' },
                  { icon: LuLinkedin, href: 'https://www.linkedin.com/in/naman-singh-panwar7/', label: 'Connect on LinkedIn' },
                  { icon: LuMail, href: 'mailto:namansingh4680@gmail.com', label: 'Send an email' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={social.label}
                    className="group w-[72px] h-[72px] sm:w-20 sm:h-20 flex items-center justify-center bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-gray-200/50 dark:border-white/20 rounded-xl text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/40 hover:scale-105 hover:shadow-lg transition-all duration-300 will-change-transform"
                  >
                    <social.icon size={32} className="sm:w-9 sm:h-9" aria-hidden="true" />
                  </a>
                ))}
              </nav>
            </div>

            {/* Right side - Profile Image - Enhanced with 3D effect */}
            <aside ref={imageRef} className="flex-shrink-0 lg:flex-[0.7] mx-auto lg:ml-24 lg:mr-0 perspective-1000">
              <div className="relative group cursor-pointer w-80 h-[24rem] sm:w-96 sm:h-[28rem] md:w-[26rem] md:h-[32rem]">
                <Image
                  src="/assets/black and white aesthetic image right.png"
                  alt="Naman Singh Panwar - Web Developer and AI-Augmented Engineer"
                  fill
                  loading="eager"
                  priority
                  sizes="(max-width: 640px) 20rem, (max-width: 768px) 24rem, 26rem"
                  className="object-cover rounded-2xl shadow-xl group-hover:scale-105 transition-all duration-500 group-hover:shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" aria-hidden="true"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0" aria-hidden="true">
                  <p className="text-lg font-bold mb-1">Turning ideas into reality</p>
                  <p className="text-sm text-gray-200 flex items-center gap-2">One line of code at a time <LuSparkles className="w-4 h-4 text-yellow-300" /></p>
                </div>
              </div>
            </aside>
          </div>

          {/* Scroll indicator - Enhanced bounce */}
          <div className="scroll-indicator flex justify-center mt-6 sm:mt-8" role="navigation" aria-label="Scroll down">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-200 font-medium transition-colors duration-300">Scroll to explore</span>
              <LuArrowDown className="text-cyan-600 dark:text-cyan-400 transition-colors duration-300" size={20} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
