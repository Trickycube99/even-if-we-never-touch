import React, { useEffect, useRef, useState } from 'react';
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

  // Preload Dataset 2 (144 Quad HD upscaled frames)
  useEffect(() => {
    let loadedCount = 0;
    const images = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/frames2/ezgif-frame-${numStr}.jpg`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoading(false);
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoading(false);
        }
      };

      images.push(img);
    }
  }, []);

  // GSAP ScrollTrigger pinning (~4800px pin for 144 frames)
  useEffect(() => {
    if (loading || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Expanding letter spacing on section header
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

      // Pinned canvas scroll scrubbing with pinSpacing
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
  }, [loading]);

  // Canvas render loop for 2560x1440 Quad HD frames matching exact background rgb(34, 44, 43)
  useEffect(() => {
    if (loading) return;

    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const render = () => {
      const frameDiff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += frameDiff * 0.15;

      const frameIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameRef.current)));
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

        ctx.fillStyle = '#222D2D';
        ctx.fillRect(0, 0, w, h);

        const imgW = img.naturalWidth || 2560;
        const imgH = img.naturalHeight || 1440;
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
  }, [loading]);

  let overlayOpacity = 0;
  if (scrollProgress >= 0.15 && scrollProgress <= 0.82) {
    overlayOpacity = Math.min(1, (scrollProgress - 0.15) / 0.25);
  } else if (scrollProgress > 0.82) {
    overlayOpacity = Math.max(0, 1 - (scrollProgress - 0.82) / 0.1);
  }

  return (
    <section
      ref={sectionRef}
      id="story-sequence"
      className="relative w-full h-screen overflow-hidden bg-[#222D2D] text-[#F0EFEA] border-t border-b border-[#1B2628]"
    >
      {/* Loading state indicator */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#222D2D] text-[#F0EFEA] px-6">
          <div className="font-serif text-2xl md:text-4xl font-light tracking-widest mb-4 animate-pulse">
            CHAPTER II: THE REUNION
          </div>
          <div className="font-mono text-xs text-[#8B8F89]">
            Loading 2.5K Quad HD visual sequence...
          </div>
        </div>
      )}

      {/* Pinned Scrubbed Canvas for Boy & Girl Sequence */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 vignette-dark pointer-events-none z-10" />

      {/* Chapter Text Overlay */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-between py-20 px-6 pointer-events-none transition-opacity duration-500"
        style={{ opacity: overlayOpacity }}
      >
        <div className="text-center pt-8">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#8C2F39] block mb-2">
            CHAPTER II &bull; THE DISTANT ORBIT
          </span>
          <h2
            ref={titleRef}
            className="font-serif text-3xl md:text-5xl font-light text-[#F0EFEA] uppercase tracking-wider"
          >
            KABIR & ANANYA
          </h2>
        </div>

        <div className="text-center max-w-3xl my-auto px-4">
          <p className="font-serif italic text-xl md:text-3xl font-light text-[#F0EFEA]/90 leading-relaxed">
            "They stood close enough to feel the warmth of each other's breath, yet far enough so that their shadows never overlapped."
          </p>
          <div className="w-12 h-[1px] bg-[#8C2F39] mx-auto mt-6" />
        </div>

        <div className="flex flex-col items-center gap-2 pb-4">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8B8F89]">
            SCROLL TO CONTINUE
          </span>
          <div className="w-[1px] h-6 bg-[#8C2F39]/60 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default CinematicStorySection;
