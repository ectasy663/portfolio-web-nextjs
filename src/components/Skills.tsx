'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  SiReact, SiTypescript, SiJavascript, SiPython, SiCplusplus,
  SiHtml5, SiCss3, SiTailwindcss, SiGit, SiGithub, SiDocker, SiFigma,
  SiNodedotjs, SiPostgresql, SiSupabase,
  SiTensorflow, SiPytorch, SiNumpy, SiPandas, SiJupyter, SiExpo
} from 'react-icons/si';
import {
  FaBrain, FaCode, FaJava, FaRocket,
  FaDesktop, FaServer, FaChartBar, FaCog
} from 'react-icons/fa';
import { VscCode } from 'react-icons/vsc';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

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

    gsap.set([titleRef.current, skillsRef.current], {
      opacity: 0,
      y: 50
    });

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })
      .to(skillsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");

    const skillCards = skillsRef.current?.querySelectorAll('.skill-card');
    if (skillCards) {
      gsap.fromTo(skillCards,
        { opacity: 0, y: 30, scale: 0.9, rotationY: 15 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 1,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: skillsRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    if (floatingRef.current) {
      const floatingElements = floatingRef.current.querySelectorAll('.floating-icon');
      gsap.to(floatingElements, {
        y: 'random(-20, 20)',
        x: 'random(-10, 10)',
        rotation: 'random(-15, 15)',
        duration: 'random(3, 6)',
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.3
      });
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

  const skillCategories = [
    {
      title: "Frontend Development",
      icon: <FaDesktop className="text-3xl text-cyan-400" />,
      skills: [
        { name: "React.js", icon: <SiReact className="text-2xl text-cyan-400" />, level: 95 },
        { name: "React Native", icon: <SiExpo className="text-2xl text-purple-400" />, level: 85 },
        { name: "TypeScript", icon: <SiTypescript className="text-2xl text-blue-400" />, level: 90 },
        { name: "JavaScript", icon: <SiJavascript className="text-2xl text-yellow-400" />, level: 92 },
        { name: "HTML5", icon: <SiHtml5 className="text-2xl text-orange-500" />, level: 95 },
        { name: "CSS3", icon: <SiCss3 className="text-2xl text-blue-500" />, level: 90 },
        { name: "Tailwind CSS", icon: <SiTailwindcss className="text-2xl text-teal-400" />, level: 88 },
      ],
      gradient: "from-cyan-500 via-blue-500 to-purple-600"
    },
    {
      title: "Backend & Database",
      icon: <FaServer className="text-3xl text-green-400" />,
      skills: [
        { name: "Node.js", icon: <SiNodedotjs className="text-2xl text-green-500" />, level: 85 },
        { name: "Python", icon: <SiPython className="text-2xl text-yellow-400" />, level: 90 },
        { name: "PostgreSQL", icon: <SiPostgresql className="text-2xl text-blue-400" />, level: 80 },
        { name: "Supabase", icon: <SiSupabase className="text-2xl text-emerald-400" />, level: 82 },
        { name: "C++", icon: <SiCplusplus className="text-2xl text-blue-600" />, level: 85 },
        { name: "Java", icon: <FaJava className="text-2xl text-red-500" />, level: 80 },
      ],
      gradient: "from-green-500 via-emerald-500 to-teal-600"
    },
    {
      title: "AI/ML & Data Science",
      icon: <FaChartBar className="text-3xl text-purple-400" />,
      skills: [
        { name: "TensorFlow", icon: <SiTensorflow className="text-2xl text-orange-500" />, level: 75 },
        { name: "PyTorch", icon: <SiPytorch className="text-2xl text-red-500" />, level: 70 },
        { name: "NumPy", icon: <SiNumpy className="text-2xl text-blue-400" />, level: 85 },
        { name: "Pandas", icon: <SiPandas className="text-2xl text-purple-400" />, level: 88 },
        { name: "Jupyter", icon: <SiJupyter className="text-2xl text-orange-400" />, level: 80 },
        { name: "Machine Learning", icon: <FaBrain className="text-2xl text-pink-400" />, level: 75 },
      ],
      gradient: "from-purple-500 via-pink-500 to-red-500"
    },
    {
      title: "Tools & DevOps",
      icon: <FaCog className="text-3xl text-orange-400" />,
      skills: [
        { name: "Git", icon: <SiGit className="text-2xl text-orange-500" />, level: 90 },
        { name: "GitHub", icon: <SiGithub className="text-2xl text-gray-300" />, level: 92 },
        { name: "Docker", icon: <SiDocker className="text-2xl text-blue-400" />, level: 75 },
        { name: "Figma", icon: <SiFigma className="text-2xl text-purple-400" />, level: 85 },
        { name: "VS Code", icon: <VscCode className="text-2xl text-blue-500" />, level: 95 },
        { name: "Animation", icon: <FaRocket className="text-2xl text-green-400" />, level: 80 },
      ],
      gradient: "from-orange-500 via-red-500 to-pink-600"
    }
  ];

  return (
    <section ref={sectionRef} id="skills" className="section-padding relative overflow-hidden bg-gray-50 dark:bg-transparent transition-colors duration-300">
      {/* Light theme background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:opacity-0 opacity-100 transition-opacity duration-300 z-0"></div>

      {/* Dynamic gradient background overlay */}
      <div className="absolute inset-0 z-20 opacity-10 dark:opacity-30 transition-opacity duration-300">
        <div className="skills-overlay absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="skills-overlay absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Background floating icons */}
      <div ref={floatingRef} className="absolute inset-0 pointer-events-none opacity-3 dark:opacity-5 z-30 transition-opacity duration-300">
        {[SiReact, SiJavascript, SiPython, SiDocker, SiGit, FaBrain, FaRocket, FaCode].map((Icon, index) => (
          <Icon
            key={index}
            className={`floating-icon absolute text-6xl text-blue-600 dark:text-blue-400 transition-colors duration-300`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-grid-pattern opacity-3 dark:opacity-5 z-30 transition-opacity duration-300"></div>

      <div className="container relative z-40">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-display-lg font-display mb-6 leading-tight py-2">
            <span className="gradient-text text-gray-800 dark:text-white transition-colors duration-300">
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
                <div className="relative bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-gray-200/50 dark:border-white/20 rounded-2xl p-8 hover:border-gray-300 dark:hover:border-white/30 transition-all duration-500 shadow-lg hover:shadow-2xl hover:bg-white/95 dark:hover:bg-white/20">
                {/* Gradient border effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}></div>

                {/* Header */}
                <div className="flex items-center space-x-4 mb-8">
                  <div className="text-transparent bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text transition-colors duration-300">
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
                      className="group/skill relative bg-white/80 dark:bg-white/10 rounded-xl p-4 hover:bg-white dark:hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-gray-200/50 dark:border-white/10 backdrop-blur-sm"
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
        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300">
          <h3 className="text-heading-lg font-heading text-center mb-8">
            <span className="gradient-text">
              Currently Learning
            </span>
          </h3>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { name: "Next.js 14", icon: "⚡", color: "from-gray-400 to-gray-600" },
              { name: "WebGL", icon: "🎨", color: "from-purple-400 to-pink-600" },
              { name: "Blockchain", icon: "⛓️", color: "from-yellow-400 to-orange-600" },
              { name: "Cloud Native", icon: "☁️", color: "from-blue-400 to-cyan-600" },
              { name: "Edge Computing", icon: "🚀", color: "from-green-400 to-teal-600" },
              { name: "Quantum ML", icon: "🔬", color: "from-indigo-400 to-purple-600" }
            ].map((tech, index) => (
              <div
                key={index}
                className="group flex items-center space-x-3 bg-white/70 dark:bg-white/10 backdrop-blur-md rounded-xl px-6 py-3 border border-gray-200/50 dark:border-white/20 hover:border-primary-400 dark:hover:border-primary-400 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
              >
                <span className="text-2xl group-hover:animate-bounce">{tech.icon}</span>
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

export default Skills;
