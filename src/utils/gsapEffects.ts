'use client';

import gsap from 'gsap';

/**
 * Custom SplitText implementation - splits text into characters/words for animation
 */
export function splitTextIntoSpans(element: HTMLElement, type: 'chars' | 'words' | 'both' = 'chars'): { chars: HTMLSpanElement[], words: HTMLSpanElement[] } {
  const text = element.textContent || '';
  element.innerHTML = '';

  const chars: HTMLSpanElement[] = [];
  const words: HTMLSpanElement[] = [];

  if (type === 'words' || type === 'both') {
    const wordArray = text.split(' ');
    wordArray.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'split-word inline-block';
      wordSpan.style.display = 'inline-block';

      if (type === 'both') {
        // Split each word into characters
        word.split('').forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'split-char inline-block';
          charSpan.style.display = 'inline-block';
          charSpan.textContent = char;
          wordSpan.appendChild(charSpan);
          chars.push(charSpan);
        });
      } else {
        wordSpan.textContent = word;
      }

      words.push(wordSpan);
      element.appendChild(wordSpan);

      // Add space between words
      if (wordIndex < wordArray.length - 1) {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;';
        space.style.display = 'inline-block';
        element.appendChild(space);
      }
    });
  } else {
    // Characters only
    text.split('').forEach((char) => {
      const charSpan = document.createElement('span');
      charSpan.className = 'split-char inline-block';
      charSpan.style.display = 'inline-block';
      charSpan.textContent = char === ' ' ? '\u00A0' : char;
      element.appendChild(charSpan);
      chars.push(charSpan);
    });
  }

  return { chars, words };
}

/**
 * Magnetic effect - element follows cursor with easing
 */
export function createMagneticEffect(element: HTMLElement, strength: number = 0.3) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const handleMouseMove = (e: MouseEvent) => {
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    gsap.to(element, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)'
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
}

/**
 * Parallax mouse tracking for background elements
 */
export function createMouseParallax(container: HTMLElement, elements: HTMLElement[], intensity: number = 0.05) {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * intensity;
    const y = (e.clientY - rect.top - rect.height / 2) * intensity;

    elements.forEach((el, index) => {
      const depth = (index + 1) * 0.5;
      gsap.to(el, {
        x: x * depth,
        y: y * depth,
        duration: 0.8,
        ease: 'power2.out'
      });
    });
  };

  container.addEventListener('mousemove', handleMouseMove);

  return () => {
    container.removeEventListener('mousemove', handleMouseMove);
  };
}

/**
 * Text reveal animation (character by character)
 */
/**
 * Robust Text reveal animation using fromTo to ensure visibility
 * Handles gradient text compatibility by ensuring inline-block behavior
 */
export type SplitTextInstance = {
  element: HTMLElement;
  chars: HTMLSpanElement[];
  refresh?: () => void;
  revert: () => void;
};

export function createSplitText(
  element: HTMLElement,
  options: {
    // If true, will not use inline-block if it breaks gradients (experimental)
    preserveGradient?: boolean;
  } = {}
): SplitTextInstance {
  const originalHTML = element.innerHTML;
  // Normalize whitespace so repeated mounts / formatting newlines don't create
  // hidden characters that can break layout/gradient calculations.
  const text = (element.textContent ?? '').replace(/\s+/g, ' ').trim();
  element.innerHTML = '';

  const computed = window.getComputedStyle(element);
  const hasGradientClass =
    element.classList.contains('gradient-text-gold') ||
    element.classList.contains('gradient-text-name');
  const usesClippedBackground =
    computed.backgroundImage !== 'none' &&
    (computed.webkitBackgroundClip === 'text' || computed.backgroundClip === 'text');
  const hasTransparentFill =
    computed.color === 'transparent' ||
    computed.color === 'rgba(0, 0, 0, 0)' ||
    (computed as any).webkitTextFillColor === 'transparent';
  const shouldPreserveGradient =
    options.preserveGradient ?? (hasGradientClass || (usesClippedBackground && hasTransparentFill));

  const gradientClasses: string[] = [];
  if (element.classList.contains('gradient-text-gold')) gradientClasses.push('gradient-text-gold');
  if (element.classList.contains('gradient-text-name')) gradientClasses.push('gradient-text-name');

  const applyContinuousGradient = (targets: HTMLSpanElement[]) => {
    const currentComputed = window.getComputedStyle(element);
    const parentRect = element.getBoundingClientRect();
    if (!parentRect.width || !parentRect.height) return;

    const bgSizeTokens = currentComputed.backgroundSize.split(/\s+/).filter(Boolean);
    const sizeXToken = bgSizeTokens[0] || '100%';
    const sizeYToken = bgSizeTokens[1] || 'auto';

    const percentToMultiplier = (value: string) => {
      const match = value.trim().match(/^([0-9.]+)%$/);
      if (!match) return null;
      const n = Number(match[1]);
      return Number.isFinite(n) ? n / 100 : null;
    };

    const multiplierX = percentToMultiplier(sizeXToken) ?? 1;
    const multiplierY = percentToMultiplier(sizeYToken) ?? null;

    const backgroundWidthPx = parentRect.width * multiplierX;
    const backgroundHeightPx = multiplierY ? parentRect.height * multiplierY : parentRect.height;

    targets.forEach((span) => {
      const spanRect = span.getBoundingClientRect();
      const offsetX = spanRect.left - parentRect.left;
      const offsetY = spanRect.top - parentRect.top;

      span.style.backgroundImage = currentComputed.backgroundImage;
      span.style.backgroundRepeat = 'no-repeat';
      span.style.backgroundSize = `${backgroundWidthPx}px ${backgroundHeightPx}px`;
      span.style.backgroundPosition = `${-offsetX}px ${-offsetY}px`;
      span.style.backgroundClip = 'text';
      (span.style as any).WebkitBackgroundClip = 'text';
      span.style.color = 'transparent';
      (span.style as any).WebkitTextFillColor = 'transparent';
      span.style.animation = 'none';
    });
  };

  const animChars: HTMLSpanElement[] = [];

  // Split into words and wrap each word in a non-breaking inline-block container.
  // This prevents awkward mid-word line breaks when each character is its own inline element.
  const words = text.split(' ');
  words.forEach((word, wordIndex) => {
    const wordWrap = document.createElement('span');
    wordWrap.className = 'split-word inline-block';
    wordWrap.style.display = 'inline-block';
    wordWrap.style.whiteSpace = 'nowrap';
    wordWrap.style.lineHeight = 'inherit';
    wordWrap.style.verticalAlign = 'baseline';

    Array.from(word).forEach((char) => {
      const span = document.createElement('span');
      span.className = 'split-char inline-block';
      span.style.display = 'inline-block';
      span.style.willChange = 'transform, opacity';
      span.textContent = char;
      span.style.lineHeight = 'inherit';
      span.style.letterSpacing = 'inherit';
      span.style.verticalAlign = 'baseline';
      span.style.overflow = 'visible';
      span.style.position = 'relative';

      if (shouldPreserveGradient) {
        gradientClasses.forEach((cls) => span.classList.add(cls));
        span.style.backgroundImage = computed.backgroundImage;
        span.style.backgroundSize = computed.backgroundSize;
        span.style.backgroundRepeat = computed.backgroundRepeat;
        span.style.backgroundClip = 'text';
        (span.style as any).WebkitBackgroundClip = 'text';
        span.style.color = 'transparent';
        (span.style as any).WebkitTextFillColor = 'transparent';
      }

      wordWrap.appendChild(span);
      animChars.push(span);
    });

    element.appendChild(wordWrap);

    // Add spacing + word-level wrap opportunity
    if (wordIndex < words.length - 1) {
      const spaceSpan = document.createElement('span');
      spaceSpan.className = 'split-space';
      spaceSpan.style.display = 'inline-block';
      spaceSpan.style.width = '0.33em';
      spaceSpan.style.lineHeight = 'inherit';
      spaceSpan.style.verticalAlign = 'baseline';
      spaceSpan.textContent = '\u00A0';
      element.appendChild(spaceSpan);
      element.appendChild(document.createElement('wbr'));
    }
  });

  let resizeObserver: ResizeObserver | null = null;
  const refresh = () => {
    if (!shouldPreserveGradient) return;
    requestAnimationFrame(() => applyContinuousGradient(animChars));
  };

  if (shouldPreserveGradient) {
    // 1) First frame (initial layout)
    refresh();

    // 2) After fonts settle (prevents occasional “missing/cut” glyphs)
    if (document.fonts?.ready) {
      document.fonts.ready
        .then(() => refresh())
        .catch(() => {
          // ignore
        });
    }

    // 3) Any size changes (responsive / hydration / layout shifts)
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        refresh();
      });
      resizeObserver.observe(element);
    }
  }

  return {
    element,
    chars: animChars,
    refresh,
    revert: () => {
      resizeObserver?.disconnect();
      resizeObserver = null;
      element.innerHTML = originalHTML;
    }
  };
}

export function animateSplitText(
  element: HTMLElement,
  options: {
    duration?: number;
    stagger?: number;
    ease?: string;
    delay?: number;
    scrollTrigger?: any;
    from?: gsap.TweenVars;
    // If true, will not use inline-block if it breaks gradients (experimental)
    preserveGradient?: boolean;
  } = {}
) {
  const split = createSplitText(element, { preserveGradient: options.preserveGradient });

  const defaults = {
    duration: 1,
    stagger: 0.03,
    ease: 'back.out(1.7)',
    delay: 0,
    from: {
      opacity: 0,
      y: 40,
      rotateX: -90,
      transformPerspective: 1000
    }
  };

  const config = { ...defaults, ...options };

  return gsap.fromTo(split.chars,
    config.from,
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: config.duration,
      stagger: config.stagger,
      ease: config.ease,
      delay: config.delay,
      scrollTrigger: config.scrollTrigger
    }
  );
}

// Keep legacy export name for compatibility if needed, but alias to new function
export const animateTextReveal = animateSplitText;

/**
 * Word wave animation
 */
export function animateWordWave(
  element: HTMLElement,
  options: {
    duration?: number;
    stagger?: number;
    ease?: string;
  } = {}
) {
  const { words } = splitTextIntoSpans(element, 'words');

  const defaults = {
    duration: 1,
    stagger: 0.1,
    ease: 'elastic.out(1, 0.5)'
  };

  const config = { ...defaults, ...options };

  gsap.set(words, { opacity: 0, y: 100, rotationX: -80, transformPerspective: 1000 });

  return gsap.to(words, {
    opacity: 1,
    y: 0,
    rotationX: 0,
    duration: config.duration,
    stagger: config.stagger,
    ease: config.ease
  });
}

/**
 * Scramble text effect (like decryption)
 */
export function animateTextScramble(element: HTMLElement, duration: number = 1.5) {
  const originalText = element.textContent || '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let frame = 0;
  const totalFrames = duration * 60; // 60fps

  const animate = () => {
    const progress = frame / totalFrames;
    let result = '';

    for (let i = 0; i < originalText.length; i++) {
      if (originalText[i] === ' ') {
        result += ' ';
      } else if (i < originalText.length * progress) {
        result += originalText[i];
      } else {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    element.textContent = result;
    frame++;

    if (frame <= totalFrames) {
      requestAnimationFrame(animate);
    }
  };

  animate();
}

/**
 * Flip-like state transition helper
 */
export function animateFlipState(
  element: HTMLElement,
  newState: () => void,
  options: {
    duration?: number;
    ease?: string;
  } = {}
) {
  const defaults = { duration: 0.6, ease: 'power1.inOut' };
  const config = { ...defaults, ...options };

  // Capture initial state
  const initialRect = element.getBoundingClientRect();
  const initialStyles = window.getComputedStyle(element);

  // Apply new state
  newState();

  // Capture final state
  const finalRect = element.getBoundingClientRect();

  // Calculate deltas
  const deltaX = initialRect.left - finalRect.left;
  const deltaY = initialRect.top - finalRect.top;
  const deltaWidth = initialRect.width / finalRect.width;
  const deltaHeight = initialRect.height / finalRect.height;

  // Animate from initial to final
  gsap.fromTo(element,
    {
      x: deltaX,
      y: deltaY,
      scaleX: deltaWidth,
      scaleY: deltaHeight,
    },
    {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      duration: config.duration,
      ease: config.ease
    }
  );
}

/**
 * Staggered reveal with physics-like bounce
 */
export function animateStaggeredPhysics(
  elements: HTMLElement[] | NodeListOf<Element>,
  options: {
    duration?: number;
    stagger?: number;
    from?: gsap.TweenVars;
  } = {}
) {
  const defaults = {
    duration: 1.2,
    stagger: 0.1,
    from: { opacity: 0, y: 100, scale: 0.8 }
  };

  const config = { ...defaults, ...options };

  gsap.set(elements, config.from);

  return gsap.to(elements, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: config.duration,
    stagger: {
      each: config.stagger,
      ease: 'power2.out'
    },
    ease: 'elastic.out(1, 0.5)'
  });
}

/**
 * Counter animation for numbers
 */
export function animateCounter(
  element: HTMLElement,
  endValue: number,
  options: {
    duration?: number;
    prefix?: string;
    suffix?: string;
  } = {}
) {
  const defaults = { duration: 2, prefix: '', suffix: '' };
  const config = { ...defaults, ...options };

  const counter = { value: 0 };

  return gsap.to(counter, {
    value: endValue,
    duration: config.duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = `${config.prefix}${Math.round(counter.value)}${config.suffix}`;
    }
  });
}

/**
 * Floating animation for decorative elements
 */
export function createFloatingAnimation(element: HTMLElement, intensity: number = 20) {
  return gsap.to(element, {
    y: `+=${intensity}`,
    duration: 2 + Math.random() * 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: Math.random() * 2
  });
}

/**
 * Glow pulse animation
 */
export function createGlowPulse(element: HTMLElement, color: string = 'rgba(59, 130, 246, 0.5)') {
  return gsap.to(element, {
    boxShadow: `0 0 30px ${color}`,
    duration: 1.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  });
}

/**
 * Morphing background gradient
 */
export function createMorphingGradient(element: HTMLElement) {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  ];

  let index = 0;

  const animate = () => {
    gsap.to(element, {
      background: colors[index],
      duration: 3,
      ease: 'power2.inOut',
      onComplete: () => {
        index = (index + 1) % colors.length;
        animate();
      }
    });
  };

  animate();
}

export default {
  splitTextIntoSpans,
  createMagneticEffect,
  createMouseParallax,
  animateTextReveal,
  animateWordWave,
  animateTextScramble,
  animateFlipState,
  animateStaggeredPhysics,
  animateCounter,
  createFloatingAnimation,
  createGlowPulse,
  createMorphingGradient
};
