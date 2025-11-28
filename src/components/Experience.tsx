'use client';

import React, { useEffect, useRef } from 'react';
import { Calendar, Building } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

  const experiences = [
    {
      role: "Summer Trainee",
      company: "DRDO (Defence Research and Development Organisation)",
      period: "July 2025 – Sep 2025",
      description: "Gained hands-on experience with advanced AI/ML technologies at India's premier defense research organization. Contributed directly to active research projects, enhancing my skills in machine learning algorithms, data analysis, and their application in high-stakes environments.",
      type: "Current",
      color: "from-green-500 to-green-600"
    },
    {
      role: "AI Intern (Web Development)",
      company: "Gyannetra Pvt Ltd",
      period: "May 2025 – July 2025",
      description: "Developed responsive frontend components for AI-driven web applications. Collaborated closely with the AI team to integrate complex functionalities and utilized Docker to containerize applications, ensuring consistent development and streamlined deployment pipelines.",
      type: "Recent",
      color: "from-blue-500 to-blue-600"
    },
    {
      role: "MS AINSI AI Intern",
      company: "Microsoft (in collaboration with AICTE)",
      period: "Apr 2025 – May 2025",
      description: "Completed a national-level internship focused on AI Foundations, gaining practical experience in the end-to-end AI project lifecycle. Applied skills in data analysis and predictive modeling to explore and solve real-world industry problems.",
      type: "Achievement",
      color: "from-purple-500 to-purple-600"
    },
    {
      role: "AI Executive Intern",
      company: "Ideaforage",
      period: "June 2024 – Dec 2024",
      description: "Contributed to the development of innovative AI-driven solutions by researching and implementing emerging technologies. Worked within a collaborative team to brainstorm ideas, troubleshoot complex issues, and deliver high-quality, impactful results.",
      type: "Foundation",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section ref={sectionRef} id="experience" className="section-padding relative overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300">
      {/* Light theme background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:opacity-0 opacity-100 transition-opacity duration-300 z-0"></div>

      {/* Dynamic gradient background overlay */}
      <div className="absolute inset-0 z-20 opacity-10 dark:opacity-30 transition-opacity duration-300">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-30">
        <h2 ref={titleRef} className="text-display-lg font-display text-center mb-16 leading-tight py-2">
          <span className="gradient-text">
            My Journey
          </span>
        </h2>

        <div ref={timelineRef} className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-primary-600 dark:from-cyan-400 dark:to-purple-400 transition-colors duration-300"></div>

            {experiences.map((exp, index) => (
              <div key={index} className="timeline-item relative pl-20 pb-12 last:pb-0">
                {/* Timeline dot */}
                <div className={`absolute left-6 w-4 h-4 bg-gradient-to-r ${exp.color} rounded-full border-4 border-white dark:border-gray-800 z-10 transition-colors duration-300`}></div>

                {/* Content card */}
                <div className="card-hover bg-white/90 dark:bg-white/10 backdrop-blur-xl p-6 rounded-xl border border-gray-200 dark:border-white/20 relative shadow-lg hover:shadow-xl hover:bg-white dark:hover:bg-white/20 transition-all duration-300">
                  {/* Type badge */}
                  <div className={`inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${exp.color} text-white mb-4`}>
                    {exp.type}
                  </div>

                  {/* Role and company */}
                  <h3 className="text-heading-md font-heading text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                    {exp.role}
                  </h3>

                  <div className="flex items-center gap-4 mb-4 text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    <div className="flex items-center gap-2">
                      <Building size={16} />
                      <span className="text-body-sm font-heading text-primary-600 dark:text-cyan-400 font-medium transition-colors duration-300">{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span className="text-body-sm font-mono">{exp.period}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-body-md text-gray-700 dark:text-gray-200 leading-relaxed transition-colors duration-300">
                    {exp.description}
                  </p>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-600/5 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center">
          <div className="bg-white/90 dark:bg-white/10 backdrop-blur-xl p-8 rounded-xl border border-gray-200 dark:border-white/20 max-w-3xl mx-auto shadow-lg hover:shadow-xl hover:bg-white dark:hover:bg-white/20 transition-all duration-300">
            <h3 className="text-heading-md font-heading mb-4">
              <span className="gradient-text">
                Currently Exploring
              </span>
            </h3>
            <p className="text-body-md text-gray-700 dark:text-gray-200 leading-relaxed transition-colors duration-300">
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
