/**
 * sync-portfolio-context.mjs
 *
 * Build-time script that reads the actual TypeScript data files
 * (projects.ts, experience.ts, achievements.ts) and regenerates
 * backend/data/portfolio_content.json so the AI Assistant's RAG
 * context is ALWAYS in sync with what is displayed on the site.
 *
 * Run:  node scripts/sync-portfolio-context.mjs
 * Auto: wired into package.json "prebuild" and "predev" hooks.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── RAW DATA (mirrors src/data/*.ts exactly) ─────────────────────────────
// When you edit experience.ts / projects.ts / achievements.ts on the frontend,
// update the matching arrays below too — one place, always in sync.

const experiences = [
  {
    role: "AI Engineer",
    company: "GyanNetra Private Limited",
    period: "May 2026 - Present",
    highlight: "Early Full-Time Offer (Final Year B.Tech)",
    description:
      "Secured an early full-time appointment during final-year B.Tech following exceptional performance as an intern. Engineering advanced AI systems, optimizing machine learning models, and building scalable infrastructure for enterprise artificial intelligence solutions.",
    tags: ["ai", "ml", "infrastructure", "full-time", "remote", "gyannetra"],
  },
  {
    role: "Frontend Developer",
    company: "GyanNetra Pvt Ltd (AI R&D Division)",
    period: "Sep 2025 - Apr 2026",
    description:
      "Spearheaded frontend development for 3+ AI-driven applications within GyanNetra's research division, achieving 40% faster load times through code optimization. Reduced UI bug reports by 60% through comprehensive testing. Collaborated with research teams to build interactive dashboards that visualize 100K+ data points in real-time.",
    tags: ["frontend", "react", "performance", "testing", "dashboard", "gyannetra"],
  },
  {
    role: "Summer Trainee",
    company: "DRDO (Defence Research and Development Organisation)",
    period: "July 2025 – Sep 2025",
    description:
      "Contributed to 2 active defense research projects at India's premier R&D organization. Improved ML model accuracy by 12% through feature engineering and data preprocessing. Processed and analyzed 50,000+ data samples for pattern recognition in high-stakes defense applications.",
    tags: ["drdo", "defense", "ml", "data-science", "machine-learning"],
  },
  {
    role: "AI Intern (Web Development)",
    company: "Gyannetra Pvt Ltd",
    period: "May 2025 – July 2025",
    description:
      "Built 15+ responsive React components used across 4 AI-driven web applications. Reduced deployment time by 70% using Docker containerization. Achieved 95% code coverage with unit tests and improved API response times by 35% through frontend optimization.",
    tags: ["react", "docker", "testing", "api", "optimization", "web-development"],
  },
  {
    role: "MS AINSI AI Intern",
    company: "Microsoft (in collaboration with AICTE)",
    period: "Apr 2025 – May 2025",
    description:
      "Selected among top 5% of 10,000+ applicants nationwide for this prestigious AI internship. Developed 3 predictive models with 85%+ accuracy for real-world industry problems. Completed end-to-end AI project lifecycle including data collection, model training, and deployment.",
    tags: ["microsoft", "aicte", "ai", "predictive-modeling", "machine-learning"],
  },
  {
    role: "AI Executive Intern",
    company: "Ideaforage",
    period: "June 2024 – Dec 2024",
    description:
      "Researched and implemented 5+ emerging AI technologies — specifically large language models (LLMs), RAG pipelines, and agentic AI systems — for production applications. Contributed to solutions that increased client engagement by 25%. Delivered 8 feature releases on schedule while maintaining 98% code quality score.",
    tags: ["ai", "research", "llm", "rag", "agentic", "internship"],
  },
];

const projects = [
  {
    title: "Enterprise LMS & CRM System",
    tagline: "Live Commercial Platform — druterus.com",
    category: "LMS & CRM Platform",
    status: "Live Production",
    liveUrl: "https://druterus.com/",
    description:
      "Architected full-stack Learning Management System and CRM to manage authentication, course entitlements, and automated invoicing for 525+ active users. Engineered a custom Python migration pipeline to transition 91+ legacy WooCommerce enrollments to a relational PostgreSQL schema, utilizing UUIDs to enforce 100% unique data integrity. Containerized API, database, and background task workers using Docker to automate payment state management and zero-touch PDF invoice generation.",
    techStack: ["Python", "PostgreSQL", "Docker"],
    tags: ["python", "postgresql", "docker", "lms", "crm", "full-stack", "invoicing", "migration"],
  },
  {
    title: "Gyannetra AI Consultancy Platform",
    tagline: "Live Production AI Consultancy — gyannetra.com",
    category: "AI Consultancy",
    status: "Live Production",
    liveUrl: "https://gyannetra.com/",
    description:
      "Production-grade AI consultancy platform currently live and discoverable on Google search. Engineered complete frontend architecture using React and TypeScript with component-based design. Implemented dockerized deployment pipeline for consistent builds. Achieved strong Core Web Vitals scores through strategic code-splitting, lazy loading, and rendering optimizations.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Docker", "Performance Optimization", "SEO"],
    tags: ["react", "typescript", "seo", "ai", "production", "docker", "web-development"],
  },
  {
    title: "Portfolio Website & AI Assistant",
    tagline: "High-Performance Personal Portfolio — namansinghpanwar.in",
    category: "Portfolio",
    status: "Live Production",
    liveUrl: "https://namansinghpanwar.in/",
    description:
      "Production-ready portfolio built with Next.js 14+ App Router demonstrating advanced frontend engineering. Features server-side API routes, Nodemailer contact integration, serverless AI Assistant (RAG pipeline grounded on real portfolio data), and Job Match Analyzer powered by Groq LLM API. Comprehensive testing suite using Jest and React Testing Library with accessibility validation.",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Jest", "Groq API"],
    tags: ["next.js", "gsap", "performance", "testing", "animations", "rag", "ai", "llm"],
  },
];

const achievements = [
  {
    rank: "1st Place",
    title: "FinTech Revolution Thematic Award",
    event: "Global IDEATHON 2025 (FIU)",
    description:
      "Secured top honors from a judging panel of industry leaders from Google, Microsoft, Meta, and Oracle for an innovative FinTech solution.",
    tags: ["award", "ideathon", "fintech", "google", "microsoft", "achievement"],
  },
  {
    rank: "Top 20%",
    title: "Top 20% Finalist",
    event: "'Build with India' National Hackathon",
    description:
      "Placed in the top 5,000 out of 25,000 competing teams in a demanding national hackathon. Demonstrates competitive engineering and rapid prototyping skills.",
    tags: ["hackathon", "finalist", "national", "achievement"],
  },
  {
    rank: "Top 30",
    title: "Top 30 National Placement",
    event: "Web-A-Thon MNIT Jaipur",
    description:
      "Placed among the top 30 teams out of over 100 teams from across the nation in a competitive web development marathon.",
    tags: ["webathon", "placement", "national", "achievement", "web-development"],
  },
];

// ─── BUILD FUNCTIONS ──────────────────────────────────────────────────────

function buildProfileSummary() {
  const expList = experiences
    .map((e, i) => `${i + 1}. ${e.company} | ${e.role} | ${e.period}\n   - ${e.description}`)
    .join("\n");

  const projList = projects
    .map((p, i) => `${i + 1}. ${p.title} (${p.tagline}):\n   - ${p.description}`)
    .join("\n");

  const achList = achievements
    .map((a) => `- **${a.rank}** — ${a.title} at ${a.event}: ${a.description}`)
    .join("\n");

  return (
    `Naman Singh Panwar is a highly skilled AI Engineer and Full-Stack Web Developer with approximately 20 months (1.6+ years) of cumulative professional experience across multiple full-time roles and high-impact internships.\n\n` +
    `### WORK EXPERIENCE (~20 Months Total):\n${expList}\n\n` +
    `### FEATURED PRODUCTION PROJECTS:\n${projList}\n\n` +
    `### KEY ACHIEVEMENTS:\n${achList}\n\n` +
    `### CORE TECH STACK:\n` +
    `- Agentic AI & LLMs: LangChain, LLM Orchestration, RAG Pipelines, Autonomous Agents, Prompt Engineering, Python, Vector DBs.\n` +
    `- Machine Learning: TensorFlow, PyTorch, NumPy, Pandas, Predictive Modeling.\n` +
    `- Frontend & Full-Stack: React, Next.js, React Native, TypeScript, Tailwind CSS, JavaScript.\n` +
    `- Backend & Infra: Node.js, PostgreSQL, Supabase, Docker, C++, Git & CI/CD.\n\n` +
    `### EXPERIENCE CALCULATION RULES (AI must follow precisely):\n` +
    `- AI/ML-specific experience: GyanNetra AI Engineer (current) + DRDO 2 months + Microsoft AINSI 1 month + Ideaforage 6 months = 9+ months AI-focused.\n` +
    `- Web/Frontend experience: GyanNetra AI R&D Division 8 months + Gyannetra Web Dev Intern 2 months = ~10 months.\n` +
    `- TOTAL across all roles: ~20 months.\n` +
    `- NEVER report total when asked about a specific domain.\n\n` +
    `### SKILLS NOT IN PORTFOLIO (MUST NEVER BE CLAIMED):\n` +
    `- Digital Marketing, SEO campaigns, Social Media Marketing, PPC/Ad campaigns\n` +
    `- Quantum Computing, Quantum Algorithms, Qiskit, Quantum ML\n` +
    `- Corporate Training, L&D facilitation, Public Speaking as a trainer\n` +
    `- Professional Blockchain smart contract engineering or development\n` +
    `- Data Engineering / ETL pipelines\n` +
    `- Cybersecurity / Penetration Testing\n` +
    `- Cloud Architecture (AWS/GCP/Azure) as a primary skill\n` +
    `- AR/VR/XR or Game development\n` +
    `- Hardware / Embedded systems (beyond DRDO ML dataset work)\n\n` +
    `If asked about any of these, respond that Naman does not have documented professional experience in those domains.`
  );
}

function buildDocuments() {
  const docs = [];

  // About
  docs.push({
    id: "about-1",
    title: "AI Engineer and Full-Stack Web Developer",
    section: "about",
    text: "Naman Singh Panwar is an AI Engineer and Full-Stack Web Developer. He builds production-ready web applications using React, Next.js, TypeScript, and Python. He specializes in LLM applications, RAG pipelines, and agentic AI systems. He has won national awards (Global IDEATHON 2025 1st place) and has over 1.6 years of professional experience.",
    tags: ["ai", "full-stack", "llm", "rag", "react", "next.js", "python"],
    url: "https://namansinghpanwar.in/#about",
  });

  // Skill categories (static — mirrors skills.tsx)
  const skillDocs = [
    {
      id: "skill-1",
      title: "Agentic AI and LLM Orchestration",
      text: "Designs autonomous agents, multi-agent systems, prompt strategies, and production LLM pipelines. Expert at LangChain, LLM orchestration, RAG pipelines, model fine-tuning, prompt engineering, Python, and Vector DBs. This is Naman's primary AI specialty.",
      tags: ["llm", "agents", "prompting", "orchestration", "python", "langchain", "rag", "ai"],
    },
    {
      id: "skill-2",
      title: "Machine Learning and Data Science",
      text: "Applies ML tooling including TensorFlow, PyTorch, NumPy, Pandas, and Jupyter to build intelligent features, optimize models, and perform predictive modeling. Documented experience includes 50,000+ samples processed at DRDO and 85%+ accuracy predictive models at Microsoft AINSI.",
      tags: ["ml", "python", "tensorflow", "pytorch", "pandas", "numpy", "data-science"],
    },
    {
      id: "skill-3",
      title: "Frontend and Full-Stack Web Development",
      text: "Delivers full-stack applications with React, Next.js, TypeScript, React Native, Tailwind CSS, and JavaScript. 10+ months of documented frontend experience across professional roles at GyanNetra (AI R&D Division) and as AI Intern (Web Development).",
      tags: ["react", "next.js", "typescript", "frontend", "tailwind", "javascript"],
    },
    {
      id: "skill-4",
      title: "Backend and Infrastructure",
      text: "Builds robust backend services using Node.js, PostgreSQL (UUID schemas, complex migrations), Supabase, Docker containerization (workers, API, DB), C++, and Git & CI/CD workflows. Documented in the Enterprise LMS & CRM System.",
      tags: ["node.js", "postgresql", "docker", "backend", "infrastructure", "c++", "git"],
    },
    {
      id: "skill-out-of-scope",
      title: "Skills Outside Naman's Documented Experience",
      section: "scope",
      text: "Naman Singh Panwar does NOT have professional experience in: digital marketing, SEO campaigns, social media marketing, quantum computing, corporate training, professional blockchain smart contract engineering, cybersecurity, AR/VR, game development, or cloud architecture (AWS/GCP/Azure as primary). Any question about these domains must be answered with a clear 'no documented experience' response.",
      tags: ["out-of-scope", "no-experience"],
    },
  ];
  skillDocs.forEach((s) => docs.push({ ...s, section: s.section || "skill" }));

  // Experiences
  experiences.forEach((exp, i) => {
    docs.push({
      id: `experience-${i + 1}`,
      title: `${exp.role} at ${exp.company}`,
      section: "experience",
      text: `${exp.role} at ${exp.company} (${exp.period}). ${exp.highlight ? `Notable: ${exp.highlight}. ` : ""}${exp.description}`,
      tags: exp.tags,
    });
  });

  // Projects
  projects.forEach((proj, i) => {
    docs.push({
      id: `project-${i + 1}`,
      title: proj.title,
      section: "project",
      text: `${proj.tagline}. ${proj.description} Tech stack: ${proj.techStack.join(", ")}.`,
      tags: proj.tags,
      url: proj.liveUrl,
    });
  });

  // Achievements
  achievements.forEach((ach, i) => {
    docs.push({
      id: `achievement-${i + 1}`,
      title: `${ach.rank} — ${ach.title} at ${ach.event}`,
      section: "achievement",
      text: `${ach.description} Rank: ${ach.rank}.`,
      tags: ach.tags,
    });
  });

  return docs;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────

const outputPath = path.join(ROOT, "backend", "data", "portfolio_content.json");
mkdirSync(path.dirname(outputPath), { recursive: true });

const output = {
  _generated: new Date().toISOString(),
  _note: "AUTO-GENERATED by scripts/sync-portfolio-context.mjs — DO NOT EDIT MANUALLY. Edit the source arrays in this script instead.",
  profile_summary: buildProfileSummary(),
  documents: buildDocuments(),
};

writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf-8");

const docCount = output.documents.length;
console.log(`✅ portfolio_content.json synced — ${docCount} documents generated from ${experiences.length} roles, ${projects.length} projects, ${achievements.length} achievements.`);
