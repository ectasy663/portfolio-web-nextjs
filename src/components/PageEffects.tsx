'use client';

import { useEffect, useState } from 'react';

export default function PageEffects() {
  const [showFab, setShowFab] = useState(false);

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
      setShowFab(scrollTop > 400);
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
    const target = document.getElementById('ai-studio');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 z-[1100] bg-gray-200 dark:bg-dark-800">
        <div className="scroll-progress h-full bg-gradient-to-r from-primary-400 to-primary-600 w-0"></div>
      </div>
      <button
        type="button"
        onClick={handleAiJump}
        aria-label="Open AI Studio"
        className={`fixed bottom-6 right-6 z-[1100] rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-xl transition-all duration-300 ${
          showFab ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        } bg-gradient-to-r from-primary-500 via-royal-blue-500 to-primary-600 hover:scale-[1.02]`}
      >
        AI Studio
      </button>
    </>
  );
}
