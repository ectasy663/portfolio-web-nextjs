'use client';

import React, { useMemo, useState } from 'react';
import { LuBot, LuSparkles, LuTarget, LuBrain, LuTriangleAlert } from 'react-icons/lu';

interface AskSource {
  title: string;
  section: string;
  snippet: string;
  score: number;
}

interface AskResponse {
  answer: string;
  sources: AskSource[];
}

interface JobMatchResponse {
  score: number;
  summary: string;
  highlights: string[];
  matched_projects: string[];
  matched_skills: string[];
}

const AIStudio: React.FC = () => {
  const apiBase = useMemo(() => {
    const env = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000';
    return env.replace(/\/$/, '');
  }, []);

  const [question, setQuestion] = useState('');
  const [askResult, setAskResult] = useState<AskResponse | null>(null);
  const [askError, setAskError] = useState('');
  const [askLoading, setAskLoading] = useState(false);

  const [jobDescription, setJobDescription] = useState('');
  const [jobResult, setJobResult] = useState<JobMatchResponse | null>(null);
  const [jobError, setJobError] = useState('');
  const [jobLoading, setJobLoading] = useState(false);

  const handleAsk = async (event: React.FormEvent) => {
    event.preventDefault();
    setAskError('');

    if (question.trim().length < 8) {
      setAskError('Ask something more specific so the agent can answer accurately.');
      return;
    }

    setAskLoading(true);
    setAskResult(null);

    try {
      const response = await fetch(`${apiBase}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
      });

      if (!response.ok) {
        throw new Error('AI request failed.');
      }

      const payload: AskResponse = await response.json();
      setAskResult(payload);
    } catch (error) {
      setAskError('Unable to reach the AI service. Try again in a moment.');
    } finally {
      setAskLoading(false);
    }
  };

  const handleJobMatch = async (event: React.FormEvent) => {
    event.preventDefault();
    setJobError('');

    if (jobDescription.trim().length < 80) {
      setJobError('Paste a fuller job description so the match score is meaningful.');
      return;
    }

    setJobLoading(true);
    setJobResult(null);

    try {
      const response = await fetch(`${apiBase}/api/job-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_description: jobDescription.trim() }),
      });

      if (!response.ok) {
        throw new Error('AI request failed.');
      }

      const payload: JobMatchResponse = await response.json();
      setJobResult(payload);
    } catch (error) {
      setJobError('Unable to reach the AI service. Try again in a moment.');
    } finally {
      setJobLoading(false);
    }
  };

  return (
    <section
      id="ai-studio"
      className="relative py-20 px-6 md:px-12 lg:px-24 overflow-hidden"
      aria-labelledby="ai-studio-title"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.22),_transparent_50%)]" />
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(120deg,_rgba(255,255,255,0.03)_0%,_rgba(255,255,255,0.12)_100%)]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/70 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-700/50 shadow-sm">
            <LuSparkles className="text-primary-500" aria-hidden="true" />
            <span className="text-xs uppercase tracking-[0.2em] text-gray-700 dark:text-gray-200">AI Studio</span>
          </div>
          <h2
            id="ai-studio-title"
            className="text-4xl md:text-5xl lg:text-6xl font-display font-normal mt-6 mb-4 text-gray-900 dark:text-white"
          >
            Two live AI experiences
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore a real-time LLM assistant trained on my portfolio data and a job match analyzer that scores fit, highlights strengths, and
            surfaces the most relevant projects.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <article className="relative rounded-3xl border border-gray-200/70 dark:border-gray-700/60 bg-white/90 dark:bg-gray-900/70 p-8 shadow-xl backdrop-blur">
            <div className="absolute -top-8 right-8 w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-royal-blue-500 blur-2xl opacity-70" />
            <div className="flex items-center gap-3 mb-6">
              <LuBot className="text-3xl text-primary-500" aria-hidden="true" />
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Ask Me Anything</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">RAG grounded on my real experience and projects.</p>
              </div>
            </div>

            <form onSubmit={handleAsk} className="space-y-4">
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask about my AI work, projects, or stack."
                className="w-full min-h-[120px] rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/90 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/60"
              />
              <button
                type="submit"
                disabled={askLoading}
                className="w-full rounded-2xl bg-gray-900 text-white px-4 py-3 text-sm font-semibold uppercase tracking-widest disabled:opacity-60"
              >
                {askLoading ? 'Thinking...' : 'Ask the AI'}
              </button>
            </form>

            {askError && (
              <div className="mt-4 flex items-center gap-2 text-sm text-red-500">
                <LuTriangleAlert aria-hidden="true" />
                {askError}
              </div>
            )}

            {askResult && (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/50 p-4 text-sm text-gray-700 dark:text-gray-200">
                  {askResult.answer}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Sources</p>
                  <div className="space-y-2">
                    {askResult.sources.map((source, index) => (
                      <div key={index} className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-3 text-xs text-gray-600 dark:text-gray-300">
                        <div className="font-semibold text-gray-800 dark:text-gray-100">{source.title}</div>
                        <div className="text-[11px] uppercase tracking-wider text-gray-400">{source.section}</div>
                        <p className="mt-2">{source.snippet}...</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </article>

          <article className="relative rounded-3xl border border-gray-200/70 dark:border-gray-700/60 bg-white/90 dark:bg-gray-900/70 p-8 shadow-xl backdrop-blur">
            <div className="absolute -bottom-8 left-6 w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 blur-2xl opacity-70" />
            <div className="flex items-center gap-3 mb-6">
              <LuTarget className="text-3xl text-emerald-500" aria-hidden="true" />
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Job Match Analyzer</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">Upload a JD and get an instant fit score.</p>
              </div>
            </div>

            <form onSubmit={handleJobMatch} className="space-y-4">
              <textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste a job description here."
                className="w-full min-h-[160px] rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/90 dark:bg-gray-900/60 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
              <button
                type="submit"
                disabled={jobLoading}
                className="w-full rounded-2xl bg-emerald-500 text-white px-4 py-3 text-sm font-semibold uppercase tracking-widest disabled:opacity-60"
              >
                {jobLoading ? 'Analyzing...' : 'Score the Match'}
              </button>
            </form>

            {jobError && (
              <div className="mt-4 flex items-center gap-2 text-sm text-red-500">
                <LuTriangleAlert aria-hidden="true" />
                {jobError}
              </div>
            )}

            {jobResult && (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700/50 p-4 bg-gray-50 dark:bg-gray-800/60">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">Match Score</p>
                    <span className="text-2xl font-semibold text-gray-900 dark:text-white">{jobResult.score}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                      style={{ width: `${jobResult.score}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/50 p-4 text-sm text-gray-700 dark:text-gray-200">
                  {jobResult.summary}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 p-4">
                    <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Highlights</p>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                      {jobResult.highlights.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <LuBrain className="text-primary-500 mt-1" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 p-4">
                    <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Best Fits</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-gray-400">Projects</p>
                        <p className="text-sm text-gray-700 dark:text-gray-200">
                          {jobResult.matched_projects.join(', ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-gray-400">Skills</p>
                        <p className="text-sm text-gray-700 dark:text-gray-200">
                          {jobResult.matched_skills.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
};

export default AIStudio;
