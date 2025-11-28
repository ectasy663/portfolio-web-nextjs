'use client';

import React, { useEffect, useRef } from 'react';
import { ExternalLink, Github, ArrowRight, Star, Eye, GitFork, Calendar, Code2, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToId } from '@/utils/scroll';
import {
  SiReact, SiTypescript, SiTailwindcss, SiSupabase, SiJavascript,
  SiCss3, SiHtml5, SiNodedotjs, SiPython, SiGit, SiSolana
} from 'react-icons/si';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

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

    gsap.set([titleRef.current, projectsRef.current], {
      opacity: 0,
      y: 50
    });

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })
      .to(projectsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");

    const projectCards = projectsRef.current?.querySelectorAll('.project-card');
    if (projectCards) {
      gsap.fromTo(projectCards,
        { opacity: 0, y: 30, scale: 0.9, rotationY: 15 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 1,
          stagger: 0.3,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: projectsRef.current,
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

  const getTechIcon = (tech: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      'React': <SiReact className="text-cyan-400" />,
      'TypeScript': <SiTypescript className="text-blue-400" />,
      'JavaScript': <SiJavascript className="text-yellow-400" />,
      'Tailwind CSS': <SiTailwindcss className="text-teal-400" />,
      'CSS': <SiCss3 className="text-blue-500" />,
      'HTML': <SiHtml5 className="text-orange-500" />,
      'Supabase': <SiSupabase className="text-emerald-400" />,
      'Node.js': <SiNodedotjs className="text-green-500" />,
      'Python': <SiPython className="text-yellow-400" />,
      'Git': <SiGit className="text-orange-500" />,
      'Solana Web3.js': <SiSolana className="text-purple-400" />
    };
    return iconMap[tech] || <Code2 className="text-gray-600 dark:text-gray-400" />;
  };

  const projects = [
    {
      title: "Gifting Muse Oracle",
      tagline: "Creative Gift Discovery Platform",
      description: "An innovative gift discovery platform that combines intuitive design with smart curation to provide personalized gift recommendations. Features a beautiful interface with creative filtering and curated suggestions for every occasion and recipient.",
      features: [
        { icon: "🎁", text: "Curated Gift Collections" },
        { icon: "✨", text: "Personalized Suggestions" },
        { icon: "🎯", text: "Occasion-Based Filtering" },
        { icon: "💡", text: "Creative Gift Ideas" },
        { icon: "🔍", text: "Smart Search Engine" },
        { icon: "📱", text: "Responsive Design" }
      ],
      techStack: ["React", "TypeScript", "Tailwind CSS"],
      liveUrl: "https://gifting-muse-oracle.vercel.app",
      githubUrl: "#",
      stats: { stars: 15, forks: 4, views: 298 },
      date: "2024",
      gradient: "from-pink-500 via-rose-500 to-red-500",
      category: "Creative Web App",
      status: "Live Production"
    },
    {
      title: "User-Centric Property Platform",
      tagline: "Next-Gen Real Estate Discovery",
      description: "An intelligent property discovery platform that leverages advanced filtering algorithms and modern UX principles to transform how users find their perfect property.",
      features: [
        { icon: "📱", text: "Progressive Web App" },
        { icon: "🔍", text: "AI-Powered Search" },
        { icon: "🚀", text: "Optimized Performance" },
        { icon: "🎨", text: "Modern UI/UX Design" },
        { icon: "📈", text: "SEO Excellence" },
        { icon: "🔄", text: "Real-Time Updates" }
      ],
      techStack: ["React", "JavaScript", "CSS"],
      liveUrl: "https://modernwebshowcase.netlify.app",
      githubUrl: "#",
      stats: { stars: 8, forks: 2, views: 189 },
      date: "2024",
      gradient: "from-green-500 via-emerald-500 to-teal-600",
      category: "Frontend Application",
      status: "Active"
    },
    {
      title: "Tokenarium",
      tagline: "Web3 Wallet Interface & DeFi Platform",
      description: "A comprehensive Web3 wallet interface built with generative AI assistance, featuring Solana blockchain integration, token management, and decentralized finance capabilities with a modern, intuitive user experience.",
      features: [
        { icon: "🔗", text: "Solana Blockchain Integration" },
        { icon: "💼", text: "Multi-Token Wallet Support" },
        { icon: "🔒", text: "Secure Transaction Handling" },
        { icon: "📊", text: "Portfolio Analytics" },
        { icon: "🏦", text: "DeFi Protocol Access" },
        { icon: "🎨", text: "Modern Web3 UI/UX" }
      ],
      techStack: ["React", "TypeScript", "Solana Web3.js", "Tailwind CSS"],
      liveUrl: "https://tokenarium.vercel.app",
      githubUrl: "#",
      stats: { stars: 18, forks: 5, views: 324 },
      date: "2024",
      gradient: "from-purple-500 via-pink-500 to-red-500",
      category: "Web3 DApp",
      status: "Live Production"
    }
  ];

  return (
    <section ref={sectionRef} id="projects" className="section-padding relative overflow-hidden bg-white dark:bg-slate-950">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-500/30 dark:border-cyan-500/30 rounded-full px-6 py-2 mb-6">
            <Sparkles className="text-cyan-400" size={18} />
            <span className="text-cyan-400 font-medium">Featured Work</span>
          </div>

          <h2 ref={titleRef} className="text-display-lg font-display mb-6 leading-tight py-2">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
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
              className="project-card group relative z-0"
            >
              <div className={`grid lg:grid-cols-12 gap-8 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}>

                {/* Project Visual */}
                <div className={`lg:col-span-7 ${index % 2 === 1 ? 'lg:col-start-6' : ''} relative z-0 lg:z-10 pointer-events-none lg:pointer-events-auto`}>
                  <div
                    className="tilt-container pointer-events-none lg:pointer-events-auto"
                    onMouseEnter={(e) => {
                      const card = e.currentTarget;
                      gsap.to(card, {
                        duration: 0.3,
                        scale: 1.02,
                        ease: "power2.out"
                      });
                    }}
                    onMouseLeave={(e) => {
                      const card = e.currentTarget;
                      gsap.to(card, {
                        duration: 0.5,
                        scale: 1,
                        rotationX: 0,
                        rotationY: 0,
                        ease: "power2.out"
                      });
                    }}
                    onMouseMove={(e) => {
                      const card = e.currentTarget;
                      const rect = card.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const centerX = rect.width / 2;
                      const centerY = rect.height / 2;
                      const rotateX = (y - centerY) / centerY * -15;
                      const rotateY = (x - centerX) / centerX * 15;
                      
                      gsap.to(card, {
                        duration: 0.3,
                        rotationX: rotateX,
                        rotationY: rotateY,
                        transformPerspective: 1000,
                        ease: "power2.out"
                      });
                    }}
                  >
                    <div className="relative group overflow-hidden rounded-2xl">
                      {/* Main project showcase */}
                      <div
                        className={`aspect-video bg-gradient-to-br ${project.gradient} rounded-2xl relative overflow-hidden`}
                      >
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>

                        {/* Mock browser/app interface */}
                        <div className="absolute inset-4 bg-dark-900/90 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                          {/* Browser bar */}
                          <div className="flex items-center justify-between p-4 border-b border-white/10">
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
                              <div className="text-cyan-400">const project = {'{'};</div>
                              <div className="text-gray-600 dark:text-gray-400 ml-4">name: <span className="text-green-400">&quot;{project.title}&quot;</span>,</div>
                              <div className="text-gray-600 dark:text-gray-400 ml-4">status: <span className="text-yellow-400">&quot;{project.status}&quot;</span>,</div>
                              <div className="text-gray-600 dark:text-gray-400 ml-4">category: <span className="text-purple-400">&quot;{project.category}&quot;</span></div>
                              <div className="text-cyan-400">{'};'}</div>
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
                                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-neon-blue/50 transition-all duration-300 hover:scale-105 active:scale-95"
                              >
                                <ExternalLink size={18} />
                                <span>Live Demo</span>
                              </a>
                            )}
                            {project.githubUrl !== "#" && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 bg-dark-800/80 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl hover:border-white/40 transition-all duration-300 hover:scale-105 active:scale-95"
                              >
                                <Github size={18} />
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
                        <Calendar size={14} />
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
                    <h3 className="text-heading-lg font-heading text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-300">
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
                        className="flex items-center space-x-3 bg-white/70 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-300/50 dark:border-white/10 rounded-lg p-3 hover:border-gray-400/50 dark:hover:border-white/20 transition-all duration-300"
                      >
                        <span className="text-xl">{feature.icon}</span>
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
                          className="flex items-center space-x-2 bg-white/70 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-300/50 dark:border-white/10 rounded-lg px-4 py-2 hover:border-gray-400/50 dark:hover:border-white/20 hover:scale-105 transition-all duration-300"
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
                      <Star size={16} />
                      <span className="text-sm">{project.stats.stars}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <GitFork size={16} />
                      <span className="text-sm">{project.stats.forks}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Eye size={16} />
                      <span className="text-sm">{project.stats.views}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Action Buttons - MOVED OUTSIDE GRID */}
              <div className="flex flex-wrap gap-4 mt-8 lg:hidden">
                {project.liveUrl !== "#" && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-cyan-500 to-blue-600 text-white py-5 px-6 rounded-2xl shadow-xl active:scale-95 transition-all duration-200"
                  >
                    <ExternalLink size={24} strokeWidth={2.5} />
                    <span className="text-sm font-bold">Live Demo</span>
                  </a>
                )}
                {project.githubUrl !== "#" && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] flex flex-col items-center justify-center gap-2 bg-white dark:bg-slate-800 border-2 border-cyan-500 dark:border-cyan-600 text-gray-900 dark:text-white py-5 px-6 rounded-2xl shadow-xl active:scale-95 transition-all duration-200"
                  >
                    <Github size={24} strokeWidth={2.5} />
                    <span className="text-sm font-bold">Source Code</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-20">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-gray-600 shadow-xl">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Let&apos;s Build Something Amazing Together
            </h3>
            <p className="text-gray-600 dark:text-gray-200 mb-6 max-w-2xl mx-auto">
              Have an exciting project in mind? Let&apos;s collaborate and create innovative solutions that make a difference.
            </p>
            <button
              onClick={() => scrollToId('#contact', 80)}
              className="group inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-neon-blue/50 hover:scale-105 transition-all duration-300"
            >
              <span className="font-semibold">Start a Project</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
