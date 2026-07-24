import React from 'react';
import {
  SiReact, SiTypescript, SiJavascript, SiPython, SiCplusplus,
  SiHtml5, SiCss, SiTailwindcss, SiGit, SiGithub, SiDocker, SiFigma,
  SiNodedotjs, SiPostgresql, SiSupabase, SiNextdotjs,
  SiTensorflow, SiPytorch, SiNumpy, SiPandas, SiJupyter, SiExpo
} from 'react-icons/si';
import {
  FaBrain, FaCode, FaJava, FaRocket,
  FaDesktop, FaServer, FaChartBar, FaCog,
  FaRobot, FaProjectDiagram, FaNetworkWired, FaDatabase
} from 'react-icons/fa';
import { VscCode } from 'react-icons/vsc';

export const skillCategories = [
  {
    title: "Agentic AI & LLMs",
    icon: React.createElement(FaRobot, { className: "text-3xl text-purple-400", "aria-hidden": "true" }),
    skills: [
      { name: "LangChain & Frameworks", icon: React.createElement(FaProjectDiagram, { className: "text-2xl text-blue-500", "aria-hidden": "true" }), evidence: "GyanNetra AI Architecture" },
      { name: "LLM Orchestration", icon: React.createElement(FaNetworkWired, { className: "text-2xl text-purple-400", "aria-hidden": "true" }), evidence: "Production Multi-Agents" },
      { name: "RAG Pipelines", icon: React.createElement(FaDatabase, { className: "text-2xl text-emerald-400", "aria-hidden": "true" }), evidence: "Vector DB & Embeddings" },
      { name: "Autonomous Agents", icon: React.createElement(FaRobot, { className: "text-2xl text-pink-400", "aria-hidden": "true" }), evidence: "Agentic AI Systems" },
      { name: "Prompt Engineering", icon: React.createElement(FaCode, { className: "text-2xl text-yellow-400", "aria-hidden": "true" }), evidence: "Production Optimized" },
      { name: "Model Fine-Tuning", icon: React.createElement(FaCog, { className: "text-2xl text-orange-400", "aria-hidden": "true" }), evidence: "Domain Adaptation" },
      { name: "Python", icon: React.createElement(SiPython, { className: "text-2xl text-yellow-400", "aria-hidden": "true" }), evidence: "DRDO & GyanNetra Pipelines" },
      { name: "Vector DBs", icon: React.createElement(SiPostgresql, { className: "text-2xl text-blue-400", "aria-hidden": "true" }), evidence: "PostgreSQL & pgvector" },
      { name: "Background Workers", icon: React.createElement(FaServer, { className: "text-2xl text-emerald-400", "aria-hidden": "true" }), evidence: "Containerized Workers" },
      { name: "Automated Invoicing", icon: React.createElement(FaCode, { className: "text-2xl text-yellow-400", "aria-hidden": "true" }), evidence: "525+ User LMS System" },
    ],
    gradient: "dark:from-royal-purple-500 dark:via-royal-purple-600 dark:to-royal-red-600 from-primary-500 via-primary-400 to-primary-600"
  },
  {
    title: "Machine Learning & Data Science",
    icon: React.createElement(FaBrain, { className: "text-3xl text-orange-400", "aria-hidden": "true" }),
    skills: [
      { name: "TensorFlow", icon: React.createElement(SiTensorflow, { className: "text-2xl text-orange-500", "aria-hidden": "true" }), evidence: "MS AINSI AI Program" },
      { name: "PyTorch", icon: React.createElement(SiPytorch, { className: "text-2xl text-red-500", "aria-hidden": "true" }), evidence: "Deep Learning Models" },
      { name: "NumPy", icon: React.createElement(SiNumpy, { className: "text-2xl text-blue-400", "aria-hidden": "true" }), evidence: "50K+ Data Samples (DRDO)" },
      { name: "Pandas", icon: React.createElement(SiPandas, { className: "text-2xl text-purple-400", "aria-hidden": "true" }), evidence: "Custom Migration Pipeline" },
      { name: "Jupyter", icon: React.createElement(SiJupyter, { className: "text-2xl text-orange-400", "aria-hidden": "true" }), evidence: "R&D Experiments" },
      { name: "Predictive Modeling", icon: React.createElement(FaChartBar, { className: "text-2xl text-pink-400", "aria-hidden": "true" }), evidence: "85%+ Accuracy Models" },
    ],
    gradient: "dark:from-royal-red-500 dark:via-royal-red-600 dark:to-primary-600 from-primary-500 via-primary-400 to-primary-600"
  },
  {
    title: "Frontend & Full-Stack",
    icon: React.createElement(FaDesktop, { className: "text-3xl text-cyan-400", "aria-hidden": "true" }),
    skills: [
      { name: "React.js", icon: React.createElement(SiReact, { className: "text-2xl text-cyan-400", "aria-hidden": "true" }), evidence: "Live Apps & Portfolios" },
      { name: "Next.js", icon: React.createElement(SiNextdotjs, { className: "text-2xl text-black dark:text-white", "aria-hidden": "true" }), evidence: "App Router & SSR" },
      { name: "TypeScript", icon: React.createElement(SiTypescript, { className: "text-2xl text-blue-400", "aria-hidden": "true" }), evidence: "Strict Type Safety" },
      { name: "React Native", icon: React.createElement(SiExpo, { className: "text-2xl text-purple-400", "aria-hidden": "true" }), evidence: "Mobile App Suite" },
      { name: "Tailwind CSS", icon: React.createElement(SiTailwindcss, { className: "text-2xl text-teal-400", "aria-hidden": "true" }), evidence: "Responsive UI/UX" },
      { name: "JavaScript", icon: React.createElement(SiJavascript, { className: "text-2xl text-yellow-400", "aria-hidden": "true" }), evidence: "ES6+ Full Stack" },
    ],
    gradient: "dark:from-royal-blue-500 dark:via-royal-blue-600 dark:to-royal-purple-600 from-primary-500 via-primary-400 to-primary-600"
  },
  {
    title: "Backend & Infrastructure",
    icon: React.createElement(FaServer, { className: "text-3xl text-green-400", "aria-hidden": "true" }),
    skills: [
      { name: "Node.js", icon: React.createElement(SiNodedotjs, { className: "text-2xl text-green-500", "aria-hidden": "true" }), evidence: "RESTful Server APIs" },
      { name: "PostgreSQL", icon: React.createElement(SiPostgresql, { className: "text-2xl text-blue-400", "aria-hidden": "true" }), evidence: "Relational UUID Schemas" },
      { name: "Supabase", icon: React.createElement(SiSupabase, { className: "text-2xl text-emerald-400", "aria-hidden": "true" }), evidence: "Cloud DB & Auth" },
      { name: "Docker", icon: React.createElement(SiDocker, { className: "text-2xl text-blue-500", "aria-hidden": "true" }), evidence: "Containerized Workers" },
      { name: "C++", icon: React.createElement(SiCplusplus, { className: "text-2xl text-blue-600", "aria-hidden": "true" }), evidence: "Algorithms & Logic" },
      { name: "Git & CI/CD", icon: React.createElement(SiGit, { className: "text-2xl text-orange-500", "aria-hidden": "true" }), evidence: "Production Deploys" },
      { name: "Data Migration", icon: React.createElement(FaDatabase, { className: "text-2xl text-purple-400", "aria-hidden": "true" }), evidence: "91+ WooCommerce Records" },
      { name: "QA Testing", icon: React.createElement(FaCog, { className: "text-2xl text-blue-400", "aria-hidden": "true" }), evidence: "Jest & RTL Suites" },
    ],
    gradient: "dark:from-secondary-500 dark:via-secondary-600 dark:to-royal-blue-600 from-primary-500 via-primary-400 to-primary-600"
  }
];
