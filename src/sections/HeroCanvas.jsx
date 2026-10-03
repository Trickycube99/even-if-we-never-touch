import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 144; // All 144 frames from full video sequence

const HeroCanvas = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);

  const autoPlayFrameRef = useRef(0);
  const autoPlayIntervalRef = useRef(null);
  const isAutoPlayingRef = useRef(true);
  const isMobileRef = useRef(false);

  const hasTouchedTopRef = useRef(false);

  // Preload Dataset 1 (144 Quad HD upscaled frames)
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
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoading(false);
        }
      };

      img.onload = handleLoad;
      img.onerror = handleLoad;

      images.push(img);
    }
  }, []);

  // Helper to start automatic hands animation playback (direction: 'forward' | 'backward', speedMultiplier)
  const startAutoPlay = useCallback((direction = 'forward', speedMultiplier = 4) => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }

    isAutoPlayingRef.current = true;
    const frameStep = 1.0 * speedMultiplier;

    if (direction === 'forward') {
      autoPlayIntervalRef.current = setInterval(() => {
        if (autoPlayFrameRef.current < TOTAL_FRAMES - 1) {
          autoPlayFrameRef.current += frameStep;
        } else {
          autoPlayFrameRef.current = TOTAL_FRAMES - 1;
          if (autoPlayIntervalRef.current) {
            clearInterval(autoPlayIntervalRef.current);
            autoPlayIntervalRef.current = null;
          }
        }
      }, 32);
    } else {
      // Backward / Reverse playback at 4X speed
      autoPlayIntervalRef.current = setInterval(() => {
        if (autoPlayFrameRef.current > 0) {
          autoPlayFrameRef.current -= frameStep;
        } else {
          autoPlayFrameRef.current = 0;
          if (autoPlayIntervalRef.current) {
            clearInterval(autoPlayIntervalRef.current);
            autoPlayIntervalRef.current = null;
          }
        }
      }, 32);
    }
  }, []);

  // Reset animation to frame 0
  const resetToStart = useCallback(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
    autoPlayFrameRef.current = 0;
    currentFrameRef.current = 0;
    targetFrameRef.current = 0;
  }, []);

  // Update scroll progress on PC
  const handleScrollUpdate = useCallback((prog) => {
    setScrollProgress(prog);

    if (prog > 0) {
      if (isAutoPlayingRef.current) {
        isAutoPlayingRef.current = false;
        if (autoPlayIntervalRef.current) {
          clearInterval(autoPlayIntervalRef.current);
          autoPlayIntervalRef.current = null;
        }
      }
      targetFrameRef.current = prog * (TOTAL_FRAMES - 1);
    } else {
      if (!isAutoPlayingRef.current) {
        resetToStart();
        startAutoPlay('forward', 1);
      }
    }
  }, [startAutoPlay, resetToStart]);

  // Mobile & PC animation control logic
  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;

    if (!isMobile) {
      // PC & Laptop: Exact pinned scroll scrubbing untouched
      resetToStart();
      startAutoPlay('forward', 1);

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=3200',
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.5,
          onUpdate: (self) => {
            handleScrollUpdate(self.progress);
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    } else {
      // Mobile: 4X speed after 0.5s delay in viewport, reverse on scroll back, reset at top on first touch
      let viewportTimer = null;
      let lastScrollY = window.scrollY;

      // Handle top-of-page reset & first-touch trigger on Mobile
      const handleMobileTouch = () => {
        if (window.scrollY < 50 && !hasTouchedTopRef.current) {
          hasTouchedTopRef.current = true;
          resetToStart();
          viewportTimer = setTimeout(() => {
            startAutoPlay('forward', 4);
          }, 500);
        }
      };

      const handleScrollTopCheck = () => {
        if (window.scrollY < 50) {
          hasTouchedTopRef.current = false;
        }
      };

      window.addEventListener('touchstart', handleMobileTouch, { passive: true });
      window.addEventListener('scroll', handleScrollTopCheck, { passive: true });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const currentY = window.scrollY;
              const isScrollingUp = currentY < lastScrollY;
              lastScrollY = currentY;

              if (viewportTimer) clearTimeout(viewportTimer);
              viewportTimer = setTimeout(() => {
                if (isScrollingUp) {
                  startAutoPlay('backward', 4); // 4X speed reverse playback on scroll back
                } else {
                  startAutoPlay('forward', 4); // 4X speed forward playback after 0.5s
                }
              }, 500);
            } else {
              if (viewportTimer) {
                clearTimeout(viewportTimer);
                viewportTimer = null;
              }
              if (autoPlayIntervalRef.current) {
                clearInterval(autoPlayIntervalRef.current);
                autoPlayIntervalRef.current = null;
              }
            }
          });
        },
        { threshold: 0.15 }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      // Initial page load trigger on mobile
      viewportTimer = setTimeout(() => {
        startAutoPlay('forward', 4);
      }, 500);

      return () => {
        if (viewportTimer) clearTimeout(viewportTimer);
        if (autoPlayIntervalRef.current) {
          clearInterval(autoPlayIntervalRef.current);
          autoPlayIntervalRef.current = null;
        }
        window.removeEventListener('touchstart', handleMobileTouch);
        window.removeEventListener('scroll', handleScrollTopCheck);
        if (sectionRef.current) observer.unobserve(sectionRef.current);
      };
    }
  }, [loading, handleScrollUpdate, startAutoPlay, resetToStart]);

  // Canvas render loop for Quad HD frames
  useEffect(() => {
    if (loading) return;

    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const render = () => {
      const isMobile = isMobileRef.current || window.innerWidth < 768;

      if (isMobile || isAutoPlayingRef.current) {
        targetFrameRef.current = autoPlayFrameRef.current;
      }

      const frameDiff = targetFrameRef.current - currentFrameRef.current;
      const lerpFactor = isMobile ? 0.25 : 0.2;
      currentFrameRef.current += frameDiff * lerpFactor;

      let frameIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameRef.current)));
      const img = imagesRef.current[frameIdx];

      if (img && img.complete && img.naturalWidth > 0) {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const w = window.innerWidth;
        const h = window.innerHeight;

        if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
          canvas.width = Math.floor(w * dpr);
          canvas.height = Math.floor(h * dpr);
        }

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.fillStyle = '#060F10';
        ctx.fillRect(0, 0, w, h);

        const imgW = img.naturalWidth || 1920;
        const imgH = img.naturalHeight || 1080;
        const imgAspect = imgW / imgH;
        const screenAspect = w / h;

        // Universal background cover mode for both PC and Mobile (no letterboxing)
        let renderW, renderH;
        if (screenAspect > imgAspect) {
          renderW = w;
          renderH = w / imgAspect;
        } else {
          renderH = h;
          renderW = h * imgAspect;
        }
        const renderX = (w - renderW) / 2;
        const renderY = (h - renderH) / 2;

        ctx.drawImage(img, Math.floor(renderX), Math.floor(renderY), Math.ceil(renderW), Math.ceil(renderH));
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [loading, scrollProgress]);

  // Title Opacity: Softly fades out as user scrolls far down away from hero
  let titleOpacity = 1;
  if (scrollProgress > 0.65) {
    titleOpacity = Math.max(0, 1 - (scrollProgress - 0.65) / 0.35);
  }

  return (
    <section ref={sectionRef} id="hero" className="relative w-full h-screen min-h-[100dvh] overflow-hidden bg-[#060F10]">
      {/* Minimalist Loader */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#060F10] text-[#F0EFEA] px-6">
          <div className="font-serif text-2xl md:text-5xl font-light tracking-widest mb-4 animate-pulse text-center">
            EVEN IF WE NEVER TOUCH
          </div>
          <div className="font-mono text-[10px] md:text-xs tracking-widest text-[#8B8F89] uppercase mb-8 text-center">
            A FILM BY PRANSHUR MANJKHOLA
          </div>

          <div className="w-48 md:w-56 h-[2px] bg-[#1B2628] rounded-full overflow-hidden relative mb-4">
            <div
              className="h-full bg-[#8C2F39] transition-all duration-300 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <div className="font-mono text-[10px] md:text-xs text-[#8B8F89]">
            Loading Canvas Frames... {loadProgress}%
          </div>
        </div>
      )}

      {/* Full Cover Viewport Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Dark Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-700 opacity-60 md:opacity-60"
        style={{
          background: 'radial-gradient(circle at center, rgba(6, 15, 16, 0.25) 20%, rgba(6, 15, 16, 0.85) 100%)'
        }}
      />

      {/* Film Title & Tagline Overlay */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-between py-12 sm:py-16 md:py-24 px-4 sm:px-6 pointer-events-none transition-opacity duration-300"
        style={{ opacity: titleOpacity }}
      >
        {/* Top Metadata */}
        <div className="text-center pt-10 sm:pt-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <span className="font-mono text-[9px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#8B8F89] block mb-1.5 sm:mb-2">
            OFFICIAL SELECTION &bull; CANNES 2026
          </span>
          <span className="font-sans text-[10px] sm:text-xs tracking-widest uppercase text-[#8C2F39]">
            A TRAGIC ROMANCE BY PRANSHUR MANJKHOLA
          </span>
        </div>

        {/* Center Split Title */}
        <div className="text-center max-w-4xl px-2 sm:px-4 my-auto drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
          <div className="overflow-hidden mb-2">
            <h1 className="flex justify-center items-center gap-3 sm:gap-6 md:gap-12 flex-wrap drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
              <span className="font-serif text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-[#F0EFEA] inline-block">
                EVEN IF
              </span>
              <span className="font-serif text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-[#F0EFEA] inline-block">
                WE NEVER TOUCH
              </span>
            </h1>
          </div>

          <p className="font-serif italic text-base sm:text-xl md:text-2xl font-light max-w-2xl mx-auto mt-4 sm:mt-6 text-[#8B8F89] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-relaxed">
            "Some souls are bound not by physical presence, but by the space left between them."
          </p>

          <div className="flex items-center justify-center gap-3 sm:gap-4 font-mono text-[10px] sm:text-xs tracking-widest uppercase mt-6 sm:mt-8 text-[#8C2F39]">
            <span>118 MIN</span>
            <span>&bull;</span>
            <span>CINEMASCOPE</span>
            <span>&bull;</span>
            <span>2026</span>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 pb-2 sm:pb-4">
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#8B8F89]">
            SCROLL TO DISCOVER
          </span>
          <div className="w-[1px] h-6 sm:h-8 bg-[#8C2F39]/60 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroCanvas;
