'use client';

import React, { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { loadGSAP } from '@/utils/gsapLoader';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import { strengths } from '@/data/about';
import { LuRocket, LuGraduationCap, LuBot, LuBookOpen, LuShield, LuBanknote, LuStar } from 'react-icons/lu';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const strengthsRef = useRef<HTMLDivElement>(null);
  const strengthsTitleRef = useRef<HTMLHeadingElement>(null);

  useSplitTextAnimation({
    scopeRef: sectionRef,
    targetRef: titleRef,
    desktop: {
      duration: 1,
      stagger: 0.04,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      from: {
        y: 28
      }
    },
    mobile: {
      duration: 0.9,
      stagger: 0.035,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      from: {
        y: 20
      }
    }
  });

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;

    const init = async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGSAP();
        if (cancelled) return;

        const ctx = gsap.context(() => {
      // === IMAGE 3D ENTRANCE ===
      if (imageRef.current) {
        gsap.fromTo(imageRef.current,
          {
            opacity: 0,
            x: -100,
            rotateY: -45,
            transformPerspective: 1500
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger: {
              trigger: imageRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // 3D tilt on hover
        const imageContainer = imageRef.current.querySelector('.image-container');
        if (imageContainer) {
          imageContainer.addEventListener('mouseenter', () => {
            gsap.to(imageContainer, {
              scale: 1.02,
              duration: 0.3,
              ease: "power2.out"
            });
          });

          imageContainer.addEventListener('mouseleave', () => {
            gsap.to(imageContainer, {
              scale: 1,
              rotateX: 0,
              rotateY: 0,
              duration: 0.5,
              ease: "power2.out"
            });
          });

          imageContainer.addEventListener('mousemove', (e: Event) => {
            const mouseEvent = e as MouseEvent;
            const rect = (imageContainer as HTMLElement).getBoundingClientRect();
            const x = mouseEvent.clientX - rect.left;
            const y = mouseEvent.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;

            gsap.to(imageContainer, {
              rotateX: rotateX,
              rotateY: rotateY,
              transformPerspective: 1000,
              duration: 0.3,
              ease: "power2.out"
            });
          });
        }
      }

      // === CONTENT PARAGRAPHS WORD-BY-WORD REVEAL ===
      if (contentRef.current) {
        const paragraphs = contentRef.current.querySelectorAll('p');

        paragraphs.forEach((p, pIndex) => {
          gsap.fromTo(p,
            {
              opacity: 0,
              y: 30
            },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              delay: pIndex * 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: p,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      }

      // === STRENGTHS TITLE SPLIT TEXT ===
      if (strengthsTitleRef.current && strengthsTitleRef.current.textContent) {
        const text = strengthsTitleRef.current.textContent;
        strengthsTitleRef.current.innerHTML = '';

        text.split('').forEach((char) => {
          const span = document.createElement('span');
          span.className = 'str-title-char inline-block';
          span.style.display = 'inline-block';
          span.textContent = char === ' ' ? '\u00A0' : char;
          strengthsTitleRef.current?.appendChild(span);
        });

        const chars = strengthsTitleRef.current.querySelectorAll('.str-title-char');

        gsap.fromTo(chars,
          {
            opacity: 0,
            scale: 0,
            rotation: gsap.utils.random(-45, 45, true)
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            stagger: 0.03,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: strengthsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // === STRENGTH CARDS 3D FLIP REVEAL ===
      const strengthCards = strengthsRef.current?.querySelectorAll('.strength-card');
      if (strengthCards) {
        strengthCards.forEach((card, index) => {
          gsap.fromTo(card,
            {
              opacity: 0,
              rotationX: -90,
              y: 100,
              transformPerspective: 1500,
              transformOrigin: "top center"
            },
            {
              opacity: 1,
              rotationX: 0,
              y: 0,
              duration: 1,
              delay: index * 0.15,
              ease: "back.out(1.2)",
              scrollTrigger: {
                trigger: strengthsRef.current,
                start: "top 70%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      }

      // === STRENGTH ICONS MAGNETIC HOVER ===
      const strengthIcons = strengthsRef.current?.querySelectorAll('.strength-icon');
      strengthIcons?.forEach((icon) => {
        const iconEl = icon as HTMLElement;

        iconEl.addEventListener('mouseenter', () => {
          gsap.to(iconEl, {
            rotation: 360,
            scale: 1.2,
            duration: 0.6,
            ease: "back.out(1.7)"
          });
        });

        iconEl.addEventListener('mouseleave', () => {
          gsap.to(iconEl, {
            rotation: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
          });
        });
      });

      // === BACKGROUND PARALLAX ===
      if (sectionRef.current) {
        const overlayBubbles = sectionRef.current.querySelectorAll('.about-overlay');
        overlayBubbles.forEach((el, i) => {
          gsap.to(el, {
            y: i % 2 === 0 ? -80 : -50,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5
            }
          });
        });
      }

        }, sectionRef);

        return () => ctx.revert();
      } catch (error) {
        console.error('Failed to initialize About animations:', error);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="section-padding relative overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300">
      {/* Background Video - Only visible in dark theme */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-0 dark:opacity-100 transition-opacity duration-300 will-change-transform dark:brightness-75 dark:contrast-125"
        style={{
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1.08)'
        }}
        aria-hidden="true"
      >
        <source src="/videos/metaverse.mp4" type="video/mp4" />
      </video>

      {/* Light theme background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:opacity-0 opacity-100 transition-opacity duration-300 z-0"></div>

      {/* Video overlay for better text readability - Only in dark theme */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70 backdrop-blur-[2px] dark:opacity-100 opacity-0 transition-opacity duration-300 z-10"></div>

      {/* Dynamic gradient background overlay */}
      <div className="absolute inset-0 z-20 opacity-10 dark:opacity-30 transition-opacity duration-300">
        <div className="about-overlay absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-royal-blue-500/20 to-primary-500/20 rounded-full blur-3xl"></div>
        <div className="about-overlay absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-primary-500/20 to-royal-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-30">
        <h2
          ref={titleRef}
          className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-display font-normal text-center mb-16 gradient-text-gold leading-tight py-2 transition-colors duration-300"
          style={{ opacity: 0 }}
        >
          About Me
        </h2>

        {/* Centered Content */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Left side - Professional Image - Enhanced 3D */}
            <div ref={imageRef} className="flex-shrink-0" style={{ perspective: '1500px' }}>
              <div className="image-container relative group cursor-pointer w-80 h-[24rem] sm:w-96 sm:h-[28rem] md:w-[26rem] md:h-[32rem]" style={{ transformStyle: 'preserve-3d' }}>
                <Image
                  src="/assets/black and white different pose.png"
                  alt="Naman Singh Panwar - Professional Style"
                  fill
                  sizes="(max-width: 640px) 16rem, (max-width: 768px) 18rem, 20rem"
                  className="object-cover rounded-2xl shadow-xl group-hover:scale-105 transition-all duration-500 group-hover:shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-20">
                  <p className="text-lg font-bold mb-1">Driven by passion</p>
                  <p className="text-sm text-gray-200 flex items-center gap-2">Building the future with code <LuRocket className="w-4 h-4 text-orange-400" /></p>
                </div>
              </div>
            </div>

            {/* Right side - Text content */}
            <div className="flex-1 text-left">
              <div ref={contentRef} className="space-y-8">
                <div className="prose prose-xl lg:prose-2xl dark:prose-invert">
                  <p className="text-body-lg font-body font-normal text-gray-700 dark:text-gray-100 leading-[1.8] transition-colors duration-300">
                    I'm a passionate and driven Computer Science student with a deep fascination for Artificial Intelligence
                    and its power to solve real-world problems. My journey is fueled by a constant curiosity to learn and a
                    desire to build things that matter.
                  </p>
                  <p className="text-body-lg font-body font-normal text-gray-700 dark:text-gray-100 leading-[1.8] transition-colors duration-300">
                    From contributing to national defense projects at DRDO to innovating in the FinTech space, I thrive on
                    challenges that push the boundaries of technology. My goal is to not just write code, but to architect
                    elegant, efficient, and intelligent systems that leave a lasting impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Strengths - Enhanced */}
        <div ref={strengthsRef} className="mt-24">
          <h3
            ref={strengthsTitleRef}
            className="text-heading-lg font-display font-normal text-center mb-16 gradient-text-gold transition-colors duration-300"
          >
            Key Strengths
          </h3>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {strengths.map((strength, index) => (
              <div
                key={index}
                className="strength-card glass-panel p-8 rounded-xl border border-primary-200/50 dark:border-primary-500/30 text-center card-hover shadow-lg hover:shadow-royal-gold hover:bg-white/95 dark:hover:bg-dark-800/80 transition-all duration-300"
                style={{
                  transformStyle: 'preserve-3d',
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="strength-icon inline-flex items-center justify-center w-20 h-20 bg-primary-50 dark:bg-primary-900/20 backdrop-blur-sm rounded-lg mb-6 cursor-pointer" style={{ transition: 'transform 0.2s ease-out' }}>
                  <strength.icon className="w-10 h-10 text-primary-600 dark:text-primary-400 transition-colors duration-300" />
                </div>
                <h4 className="text-lg font-body font-medium mb-6 text-gray-800 dark:text-white transition-colors duration-300">
                  {strength.title}
                </h4>
                <p className="text-body-md text-gray-600 dark:text-gray-200 leading-relaxed transition-colors duration-300">
                  {strength.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(About);
