'use client';

import React, { useEffect, useRef } from 'react';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Achievements: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);

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

    gsap.set([titleRef.current, achievementsRef.current], {
      opacity: 0,
      y: 50
    });

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    .to(achievementsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4");

    const achievementCards = achievementsRef.current?.querySelectorAll('.achievement-card');
    if (achievementCards) {
      gsap.fromTo(achievementCards,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: achievementsRef.current,
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

  const achievements = [
    {
      title: "FinTech Revolution Thematic Award",
      event: "Global IDEATHON 2025 (FIU)",
      description: "Secured top honors from a judging panel of industry leaders from Google, Microsoft, Meta, and Oracle for an innovative FinTech solution.",
      icon: Trophy,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-500/20 to-yellow-600/20",
      rank: "1st Place"
    },
    {
      title: "Top 20% Finalist",
      event: "'Build with India' National Hackathon",
      description: "Excelled in a high-stakes environment, placing in the top 5,000 out of 25,000 competing teams in a demanding national hackathon.",
      icon: Medal,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-500/20 to-blue-600/20",
      rank: "Top 20%"
    },
    {
      title: "Top 30 National Placement",
      event: "Web-A-Thon MNIT Jaipur",
      description: "Placed among the top 30 teams out of over 100 teams from across the nation in a competitive web development marathon.",
      icon: Award,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-500/20 to-purple-600/20",
      rank: "Top 30"
    }
  ];

  return (
    <section ref={sectionRef} id="achievements" className="section-padding bg-gray-50 dark:bg-transparent relative overflow-hidden transition-colors duration-300">
      {/* Light theme background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-yellow-50 dark:opacity-0 opacity-100 transition-opacity duration-300 z-0"></div>

      {/* Dynamic gradient background overlay */}
      <div className="absolute inset-0 z-10 opacity-10 dark:opacity-30 transition-opacity duration-300">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-20">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text leading-tight py-2">
          Awards & Recognition
        </h2>

        <div ref={achievementsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className="achievement-card card-hover bg-white/80 dark:bg-white/10 backdrop-blur-xl p-6 rounded-xl border border-gray-200/50 dark:border-white/20 relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Background pattern */}
              <div className={`absolute inset-0 bg-gradient-to-br ${achievement.bgColor} opacity-50`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon and rank */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-lg`}>
                    <achievement.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`px-3 py-1 bg-gradient-to-r ${achievement.color} text-white text-xs font-bold rounded-full`}>
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
                <div className="absolute top-4 right-4 opacity-20">
                  <Star className={`w-8 h-8 text-gradient-to-r ${achievement.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">3+</div>
            <p className="text-gray-600 dark:text-gray-400">Major Awards</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">25K+</div>
            <p className="text-gray-600 dark:text-gray-400">Participants Competed</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">Top 20%</div>
            <p className="text-gray-600 dark:text-gray-400">National Ranking</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">4+</div>
            <p className="text-gray-600 dark:text-gray-400">Tech Giants Recognition</p>
          </div>
        </div>

        {/* Quote section */}
        <div className="mt-16 text-center">
          <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl p-8 rounded-xl border border-gray-200/50 dark:border-white/20 max-w-4xl mx-auto shadow-lg hover:shadow-2xl transition-all duration-300">
            <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic mb-4">
              &quot;Success is not final, failure is not fatal: it is the courage to continue that counts.&quot;
            </blockquote>
            <p className="text-gray-600 dark:text-gray-400">
              — Winston Churchill
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
