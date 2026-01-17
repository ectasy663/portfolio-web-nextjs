'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skillCategories } from '@/data/skills';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Unique Title Animation: Fade Up with slight scale
    gsap.set(titleRef.current, { opacity: 0, y: 30, scale: 0.9 });
    gsap.set(skillsRef.current, { opacity: 0 });

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "back.out(1.2)"
    })
      .to(skillsRef.current, {
        opacity: 1,
        duration: 0.5
      }, "-=0.5");

    const skillCards = skillsRef.current?.querySelectorAll('.skill-card');
    if (skillCards) {
      // Unique Card Animation: 3D Rotate In
      gsap.fromTo(skillCards,
        {
          opacity: 0,
          rotationX: 90,
          y: 50,
          transformPerspective: 1000
        },
        {
          opacity: 1,
          rotationX: 0,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: skillsRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    if (sectionRef.current) {
      const overlays = sectionRef.current.querySelectorAll('.skills-overlay');
      overlays.forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -50 : -30,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="section-padding relative overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300">
      {/* Light theme background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:opacity-0 opacity-100 transition-opacity duration-300 z-0"></div>

      {/* Dynamic gradient background overlay */}
      <div className="absolute inset-0 z-20 opacity-10 dark:opacity-30 transition-opacity duration-300">
        <div className="skills-overlay absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-royal-blue-500/20 to-royal-purple-500/20 rounded-full blur-3xl"></div>
        <div className="skills-overlay absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-royal-purple-500/20 to-royal-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-grid-pattern opacity-3 dark:opacity-5 z-30 transition-opacity duration-300"></div>

      <div className="container relative z-40">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-display-lg font-display mb-6 leading-tight py-2">
            <span className="gradient-text-gold transition-colors duration-300">
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
            >
              {/* Glass morphism card */}
              <div className="relative glass-panel rounded-2xl p-8 hover:border-primary-400 dark:hover:border-primary-400 transition-all duration-500 shadow-lg hover:shadow-royal-gold hover:bg-white/95 dark:hover:bg-dark-800/80">
                {/* Gradient border effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}></div>

                {/* Header */}
                <div className="flex items-center space-x-4 mb-8">
                  <div className="text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text transition-colors duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-heading-md font-heading text-gray-900 dark:text-white transition-colors duration-300">
                    {category.title}
                  </h3>
                </div>

                {/* Skills grid */}
                <div className="grid grid-cols-1 gap-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="group/skill relative bg-white/80 dark:bg-dark-900/50 rounded-xl p-4 hover:bg-white dark:hover:bg-dark-900/80 transition-all duration-300 hover:scale-105 border border-primary-200/30 dark:border-primary-500/20 backdrop-blur-sm"
                    >
                      {/* Skill icon and name */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="group-hover/skill:scale-110 transition-transform duration-300">
                            {skill.icon}
                          </div>
                          <span className="text-body-sm font-body text-gray-800 dark:text-gray-200 group-hover/skill:text-gray-900 dark:group-hover/skill:text-white transition-colors duration-300">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-caption text-gray-600 dark:text-gray-300 font-mono transition-colors duration-300">
                          {skill.level}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="relative">
                        <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${category.gradient} rounded-full transition-all duration-1000 ease-out transform origin-left group-hover/skill:scale-x-105`}
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tech stack highlights */}
        <div className="glass-panel rounded-3xl p-8 border border-primary-200/50 dark:border-primary-500/30 shadow-lg hover:shadow-royal-gold transition-all duration-300">
          <h3 className="text-heading-lg font-heading text-center mb-8">
            <span className="gradient-text-gold">
              Currently Learning
            </span>
          </h3>

          <div className="flex flex-wrap justify-center gap-6">
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
                className="group flex items-center space-x-3 bg-white/70 dark:bg-dark-900/50 backdrop-blur-md rounded-xl px-6 py-3 border border-primary-200/50 dark:border-primary-500/20 hover:border-primary-400 dark:hover:border-primary-400 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-royal-gold"
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
