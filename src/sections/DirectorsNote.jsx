import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DirectorsNote = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { letterSpacing: '0.1em' },
        {
          letterSpacing: '0.4em',
          ease: 'none',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            end: 'bottom 20%',
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="director" className="relative py-32 px-6 md:px-16 bg-[#1B2628]/20 text-[#F0EFEA] border-t border-[#1B2628]">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#8C2F39] block mb-3">
            V. STATEMENT OF INTENT
          </span>
          <h2
            ref={titleRef}
            className="font-serif text-3xl md:text-5xl lg:text-6xl font-light uppercase text-[#F0EFEA]"
          >
            DIRECTOR'S NOTE
          </h2>
          <div className="w-12 h-[1px] bg-[#8C2F39] mx-auto mt-6" />
        </div>

        {/* Letter Container */}
        <div className="relative bg-[#060F10] border border-[#1B2628] rounded-xl p-8 md:p-16 shadow-2xl space-y-8">
          <div className="flex items-center justify-between border-b border-[#1B2628] pb-6 font-mono text-xs text-[#8B8F89] tracking-widest uppercase">
            <span>LOCATION: RISHIKESH & ALMORA COAST</span>
            <span>DATE: OCTOBER 2026</span>
          </div>

          <div className="space-y-6 font-serif text-lg md:text-xl font-light leading-relaxed text-[#F0EFEA]/90">
            <p>
              "We live in a culture obsessed with consumption — with touching what we admire, possessing what we love, and reducing intimacy to proximity. But the most sacred bonds are often forged in the reverence of space."
            </p>
            <p>
              When I began writing <em>Even If We Never Touch</em>, I wanted to explore what happens when love is denied physical fulfillment — not by external tragedy alone, but by a mutual, almost religious commitment to preserve the longing itself. What remains when two people decide that keeping their distance is the only way to ensure their bond stays unbroken?
            </p>
            <p>
              This film was shot on 35mm stock with vintage lenses, using natural winter light that fades within four hours each day. Every frame was crafted like an oil painting, where the negative space between two characters speaks louder than any dialogue could.
            </p>
            <p>
              I hope this story leaves you with the quiet realization that distance is not absence. Sometimes, it is the purest form of devotion.
            </p>
          </div>

          {/* Director Signature */}
          <div className="pt-8 border-t border-[#1B2628] flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="font-serif text-3xl md:text-4xl italic font-light text-[#F0EFEA] tracking-wider mb-1">
                Pranshur Manjkhola
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#8C2F39]">
                DIRECTOR & SCREENWRITER
              </span>
            </div>

            <div className="font-mono text-[10px] text-[#8B8F89] tracking-widest uppercase text-left md:text-right">
              MANJKHOLA FILM PRODUCTIONS &bull; PARIS / NEW DELHI
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectorsNote;
