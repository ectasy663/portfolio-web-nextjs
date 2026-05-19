'use client';

import React, { useRef, useEffect, memo } from 'react';

interface KnockoutTextProps {
  children: React.ReactNode;
  /** Tailwind / CSS class for the text element */
  textClassName?: string;
  /** Background behind the knockout (visible through the text) */
  backgroundClassName?: string;
  /** The HTML tag to render */
  as?: React.ElementType;
  /** Extra wrapper className */
  className?: string;
  /** Whether to animate with GSAP on scroll */
  animate?: boolean;
  /** id forwarded to the heading for aria */
  id?: string;
}

/**
 * Knockout Text (Exclusion Blend Typography)
 * The text "knocks out" the background, revealing content behind it.
 * Uses mix-blend-mode: exclusion on white text over a colored/image background.
 */
const KnockoutText: React.FC<KnockoutTextProps> = ({
  children,
  textClassName = '',
  backgroundClassName = '',
  as: Tag = 'h2',
  className = '',
  animate = false,
  id,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate || typeof window === 'undefined') return;
    let cancelled = false;

    const init = async () => {
      try {
        const gsapMod = await import('gsap');
        const scrollMod = await import('gsap/ScrollTrigger');
        const gsap = gsapMod.default || gsapMod.gsap || gsapMod;
        const { ScrollTrigger } = scrollMod;
        gsap.registerPlugin(ScrollTrigger);
        if (cancelled || !wrapperRef.current) return;

        const el = wrapperRef.current.querySelector('.knockout-text-inner');
        if (!el) return;

        gsap.fromTo(
          el,
          { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      } catch (e) {
        // silent
      }
    };

    init();
    return () => { cancelled = true; };
  }, [animate]);

  return (
    <div ref={wrapperRef} className={`knockout-text-wrapper relative inline-flex items-center justify-center ${className}`}>
      {/* Background layer */}
      <div
        className={`absolute inset-0 rounded-inherit ${backgroundClassName}`}
        aria-hidden="true"
      />
      {/* Text with exclusion blend — appears to "knock out" through */}
      <Tag
        id={id}
        className={`knockout-text-inner relative z-10 ${textClassName}`}
        style={{ mixBlendMode: 'exclusion' as React.CSSProperties['mixBlendMode'], color: '#ffffff' }}
      >
        {children}
      </Tag>
    </div>
  );
};

export default memo(KnockoutText);
