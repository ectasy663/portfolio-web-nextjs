'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { LuArrowDown, LuGithub, LuLinkedin, LuMail, LuCode, LuZap, LuRocket, LuSparkles, LuBrain, LuGlobe, LuPalette, LuLightbulb } from 'react-icons/lu';
import { scrollToId } from '@/utils/scroll';
import ResumeButton from './ResumeButton';
import dynamic from 'next/dynamic';

// Lazy load heavy dependencies
const Typewriter = dynamic(() => import('typewriter-effect'), { ssr: false });

interface TechStackItem {
  color: string;
  name: string;
}

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const techBadgesRef = useRef<HTMLDivElement>(null);

  // Defer GSAP initialization for faster first paint
  useEffect(() => {
    const initAnimations = async () => {
      const gsap = (await import('gsap')).default;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // === SPLIT TEXT ANIMATION FOR NAME ===
        const nameElement = titleRef.current?.querySelector('.gradient-text-name');
        if (nameElement && nameElement.textContent) {
          const text = nameElement.textContent;
          nameElement.innerHTML = '';

          // Create character spans
          text.split('').forEach((char) => {
            const span = document.createElement('span');
            span.className = 'split-char inline-block';
            span.style.display = 'inline-block';
            span.textContent = char === ' ' ? '\u00A0' : char;
            nameElement.appendChild(span);
          });

          const chars = nameElement.querySelectorAll('.split-char');

          // Animate characters with wave effect
          gsap.set(chars, {
            opacity: 0,
            y: 80,
            rotateX: -90,
            transformPerspective: 1000
          });

          gsap.to(chars, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            stagger: 0.04,
            ease: "back.out(1.7)",
            delay: 0.2
          });
        }

        // Mobile name split text
        const mobileNameElements = titleRef.current?.querySelectorAll('.gradient-text-name');
        mobileNameElements?.forEach((el) => {
          if (el.classList.contains('split-animated')) return;
          el.classList.add('split-animated');
        });

        // === SUBTITLE ANIMATION ===
        if (subtitleRef.current) {
          gsap.set(subtitleRef.current, {
            opacity: 0,
            y: 40,
            filter: "blur(10px)"
          });

          gsap.to(subtitleRef.current, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power4.out",
            delay: 0.8
          });
        }

        // === DESCRIPTION WITH SCRAMBLE EFFECT ===
        if (descriptionRef.current) {
          gsap.set(descriptionRef.current, { opacity: 0, y: 30 });

          gsap.to(descriptionRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: 1.2
          });
        }

        // === BUTTONS STAGGERED ENTRANCE ===
        if (buttonsRef.current) {
          const buttons = buttonsRef.current.querySelectorAll('button, a');
          gsap.set(buttons, {
            opacity: 0,
            y: 50,
            scale: 0.8,
            rotateY: -15
          });

          gsap.to(buttons, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateY: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)",
            delay: 1.5
          });
        }

        // === SOCIAL LINKS POP-IN ===
        if (socialRef.current) {
          const socialLinks = socialRef.current.querySelectorAll('a');
          gsap.set(socialLinks, {
            opacity: 0,
            scale: 0,
            rotation: -180
          });

          gsap.to(socialLinks, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(2)",
            delay: 1.8
          });
        }

        // === TECH BADGES FLOATING ENTRANCE ===
        if (techBadgesRef.current) {
          const badges = techBadgesRef.current.querySelectorAll('.tech-badge');
          gsap.set(badges, {
            opacity: 0,
            y: 30,
            scale: 0.5,
            rotation: gsap.utils.random(-20, 20, true)
          });

          gsap.to(badges, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "elastic.out(1, 0.5)",
            delay: 1.3
          });

          // Add continuous floating
          badges.forEach((badge, index) => {
            gsap.to(badge, {
              y: "+=8",
              duration: 2 + index * 0.3,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: index * 0.2
            });
          });
        }

        // === PROFILE IMAGE REVEAL ===
        if (imageRef.current) {
          gsap.set(imageRef.current, {
            opacity: 0,
            scale: 0.8,
            x: 100,
            rotateY: 25
          });

          gsap.to(imageRef.current, {
            opacity: 1,
            scale: 1,
            x: 0,
            rotateY: 0,
            duration: 1.5,
            ease: "expo.out",
            delay: 0.5
          });
        }

        // === PARTICLES FLOATING ANIMATION ===
        if (particlesRef.current) {
          const particles = particlesRef.current.querySelectorAll('.particle');
          particles.forEach((particle, index) => {
            // Random floating
            gsap.to(particle, {
              y: gsap.utils.random(-30, 30),
              x: gsap.utils.random(-20, 20),
              duration: 3 + index * 0.5,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: index * 0.3
            });

            // Scale pulse
            gsap.to(particle, {
              scale: gsap.utils.random(0.8, 1.3),
              duration: 2 + index * 0.4,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1
            });
          });
        }

        // === MOUSE PARALLAX FOR HERO ===
        const handleMouseMove = (e: MouseEvent) => {
          if (!heroRef.current) return;

          const rect = heroRef.current.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
          const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

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
    };

    // Use requestIdleCallback for non-blocking animation init
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback?.(initAnimations);
    } else {
      setTimeout(initAnimations, 1);
    }
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
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300">
      {/* Background Video - Only visible in dark theme - Extended to cover all borders */}
      <video
        id="heroVideo"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className="absolute z-0 opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1.1)',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'cover',
        }}
        aria-hidden="true"
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Light theme background - Full viewport */}
      <div className="absolute inset-0 h-full bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:opacity-0 opacity-100 transition-opacity duration-300 z-0"></div>

      {/* Light Rays Effect */}
      <div className="light-ray z-0"></div>

      {/* Video overlay for better text readability - Only in dark theme */}
      <div className="absolute inset-0 h-full bg-gradient-to-b from-black/50 via-black/30 to-black/60 dark:opacity-100 opacity-0 transition-opacity duration-300 z-10"></div>

      {/* Dynamic gradient background overlay - Detailed Illustrations */}
      <div className="absolute inset-0 z-20 opacity-20 dark:opacity-30 transition-opacity duration-300 pointer-events-none">
        <div className="parallax-layer absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
        <div className="parallax-layer absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse delay-1000"></div>
        <div className="parallax-layer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient from-white/5 to-transparent opacity-50 blur-2xl"></div>
      </div>

      {/* Animated background particles - Enhanced with GSAP */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none z-30 hidden sm:block" aria-hidden="true">
        <div className="particle absolute top-20 right-20 w-2 h-2 bg-cyan-400 rounded-full"></div>
        <div className="particle absolute top-40 right-40 w-3 h-3 bg-blue-400 rounded-full"></div>
        <div className="particle absolute top-60 right-60 w-2 h-2 bg-yellow-400 rounded-full"></div>
        <div className="particle absolute bottom-60 right-52 w-2 h-2 bg-orange-400 rounded-full"></div>
        <div className="particle absolute top-32 left-20 w-2 h-2 bg-purple-400 rounded-full"></div>
        <div className="particle absolute bottom-40 left-40 w-3 h-3 bg-pink-400 rounded-full"></div>
        <div className="particle absolute top-1/2 right-32 w-2 h-2 bg-green-400 rounded-full"></div>
        <div className="particle absolute bottom-32 right-1/3 w-2 h-2 bg-indigo-400 rounded-full"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-40 pt-28 sm:pt-32">
        <div ref={heroRef} className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Left side - Text content */}
            <div className="flex-1 text-left space-y-6 sm:space-y-8">
              {/* Main heading with gradient text - SplitText Animation */}
              <h1 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight relative z-50" style={{ opacity: 1 }}>
                <div className="block sm:hidden text-left">
                  <div className="text-4xl font-bold mb-2 gradient-text-name">Naman Singh</div>
                  <div className="text-4xl font-bold gradient-text-name">Panwar</div>
                </div>
                <span className="hidden sm:inline whitespace-nowrap gradient-text-name transition-colors duration-300">
                  Naman Singh Panwar
                </span>
              </h1>

              {/* Subtitle with typewriter effect */}
              <h2 ref={subtitleRef} className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-700 dark:text-gray-200 transition-colors duration-300 flex items-center gap-3">
                <LuRocket className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 animate-pulse-slow" />
                <Typewriter
                  options={{
                    strings: [
                      'AI/ML Engineer',
                      'Full Stack Developer',
                      'Mobile App Developer',
                      'Creative Technologist',
                      'Problem Solver'
                    ],
                    autoStart: true,
                    loop: true,
                    deleteSpeed: 30,
                    delay: 100,
                    wrapperClassName: "gradient-text-gold",
                  }}
                />
              </h2>

              {/* Description */}
              <p ref={descriptionRef} className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-200 leading-relaxed transition-colors duration-300 font-medium">
                Crafting intelligent digital experiences <span className="inline-block align-middle"><LuSparkles className="w-5 h-5 text-yellow-400 animate-spin-slow" /></span> at the intersection of{' '}
                <span className="text-primary-600 dark:text-primary-400 font-bold transition-colors duration-300 inline-flex items-center gap-1">AI/ML <LuBrain className="w-5 h-5" /></span>,{' '}
                <span className="text-secondary-600 dark:text-secondary-400 font-bold transition-colors duration-300 inline-flex items-center gap-1">web development <LuGlobe className="w-5 h-5" /></span>, and{' '}
                <span className="text-primary-500 dark:text-primary-300 font-bold transition-colors duration-300 inline-flex items-center gap-1">creative design <LuPalette className="w-5 h-5" /></span>.
                Transforming complex ideas into elegant, user-centered solutions <span className="inline-block align-middle"><LuLightbulb className="w-5 h-5 text-yellow-500" /></span>.
              </p>

              {/* Tech highlights - Enhanced with floating animation */}
              <div ref={techBadgesRef} className="flex flex-wrap gap-2 sm:gap-3">
                {technologyStack.slice(0, 4).map((tech, index) => (
                  <div
                    key={index}
                    className="tech-badge group flex items-center bg-white/80 dark:bg-dark-800/50 backdrop-blur-xl border border-primary-200/50 dark:border-primary-500/30 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 hover:border-primary-400 dark:hover:border-primary-400 hover:shadow-royal-gold transition-all duration-300 will-change-transform cursor-pointer"
                  >
                    <span className={`text-xs sm:text-sm font-semibold ${tech.color} transition-colors duration-300`}>{tech.name}</span>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div ref={buttonsRef} className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4">
                <button
                  onClick={scrollToProjects}
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-gray-200/50 dark:border-white/20 text-gray-800 dark:text-white font-semibold rounded-xl hover:border-gray-300 dark:hover:border-white/40 hover:shadow-xl hover:scale-105 transition-all duration-300 will-change-transform focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-white/30 active:scale-95"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <LuCode size={18} className="sm:w-5 sm:h-5" aria-hidden="true" />
                    <span className="text-sm sm:text-base">View My Work</span>
                  </span>
                </button>

                <ResumeButton variant="secondary" className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base" />

                <button
                  onClick={scrollToContact}
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-gray-200/50 dark:border-white/20 text-gray-800 dark:text-white font-semibold rounded-xl hover:border-gray-300 dark:hover:border-white/40 hover:shadow-xl hover:scale-105 transition-all duration-300 will-change-transform focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-white/30 active:scale-95"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <LuZap size={18} className="sm:w-5 sm:h-5" aria-hidden="true" />
                    <span className="text-sm sm:text-base">Let's Connect</span>
                  </span>
                </button>
              </div>

              {/* Social links */}
              <div ref={socialRef} className="flex gap-4 sm:gap-6">
                {[
                  { icon: LuGithub, href: 'https://github.com/ectasy663', label: 'GitHub' },
                  { icon: LuLinkedin, href: 'https://www.linkedin.com/in/naman-singh-panwar7/', label: 'LinkedIn' },
                  { icon: LuMail, href: 'mailto:namansingh4680@gmail.com', label: 'Email' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={social.label}
                    className="group p-2.5 sm:p-3 bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-gray-200/50 dark:border-white/20 rounded-xl text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/40 hover:scale-110 hover:shadow-lg transition-all duration-300 will-change-transform"
                  >
                    <social.icon size={20} className="sm:w-6 sm:h-6" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right side - Profile Image - Enhanced with 3D effect */}
            <div ref={imageRef} className="flex-shrink-0 ml-auto lg:ml-12 lg:pl-12" style={{ perspective: '1000px' }}>
              <div className="relative group cursor-pointer w-80 h-[24rem] sm:w-96 sm:h-[28rem] md:w-[26rem] md:h-[32rem]">
                <Image
                  src="/assets/black and white aesthetic image right.png"
                  alt="Naman Singh Panwar - Professional"
                  fill
                  loading="eager"
                  sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
                  className="object-cover rounded-2xl shadow-xl group-hover:scale-105 transition-all duration-500 group-hover:shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <p className="text-lg font-bold mb-1">Turning ideas into reality</p>
                  <p className="text-sm text-gray-200 flex items-center gap-2">One line of code at a time <LuSparkles className="w-4 h-4 text-yellow-300" /></p>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator - Enhanced bounce */}
          <div className="scroll-indicator flex justify-center mt-12 sm:mt-16">
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
