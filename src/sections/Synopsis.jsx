import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const synopsisLines = [
  "In the quiet shadow of a winter-bound coastal town, two former painters reunite after seven years of deliberate silence.",
  "Kabir, an archivist obsessed with restoring degraded 19th-century canvases, has lost his ability to perceive warmth in color.",
  "Ananya, a violinist bound by a terminal neuromuscular decay, lives in the ephemeral quiet between unplayed notes.",
  "Their love was never defined by promises or touch, but by an unspoken vow: never to cross the threshold that separates longing from reality.",
  "As the final winter mist settles over the coast, they construct one last joint masterpiece — written not in paint, but in the distance left between their outstretched hands."
];

const Synopsis = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const linesRef = useRef([]);
  const svgLineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Title letter spacing expansion animation on scroll
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

      // 2. Line-by-line text reveal
      linesRef.current.forEach((line) => {
        if (!line) return;
        gsap.fromTo(
          line,
          { opacity: 0.15, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 0.5,
            },
          }
        );
      });

      // 3. Thin wine-colored SVG line drawing and breaking
      if (svgLineRef.current) {
        gsap.fromTo(
          svgLineRef.current,
          { strokeDashoffset: 1000 },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'bottom 40%',
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="synopsis"
      className="relative z-20 py-32 px-6 md:px-16 bg-[#060F10] text-[#F0EFEA] overflow-hidden border-t border-[#1B2628]"
    >
      {/* Clean Background Soft Vignette */}
      <div className="absolute inset-0 vignette-dark pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#8C2F39] block mb-3">
            I. THE ARCHIVE OF LONGING
          </span>
          <h2
            ref={titleRef}
            className="font-serif text-3xl md:text-5xl lg:text-6xl font-light uppercase text-[#F0EFEA] transition-all duration-300"
          >
            SYNOPSIS
          </h2>
          <div className="w-12 h-[1px] bg-[#8C2F39] mx-auto mt-6" />
        </div>

        {/* Line by line reveal paragraphs */}
        <div className="space-y-12">
          {synopsisLines.map((text, idx) => (
            <p
              key={idx}
              ref={(el) => (linesRef.current[idx] = el)}
              className="font-serif text-xl md:text-3xl lg:text-4xl font-light leading-relaxed md:leading-relaxed text-[#F0EFEA]/90 tracking-wide text-center md:text-left"
            >
              {text}
            </p>
          ))}
        </div>

        {/* Key Theme Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 pt-16 border-t border-[#1B2628]">
          <div className="text-center md:text-left">
            <span className="font-mono text-xs uppercase tracking-widest text-[#8C2F39] block mb-1">
              ATMOSPHERE
            </span>
            <p className="font-sans text-sm text-[#8B8F89]">
              Classical monochrome oils, 35mm grain, silent tides.
            </p>
          </div>
          <div className="text-center md:text-left">
            <span className="font-mono text-xs uppercase tracking-widest text-[#8C2F39] block mb-1">
              THEME
            </span>
            <p className="font-sans text-sm text-[#8B8F89]">
              The sanctity of unfulfilled desire and untainted memory.
            </p>
          </div>
          <div className="text-center md:text-left">
            <span className="font-mono text-xs uppercase tracking-widest text-[#8C2F39] block mb-1">
              SCORE
            </span>
            <p className="font-sans text-sm text-[#8B8F89]">
              Solo violin & recorded coastal wind resonance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Synopsis;
