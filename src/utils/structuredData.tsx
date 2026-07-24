/**
 * Structured Data / Schema.org JSON-LD utilities
 * For maximum SEO and AI discoverability
 */

export interface PersonSchema {
  '@context': string;
  '@type': 'Person';
  name: string;
  url: string;
  image?: string;
  jobTitle: string;
  description: string;
  email?: string;
  alumniOf?: {
    '@type': string;
    name: string;
  };
  knowsAbout: string[];
  sameAs: string[];
  worksFor?: Array<{
    '@type': string;
    name: string;
    url?: string;
  }>;
}

export interface WebSiteSchema {
  '@context': string;
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  author: {
    '@type': string;
    name: string;
  };
  inLanguage: string;
  copyrightYear: number;
}

export interface CreativeWorkSchema {
  '@context': string;
  '@type': 'CreativeWork' | 'SoftwareApplication';
  name: string;
  description: string;
  url?: string;
  author: {
    '@type': string;
    name: string;
  };
  datePublished: string;
  keywords: string[];
  programmingLanguage?: string[];
  applicationCategory?: string;
}

export interface FAQPageSchema {
  '@context': string;
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
}

export interface BreadcrumbSchema {
  '@context': string;
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }>;
}

/**
 * Generate Person schema for portfolio owner
 */
export function generatePersonSchema(): PersonSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Naman Singh Panwar',
    url: 'https://namansinghpanwar.vercel.app',
    image: 'https://namansinghpanwar.vercel.app/assets/Name-logo-without-bg.png',
    jobTitle: 'Web Developer & AI-Augmented Engineer',
    description: 'Full Stack Web Developer and App Developer who leverages artificial intelligence as a powerful development tool. Specializes in React, Next.js, React Native, TypeScript, and building production-grade applications with AI-enhanced workflows.',
    knowsAbout: [
      'Web Development',
      'Full Stack Development',
      'App Development',
      'React.js',
      'Next.js',
      'React Native',
      'TypeScript',
      'JavaScript',
      'AI-Assisted Development',
      'Frontend Development',
      'Backend Development',
      'Mobile Development',
      'Tailwind CSS',
      'Node.js',
      'Docker',
      'Git',
      'PostgreSQL',
      'Performance Optimization',
      'Responsive Design',
      'API Development'
    ],
    sameAs: [
      'https://github.com/ectasy663',
      'https://linkedin.com/in/namansinghpanwar',
    ],
    worksFor: [
      {
        '@type': 'Organization',
        name: 'GyanNetra Pvt Ltd (AI R&D Division)',
      },
    ],
  };
}

/**
 * Generate WebSite schema
 */
export function generateWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Naman Singh Panwar Portfolio',
    url: 'https://namansinghpanwar.vercel.app',
    description: 'Professional portfolio showcasing AI/ML engineering projects, full stack development work, and technical achievements by Naman Singh Panwar.',
    author: {
      '@type': 'Person',
      name: 'Naman Singh Panwar',
    },
    inLanguage: 'en-US',
    copyrightYear: new Date().getFullYear(),
  };
}

/**
 * Generate CreativeWork schema for a project
 */
export function generateProjectSchema(project: {
  title: string;
  description: string;
  liveUrl?: string;
  techStack: string[];
  date: string;
  category: string;
}): CreativeWorkSchema {
  return {
    '@context': 'https://schema.org',
    '@type': project.category.includes('App') ? 'SoftwareApplication' : 'CreativeWork',
    name: project.title,
    description: project.description,
    url: project.liveUrl,
    author: {
      '@type': 'Person',
      name: 'Naman Singh Panwar',
    },
    datePublished: project.date,
    keywords: project.techStack,
    programmingLanguage: project.techStack,
    applicationCategory: project.category,
  };
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): FAQPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Breadcrumb schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Render JSON-LD script tag
 */
export function renderJSONLD(schema: any) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
