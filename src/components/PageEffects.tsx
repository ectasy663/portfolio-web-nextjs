'use client';

import { useEffect, useState } from 'react';
import { LuSparkles, LuBrain } from 'react-icons/lu';
import { scrollToId } from '@/utils/scroll';

export default function PageEffects() {
  const [showScrollProgress, setShowScrollProgress] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Occasional pulse effect for the AI orb
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 2000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const bar = document.querySelector<HTMLElement>('.scroll-progress');
    if (!bar) return;

    let rafId = 0;
    const update = () => {
      rafId = 0;
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
      const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
      const pct = Math.min(100, Math.max(0, (scrollTop / max) * 100));
      bar.style.width = `${pct}%`;
      // We can always show the orb, but maybe hide scroll progress at 0
      setShowScrollProgress(scrollTop > 50);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const handleAiJump = () => {
    scrollToId('#ai-studio');
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 z-[1100] bg-transparent">
        <div className="scroll-progress h-full bg-gradient-to-r from-cyan-400 to-blue-600 dark:from-cyan-400 dark:to-primary-500 w-0 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
      </div>
      
      {/* Floating AI Studio Orb */}
      <div className="fixed bottom-6 right-6 z-[1100] group flex items-center gap-3">
        {/* Hover Label */}
        <div className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-white/90 dark:bg-dark-800/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 pointer-events-none">
          <p className="text-sm font-semibold tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            Ask AI Assistant
          </p>
        </div>
        
        {/* Orb Button */}
        <button
          type="button"
          onClick={handleAiJump}
          aria-label="Open AI Studio"
          className="relative w-14 h-14 rounded-full flex items-center justify-center outline-none focus:outline-none transition-transform duration-300 hover:scale-110"
        >
          {/* Ripple effects */}
          <div className={`absolute inset-0 rounded-full border-2 border-cyan-400/50 ${pulse ? 'animate-ping' : ''}`}></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 blur-md group-hover:blur-lg transition-all duration-300"></div>
          
          {/* Main button background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-shadow duration-300 border border-white/20"></div>
          
          <LuBrain className="w-6 h-6 text-white relative z-10 animate-bounce-slow" />
          <LuSparkles className="w-3 h-3 text-yellow-300 absolute top-3 right-3 z-10 drop-shadow-md" />
        </button>
      </div>
    </>
  );
}
