import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Maximize2, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stills = [
  {
    title: 'I. THE THRESHOLD OF FOG',
    caption: 'Kabir standing at the edge of the breakwater, 6:14 AM.',
    image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=1200&auto=format&fit=crop',
    tech: 'Arri Alexa Mini LF &bull; Zeiss Supreme 35mm T1.5 &bull; 800 ISO',
  },
  {
    title: 'II. THE UNFINISHED CANVAS',
    caption: 'Detail of oil paint cracking along the canvas edge.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    tech: 'Panavision Millennium DXL2 &bull; Macro 90mm T2.8 &bull; 400 ISO',
  },
  {
    title: 'III. THE BOW AND THE RESONANCE',
    caption: 'Ananya holding her 18th-century Italian violin in sea mist.',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop',
    tech: 'Kodak Vision3 500T 35mm Film &bull; Leica Summilux 50mm',
  },
  {
    title: 'IV. THE SILENT LIGHTHOUSE',
    caption: 'Dev overlooking the bay as dusk dissolves into night.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    tech: 'Arri Alexa 65 &bull; Hasselblad Prime 80mm &bull; 1250 ISO',
  },
  {
    title: 'V. THE FINGERTIPS OF DUST',
    caption: 'Two shadows cast against the rain-streaked window frame.',
    image: 'https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?q=80&w=1200&auto=format&fit=crop',
    tech: 'Kodak Tri-X 400 Black & White &bull; Noctilux 50mm f/0.95',
  },
];

const GallerySection = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const [activeStill, setActiveStill] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Letter spacing title expansion
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

      // Horizontal Scroll Animation
      const container = containerRef.current;
      if (container) {
        const totalScroll = container.scrollWidth - container.clientWidth;
        gsap.to(container, {
          x: () => -totalScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${totalScroll + 800}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="gallery" className="relative py-24 bg-[#060F10] text-[#F0EFEA] overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 text-center md:text-left">
        <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#8C2F39] block mb-3">
          III. CINEMATOGRAPHY & FRAMES
        </span>
        <h2
          ref={titleRef}
          className="font-serif text-3xl md:text-5xl lg:text-6xl font-light uppercase text-[#F0EFEA]"
        >
          STILLS GALLERY
        </h2>
        <div className="w-12 h-[1px] bg-[#8C2F39] mt-6 mx-auto md:mx-0" />
      </div>

      {/* Horizontal Scroll Track */}
      <div className="w-full overflow-hidden">
        <div
          ref={containerRef}
          className="flex space-x-8 md:space-x-12 px-6 md:px-12 w-max"
        >
          {stills.map((still, idx) => (
            <div
              key={idx}
              onClick={() => setActiveStill(still)}
              className="interactive group relative flex-none w-[80vw] md:w-[50vw] lg:w-[40vw] bg-[#1B2628]/40 border border-[#1B2628] rounded-xl p-4 md:p-6 hover:border-[#8C2F39] transition-all duration-500 cursor-pointer shadow-2xl"
            >
              {/* Image with Painterly Frame */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[#060F10] mb-4">
                <img
                  src={still.image}
                  alt={still.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#8C2F39]/80 backdrop-blur-md flex items-center justify-center text-[#F0EFEA]">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Still Metadata */}
              <div className="flex flex-col space-y-2">
                <span className="font-mono text-[10px] tracking-widest text-[#8C2F39] uppercase">
                  FRAME 00{idx + 1}
                </span>
                <h3 className="font-serif text-xl md:text-2xl font-light text-[#F0EFEA] group-hover:text-[#8C2F39] transition-colors duration-300">
                  {still.title}
                </h3>
                <p className="font-sans text-xs md:text-sm text-[#8B8F89]">
                  {still.caption}
                </p>
                <span
                  className="font-mono text-[9px] tracking-widest text-[#434A48] pt-2 border-t border-[#1B2628]"
                  dangerouslySetInnerHTML={{ __html: still.tech }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeStill && (
        <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 animate-fadeIn">
          <button
            onClick={() => setActiveStill(null)}
            className="interactive absolute top-6 right-6 p-3 rounded-full border border-[#434A48] text-[#F0EFEA] hover:border-[#8C2F39] hover:bg-[#8C2F39]/20 transition-all duration-300"
            aria-label="Close image modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-5xl w-full flex flex-col items-center">
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-[#1B2628] shadow-2xl mb-6 bg-[#060F10]">
              <img
                src={activeStill.image}
                alt={activeStill.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-center space-y-2 max-w-2xl">
              <h3 className="font-serif text-2xl md:text-3xl text-[#F0EFEA] font-light">
                {activeStill.title}
              </h3>
              <p className="font-sans text-sm text-[#8B8F89]">
                {activeStill.caption}
              </p>
              <div
                className="font-mono text-xs text-[#8C2F39] tracking-widest uppercase pt-2"
                dangerouslySetInnerHTML={{ __html: activeStill.tech }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
