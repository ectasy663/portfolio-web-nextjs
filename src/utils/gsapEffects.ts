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
export function animateTextReveal(
  element: HTMLElement,
  options: {
    duration?: number;
    stagger?: number;
    ease?: string;
    from?: gsap.TweenVars;
  } = {}
) {
  const { chars } = splitTextIntoSpans(element, 'chars');

  const defaults = {
    duration: 0.8,
    stagger: 0.02,
    ease: 'back.out(1.7)',
    from: { opacity: 0, y: 50, rotateX: -90 }
  };

  const config = { ...defaults, ...options };

  gsap.set(chars, config.from);

  return gsap.to(chars, {
    opacity: 1,
    y: 0,
    rotateX: 0,
    duration: config.duration,
    stagger: config.stagger,
    ease: config.ease
  });
}

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
