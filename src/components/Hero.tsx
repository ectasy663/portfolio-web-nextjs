'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ArrowDown, Github, Linkedin, Mail, Code, Zap } from 'lucide-react';
import gsap from 'gsap';
import { scrollToId } from '@/utils/scroll';
import Typewriter from 'typewriter-effect';
import ResumeButton from './ResumeButton';
import {
  SiReact, SiTypescript, SiPython, SiJavascript, SiNodedotjs,
  SiDocker, SiGit, SiTensorflow
} from 'react-icons/si';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline();

      if (titleRef.current && subtitleRef.current && descriptionRef.current && buttonsRef.current && socialRef.current) {
        gsap.set([titleRef.current, subtitleRef.current, descriptionRef.current, buttonsRef.current, socialRef.current], {
          opacity: 0,
          y: 30
        });

        tl.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)"
        })
          .to(subtitleRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out"
          }, "-=1.0")
          .to(descriptionRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
          }, "-=0.8")
          .to(buttonsRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "back.out(1.7)"
          }, "-=0.6")
          .to(socialRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "back.out(1.7)"
          }, "-=0.6");
      }

      const techIcons = document.querySelectorAll('.floating-tech-icon');
      techIcons.forEach((icon, index) => {
        gsap.to(icon, {
          y: 'random(-20, 20)',
          x: 'random(-15, 15)',
          rotation: 'random(-15, 15)',
          duration: 'random(3, 6)',
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: index * 0.2
        });
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (titleRef.current && subtitleRef.current && descriptionRef.current && buttonsRef.current && socialRef.current) {
        gsap.set([titleRef.current, subtitleRef.current, descriptionRef.current, buttonsRef.current, socialRef.current], {
          opacity: 1,
          y: 0
        });
      }
    });

    return () => {
      mm.revert();
    };
  }, []);

  const scrollToProjects = useCallback(() => {
    scrollToId('#projects', 80);
  }, []);

  const scrollToContact = useCallback(() => {
    scrollToId('#contact', 80);
  }, []);

  const techStack = [
    { icon: SiReact, color: 'text-cyan-400', name: 'React' },
    { icon: SiTypescript, color: 'text-blue-400', name: 'TypeScript' },
    { icon: SiPython, color: 'text-yellow-400', name: 'Python' },
    { icon: SiJavascript, color: 'text-yellow-300', name: 'JavaScript' },
    { icon: SiNodedotjs, color: 'text-green-400', name: 'Node.js' },
    { icon: SiDocker, color: 'text-blue-500', name: 'Docker' },
    { icon: SiGit, color: 'text-orange-500', name: 'Git' },
    { icon: SiTensorflow, color: 'text-orange-400', name: 'TensorFlow' },
  ];

  useEffect(() => {
    const handleResize = () => {
      const video = document.querySelector('#heroVideo') as HTMLVideoElement;
      if (!video) return;
      
      if (window.innerWidth <= 640) {
        video.style.position = 'fixed';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100%';
        video.style.height = '100vh';
        video.style.objectFit = 'cover';
      } else {
        video.style.position = 'absolute';
        video.style.width = 'auto';
        video.style.height = 'auto';
        video.style.minWidth = '100%';
        video.style.minHeight = '100%';
        video.style.top = '50%';
        video.style.left = '50%';
        video.style.transform = 'translate(-50%, -50%)';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300 py-8 sm:py-12 md:py-0">
      {/* Background Video - Only visible in dark theme */}
      <video
        id="heroVideo"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-0 dark:opacity-100 transition-opacity duration-300"
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Light theme background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:opacity-0 opacity-100 transition-opacity duration-300 z-0"></div>

      {/* Light Rays Effect */}
      <div className="light-ray z-0"></div>

      {/* Video overlay for better text readability - Only in dark theme */}
      <div className="absolute inset-0 bg-black/40 dark:opacity-100 opacity-0 transition-opacity duration-300 z-10"></div>

      {/* Dynamic gradient background overlay - Detailed Illustrations */}
      <div className="absolute inset-0 z-20 opacity-20 dark:opacity-30 transition-opacity duration-300 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient from-white/5 to-transparent opacity-50 blur-2xl"></div>
      </div>

      {/* Floating tech icons */}
      <div className="absolute inset-0 pointer-events-none z-30 hidden sm:block" aria-hidden="true">
        {techStack.map((tech, index) => (
          <div
            key={index}
            className={`floating-tech-icon absolute ${tech.color} opacity-40 dark:opacity-0 transition-opacity duration-300`}
            style={{
              right: `${10 + (index * 8)}%`,
              top: `${15 + (index % 4) * 20}%`,
              fontSize: '2.5rem'
            }}
          >
            <tech.icon aria-hidden="true" />
          </div>
        ))}
      </div>

      {/* Geometric shapes */}
      <div className="absolute inset-0 pointer-events-none z-30 hidden sm:block">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary-300/30 dark:border-primary-500/20 rotate-45 animate-rotate-slow transition-colors duration-300"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-secondary-300/30 dark:border-secondary-500/20 rotate-12 animate-pulse transition-colors duration-300"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full animate-float"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-40">
        <div ref={heroRef} className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Left side - Text content */}
            <div className="flex-1 text-left space-y-6 sm:space-y-8">
              {/* Main heading with gradient text */}
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
              <h2 ref={subtitleRef} className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-700 dark:text-gray-200 transition-colors duration-300 flex items-center gap-2">
                <span className="text-3xl">🚀</span>
                <Typewriter
                  options={{
                    strings: [
                      'AI/ML Engineer 🤖',
                      'Full Stack Developer 💻',
                      'Mobile App Developer 📱',
                      'Creative Technologist 🎨',
                      'Problem Solver 🧩'
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
                Crafting intelligent digital experiences ✨ at the intersection of{' '}
                <span className="text-primary-600 dark:text-primary-400 font-bold transition-colors duration-300">AI/ML 🧠</span>,{' '}
                <span className="text-secondary-600 dark:text-secondary-400 font-bold transition-colors duration-300">web development 🌐</span>, and{' '}
                <span className="text-primary-500 dark:text-primary-300 font-bold transition-colors duration-300">creative design 🎨</span>.
                Transforming complex ideas into elegant, user-centered solutions 💡.
              </p>

              {/* Tech highlights */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {techStack.slice(0, 4).map((tech, index) => (
                  <div
                    key={index}
                    className="group flex items-center space-x-1 sm:space-x-2 bg-white/80 dark:bg-dark-800/50 backdrop-blur-xl border border-primary-200/50 dark:border-primary-500/30 rounded-full px-2 sm:px-4 py-1.5 sm:py-2 hover:border-primary-400 dark:hover:border-primary-400 hover:shadow-royal-gold transition-all duration-300 will-change-transform"
                  >
                    <tech.icon className={`text-sm sm:text-lg ${tech.color} group-hover:scale-110 transition-transform duration-150`} />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 transition-colors duration-300">{tech.name}</span>
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
                    <Code size={18} className="sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">View My Work</span>
                  </span>
                </button>

                <ResumeButton variant="secondary" className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base" />

                <button
                  onClick={scrollToContact}
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-gray-200/50 dark:border-white/20 text-gray-800 dark:text-white font-semibold rounded-xl hover:border-gray-300 dark:hover:border-white/40 hover:shadow-xl hover:scale-105 transition-all duration-300 will-change-transform focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-white/30 active:scale-95"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Zap size={18} className="sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Let's Connect</span>
                  </span>
                </button>
              </div>

              {/* Social links */}
              <div ref={socialRef} className="flex gap-4 sm:gap-6">
                {[
                  { icon: Github, href: 'https://github.com/ectasy663', label: 'GitHub' },
                  { icon: Linkedin, href: 'https://www.linkedin.com/in/naman-singh-panwar7/', label: 'LinkedIn' },
                  { icon: Mail, href: 'mailto:namansingh4680@gmail.com', label: 'Email' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={social.label}
                    className="group p-2.5 sm:p-3 bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-gray-200/50 dark:border-white/20 rounded-xl text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/40 hover:scale-110 hover:shadow-lg transition-all duration-300 will-change-transform"
                  >
                    <social.icon size={20} className="sm:w-6 sm:h-6" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right side - Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative group cursor-pointer w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[28rem]">
                <Image
                  src="/assets/wall lean pic professional.png"
                  alt="Naman Singh Panwar - Professional"
                  fill
                  priority
                  sizes="(max-width: 640px) 16rem, (max-width: 768px) 18rem, 20rem"
                  className="object-cover rounded-2xl border-4 border-white/20 dark:border-white/10 shadow-2xl group-hover:scale-105 transition-all duration-500 group-hover:shadow-3xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <p className="text-lg font-bold mb-1">Turning ideas into reality</p>
                  <p className="text-sm text-gray-200">One line of code at a time ✨</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-12 sm:mt-16">
            <div className="flex flex-col items-center space-y-2 animate-bounce">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-200 font-medium transition-colors duration-300">Scroll to explore</span>
              <ArrowDown className="text-cyan-600 dark:text-cyan-400 transition-colors duration-300" size={20} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
