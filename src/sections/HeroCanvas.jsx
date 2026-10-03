import React, { useEffect, useRef, useState } from 'react';
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
  const isAutoPlayFinishedRef = useRef(false);

  // Preload Dataset 1 (144 Quad HD upscaled frames)
  useEffect(() => {
    let loadedCount = 0;
    const images = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/frames/ezgif-frame-${numStr}.jpg`;

      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoading(false);
        }
      };

      img.onerror = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoading(false);
        }
      };

      images.push(img);
    }
  }, []);

  // Automatic hands animation on load (hands enter from sides & reach toward center)
  useEffect(() => {
    if (loading) return;

    let intervalId;
    autoPlayFrameRef.current = 0;
    isAutoPlayFinishedRef.current = false;

    // Play at ~28 FPS automatically on page load up to touching frames (~110)
    intervalId = setInterval(() => {
      if (autoPlayFrameRef.current < TOTAL_FRAMES - 1) {
        autoPlayFrameRef.current += 1.0;
      } else {
        autoPlayFrameRef.current = TOTAL_FRAMES - 1;
        isAutoPlayFinishedRef.current = true;
        clearInterval(intervalId);
      }
    }, 32);

    return () => clearInterval(intervalId);
  }, [loading]);

  // GSAP ScrollTrigger for Hero: Hands enter from sides and meet/touch as user scrolls
  useEffect(() => {
    if (loading || !sectionRef.current) return;

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
          const prog = self.progress;
          setScrollProgress(prog);

          // As user scrolls, sequence advances forward from sides to touching together
          const scrollTarget = prog * (TOTAL_FRAMES - 1);
          targetFrameRef.current = Math.max(autoPlayFrameRef.current, scrollTarget);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  // Canvas render loop for 1920x1080 Quad HD frames
  useEffect(() => {
    if (loading) return;

    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const render = () => {
      // Track load autoplay when scroll is top, or scroll scrubbing when user scrolls
      if (scrollProgress === 0) {
        targetFrameRef.current = autoPlayFrameRef.current;
      }

      const frameDiff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += frameDiff * 0.18;

      let frameIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameRef.current)));
      const img = imagesRef.current[frameIdx];

      if (img && img.complete && img.naturalWidth > 0) {
        const dpr = Math.max(2, window.devicePixelRatio || 1);
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

        let renderW, renderH, renderX, renderY;
        const isMobile = w < 768;

        if (isMobile) {
          renderW = w;
          renderH = w / imgAspect;
          renderX = 0;
          renderY = (h - renderH) / 2;
        } else {
          if (screenAspect > imgAspect) {
            renderW = w;
            renderH = w / imgAspect;
          } else {
            renderH = h;
            renderW = h * imgAspect;
          }
          renderX = (w - renderW) / 2;
          renderY = (h - renderH) / 2;
        }

        ctx.drawImage(img, Math.floor(renderX), Math.floor(renderY), Math.ceil(renderW), Math.ceil(renderH));
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [loading, scrollProgress]);

  // Title Opacity: Always 1.0 at start, softly fades out only as user scrolls far down away from hero
  let titleOpacity = 1;
  if (scrollProgress > 0.65) {
    titleOpacity = Math.max(0, 1 - (scrollProgress - 0.65) / 0.35);
  }

  return (
    <section ref={sectionRef} id="hero" className="relative w-full h-screen overflow-hidden bg-[#060F10]">
      {/* Minimalist Loader */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#060F10] text-[#F0EFEA] px-6">
          <div className="font-serif text-3xl md:text-5xl font-light tracking-widest mb-4 animate-pulse">
            EVEN IF WE NEVER TOUCH
          </div>
          <div className="font-mono text-xs tracking-widest text-[#8B8F89] uppercase mb-8">
            A FILM BY PRANSHUR MANJKHOLA
          </div>

          <div className="w-56 h-[2px] bg-[#1B2628] rounded-full overflow-hidden relative mb-4">
            <div
              className="h-full bg-[#8C2F39] transition-all duration-300 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <div className="font-mono text-xs text-[#8B8F89]">
            Loading 2.5K Quad HD Canvas Frames... {loadProgress}%
          </div>
        </div>
      )}

      {/* Pinned Scroll-Scrubbed Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Soft Dark Vignette Overlay for High Legibility */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-700 opacity-60"
        style={{
          background: 'radial-gradient(circle at center, rgba(6, 15, 16, 0.2) 20%, rgba(6, 15, 16, 0.85) 100%)'
        }}
      />

      {/* Film Title & Tagline Reveal */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-between py-24 px-6 pointer-events-none transition-opacity duration-300"
        style={{ opacity: titleOpacity }}
      >
        {/* Top Metadata */}
        <div className="text-center pt-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#8B8F89] block mb-2">
            OFFICIAL SELECTION &bull; CANNES 2026
          </span>
          <span className="font-sans text-xs tracking-widest uppercase text-[#8C2F39]">
            A TRAGIC ROMANCE BY PRANSHUR MANJKHOLA
          </span>
        </div>

        {/* Center Split Title */}
        <div className="text-center max-w-4xl px-4 my-auto drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
          <div className="overflow-hidden mb-2">
            <h1 className="flex justify-center items-center gap-6 md:gap-12 flex-wrap drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
              <span className="font-serif text-5xl md:text-8xl lg:text-9xl font-light tracking-tight text-[#F0EFEA] inline-block">
                EVEN IF
              </span>
              <span className="font-serif text-5xl md:text-8xl lg:text-9xl font-light tracking-tight text-[#F0EFEA] inline-block">
                WE NEVER TOUCH
              </span>
            </h1>
          </div>

          <p className="font-serif italic text-lg md:text-2xl font-light max-w-2xl mx-auto mt-6 text-[#8B8F89] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            "Some souls are bound not by physical presence, but by the space left between them."
          </p>

          <div className="flex items-center justify-center gap-4 font-mono text-xs tracking-widest uppercase mt-8 text-[#8C2F39]">
            <span>118 MIN</span>
            <span>&bull;</span>
            <span>CINEMASCOPE</span>
            <span>&bull;</span>
            <span>2026</span>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 pb-4">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8B8F89]">
            SCROLL TO DISCOVER
          </span>
          <div className="w-[1px] h-8 bg-[#8C2F39]/60 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroCanvas;
