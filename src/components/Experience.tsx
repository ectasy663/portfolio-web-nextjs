'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { LuCalendar, LuBuilding, LuBriefcase } from 'react-icons/lu';
import { loadGSAP } from '@/utils/gsapLoader';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import { experiences } from '@/data/experience';

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleTextRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const exploringRef = useRef<HTMLDivElement>(null);

  useSplitTextAnimation({
    scopeRef: sectionRef,
    targetRef: titleTextRef,
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
      // === TIMELINE LINE DRAW ANIMATION ===
      if (timelineLineRef.current) {
        gsap.fromTo(timelineLineRef.current,
          {
            scaleY: 0,
            transformOrigin: "top center"
          },
          {
            scaleY: 1,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 70%",
              end: "bottom 30%",
              scrub: 1
            }
          }
        );
      }

      // === TIMELINE ITEMS STAGGERED REVEAL ===
      const timelineItems = timelineRef.current?.querySelectorAll('.timeline-item');
      if (timelineItems) {
        timelineItems.forEach((item, index) => {
          const isEven = index % 2 === 0;

          gsap.fromTo(item,
            {
              opacity: 0,
              x: isEven ? -50 : 50,
              y: 30,
              scale: 0.95
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      }

      // === TIMELINE DOTS PULSE ===
      const timelineDots = timelineRef.current?.querySelectorAll('.timeline-dot');
      if (timelineDots) {
        timelineDots.forEach((dot, index) => {
          gsap.fromTo(dot,
            {
              opacity: 0,
              scale: 0,
              rotation: -180
            },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.8,
              ease: "elastic.out(1, 0.5)",
              scrollTrigger: {
                trigger: dot,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );

          // Continuous glow pulse
          gsap.to(dot.querySelector('.dot-glow'), {
            opacity: 0.5,
            scale: 1.5,
            duration: 1.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.3
          });
        });
      }

      // === EXPERIENCE CARDS CONTENT REVEAL ===
      const cardContents = timelineRef.current?.querySelectorAll('.card-content');
      if (cardContents) {
        cardContents.forEach((content) => {
          // Role title scramble effect
          const roleEl = content.querySelector('.role-title');
          if (roleEl && roleEl.textContent) {
            const originalText = roleEl.textContent;

            ScrollTrigger.create({
              trigger: content,
              start: "top 80%",
              onEnter: () => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                let frame = 0;
                const totalFrames = 30;

                const animate = () => {
                  const progress = frame / totalFrames;
                  let result = '';

                  for (let i = 0; i < originalText.length; i++) {
                    if (originalText[i] === ' ') {
                      result += ' ';
                    } else if (i < originalText.length * progress) {
                      result += originalText[i];
                    } else {
                      result += chars[Math.floor(Math.random() * chars.length)];
                    }
                  }

                  roleEl.textContent = result;
                  frame++;

                  if (frame <= totalFrames) {
                    requestAnimationFrame(animate);
                  }
                };

                animate();
              }
            });
          }
        });
      }

      // === TYPE BADGES POP-IN ===
      const typeBadges = timelineRef.current?.querySelectorAll('.type-badge');
      if (typeBadges) {
        typeBadges.forEach((badge) => {
          gsap.set(badge, {
            opacity: 0,
            scale: 0,
            rotation: -20
          });

          gsap.to(badge, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: badge.closest('.timeline-item'),
              start: "top 75%",
              toggleActions: "play none none reverse"
            }
          });
        });
      }

      // === SHIMMER EFFECT ON HOVER ===
      const cards = timelineRef.current?.querySelectorAll('.experience-card');
      cards?.forEach((card) => {
        const shimmer = card.querySelector('.shimmer-effect');

        card.addEventListener('mouseenter', () => {
          gsap.to(shimmer, {
            x: '200%',
            duration: 0.8,
            ease: "power2.out"
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.set(shimmer, { x: '-100%' });
        });
      });

      // === EXPLORING SECTION ENTRANCE ===
      if (exploringRef.current) {
        gsap.set(exploringRef.current, {
          opacity: 0,
          y: 60,
          scale: 0.95
        });

        gsap.to(exploringRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: exploringRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      }

      // === BACKGROUND PARALLAX ===
      const overlays = sectionRef.current?.querySelectorAll('.exp-overlay');
      overlays?.forEach((el, i) => {
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

    }, sectionRef);

    return () => ctx.revert();
      } catch (error) {
        console.error('Failed to initialize Experience animations:', error);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="section-padding relative overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300">
      {/* Light theme background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:opacity-0 opacity-100 transition-opacity duration-300 z-0"></div>

      {/* Dynamic gradient background overlay */}
      <div className="absolute inset-0 z-20 opacity-10 dark:opacity-30 transition-opacity duration-300">
        <div className="exp-overlay absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-royal-purple-500/20 to-primary-500/20 rounded-full blur-3xl"></div>
        <div className="exp-overlay absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-primary-500/20 to-royal-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-30">
        <h2 ref={titleRef} className="text-display-lg font-display font-normal text-center mb-16 leading-tight py-2">
          <span ref={titleTextRef} className="gradient-text-gold" style={{ opacity: 0 }}>
            My Journey
          </span>
        </h2>

        <div ref={timelineRef} className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline line - Animated */}
            <div
              ref={timelineLineRef}
              className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-royal-purple-500 via-primary-500 to-royal-purple-500 dark:from-royal-purple-400 dark:via-primary-400 dark:to-royal-purple-400 transition-colors duration-300"
            ></div>

            {experiences.map((exp, index) => (
              <div key={index} className="timeline-item relative pl-24 pb-16 last:pb-0">
                {/* Timeline dot - Enhanced */}
                <div className="timeline-dot absolute left-0 top-0 w-14 h-14 flex items-center justify-center bg-white dark:bg-dark-900 rounded-full z-10 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] border-2 border-transparent bg-clip-padding">
                  <div className={`dot-glow absolute inset-0 rounded-full bg-gradient-to-r ${exp.color} opacity-20`}></div>
                  <div className={`absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r ${exp.color} [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)]`}></div>
                  <LuBriefcase className="w-6 h-6 text-gray-700 dark:text-gray-200 relative z-10" aria-hidden="true" />
                </div>

                {/* Content card - Enhanced */}
                <div className="experience-card card-content group relative bg-white/80 dark:bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-royal-gold transition-all duration-500 hover:-translate-y-1 overflow-hidden">

                  {/* Gradient Border Effect on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${exp.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"></div>

                  {/* Header */}
                  <div className="flex flex-col gap-3 mb-6 relative z-10">
                    <div className="flex justify-between items-start">
                      <h3 className="role-title text-xl font-body font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 pr-32">
                        {exp.role}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-royal-purple-600 dark:text-royal-purple-400 font-medium">
                        <LuBuilding size={16} aria-hidden="true" />
                        <span>{exp.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-white/5 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                        <LuCalendar size={14} aria-hidden="true" />
                        <span className="font-mono">{exp.period}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10">
                    {exp.description}
                  </p>

                  {/* Type Badge - Enhanced */}
                  <div className={`type-badge absolute top-6 right-6 px-3 py-1 text-xs font-medium tracking-wide uppercase bg-gradient-to-r ${exp.color} text-white rounded-full shadow-md transform group-hover:scale-105 transition-transform duration-300`}>
                    {exp.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional info - Enhanced */}
        <div ref={exploringRef} className="mt-20 text-center">
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/20 dark:border-white/10 max-w-4xl mx-auto shadow-lg hover:shadow-royal-purple-glow transition-all duration-500 group">
            <h3 className="text-xl font-bold mb-4">
              <span className="gradient-text-gold">
                Currently Exploring
              </span>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
              Advanced AI/ML research, cloud computing platforms, and cutting-edge technologies
              that can revolutionize how we approach complex problem-solving in various industries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Experience);
