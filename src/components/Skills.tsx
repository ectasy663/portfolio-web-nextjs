'use client';

import React, { useEffect, useRef } from 'react';
import { loadGSAP } from '@/utils/gsapLoader';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import { skillCategories } from '@/data/skills';
import { useInViewOnce } from '@/hooks/useInViewOnce';

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleTextRef = useRef<HTMLSpanElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const learningRef = useRef<HTMLDivElement>(null);

  const shouldAnimate = useInViewOnce(sectionRef, { rootMargin: '600px', threshold: 0.1 });

  useSplitTextAnimation({
    scopeRef: sectionRef,
    targetRef: titleTextRef,
    enabled: shouldAnimate,
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!shouldAnimate) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    const init = async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGSAP();
        if (cancelled) return;

        ctx = gsap.context(() => {
      // === SKILL CARDS 3D FLIP ENTRANCE ===
      const skillCards = skillsRef.current?.querySelectorAll('.skill-card');
      if (skillCards) {
        gsap.fromTo(skillCards,
          {
            opacity: 0,
            rotationY: 90,
            transformPerspective: 1500,
            transformOrigin: "left center"
          },
          {
            opacity: 1,
            rotationY: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: skillsRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // === INDIVIDUAL SKILL ITEMS STAGGER ===
      const skillItems = skillsRef.current?.querySelectorAll('.skill-item');
      if (skillItems) {
        skillItems.forEach((item, index) => {
          gsap.fromTo(item,
            {
              opacity: 0,
              x: -30,
              scale: 0.9
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.6,
              delay: index * 0.05,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item.closest('.skill-card'),
                start: "top 70%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      }

      // === SKILL ICONS HOVER MAGNETIC EFFECT ===
      const skillIcons = skillsRef.current?.querySelectorAll('.skill-icon');
      skillIcons?.forEach((icon) => {
        const iconEl = icon as HTMLElement;

        iconEl.addEventListener('mouseenter', () => {
          gsap.to(iconEl, {
            scale: 1.3,
            rotation: 360,
            duration: 0.5,
            ease: "back.out(1.7)"
          });
        });

        iconEl.addEventListener('mouseleave', () => {
          gsap.to(iconEl, {
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "power2.out"
          });
        });
      });

      // === LEARNING BADGES WAVE ANIMATION ===
      const learningBadges = learningRef.current?.querySelectorAll('.learning-badge');
      if (learningBadges) {
        gsap.fromTo(learningBadges,
          {
            opacity: 0,
            y: 20,
            scale: 0.8
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: {
              each: 0.08,
              from: "start"
            },
            ease: "power3.out",
            scrollTrigger: {
              trigger: learningRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Continuous gentle float
        learningBadges.forEach((badge, index) => {
          gsap.to(badge, {
            y: "+=3",
            duration: 2 + index * 0.2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.15
          });
        });
      }

      // === BACKGROUND PARALLAX ===
      if (sectionRef.current) {
        const overlays = sectionRef.current.querySelectorAll('.skills-overlay');
        overlays.forEach((el, i) => {
          gsap.to(el, {
            y: i % 2 === 0 ? -80 : -50,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          });
        });
      }
      }, sectionRef);
      } catch (error) {
        console.error('Failed to initialize Skills animations:', error);
      }
    };

    init();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [shouldAnimate]);

  return (
    <section ref={sectionRef} id="skills" className="video-scrub-section section-padding relative overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300 scroll-mt-28">


      {/* Light theme background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:opacity-0 opacity-100 transition-opacity duration-300 z-[3]"></div>

      {/* Dynamic gradient background overlay */}
      <div className="absolute inset-0 z-[4] opacity-10 dark:opacity-30 transition-opacity duration-300">
        <div className="skills-overlay absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-royal-blue-500/20 to-royal-purple-500/20 rounded-full blur-3xl"></div>
        <div className="skills-overlay absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-royal-purple-500/20 to-royal-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-grid-pattern opacity-3 dark:opacity-5 z-[5] transition-opacity duration-300"></div>

      <div className="video-scrub-content container relative z-[10]">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-display-lg font-display font-normal mb-6 leading-tight py-2">
            <span ref={titleTextRef} className="gradient-text-gold transition-colors duration-300" style={{ opacity: 0 }}>
              Technical Skills
            </span>
          </h2>
          <p className="text-body-lg text-gray-700 dark:text-gray-200 max-w-3xl mx-auto transition-colors duration-300">
            Mastering cutting-edge technologies to build innovative solutions
          </p>
        </div>

        <div ref={skillsRef} className="grid lg:grid-cols-2 gap-8 mb-16">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="skill-card group relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glass morphism card */}
              <div className="relative glass-panel rounded-2xl p-8 hover:border-primary-400 dark:hover:border-primary-400 transition-all duration-500 shadow-lg hover:shadow-royal-gold hover:bg-white/95 dark:hover:bg-dark-800/80">
                {/* Gradient border effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}></div>

                {/* Header */}
                <div className="flex items-center space-x-4 mb-8">
                  <div className="skill-icon text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text transition-colors duration-300 cursor-pointer">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-body font-medium text-gray-900 dark:text-white transition-colors duration-300">
                    {category.title}
                  </h3>
                </div>

                {/* Skills grid */}
                <div className="grid grid-cols-1 gap-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="skill-item group/skill relative bg-white/80 dark:bg-dark-900/50 rounded-xl p-4 hover:bg-white dark:hover:bg-dark-900/80 transition-all duration-300 hover:scale-105 border border-primary-200/30 dark:border-primary-500/20 backdrop-blur-sm"
                    >
                      {/* Skill icon, name and evidence badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="skill-icon group-hover/skill:scale-110 transition-transform duration-300 cursor-pointer">
                            {skill.icon}
                          </div>
                          <span className="text-body-sm font-body text-gray-800 dark:text-gray-200 group-hover/skill:text-gray-900 dark:group-hover/skill:text-white transition-colors duration-300 font-medium">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-md font-mono bg-primary-500/10 text-primary-600 dark:text-primary-300 border border-primary-500/20 whitespace-nowrap">
                          {skill.evidence}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tech stack highlights */}
        <div ref={learningRef} className="glass-panel rounded-3xl px-6 py-8 sm:px-10 sm:py-10 border border-primary-200/50 dark:border-primary-500/30 shadow-lg hover:shadow-royal-gold transition-all duration-300 w-full overflow-hidden">
          <h3 className="text-heading-lg font-heading text-center mb-6">
            <span className="gradient-text-gold">
              Currently Learning
            </span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 items-stretch">
            {[
              { name: "Cloud Computing", color: "dark:from-primary-400 dark:to-secondary-600 from-primary-500 to-primary-600" },
              { name: "WebGL", color: "dark:from-secondary-400 dark:to-primary-600 from-primary-500 to-primary-600" },
              { name: "Blockchain", color: "dark:from-primary-400 dark:to-primary-600 from-primary-500 to-primary-600" },
              { name: "Cloud Native", color: "dark:from-secondary-400 dark:to-secondary-600 from-primary-500 to-primary-600" },
              { name: "Edge Computing", color: "dark:from-primary-400 dark:to-secondary-600 from-primary-500 to-primary-600" },
              { name: "Quantum ML", color: "dark:from-secondary-400 dark:to-primary-600 from-primary-500 to-primary-600" }
            ].map((tech, index) => (
              <div
                key={index}
                className="learning-badge group flex w-full items-center justify-center bg-white/70 dark:bg-dark-900/50 backdrop-blur-md rounded-xl px-4 py-3 border border-primary-200/50 dark:border-primary-500/20 hover:border-primary-400 dark:hover:border-primary-400 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-royal-gold cursor-pointer"
              >
                <span className={`font-heading font-medium text-transparent bg-gradient-to-r ${tech.color} bg-clip-text`}>
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Skills);
