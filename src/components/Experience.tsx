'use client';

import React, { useEffect, useRef } from 'react';
import { Calendar, Building, Briefcase } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { experiences } from '@/data/experience';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

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

    gsap.set([titleRef.current, timelineRef.current], {
      opacity: 0,
      y: 50
    });

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })
      .to(timelineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");

    const timelineItems = timelineRef.current?.querySelectorAll('.timeline-item');
    if (timelineItems) {
      gsap.fromTo(timelineItems,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="section-padding relative overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300">
      {/* Light theme background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:opacity-0 opacity-100 transition-opacity duration-300 z-0"></div>

      {/* Dynamic gradient background overlay */}
      <div className="absolute inset-0 z-20 opacity-10 dark:opacity-30 transition-opacity duration-300">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-royal-purple-500/20 to-primary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-primary-500/20 to-royal-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container relative z-30">
        <h2 ref={titleRef} className="text-display-lg font-display text-center mb-16 leading-tight py-2">
          <span className="gradient-text-gold">
            My Journey
          </span>
        </h2>

        <div ref={timelineRef} className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-royal-purple-500 via-primary-500 to-royal-purple-500 dark:from-royal-purple-400 dark:via-primary-400 dark:to-royal-purple-400 transition-colors duration-300"></div>

            {experiences.map((exp, index) => (
              <div key={index} className="timeline-item relative pl-24 pb-16 last:pb-0">
                {/* Timeline dot */}
                <div className={`absolute left-0 top-0 w-14 h-14 flex items-center justify-center bg-white dark:bg-dark-900 rounded-full z-10 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-110 border-2 border-transparent bg-clip-padding`}>
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${exp.color} opacity-20 animate-spin-slow`}></div>
                  <div className={`absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r ${exp.color} [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)]`}></div>
                  <Briefcase className="w-6 h-6 text-gray-700 dark:text-gray-200 relative z-10" />
                </div>

                {/* Content card */}
                <div className="group relative bg-white/80 dark:bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-royal-gold transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                  
                  {/* Gradient Border Effect on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${exp.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>

                  {/* Header */}
                  <div className="flex flex-col gap-3 mb-6 relative z-10">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 pr-32">
                        {exp.role}
                      </h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-royal-purple-600 dark:text-royal-purple-400 font-medium">
                        <Building size={16} />
                        <span>{exp.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-white/5 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                        <Calendar size={14} />
                        <span className="font-mono">{exp.period}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10">
                    {exp.description}
                  </p>
                  
                  {/* Type Badge - Moved inside and fixed visibility */}
                  <div className={`absolute top-6 right-6 px-3 py-1 text-xs font-bold tracking-wide uppercase bg-gradient-to-r ${exp.color} text-white rounded-full shadow-md transform group-hover:scale-105 transition-transform duration-300`}>
                    {exp.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-20 text-center">
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/20 dark:border-white/10 max-w-3xl mx-auto shadow-lg hover:shadow-royal-purple-glow transition-all duration-500 group">
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

export default Experience;
