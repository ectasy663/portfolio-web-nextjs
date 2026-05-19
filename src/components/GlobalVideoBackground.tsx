'use client';

import React, { useEffect, useRef, memo } from 'react';
import { usePathname } from 'next/navigation';

const GlobalVideoBackground = () => {
  const canvasRef1 = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas1 = canvasRef1.current;
    const canvas2 = canvasRef2.current;
    const container = containerRef.current;
    if (!canvas1 || !canvas2 || !container) return;

    const ctx1 = canvas1.getContext('2d', { alpha: false });
    const ctx2 = canvas2.getContext('2d', { alpha: false });
    if (!ctx1 || !ctx2) return;

    const frameCount = 80;
    
    // Smooth interpolation targets
    let targetProgress = 0;
    let currentProgress = 0;
    let cancelled = false;
    let reqId = 0;

    const frames1: HTMLImageElement[] = [];
    const frames2: HTMLImageElement[] = [];
    let loaded1 = 0;
    let loaded2 = 0;

    const pad = (n: number) => String(n).padStart(3, '0');

    // ── Cover-fit draw with optional transform ─────────────────────────────────
    const drawCover = (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      canvas: HTMLCanvasElement,
      scaleMultiplier: number = 1
    ) => {
      if (!img || !img.complete || !img.naturalWidth) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih) * scaleMultiplier;
      const sw = iw * scale;
      const sh = ih * scale;
      const sx = (cw - sw) / 2;
      const sy = (ch - sh) / 2;
      
      // We don't need clearRect because alpha is false and we always cover
      ctx.drawImage(img, sx, sy, sw, sh);
    };

    // ── Resize handler ────────────────────────────────────────────────────────
    const resize = () => {
      // Use device pixel ratio for sharper rendering
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      canvas1.width = w * dpr;
      canvas1.height = h * dpr;
      canvas2.width = w * dpr;
      canvas2.height = h * dpr;
      
      canvas1.style.width = `${w}px`;
      canvas1.style.height = `${h}px`;
      canvas2.style.width = `${w}px`;
      canvas2.style.height = `${h}px`;
      
      // Render current state
      renderFrame();
    };

    // ── Preload frames ────────────────────────────────────────────────────────
    for (let i = 0; i < frameCount; i++) {
      const img1 = new Image();
      img1.src = `/Animations/Video 1/Video Project 8_${pad(i)}.jpg`;
      img1.onload = () => {
        loaded1++;
        if (i === 0) {
          resize();
          drawCover(ctx1, img1, canvas1, 1.05); // slight initial zoom
        }
      };
      frames1.push(img1);

      const img2 = new Image();
      img2.src = `/Animations/Video 2/Video Project 6_${pad(i)}.jpg`;
      img2.onload = () => loaded2++;
      frames2.push(img2);
    }

    const renderFrame = () => {
      if (cancelled) return;

      // Cinematic easing (lerping)
      // Use a lower factor for buttery smooth catching up to the scroll position
      currentProgress += (targetProgress - currentProgress) * 0.06;

      // Calculate which video to show and frame indices
      // Video 1: 0 to 0.5 (progress)
      // Video 2: 0.5 to 1.0 (progress)
      
      const v1Progress = Math.min(1, Math.max(0, currentProgress / 0.5));
      const v2Progress = Math.min(1, Math.max(0, (currentProgress - 0.5) / 0.5));

      // Calculate smooth frame (float) and round for image access
      const exactFrame1 = v1Progress * (frameCount - 1);
      const frameIndex1 = Math.min(Math.floor(exactFrame1), frameCount - 1);
      
      const exactFrame2 = v2Progress * (frameCount - 1);
      const frameIndex2 = Math.min(Math.floor(exactFrame2), frameCount - 1);

      // Subtle parallax/zoom effect based on progress
      const scale1 = 1.05 + (v1Progress * 0.05); // slowly zoom in Video 1
      const scale2 = 1.05 + (v2Progress * 0.05); // slowly zoom in Video 2

      // Draw Video 1 if it has opacity
      const opacity1 = 1 - Math.min(1, Math.max(0, (currentProgress - 0.4) / 0.2)); 
      if (opacity1 > 0.01 && frames1[frameIndex1]) {
        drawCover(ctx1, frames1[frameIndex1], canvas1, scale1);
        canvas1.style.opacity = opacity1.toFixed(3);
      } else {
        canvas1.style.opacity = '0';
      }

      // Draw Video 2 if it has opacity
      const opacity2 = Math.min(1, Math.max(0, (currentProgress - 0.4) / 0.2));
      if (opacity2 > 0.01 && frames2[frameIndex2]) {
        drawCover(ctx2, frames2[frameIndex2], canvas2, scale2);
        canvas2.style.opacity = opacity2.toFixed(3);
      } else {
        canvas2.style.opacity = '0';
      }

      reqId = requestAnimationFrame(renderFrame);
    };

    // ── GSAP scroll scrubbing ─────────────────────────────────────────────────
    const setupGSAP = async () => {
      try {
        const gsapMod    = await import('gsap');
        const scrollMod  = await import('gsap/ScrollTrigger');
        const gsap        = (gsapMod as any).default ?? (gsapMod as any).gsap ?? gsapMod;
        const { ScrollTrigger } = scrollMod;

        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        resize();
        window.addEventListener('resize', resize);
        
        // Start render loop
        renderFrame();

        // Reveal the container beautifully once loaded
        gsap.to(container, {
          opacity: 1,
          duration: 2,
          ease: 'power2.inOut',
          delay: 0.2
        });

        ScrollTrigger.create({
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self: any) => {
            targetProgress = self.progress; // 0 to 1
          },
        });

        return () => {
          window.removeEventListener('resize', resize);
          ScrollTrigger.getAll().forEach((t: any) => t.kill());
        };
      } catch (err) {
        console.error('[GlobalVideoBackground] GSAP error:', err);
      }
    };

    let cleanup: (() => void) | undefined;
    setupGSAP().then((fn) => { cleanup = fn; });

    return () => {
      cancelled = true;
      if (reqId) cancelAnimationFrame(reqId);
      cleanup?.();
    };
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden opacity-0 transition-opacity duration-1000"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      {/* Deep premium black base */}
      <div className="absolute inset-0 bg-[#020202]" />

      {/* Video 1 canvas */}
      <canvas
        ref={canvasRef1}
        className="absolute inset-0 w-full h-full transform will-change-transform"
        style={{ 
          filter: 'brightness(0.65) contrast(1.15) saturate(1.1)', 
          transform: 'translateZ(0)' // Force GPU acceleration
        }}
      />
      {/* Video 2 canvas */}
      <canvas
        ref={canvasRef2}
        className="absolute inset-0 w-full h-full transform will-change-transform"
        style={{ 
          filter: 'brightness(0.65) contrast(1.15) saturate(1.1)', 
          opacity: 0,
          transform: 'translateZ(0)' 
        }}
      />

      {/* Cinematic Overlays for Depth and Readability */}
      
      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none mix-blend-multiply" />
      
      {/* Readability gradient overlay (Top & Bottom) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020202]/80 via-transparent to-[#020202]/90 pointer-events-none" />
      
      {/* Subtle noise texture for filmic feel */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'url("/assets/noise.png")', backgroundRepeat: 'repeat' }} 
      />
    </div>
  );
};

export default memo(GlobalVideoBackground);

