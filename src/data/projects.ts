export const projects = [
  {
    title: "Enterprise LMS & CRM System",
    tagline: "Commercial LMS & CRM Platform",
    description: "Architected full-stack Learning Management System and CRM to manage authentication, course entitlements, and automated invoicing for 525+ active users. Engineered a custom Python migration pipeline to transition 91+ legacy WooCommerce enrollments to a relational PostgreSQL schema, utilizing UUIDs to enforce 100% unique data integrity. Containerized API, database, and background task workers using Docker to automate payment state management and zero-touch PDF invoice generation.",
    features: [
      { text: "Architected LMS & CRM for 525+ active users" },
      { text: "Custom Python migration pipeline for 91+ WooCommerce enrollments" },
      { text: "Relational PostgreSQL schema with 100% UUID data integrity" },
      { text: "Containerized API & background task workers using Docker" },
      { text: "Automated payment state management" },
      { text: "Zero-touch PDF invoice generation" }
    ],
    techStack: ["Python", "PostgreSQL", "Docker"],
    liveUrl: "https://druterus.com/",
    githubUrl: "#",
    stats: { stars: 0, forks: 0, views: 0 },
    date: "2026",
    gradient: "dark:from-primary-500 dark:via-royal-red-600 dark:to-primary-600 from-primary-500 via-primary-400 to-primary-600",
    category: "LMS & CRM Platform",
    status: "Live Production"
  },
  {
    title: "Gyannetra AI Consultancy",
    tagline: "Live Production AI Consultancy Platform",
    description: "Production-grade AI consultancy platform currently live and discoverable on Google search. Engineered complete frontend architecture using React and TypeScript with component-based design. Implemented dockerized deployment pipeline for consistent builds across environments. Achieved strong Core Web Vitals scores through strategic code-splitting, lazy loading, and rendering optimizations. Platform serves as primary digital presence for AI consulting services, showcasing tools and solutions through polished, interactive components. Focused on conversion-optimized UI/UX while maintaining clean, professional aesthetics and SEO-ready structure.",
    features: [
      { text: "Production-grade .com deployment" },
      { text: "Minimalist, premium UI/UX" },
      { text: "Scalable React + TypeScript component architecture" },
      { text: "Dockerized build & deployment workflow" },
      { text: "Core Web Vitals + rendering optimizations" },
      { text: "SEO-ready structure & metadata hygiene" }
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Docker", "Performance Optimization", "SEO"],
    liveUrl: "https://gyannetra.com/",
    githubUrl: "#",
    stats: { stars: 0, forks: 0, views: 0 },
    date: "2026",
    gradient: "dark:from-primary-500 dark:via-royal-red-600 dark:to-primary-600 from-primary-500 via-primary-400 to-primary-600",
    category: "AI Consultancy",
    status: "Live Production"
  },
  {
    title: "Portfolio Website (Next.js)",
    tagline: "High-Performance Personal Portfolio",
    description: "Production-ready portfolio built with Next.js 14+ App Router architecture demonstrating advanced frontend engineering practices. Implements component-driven architecture with reusable, type-safe components using TypeScript. Features server-side API routes for contact form handling with Nodemailer integration. Achieved significant performance gains through dynamic imports for heavy dependencies (GSAP animations), code-splitting, and lazy loading strategies. Comprehensive testing suite using Jest and React Testing Library with accessibility validation via axe-core. Optimized for Core Web Vitals with strategic resource loading and minimal render-blocking. Demonstrates professional-grade code organization, error boundaries, and production deployment best practices.",
    features: [
      { text: "Next.js App Router architecture" },
      { text: "Reusable section components" },
      { text: "GSAP-powered cinematic animations" },
      { text: "Dynamic imports for performance" },
      { text: "Contact API route (server-side)" },
      { text: "Jest + RTL tests & a11y checks" }
    ],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Jest", "React Testing Library"],
    liveUrl: "https://namansinghpanwar.vercel.app/",
    githubUrl: "https://github.com/ectasy663/portfolio-web-nextjs",
    stats: { stars: 0, forks: 0, views: 0 },
    date: "2026",
    gradient: "dark:from-primary-500 dark:via-royal-red-600 dark:to-primary-600 from-primary-500 via-primary-400 to-primary-600",
    category: "Portfolio",
    status: "Live Production"
  }
];
