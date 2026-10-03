import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 144; // 144 Ultra HD upscaled frames from full video

const CinematicStorySection = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const imagesRef = useRef([]);

  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);

  const autoPlayFrameRef = useRef(0);
  const autoPlayIntervalRef = useRef(null);
  const isMobileRef = useRef(false);

  // Preload Dataset 2 (144 Quad HD upscaled frames)
  useEffect(() => {
    let loadedCount = 0;
    const images = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = 'async';
      const numStr = String(i).padStart(3, '0');
      img.src = `/frames2/ezgif-frame-${numStr}.jpg`;

      const handleLoad = () => {
        loadedCount++;
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

  // Helper to start automatic animation playback on Mobile (direction: 'forward' | 'backward')
  const startAutoPlay = useCallback((direction = 'forward', speedMultiplier = 2) => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }

    setScrollProgress(0.5); // Activate text overlay
    const frameStep = 1.0 * speedMultiplier;

    if (direction === 'forward') {
      if (autoPlayFrameRef.current >= TOTAL_FRAMES - 1) {
        autoPlayFrameRef.current = 0;
      }
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
      // Reverse playback at 2X speed on scroll back
      if (autoPlayFrameRef.current <= 0) {
        autoPlayFrameRef.current = TOTAL_FRAMES - 1;
      }
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

  // Reset to initial frame 0 when top of page is reached
  const resetToStart = useCallback(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
    autoPlayFrameRef.current = 0;
    currentFrameRef.current = 0;
    targetFrameRef.current = 0;
    setScrollProgress(0);
  }, []);

  // GSAP ScrollTrigger on PC, IntersectionObserver with direction tracking on Mobile
  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;

    if (!isMobile) {
      // PC & Laptop: Exact 4800px pinned scroll scrubbing untouched
      const ctx = gsap.context(() => {
        gsap.fromTo(
          titleRef.current,
          { letterSpacing: '0.1em' },
          {
            letterSpacing: '0.45em',
            ease: 'none',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              end: 'bottom 20%',
              scrub: true,
            },
          }
        );

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=4800',
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.5,
          onUpdate: (self) => {
            const prog = self.progress;
            setScrollProgress(prog);
            targetFrameRef.current = prog * (TOTAL_FRAMES - 1);
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    } else {
      // Mobile: 2X speed animation playback after 0.5s in viewport, reverse on scroll up, reset at top
      let viewportTimer = null;
      let lastScrollY = window.scrollY;

      const handleScrollTopCheck = () => {
        if (window.scrollY < 50) {
          resetToStart();
        }
      };
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
                  startAutoPlay('backward', 2); // 2X speed reverse playback on scroll up
                } else {
                  startAutoPlay('forward', 2); // 2X speed forward playback after 0.5s
                }
              }, 500); // 0.5s viewport delay
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

      return () => {
        if (viewportTimer) clearTimeout(viewportTimer);
        if (autoPlayIntervalRef.current) {
          clearInterval(autoPlayIntervalRef.current);
          autoPlayIntervalRef.current = null;
        }
        window.removeEventListener('scroll', handleScrollTopCheck);
        if (sectionRef.current) observer.unobserve(sectionRef.current);
      };
    }
  }, [loading, startAutoPlay, resetToStart]);

  // Canvas render loop for 2560x1440 Quad HD frames matching exact background rgb(34, 44, 43)
  useEffect(() => {
    if (loading) return;

    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const render = () => {
      const isMobile = isMobileRef.current || window.innerWidth < 768;

      if (isMobile) {
        targetFrameRef.current = autoPlayFrameRef.current;
      }

      const frameDiff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += frameDiff * 0.15;

      const frameIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameRef.current)));
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

        ctx.fillStyle = '#222D2D';
        ctx.fillRect(0, 0, w, h);

        const imgW = img.naturalWidth || 2560;
        const imgH = img.naturalHeight || 1440;
        const imgAspect = imgW / imgH;
        const screenAspect = w / h;

        // Universal cover mode for full screen viewport without letterboxing
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
  }, [loading]);

  let overlayOpacity = 0;
  if (isMobileRef.current) {
    overlayOpacity = scrollProgress > 0 ? 1 : 0;
  } else {
    if (scrollProgress >= 0.15 && scrollProgress <= 0.82) {
      overlayOpacity = Math.min(1, (scrollProgress - 0.15) / 0.25);
    } else if (scrollProgress > 0.82) {
      overlayOpacity = Math.max(0, 1 - (scrollProgress - 0.82) / 0.1);
    }
  }

  return (
    <section
      ref={sectionRef}
      id="story-sequence"
      className="relative w-full h-screen min-h-[100dvh] overflow-hidden bg-[#222D2D] text-[#F0EFEA] border-t border-b border-[#1B2628]"
    >
      {/* Loading state indicator */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#222D2D] text-[#F0EFEA] px-6">
          <div className="font-serif text-2xl md:text-4xl font-light tracking-widest mb-4 animate-pulse text-center">
            CHAPTER II: THE REUNION
          </div>
          <div className="font-mono text-[10px] md:text-xs text-[#8B8F89]">
            Loading visual sequence...
          </div>
        </div>
      )}

      {/* Scrubbed / Auto-play Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 vignette-dark pointer-events-none z-10" />

      {/* Chapter Text Overlay */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-between py-12 sm:py-16 md:py-20 px-4 sm:px-6 pointer-events-none transition-opacity duration-500"
        style={{ opacity: overlayOpacity }}
      >
        <div className="text-center pt-8 sm:pt-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#8C2F39] block mb-2">
            CHAPTER II &bull; THE DISTANT ORBIT
          </span>
          <h2
            ref={titleRef}
            className="font-serif text-2xl sm:text-4xl md:text-5xl font-light text-[#F0EFEA] uppercase tracking-wider"
          >
            KABIR & ANANYA
          </h2>
        </div>

        <div className="text-center max-w-3xl my-auto px-2 sm:px-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
          <p className="font-serif italic text-lg sm:text-2xl md:text-3xl font-light text-[#F0EFEA] leading-relaxed">
            "They stood close enough to feel the warmth of each other's breath, yet far enough so that their shadows never overlapped."
          </p>
          <div className="w-10 sm:w-12 h-[1px] bg-[#8C2F39] mx-auto mt-4 sm:mt-6" />
        </div>

        <div className="flex flex-col items-center gap-2 pb-2 sm:pb-4">
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#8B8F89]">
            SCROLL TO CONTINUE
          </span>
          <div className="w-[1px] h-6 bg-[#8C2F39]/60 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default CinematicStorySection;
