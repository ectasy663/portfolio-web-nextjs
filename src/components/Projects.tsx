'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import { LuExternalLink, LuGithub, LuArrowRight, LuStar, LuEye, LuGitFork, LuCalendar, LuCode, LuSparkles } from 'react-icons/lu';
import { loadGSAP } from '@/utils/gsapLoader';
import { scrollToId } from '@/utils/scroll';
import {
  SiReact, SiTypescript, SiTailwindcss, SiSupabase, SiJavascript,
  SiCss3, SiHtml5, SiNodedotjs, SiPython, SiGit, SiSolana
} from 'react-icons/si';

import { projects } from '@/data/projects';

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleTextRef = useRef<HTMLSpanElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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
      // === FEATURED BADGE ENTRANCE ===
      const featuredBadge = sectionRef.current?.querySelector('.featured-badge');
      if (featuredBadge) {
        gsap.fromTo(featuredBadge,
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
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // === PROJECT CARDS CINEMATIC REVEAL ===
      const projectCards = projectsRef.current?.querySelectorAll('.project-card');
      if (projectCards) {
        projectCards.forEach((card, index) => {
          const isEven = index % 2 === 0;

          gsap.fromTo(card,
            {
              opacity: 0,
              y: 50,
              x: isEven ? -50 : 50,
              rotationY: isEven ? -15 : 15,
              transformPerspective: 1500
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              rotationY: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      }

      // === PROJECT IMAGE CONTAINERS - ENHANCED 3D TILT ===
      const tiltContainers = projectsRef.current?.querySelectorAll('.tilt-container');
      tiltContainers?.forEach((container) => {
        const containerEl = container as HTMLElement;

        containerEl.addEventListener('mouseenter', () => {
          gsap.to(containerEl, {
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        containerEl.addEventListener('mouseleave', () => {
          gsap.to(containerEl, {
            scale: 1,
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: "power2.out"
          });
        });

        containerEl.addEventListener('mousemove', (e: MouseEvent) => {
          const rect = containerEl.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (y - centerY) / centerY * -15;
          const rotateY = (x - centerX) / centerX * 15;

          gsap.to(containerEl, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });

      // === TECH STACK BADGES WAVE ANIMATION ===
      const techBadges = projectsRef.current?.querySelectorAll('.tech-badge');
      if (techBadges) {
        techBadges.forEach((badge, index) => {
          gsap.set(badge, {
            opacity: 0,
            scale: 0.5,
            y: 20
          });

          ScrollTrigger.create({
            trigger: badge.closest('.project-card'),
            start: "top 70%",
            onEnter: () => {
              gsap.to(badge, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.5,
                delay: index * 0.05,
                ease: "back.out(1.7)"
              });
            },
            onLeaveBack: () => {
              gsap.to(badge, {
                opacity: 0,
                scale: 0.5,
                y: 20,
                duration: 0.3
              });
            }
          });
        });
      }

      // === FEATURE ITEMS STAGGER REVEAL ===
      const featureItems = projectsRef.current?.querySelectorAll('.feature-item');
      if (featureItems) {
        featureItems.forEach((item) => {
          gsap.set(item, {
            opacity: 0,
            x: -20,
            scale: 0.9
          });

          ScrollTrigger.create({
            trigger: item.closest('.project-card'),
            start: "top 65%",
            onEnter: () => {
              gsap.to(item, {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.6,
                ease: "power3.out"
              });
            },
            onLeaveBack: () => {
              gsap.to(item, {
                opacity: 0,
                x: -20,
                scale: 0.9,
                duration: 0.3
              });
            }
          });
        });
      }

      // === PROJECT STATS COUNTER ANIMATION ===
      const stats = projectsRef.current?.querySelectorAll('.stat-number');
      stats?.forEach((stat) => {
        const statEl = stat as HTMLElement;
        const originalText = statEl.textContent || '0';
        const numericValue = parseInt(originalText.replace(/\D/g, '')) || 0;

        ScrollTrigger.create({
          trigger: stat.closest('.project-card'),
          start: "top 70%",
          onEnter: () => {
            const counter = { value: 0 };
            gsap.to(counter, {
              value: numericValue,
              duration: 1.5,
              ease: "power2.out",
              onUpdate: () => {
                statEl.textContent = Math.round(counter.value).toString();
              },
              onComplete: () => {
                statEl.textContent = originalText;
              }
            });
          }
        });
      });

      // === CTA SECTION ENTRANCE ===
      if (ctaRef.current) {
        gsap.set(ctaRef.current, {
          opacity: 0,
          y: 60,
          scale: 0.95
        });

        gsap.to(ctaRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      }

      // === BACKGROUND PARALLAX ===
      const bgElements = sectionRef.current?.querySelectorAll('.bg-parallax');
      bgElements?.forEach((el, i) => {
        gsap.to(el, {
          y: (i + 1) * -50,
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
        console.error('Failed to initialize Projects animations:', error);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  const getTechIcon = (tech: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      'React': <SiReact className="text-cyan-400" aria-hidden="true" />,
      'TypeScript': <SiTypescript className="text-blue-400" aria-hidden="true" />,
      'JavaScript': <SiJavascript className="text-yellow-400" aria-hidden="true" />,
      'Tailwind CSS': <SiTailwindcss className="text-teal-400" aria-hidden="true" />,
      'CSS': <SiCss3 className="text-blue-500" aria-hidden="true" />,
      'HTML': <SiHtml5 className="text-orange-500" aria-hidden="true" />,
      'Supabase': <SiSupabase className="text-emerald-400" aria-hidden="true" />,
      'Node.js': <SiNodedotjs className="text-green-500" aria-hidden="true" />,
      'Python': <SiPython className="text-yellow-400" aria-hidden="true" />,
      'Git': <SiGit className="text-orange-500" aria-hidden="true" />,
      'Solana Web3.js': <SiSolana className="text-purple-400" aria-hidden="true" />
    };
    return iconMap[tech] || <LuCode className="text-gray-600 dark:text-gray-400" aria-hidden="true" />;
  };

  return (
    <section ref={sectionRef} id="projects" className="section-padding relative overflow-hidden bg-white dark:bg-dark-950">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" aria-hidden="true"></div>
      <div className="bg-parallax absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-royal-red-500/10 to-primary-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
      <div className="bg-parallax absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-500/10 to-royal-red-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="featured-badge inline-flex items-center space-x-2 bg-gradient-to-r from-royal-red-500/20 to-primary-500/20 backdrop-blur-sm border border-royal-red-500/30 dark:border-royal-red-500/30 rounded-full px-6 py-2 mb-6">
            <LuSparkles className="text-royal-red-400" size={18} aria-hidden="true" />
            <span className="text-royal-red-400 font-medium">Featured Work</span>
          </div>

          <h2 ref={titleRef} className="text-display-lg font-display mb-6 leading-tight py-2">
            <span ref={titleTextRef} className="gradient-text-gold" style={{ opacity: 0 }}>
              Project Showcase
            </span>
          </h2>

          <p className="text-body-lg text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
            Innovative solutions crafted with cutting-edge technologies and meticulous attention to detail
          </p>
        </div>

        {/* Projects Grid */}
        <div ref={projectsRef} className="space-y-20">
          {projects.map((project, index) => (
            <div
              key={index}
              className="project-card group relative"
              style={{ isolation: 'isolate', transformStyle: 'preserve-3d' }}
            >
              <div className={`grid lg:grid-cols-12 gap-8 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}>

                {/* Project Visual */}
                <div className={`lg:col-span-7 ${index % 2 === 1 ? 'lg:col-start-6' : ''} relative z-0 lg:z-10 pointer-events-none lg:pointer-events-auto`}>
                  <div
                    className="tilt-container pointer-events-none lg:pointer-events-auto"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="relative group overflow-hidden rounded-2xl">
                      {/* Main project showcase */}
                      <div
                        className={`aspect-video bg-gradient-to-br ${project.gradient} rounded-2xl relative overflow-hidden`}
                      >
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>

                        {/* Mock browser/app interface */}
                        <div className="absolute inset-4 bg-dark-900/90 backdrop-blur-xl rounded-xl border border-primary-500/20 overflow-hidden">
                          {/* Browser bar */}
                          <div className="flex items-center justify-between p-4 border-b border-primary-500/20">
                            <div className="flex space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">{project.liveUrl.replace('https://', '')}</div>
                          </div>

                          {/* Content area with floating tech icons */}
                          <div className="p-6 space-y-4">
                            <div className="flex items-center space-x-3">
                              {project.techStack.slice(0, 4).map((tech, techIndex) => (
                                <div
                                  key={techIndex}
                                  className="flex items-center space-x-2 bg-white/5 rounded-lg px-3 py-1.5 hover:bg-white/10 transition-colors"
                                >
                                  <div className="text-lg">{getTechIcon(tech)}</div>
                                  <span className="text-xs text-gray-300">{tech}</span>
                                </div>
                              ))}
                            </div>

                            {/* Code-like representation */}
                            <div className="space-y-2 font-mono text-xs">
                              <div className="text-primary-400">const project = {'{'}</div>
                              <div className="text-gray-600 dark:text-gray-400 ml-4">name: <span className="text-secondary-400">&quot;{project.title}&quot;</span>,</div>
                              <div className="text-gray-600 dark:text-gray-400 ml-4">status: <span className="text-primary-300">&quot;{project.status}&quot;</span>,</div>
                              <div className="text-gray-600 dark:text-gray-400 ml-4">category: <span className="text-secondary-300">&quot;{project.category}&quot;</span></div>
                              <div className="text-primary-400">{'};'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 hidden lg:flex items-center justify-center backdrop-blur-sm z-50">
                          <div className="flex space-x-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                            {project.liveUrl !== "#" && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-600 text-white px-6 py-3 rounded-xl hover:shadow-royal-gold transition-all duration-300 hover:scale-105 active:scale-95"
                              >
                                <LuExternalLink size={18} />
                                <span>Live Demo</span>
                              </a>
                            )}
                            {project.githubUrl !== "#" && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 bg-dark-800/80 backdrop-blur-sm border border-primary-500/30 text-white px-6 py-3 rounded-xl hover:border-primary-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
                              >
                                <LuGithub size={18} />
                                <span>Source</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className={`lg:col-span-5 space-y-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''} relative z-50 lg:z-20`}>
                  {/* Project meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 bg-gradient-to-r ${project.gradient} text-white text-sm font-medium rounded-full`}>
                        {project.category}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-sm">
                        <LuCalendar size={14} />
                        <span>{project.date}</span>
                      </div>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'Live Production' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      project.status === 'Active' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                      {project.status}
                    </div>
                  </div>

                  {/* Title and tagline */}
                  <div>
                    <h3 className="text-heading-lg font-heading text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary-400 group-hover:to-secondary-500 group-hover:bg-clip-text transition-all duration-300">
                      {project.title}
                    </h3>
                    <p className={`text-body-md font-heading bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                      {project.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-body-md text-gray-700 dark:text-gray-400 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Features grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {project.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="feature-item flex items-center space-x-3 bg-white/80 dark:bg-dark-800/50 backdrop-blur-xl border border-royal-red-200/50 dark:border-royal-red-500/20 rounded-lg p-3 hover:border-royal-red-400 dark:hover:border-royal-red-400 hover:shadow-lg transition-all duration-300"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Built with</h4>
                    <div className="flex flex-wrap gap-3">
                      {project.techStack.map((tech, techIndex) => (
                        <div
                          key={techIndex}
                          className="tech-badge flex items-center space-x-2 bg-white/80 dark:bg-dark-800/50 backdrop-blur-xl border border-royal-red-200/50 dark:border-royal-red-500/20 rounded-lg px-4 py-2 hover:border-royal-red-400 dark:hover:border-royal-red-400 hover:scale-105 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="text-lg">{getTechIcon(tech)}</div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project stats */}
                  <div className="flex items-center space-x-6 pt-4 border-t border-gray-300/50 dark:border-gray-700/50">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <LuStar size={16} />
                      <span className="stat-number text-sm">{project.stats.stars}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <LuGitFork size={16} />
                      <span className="stat-number text-sm">{project.stats.forks}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <LuEye size={16} />
                      <span className="stat-number text-sm">{project.stats.views}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Action Buttons - MOVED OUTSIDE GRID */}
              <div className="flex flex-wrap gap-4 mt-8 lg:hidden relative z-[100] pointer-events-auto" style={{ isolation: 'isolate' }}>
                {project.liveUrl !== "#" && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 text-white py-5 px-6 rounded-2xl shadow-xl active:scale-95 transition-all duration-200 cursor-pointer touch-manipulation select-none outline-none focus:outline-none focus:ring-0"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                      color: '#ffffff !important'
                    }}
                  >
                    <LuExternalLink size={24} strokeWidth={2.5} className="text-white" />
                    <span className="text-sm font-bold text-white">Live Demo</span>
                  </a>
                )}
                {project.githubUrl !== "#" && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] flex flex-col items-center justify-center gap-2 bg-white dark:bg-slate-800 border-2 border-primary-500 dark:border-cyan-600 text-gray-900 dark:text-white py-5 px-6 rounded-2xl shadow-xl active:scale-95 transition-all duration-200 cursor-pointer touch-manipulation select-none outline-none focus:outline-none focus:ring-0"
                    style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                  >
                    <LuGithub size={24} strokeWidth={2.5} />
                    <span className="text-sm font-bold">Source Code</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div ref={ctaRef} className="text-center mt-20">
          <div className="bg-white/80 dark:bg-dark-800/50 backdrop-blur-xl rounded-3xl p-8 border border-primary-200/50 dark:border-primary-500/30 shadow-lg hover:shadow-royal-gold transition-all duration-300">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Let&apos;s Build Something Amazing Together
            </h3>
            <p className="text-gray-600 dark:text-gray-200 mb-6 max-w-2xl mx-auto">
              Have an exciting project in mind? Let&apos;s collaborate and create innovative solutions that make a difference.
            </p>
            <button
              onClick={() => scrollToId('#contact', 80)}
              className="group inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-600 text-white px-8 py-4 rounded-xl hover:shadow-royal-gold hover:scale-105 transition-all duration-300"
            >
              <span className="font-semibold">Start a Project</span>
              <LuArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Projects);
