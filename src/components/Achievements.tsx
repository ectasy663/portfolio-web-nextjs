'use client';

import React, { useEffect, useRef } from 'react';
import { LuStar } from 'react-icons/lu';
import { loadGSAP } from '@/utils/gsapLoader';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import { achievements } from '@/data/achievements';
import { useInViewOnce } from '@/hooks/useInViewOnce';

const Achievements: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  const shouldAnimate = useInViewOnce(sectionRef, { rootMargin: '600px', threshold: 0.1 });

  useSplitTextAnimation({
    scopeRef: sectionRef,
    targetRef: titleRef,
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
      // === ACHIEVEMENT CARDS STAGGERED 3D ENTRANCE ===
      const achievementCards = achievementsRef.current?.querySelectorAll('.achievement-card');
      if (achievementCards) {
        achievementCards.forEach((card, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          const delay = (row + col) * 0.05;

          gsap.fromTo(card,
            {
              opacity: 0,
              scale: 0.8,
              rotationY: -30,
              transformPerspective: 1500
            },
            {
              opacity: 1,
              scale: 1,
              rotationY: 0,
              duration: 0.8,
              delay: delay,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: achievementsRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      }

      // === RANK BADGES POP-IN ===
      const rankBadges = achievementsRef.current?.querySelectorAll('.rank-badge');
      if (rankBadges) {
        rankBadges.forEach((badge, index) => {
          gsap.fromTo(badge,
            {
              opacity: 0,
              scale: 0,
              rotation: -180
            },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.5,
              delay: 0.1 + index * 0.05,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: badge.closest('.achievement-card'),
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      }

      // === ACHIEVEMENT ICONS GLOW PULSE ===
      const achievementIcons = achievementsRef.current?.querySelectorAll('.achievement-icon');
      achievementIcons?.forEach((icon, index) => {
        gsap.to(icon, {
          boxShadow: "0 0 20px rgba(255, 215, 0, 0.4)",
          duration: 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: index * 0.3
        });
      });

      // === DECORATIVE STARS TWINKLE ===
      const decorativeStars = achievementsRef.current?.querySelectorAll('.decorative-star');
      decorativeStars?.forEach((star, index) => {
        gsap.to(star, {
          opacity: gsap.utils.random(0.3, 1),
          scale: gsap.utils.random(0.8, 1.2),
          rotation: gsap.utils.random(-20, 20),
          duration: 1 + Math.random() * 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: index * 0.2
        });
      });

      // === STATS COUNTER ANIMATION ===
      const stats = statsRef.current?.querySelectorAll('.stat-item');
      if (stats) {
        stats.forEach((stat, index) => {
          const numberEl = stat.querySelector('.stat-number');
          const labelEl = stat.querySelector('.stat-label');

          gsap.set(stat, {
            opacity: 0,
            y: 50,
            scale: 0.8
          });

          gsap.to(stat, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.15,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          });

          // Counter animation for numbers
          if (numberEl && numberEl.textContent) {
            const originalText = numberEl.textContent;
            const numericMatch = originalText.match(/[\d.]+/);
            const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;
            const prefix = originalText.charAt(0) === '<' ? '< ' : '';
            const suffix = originalText.includes('+') ? '+' : originalText.includes('%') ? '%' : originalText.includes('K') ? 'K+' : '';

            ScrollTrigger.create({
              trigger: stat,
              start: "top 85%",
              onEnter: () => {
                const counter = { value: 0 };
                gsap.to(counter, {
                  value: numericValue,
                  duration: 2,
                  delay: index * 0.2,
                  ease: "power2.out",
                  onUpdate: () => {
                    if (numericValue < 10) {
                      (numberEl as HTMLElement).textContent = `${prefix}${counter.value.toFixed(0)}${suffix}`;
                    } else {
                      (numberEl as HTMLElement).textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
                    }
                  },
                  onComplete: () => {
                    (numberEl as HTMLElement).textContent = originalText;
                  }
                });
              }
            });
          }
        });
      }

      // === QUOTE SECTION ENTRANCE ===
      if (quoteRef.current) {
        const quote = quoteRef.current.querySelector('blockquote');
        const author = quoteRef.current.querySelector('.quote-author');

        gsap.set(quoteRef.current, {
          opacity: 0,
          y: 60,
          scale: 0.95
        });

        gsap.to(quoteRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });

        // Quote text scramble effect
        if (quote && quote.textContent) {
          const originalText = quote.textContent;

          ScrollTrigger.create({
            trigger: quoteRef.current,
            start: "top 80%",
            onEnter: () => {
              const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
              let frame = 0;
              const totalFrames = 60;

              const animate = () => {
                const progress = frame / totalFrames;
                let result = '';

                for (let i = 0; i < originalText.length; i++) {
                  if (originalText[i] === ' ' || originalText[i] === '"' || originalText[i] === '"') {
                    result += originalText[i];
                  } else if (i < originalText.length * progress) {
                    result += originalText[i];
                  } else {
                    result += chars[Math.floor(Math.random() * chars.length)];
                  }
                }

                quote.textContent = result;
                frame++;

                if (frame <= totalFrames) {
                  requestAnimationFrame(animate);
                }
              };

              animate();
            }
          });
        }
      }

      // === BACKGROUND PARALLAX ===
      const overlays = sectionRef.current?.querySelectorAll('.ach-overlay');
      overlays?.forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -70 : -40,
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
      } catch (error) {
        console.error('Failed to initialize Achievements animations:', error);
      }
    };

    init();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [shouldAnimate]);

  return (
    <section ref={sectionRef} id="achievements" className="section-padding bg-gray-50 dark:bg-transparent relative overflow-hidden transition-colors duration-300">
      {/* Light theme background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-yellow-50 dark:opacity-0 opacity-100 transition-opacity duration-300 z-0"></div>

      {/* Dynamic gradient background overlay */}
      <div className="absolute inset-0 z-10 opacity-10 dark:opacity-30 transition-opacity duration-300">
        <div className="ach-overlay absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-500/20 to-royal-purple-500/20 rounded-full blur-3xl"></div>
        <div className="ach-overlay absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-royal-purple-500/20 to-primary-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-20">
        <h2
          ref={titleRef}
          className="text-5xl xs:text-6xl sm:text-6xl md:text-7xl font-display text-center mb-16 gradient-text-gold leading-[1.2] pt-2 pb-5 overflow-visible"
          style={{ opacity: 0 }}
        >
          Awards & Recognition
        </h2>

        <div ref={achievementsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="achievement-card card-hover bg-white/80 dark:bg-dark-800/50 backdrop-blur-xl p-6 rounded-xl border border-primary-200/50 dark:border-primary-500/30 relative overflow-hidden shadow-lg hover:shadow-royal-gold transition-all duration-300"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Background pattern */}
              <div className={`absolute inset-0 bg-gradient-to-br ${achievement.bgColor} opacity-50`}></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon and rank */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`achievement-icon inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-lg`}>
                    <achievement.icon className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <div className={`rank-badge px-3 py-1 bg-gradient-to-r ${achievement.color} text-white text-xs font-bold rounded-full`}>
                    {achievement.rank}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-2">
                  {achievement.title}
                </h3>

                {/* Event */}
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">
                  {achievement.event}
                </p>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {achievement.description}
                </p>

                {/* Decorative elements */}
                <div className="decorative-star absolute top-4 right-4 opacity-20">
                  <LuStar className={`w-8 h-8 text-gradient-to-r ${achievement.color}`} aria-hidden="true" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="stat-item text-center">
            <div className="stat-number text-4xl sm:text-5xl md:text-6xl font-bold gradient-text-gold mb-2">3+</div>
            <p className="stat-label text-gray-600 dark:text-gray-400">Major Awards</p>
          </div>
          <div className="stat-item text-center">
            <div className="stat-number text-4xl sm:text-5xl md:text-6xl font-bold gradient-text-gold mb-2">25K+</div>
            <p className="stat-label text-gray-600 dark:text-gray-400">Participants Competed</p>
          </div>
          <div className="stat-item text-center">
            <div className="stat-number text-4xl sm:text-5xl md:text-6xl font-bold gradient-text-gold mb-2">Top 20%</div>
            <p className="stat-label text-gray-600 dark:text-gray-400">National Ranking</p>
          </div>
          <div className="stat-item text-center">
            <div className="stat-number text-4xl sm:text-5xl md:text-6xl font-bold gradient-text-gold mb-2">4+</div>
            <p className="stat-label text-gray-600 dark:text-gray-400">Tech Giants Recognition</p>
          </div>
        </div>

        {/* Quote section */}
        <div ref={quoteRef} className="mt-16 text-center">
          <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl p-8 rounded-xl border border-gray-200/50 dark:border-white/20 max-w-4xl mx-auto shadow-lg hover:shadow-2xl transition-all duration-300">
            <blockquote className="text-2xl sm:text-3xl md:text-4xl text-gray-700 dark:text-gray-300 italic mb-4">
              &quot;Success is not final, failure is not fatal: it is the courage to continue that counts.&quot;
            </blockquote>
            <p className="quote-author text-gray-600 dark:text-gray-400">
              — Winston Churchill
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Achievements);
