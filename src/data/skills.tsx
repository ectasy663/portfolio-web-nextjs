import React from 'react';
import {
  SiReact, SiTypescript, SiJavascript, SiPython, SiCplusplus,
  SiHtml5, SiCss3, SiTailwindcss, SiGit, SiGithub, SiDocker, SiFigma,
  SiNodedotjs, SiPostgresql, SiSupabase, SiNextdotjs,
  SiTensorflow, SiPytorch, SiNumpy, SiPandas, SiJupyter, SiExpo
} from 'react-icons/si';
import {
  FaBrain, FaCode, FaJava, FaRocket,
  FaDesktop, FaServer, FaChartBar, FaCog
} from 'react-icons/fa';
import { VscCode } from 'react-icons/vsc';

export const skillCategories = [
  {
    title: "Frontend Development",
    icon: React.createElement(FaDesktop, { className: "text-3xl text-cyan-400", "aria-hidden": "true" }),
    skills: [
      { name: "React.js", icon: React.createElement(SiReact, { className: "text-2xl text-cyan-400", "aria-hidden": "true" }), level: 95 },
      { name: "Next.js", icon: React.createElement(SiNextdotjs, { className: "text-2xl text-black dark:text-white", "aria-hidden": "true" }), level: 90 },
      { name: "React Native", icon: React.createElement(SiExpo, { className: "text-2xl text-purple-400", "aria-hidden": "true" }), level: 85 },
      { name: "TypeScript", icon: React.createElement(SiTypescript, { className: "text-2xl text-blue-400", "aria-hidden": "true" }), level: 90 },
      { name: "JavaScript", icon: React.createElement(SiJavascript, { className: "text-2xl text-yellow-400", "aria-hidden": "true" }), level: 92 },
      { name: "HTML5", icon: React.createElement(SiHtml5, { className: "text-2xl text-orange-500", "aria-hidden": "true" }), level: 95 },
      { name: "CSS3", icon: React.createElement(SiCss3, { className: "text-2xl text-blue-500", "aria-hidden": "true" }), level: 90 },
      { name: "Tailwind CSS", icon: React.createElement(SiTailwindcss, { className: "text-2xl text-teal-400", "aria-hidden": "true" }), level: 88 },
    ],
    gradient: "dark:from-royal-blue-500 dark:via-royal-blue-600 dark:to-royal-purple-600 from-primary-500 via-primary-400 to-primary-600"
  },
  {
    title: "Backend & Database",
    icon: React.createElement(FaServer, { className: "text-3xl text-green-400", "aria-hidden": "true" }),
    skills: [
      { name: "Node.js", icon: React.createElement(SiNodedotjs, { className: "text-2xl text-green-500", "aria-hidden": "true" }), level: 85 },
      { name: "Python", icon: React.createElement(SiPython, { className: "text-2xl text-yellow-400", "aria-hidden": "true" }), level: 90 },
      { name: "PostgreSQL", icon: React.createElement(SiPostgresql, { className: "text-2xl text-blue-400", "aria-hidden": "true" }), level: 80 },
      { name: "Supabase", icon: React.createElement(SiSupabase, { className: "text-2xl text-emerald-400", "aria-hidden": "true" }), level: 82 },
      { name: "Docker", icon: React.createElement(SiDocker, { className: "text-2xl text-blue-500", "aria-hidden": "true" }), level: 75 },
      { name: "C++", icon: React.createElement(SiCplusplus, { className: "text-2xl text-blue-600", "aria-hidden": "true" }), level: 85 },
      { name: "Java", icon: React.createElement(FaJava, { className: "text-2xl text-red-500", "aria-hidden": "true" }), level: 80 },
      { name: "Git", icon: React.createElement(SiGit, { className: "text-2xl text-orange-500", "aria-hidden": "true" }), level: 90 },
    ],
    gradient: "dark:from-secondary-500 dark:via-secondary-600 dark:to-royal-blue-600 from-primary-500 via-primary-400 to-primary-600"
  },
  {
    title: "AI/ML & Data Science",
    icon: React.createElement(FaChartBar, { className: "text-3xl text-purple-400", "aria-hidden": "true" }),
    skills: [
      { name: "TensorFlow", icon: React.createElement(SiTensorflow, { className: "text-2xl text-orange-500", "aria-hidden": "true" }), level: 75 },
      { name: "PyTorch", icon: React.createElement(SiPytorch, { className: "text-2xl text-red-500", "aria-hidden": "true" }), level: 70 },
      { name: "NumPy", icon: React.createElement(SiNumpy, { className: "text-2xl text-blue-400", "aria-hidden": "true" }), level: 85 },
      { name: "Pandas", icon: React.createElement(SiPandas, { className: "text-2xl text-purple-400", "aria-hidden": "true" }), level: 88 },
      { name: "Jupyter", icon: React.createElement(SiJupyter, { className: "text-2xl text-orange-400", "aria-hidden": "true" }), level: 80 },
      { name: "Machine Learning", icon: React.createElement(FaBrain, { className: "text-2xl text-pink-400", "aria-hidden": "true" }), level: 75 },
    ],
    gradient: "dark:from-royal-purple-500 dark:via-royal-purple-600 dark:to-royal-red-600 from-primary-500 via-primary-400 to-primary-600"
  },
  {
    title: "Tools & DevOps",
    icon: React.createElement(FaCog, { className: "text-3xl text-orange-400", "aria-hidden": "true" }),
    skills: [
      { name: "Git", icon: React.createElement(SiGit, { className: "text-2xl text-orange-500", "aria-hidden": "true" }), level: 90 },
      { name: "GitHub", icon: React.createElement(SiGithub, { className: "text-2xl text-gray-300", "aria-hidden": "true" }), level: 92 },
      { name: "Docker", icon: React.createElement(SiDocker, { className: "text-2xl text-blue-400", "aria-hidden": "true" }), level: 75 },
      { name: "Figma", icon: React.createElement(SiFigma, { className: "text-2xl text-purple-400", "aria-hidden": "true" }), level: 85 },
      { name: "VS Code", icon: React.createElement(VscCode, { className: "text-2xl text-blue-500", "aria-hidden": "true" }), level: 95 },
      { name: "Animation", icon: React.createElement(FaRocket, { className: "text-2xl text-green-400", "aria-hidden": "true" }), level: 80 },
    ],
    gradient: "dark:from-royal-red-500 dark:via-royal-red-600 dark:to-primary-600 from-primary-500 via-primary-400 to-primary-600"
  }
];
