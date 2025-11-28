'use client';

import React, { useEffect, useRef } from 'react';
import { Brain, Code, Users } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView } from 'react-intersection-observer';
import { useGSAPAnimation } from '@/hooks/useAnimation';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useGSAPAnimation();

  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [contentRef, contentInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [strengthsRef, strengthsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (strengthsInView && timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline();
    timelineRef.current = tl;

    if (strengthsInView) {
      const strengthCards = document.querySelectorAll('.strength-card');
      tl.fromTo(strengthCards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power3.out"
        }
      );
    }

    if (sectionRef.current) {
      const overlayBubbles = sectionRef.current.querySelectorAll('.about-overlay');
      overlayBubbles.forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -60 : -40,
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
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [strengthsInView, timelineRef]);

  const strengths = [
    {
      icon: Brain,
      title: "AI & Machine Learning",
      description: "Proficient in applying ML algorithms and Generative AI concepts to create data-driven applications."
    },
    {
      icon: Code,
      title: "Full-Stack Web Development",
      description: "Skilled in building responsive, end-to-end web solutions with modern tools like React, TypeScript, and Tailwind CSS."
    },
    {
      icon: Users,
      title: "Collaborative Problem-Solving",
      description: "A proven team player with strong communication skills, experienced in agile environments and cross-functional collaboration."
    }
  ];

  return (
    <section ref={sectionRef} id="about" className="section-padding relative overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300">
      {/* Background Video - Only visible in dark theme */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <source src="/videos/metaverse.mp4" type="video/mp4" />
      </video>

      {/* Light theme background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:opacity-0 opacity-100 transition-opacity duration-300 z-0"></div>

      {/* Video overlay for better text readability - Only in dark theme */}
      <div className="absolute inset-0 bg-black/50 dark:opacity-100 opacity-0 transition-opacity duration-300 z-10"></div>

      {/* Dynamic gradient background overlay */}
      <div className="absolute inset-0 z-20 opacity-10 dark:opacity-30 transition-opacity duration-300">
        <div className="about-overlay absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
        <div className="about-overlay absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-30">
        <h2
          ref={titleRef}
          className={`text-display-lg font-display text-center mb-16 gradient-text leading-tight py-2 animate-fade-in-slow transform transition-colors duration-300 ${titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          About Me
        </h2>

        {/* Centered Content */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Left side - Professional Image */}
            <div className="flex-shrink-0">
              <div className="relative group cursor-pointer">
                <img
                  src="/assets/Professional-styly-pic.png"
                  alt="Naman Singh Panwar - Professional Style"
                  className="w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[28rem] object-cover rounded-2xl shadow-2xl border-4 border-white/20 dark:border-white/10 group-hover:scale-105 transition-all duration-500 group-hover:shadow-3xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <p className="text-lg font-bold mb-1">Driven by passion</p>
                  <p className="text-sm text-gray-200">Building the future with code 🚀</p>
                </div>
              </div>
            </div>

            {/* Right side - Text content */}
            <div className="flex-1 text-left">
              <div
                ref={contentRef}
                className={`space-y-8 animate-fade-in-delay transform ${contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              >
                <div className="prose prose-xl lg:prose-2xl dark:prose-invert">
                  <p className="text-body-lg text-gray-700 dark:text-gray-100 leading-relaxed font-body transition-colors duration-300">
                    I'm a passionate and driven Computer Science student with a deep fascination for Artificial Intelligence
                    and its power to solve real-world problems. My journey is fueled by a constant curiosity to learn and a
                    desire to build things that matter.
                  </p>
                  <p className="text-body-lg text-gray-700 dark:text-gray-100 leading-relaxed font-body transition-colors duration-300">
                    From contributing to national defense projects at DRDO to innovating in the FinTech space, I thrive on
                    challenges that push the boundaries of technology. My goal is to not just write code, but to architect
                    elegant, efficient, and intelligent systems that leave a lasting impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Strengths */}
        <div ref={strengthsRef} className="mt-24">
          <h3 className={`text-heading-lg font-heading text-center mb-16 text-gray-800 dark:text-white animate-fade-in-slow transform transition-colors duration-300 ${strengthsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            Key Strengths
          </h3>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {strengths.map((strength, index) => (
              <div
                key={index}
                className="strength-card bg-white/80 dark:bg-white/10 backdrop-blur-xl p-8 rounded-xl border border-gray-200/50 dark:border-white/20 text-center card-hover shadow-lg hover:shadow-2xl hover:bg-white/95 dark:hover:bg-white/20 transition-all duration-300"
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-white/10 backdrop-blur-sm rounded-lg mb-6 hover:rotate-12 transition-all duration-300" style={{ transition: 'transform 0.2s ease-out' }}>
                  <strength.icon className="w-10 h-10 text-cyan-600 dark:text-cyan-400 transition-colors duration-300" />
                </div>
                <h4 className="text-heading-md font-heading mb-6 text-gray-800 dark:text-white transition-colors duration-300">
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

export default About;
