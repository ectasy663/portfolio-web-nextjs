'use client';

import React, { useRef } from 'react';
import { LuCircleHelp, LuChevronDown } from 'react-icons/lu';
import { useInViewOnce } from '@/hooks/useInViewOnce';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What technologies does Naman specialize in?',
    answer: 'Naman specializes in modern web and app development technologies including React.js, Next.js, React Native, TypeScript, and Tailwind CSS. He uses AI tools and assistants to enhance his development workflow, improve code quality, and accelerate project delivery. He also has strong experience with Node.js, Docker, PostgreSQL, and Git for full-stack development.',
  },
  {
    question: 'What kind of projects has Naman built?',
    answer: 'Naman has built production-grade web applications including AI consultancy platforms (Gyannetra), high-performance portfolio websites with advanced animations, Web3 DeFi applications with blockchain integration, immersive real estate platforms, and mobile apps. All projects emphasize performance optimization, scalability, and exceptional user experience, built with AI-enhanced development practices.',
  },
  {
    question: 'How does Naman use AI in his development work?',
    answer: 'Naman leverages AI as a powerful development tool to enhance productivity and code quality. He uses AI assistants for code generation, debugging, optimization suggestions, and architectural decisions. This AI-augmented approach allows him to build applications faster while maintaining high quality, achieving measurable improvements like 40% faster load times and 60% fewer bugs.',
  },
  {
    question: 'What is Naman\'s approach to web development?',
    answer: 'Naman follows a component-driven architecture with emphasis on performance optimization, accessibility, and SEO. He implements dynamic code splitting, lazy loading, comprehensive testing with Jest and React Testing Library, and ensures Core Web Vitals compliance. His code is modular, type-safe with TypeScript, production-ready, and built with AI-assisted development for maximum efficiency.',
  },
  {
    question: 'Has Naman worked with any notable organizations?',
    answer: 'Yes, Naman has worked with several prestigious organizations including DRDO (Defence Research and Development Organisation), Microsoft through the AINSI AI program (top 5% of 10,000+ applicants), Gyannetra Pvt Ltd, and is currently working in an AI R&D Division. He has also won awards judged by industry leaders from Google, Microsoft, Meta, and Oracle.',
  },
  {
    question: 'What makes Naman stand out as a developer?',
    answer: 'Naman combines strong web and app development expertise with AI-augmented engineering practices. He delivers production-grade applications with measurable improvements (40% faster load times, 60% fewer bugs) and has won national recognition in hackathons. His unique approach of using AI as a development multiplier allows him to maintain high velocity while ensuring code quality and user experience.',
  },
  {
    question: 'Is Naman available for freelance or collaboration?',
    answer: 'Naman is open to discussing interesting web development, app development, and AI-enhanced project opportunities. You can reach out through the contact form on this website, via email, or connect on LinkedIn and GitHub. He is particularly interested in projects involving modern web technologies, mobile apps, and innovative AI-augmented solutions.',
  },
];

const FAQ: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const shouldAnimate = useInViewOnce(sectionRef, { rootMargin: '200px', threshold: 0.1 });

  useSplitTextAnimation({
    scopeRef: sectionRef,
    targetRef: titleRef,
    enabled: shouldAnimate,
    desktop: {
      duration: 1,
      stagger: 0.04,
      ease: 'back.out(1.7)',
      from: { y: 28 },
    },
    mobile: {
      duration: 0.9,
      stagger: 0.035,
      ease: 'back.out(1.7)',
      from: { y: 20 },
    },
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative py-20 px-6 md:px-12 lg:px-24 overflow-hidden scroll-mt-28"
      aria-labelledby="faq-title"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <LuCircleHelp className="text-3xl text-primary-500" aria-hidden="true" />
            <span className="text-sm font-medium text-primary-500 tracking-wider uppercase">
              Frequently Asked
            </span>
          </div>
          <h2
            id="faq-title"
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 overflow-hidden"
          >
            <span className="inline-block">Questions</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about my skills, experience, and approach to building 
            intelligent web applications.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4" role="list">
          {faqData.map((faq, index) => (
            <article
              key={index}
              className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary-500/30"
              role="listitem"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/80"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </h3>
                <LuChevronDown
                  className={`text-2xl text-primary-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              
              <div
                id={`faq-answer-${index}`}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
              >
                <div className="px-6 pb-5 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* FAQ Schema structured data is added in page.tsx */}
    </section>
  );
};

export default FAQ;
