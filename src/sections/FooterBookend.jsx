import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 45;

const FooterBookend = () => {
  const footerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  const [loaded, setLoaded] = useState(false);

  const targetFrameRef = useRef(44);
  const currentFrameRef = useRef(44);
  const autoPlayIntervalRef = useRef(null);
  const isMobileRef = useRef(false);

  // Preload frames 1..45 from upscaled Quad HD dataset
  useEffect(() => {
    let loadedCount = 0;
    const images = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = 'async';
      const numStr = String(i).padStart(3, '0');
      img.src = `/frames/ezgif-frame-${numStr}.jpg`;

      const handleLoad = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoaded(true);
        }
      };

      img.onload = handleLoad;
      img.onerror = handleLoad;

      images.push(img);
    }
  }, []);

  // Helper to start automatic animation playback on Mobile (speedMultiplier = 4)
  const startAutoPlay = useCallback((speedMultiplier = 4) => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }

    const frameStep = 1.0 * speedMultiplier;

    autoPlayIntervalRef.current = setInterval(() => {
      if (targetFrameRef.current > 0) {
        targetFrameRef.current -= frameStep;
      } else {
        targetFrameRef.current = 0;
        if (autoPlayIntervalRef.current) {
          clearInterval(autoPlayIntervalRef.current);
          autoPlayIntervalRef.current = null;
        }
      }
    }, 32);
  }, []);

  // GSAP ScrollTrigger for reverse frame scrubbing on footer (desktop), 4X single-pass auto-play on Mobile
  useEffect(() => {
    if (!loaded || !footerRef.current) return;

    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;

    if (!isMobile) {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: footerRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: (self) => {
            const prog = self.progress;
            const revFrame = (1 - prog) * (TOTAL_FRAMES - 1);
            targetFrameRef.current = revFrame;
          },
        });
      }, footerRef);

      return () => ctx.revert();
    } else {
      // Mobile: Autoplay footer animation at 4X speed ONCE after 0.5s in viewport, no reverse
      let viewportTimer = null;
      let hasPlayed = false;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasPlayed) {
              hasPlayed = true;
              if (viewportTimer) clearTimeout(viewportTimer);
              viewportTimer = setTimeout(() => {
                startAutoPlay(4);
              }, 500); // 0.5s viewport delay
            }
          });
        },
        { threshold: 0.15 }
      );

      if (footerRef.current) {
        observer.observe(footerRef.current);
      }

      return () => {
        if (viewportTimer) clearTimeout(viewportTimer);
        if (autoPlayIntervalRef.current) {
          clearInterval(autoPlayIntervalRef.current);
          autoPlayIntervalRef.current = null;
        }
        if (footerRef.current) observer.unobserve(footerRef.current);
      };
    }
  }, [loaded, startAutoPlay]);

  // Track canvas visibility to pause RAF loop when off-screen
  const isCanvasVisibleRef = useRef(false);
  const lastDrawnFrameRef = useRef(-1);

  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isCanvasVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  // Render loop with high-resolution canvas settings
  useEffect(() => {
    if (!loaded) return;

    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const render = () => {
      // Pause RAF if footer is off-screen
      if (!isCanvasVisibleRef.current) {
        animId = requestAnimationFrame(render);
        return;
      }

      const isMobile = isMobileRef.current || window.innerWidth < 768;
      const diff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += diff * 0.15;

      const frameIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameRef.current)));
      
      const dpr = isMobile ? 1.0 : Math.min(2, window.devicePixelRatio || 1);
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      const targetCanvasW = Math.floor(w * dpr);
      const targetCanvasH = Math.floor(h * dpr);

      // Skip draw if frame index and canvas size are unchanged
      if (
        frameIdx === lastDrawnFrameRef.current &&
        canvas.width === targetCanvasW &&
        canvas.height === targetCanvasH
      ) {
        animId = requestAnimationFrame(render);
        return;
      }

      const img = imagesRef.current[frameIdx];

      if (img && img.complete && img.naturalWidth > 0) {
        if (canvas.width !== targetCanvasW || canvas.height !== targetCanvasH) {
          canvas.width = targetCanvasW;
          canvas.height = targetCanvasH;
        }

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = !isMobile;
        if (!isMobile) ctx.imageSmoothingQuality = 'high';

        ctx.fillStyle = '#060F10';
        ctx.fillRect(0, 0, w, h);

        const imgW = img.naturalWidth || 2560;
        const imgH = img.naturalHeight || 1440;
        const imgAspect = imgW / imgH;
        const containerAspect = w / h;

        let renderW, renderH;

        if (containerAspect > imgAspect) {
          renderW = w;
          renderH = w / imgAspect;
        } else {
          renderH = h;
          renderW = h * imgAspect;
        }

        const renderX = (w - renderW) / 2;
        const renderY = (h - renderH) / 2;

        ctx.globalAlpha = 0.55;
        ctx.drawImage(img, Math.floor(renderX), Math.floor(renderY), Math.ceil(renderW), Math.ceil(renderH));
        ctx.restore();

        lastDrawnFrameRef.current = frameIdx;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [loaded]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef} className="relative w-full h-[85vh] min-h-[480px] bg-[#060F10] text-[#F0EFEA] border-t border-[#1B2628] flex flex-col justify-between overflow-hidden">
      {/* Reverse Scrubbing Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 vignette-dark pointer-events-none z-10" />

      {/* Footer Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 w-full h-full flex flex-col justify-between">
        {/* Top Footer Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#1B2628]/60 pb-6 md:pb-8 text-center md:text-left">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-wider text-[#F0EFEA]">
              EVEN IF WE NEVER TOUCH
            </h2>
            <p className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#8B8F89] mt-1">
              A FILM BY PRANSHUR MANJKHOLA &bull; 2026
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="interactive flex items-center gap-3 px-6 py-2.5 sm:py-3 rounded-full border border-[#8B8F89]/40 bg-[#060F10]/80 backdrop-blur-md text-[#F0EFEA] hover:border-[#8C2F39] hover:text-[#8C2F39] transition-all duration-300 group"
          >
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest">RETURN TO SURFACE</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Center Quote / Bookend Notice */}
        <div className="my-auto text-center max-w-2xl mx-auto py-6 md:py-8 px-2">
          <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#8B8F89] font-light leading-relaxed">
            "And so the hands drift apart once more, into the silence from which they came."
          </p>
          <div className="w-8 h-[1px] bg-[#8C2F39] mx-auto mt-4" />
        </div>

        {/* Bottom Legal / Copyright Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[9px] sm:text-[10px] text-[#434A48] tracking-widest uppercase pt-4 sm:pt-6 border-t border-[#1B2628]/40 text-center md:text-left">
          <div>
            &copy; 2026 MANJKHOLA PRODUCTIONS. ALL RIGHTS RESERVED.
          </div>

          <div className="flex space-x-6">
            <a href="#synopsis" className="hover:text-[#F0EFEA] transition-colors">PRESS KIT</a>
            <a href="#screenings" className="hover:text-[#F0EFEA] transition-colors">FESTIVAL RELATIONS</a>
            <a href="#credits" className="hover:text-[#8C2F39] transition-colors">CREDITS</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterBookend;
