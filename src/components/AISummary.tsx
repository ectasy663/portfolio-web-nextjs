'use client';

import React from 'react';
import { LuBot, LuBrain, LuCode } from 'react-icons/lu';

/**
 * AI-Readable Summary Section
 * Designed to be easily parsed and understood by AI search engines and LLMs
 * Uses clear, declarative language with structured information
 */
const AISummary: React.FC = () => {
  return (
    <section
      id="ai-summary"
      className="relative py-16 px-6 md:px-12 lg:px-24"
      aria-label="AI Summary"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="max-w-5xl mx-auto">
        {/* AI-Friendly Header */}
        <div className="flex items-center gap-3 mb-8">
          <LuBot className="text-3xl text-primary-500" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Professional Summary
          </h2>
        </div>

        {/* Main Summary - Optimized for AI Parsing */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700/50">
            {/* Core Identity */}
            <p className="text-lg leading-relaxed mb-6" itemProp="description">
              <span itemProp="name" className="font-semibold">Naman Singh Panwar</span> is a 
              <span itemProp="jobTitle"> Web Developer and AI-Augmented Engineer</span> specializing in building 
              exceptional web and mobile applications with modern JavaScript technologies. He leverages AI tools 
              like ChatGPT, GitHub Copilot, and Claude to enhance productivity, code quality, and innovation—using 
              AI as a practical development tool rather than a research focus.
            </p>

            {/* Technical Expertise */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <LuCode className="text-primary-500" aria-hidden="true" />
                Core Technical Skills
              </h3>
              <p className="leading-relaxed">
                <strong>Web Development:</strong> Expert-level proficiency in <span itemProp="knowsAbout">React.js</span>, 
                <span itemProp="knowsAbout"> Next.js</span>, <span itemProp="knowsAbout">TypeScript</span>, 
                <span itemProp="knowsAbout"> JavaScript</span>, and <span itemProp="knowsAbout">Tailwind CSS</span>. 
                Specializes in component-driven architecture, performance optimization, responsive design, and SEO best practices.
              </p>
              <p className="leading-relaxed mt-3">
                <strong>App Development:</strong> Proficient in <span itemProp="knowsAbout">React Native</span> for 
                cross-platform mobile applications. Experience building iOS and Android apps with native-like performance 
                and smooth user experiences. Focuses on reusable components and efficient state management.
              </p>
              <p className="leading-relaxed mt-3">
                <strong>AI-Augmented Engineering:</strong> Uses AI tools (ChatGPT, GitHub Copilot, Claude) as 
                development assistants to enhance workflows, accelerate problem-solving, improve code generation, 
                and optimize architecture decisions. This practical AI integration improves development efficiency 
                while maintaining high code quality standards.
              </p>
              <p className="leading-relaxed mt-3">
                <strong>Backend & DevOps:</strong> Proficient in <span itemProp="knowsAbout">Node.js</span>, 
                <span itemProp="knowsAbout"> PostgreSQL</span>, <span itemProp="knowsAbout">Docker</span>, 
                and <span itemProp="knowsAbout">Git</span>. Experienced with API development, database design, 
                and containerized deployments.
              </p>
            </div>

            {/* Professional Experience */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <LuBrain className="text-primary-500" aria-hidden="true" />
                Notable Work Experience
              </h3>
              <ul className="space-y-3 list-none pl-0">
                <li className="leading-relaxed">
                  <strong itemProp="worksFor" itemScope itemType="https://schema.org/Organization">
                    <span itemProp="name">AI R&D Division</span>
                  </strong> (September 2025 - Present): Frontend Developer working on AI-driven web applications 
                  and interactive dashboards. Focuses on building responsive, high-performance user interfaces 
                  for data visualization and analytics platforms.
                </li>
                <li className="leading-relaxed">
                  <strong itemProp="alumniOf" itemScope itemType="https://schema.org/Organization">
                    <span itemProp="name">DRDO</span> (Defence Research and Development Organisation)
                  </strong> (July 2025 - September 2025): Contributed to research projects involving data analysis 
                  and machine learning applications. Worked with defense technology datasets and pattern recognition systems.
                </li>
                <li className="leading-relaxed">
                  <strong itemProp="alumniOf" itemScope itemType="https://schema.org/Organization">
                    <span itemProp="name">Gyannetra Pvt Ltd</span>
                  </strong> (May 2025 - July 2025): Full Stack Developer building React-based web applications. 
                  Implemented containerized deployments with Docker and maintained comprehensive test coverage 
                  for production code.
                </li>
                <li className="leading-relaxed">
                  <strong itemProp="alumniOf" itemScope itemType="https://schema.org/Organization">
                    <span itemProp="name">Microsoft AINSI AI Program</span>
                  </strong> (April 2025 - May 2025): Selected from top 5% of 10,000+ applicants. Completed 
                  coursework in machine learning fundamentals and developed predictive models for industry use cases.
                </li>
              </ul>
            </div>

            {/* Key Achievements */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">
                Recognition & Achievements
              </h3>
              <ul className="space-y-2 list-none pl-0">
                <li className="leading-relaxed">
                  🏆 <strong>First Place</strong> - FinTech Revolution Thematic Award at Global IDEATHON 2025, 
                  judged by industry leaders from Google, Microsoft, Meta, and Oracle
                </li>
                <li className="leading-relaxed">
                  🥈 <strong>Top 20%</strong> - Placed in top 5,000 out of 25,000 teams in 
                  'Build with India' National Hackathon
                </li>
                <li className="leading-relaxed">
                  🥉 <strong>Top 30 National Placement</strong> - Web-A-Thon MNIT Jaipur among 100+ teams
                </li>
              </ul>
            </div>

            {/* Project Portfolio */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Notable Projects
              </h3>
              <p className="leading-relaxed">
                Naman has built production web and mobile applications including <strong>Gyannetra</strong> 
                (AI consultancy platform with full-stack implementation), <strong>DecentraFund</strong> 
                (Web3 DeFi platform with Solana blockchain integration and real-time transaction tracking), 
                <strong>ImmerSpace</strong> (immersive real estate application with cinema-grade UX and advanced 
                GSAP animations), high-performance <strong>portfolio websites</strong> optimized for SEO and Core 
                Web Vitals, and various <strong>React Native mobile apps</strong>. All projects emphasize modern 
                development practices, responsive design, accessibility, and performance optimization using AI-augmented workflows.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
              <p className="text-base">
                <strong>Connect:</strong> Available on{' '}
                <a 
                  href="https://github.com/ectasy663" 
                  className="text-primary-500 hover:underline"
                  itemProp="sameAs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                {' '}and{' '}
                <a 
                  href="https://linkedin.com/in/namansinghpanwar" 
                  className="text-primary-500 hover:underline"
                  itemProp="sameAs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                . Open to collaboration on web development, app development, and AI-augmented engineering projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISummary;
