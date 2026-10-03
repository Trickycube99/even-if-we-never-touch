import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const characters = [
  {
    role: 'KABIR MEHTA',
    actor: 'Rohan Mehra',
    archetype: 'The Canvas Archivist',
    quote: '"If I touch you, the painting is finished. And I am not ready for the museum."',
    desc: 'An obsessive art restorer who sees the world in degraded pigment layers. He spends months restoring a 19th-century canvas, fearful that completing it will erase his reason to remain.',
    image: '/images/cast/kabir.jpg',
  },
  {
    role: 'ANANYA SEN',
    actor: 'Tara Sutaria',
    archetype: 'The Violinist',
    quote: '"The most exquisite music is played in the silence right before the bow hits the string."',
    desc: 'A virtuoso musician facing a degenerative condition. She refuses medical intervention, choosing instead to record single unrepeated notes across empty sea cliffs.',
    image: '/images/cast/ananya.jpg',
  },
  {
    role: 'DEV ANAND',
    actor: 'Jaideep Ahlawat',
    archetype: 'The Keeper of Silence',
    quote: '"Some people love each other by coming together; others by keeping the universe intact."',
    desc: 'The aging lighthouse operator who witnesses Kabir and Ananya’s quiet meetings across the bay. He acts as their silent messenger, carrying letters that are never opened.',
    image: '/images/cast/dev.jpg',
  },
];

const CastSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Expanding title letter-spacing
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

      // Controlled subtle parallax effect on cards bounded within section
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        const speed = (idx + 1) * 15;
        gsap.fromTo(
          card,
          { y: speed },
          {
            y: -speed,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cast"
      className="relative z-20 py-32 px-6 md:px-16 bg-[#060F10] text-[#F0EFEA] border-t border-b border-[#1B2628]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-20">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#8C2F39] block mb-3">
            II. THE PROTAGONISTS
          </span>
          <h2
            ref={titleRef}
            className="font-serif text-3xl md:text-5xl lg:text-6xl font-light uppercase text-[#F0EFEA]"
          >
            CHARACTERS & CAST
          </h2>
          <div className="w-12 h-[1px] bg-[#8C2F39] mx-auto mt-6" />
        </div>

        {/* Character Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-stretch">
          {characters.map((char, idx) => (
            <div
              key={idx}
              ref={(el) => (cardsRef.current[idx] = el)}
              className="interactive group relative flex flex-col bg-[#1B2628]/30 border border-[#1B2628] rounded-xl overflow-hidden hover:border-[#8C2F39]/60 transition-colors duration-500 shadow-2xl"
            >
              {/* Image Container with Sepia-to-Color Hover Effect */}
              <div className="relative aspect-[3/2] overflow-hidden bg-[#060F10]">
                <img
                  src={char.image}
                  alt={char.role}
                  className="sepia-card w-full h-full object-cover object-center group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060F10] via-transparent to-transparent opacity-80" />

                <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest uppercase px-3 py-1 bg-[#060F10]/80 border border-[#434A48] rounded-full text-[#8B8F89]">
                  {char.archetype}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8 flex flex-col flex-grow justify-between bg-[#060F10]">
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-[#F0EFEA] group-hover:text-[#8C2F39] transition-colors duration-300">
                    {char.role}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-widest text-[#8B8F89] mt-1 mb-4">
                    PORTRAYED BY {char.actor}
                  </p>

                  <p className="font-serif italic text-sm text-[#8B8F89] mb-4 border-l-2 border-[#8C2F39] pl-3 py-1">
                    {char.quote}
                  </p>

                  <p className="font-sans text-xs md:text-sm text-[#8B8F89] leading-relaxed">
                    {char.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#1B2628] flex items-center justify-between font-mono text-[10px] text-[#8B8F89] tracking-widest uppercase">
                  <span>CHARACTER DOSSIER</span>
                  <span className="text-[#8C2F39] group-hover:translate-x-1 transition-transform duration-300">
                    EXPLORE &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CastSection;
