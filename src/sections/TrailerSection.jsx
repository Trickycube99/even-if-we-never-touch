import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TrailerSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const videoWrapperRef = useRef(null);
  const topBarRef = useRef(null);
  const bottomBarRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title letter-spacing expansion
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

      // Scroll to expand video container
      gsap.fromTo(
        videoWrapperRef.current,
        { scale: 0.85, borderRadius: '24px' },
        {
          scale: 1,
          borderRadius: '4px',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'center center',
            scrub: true,
          },
        }
      );

      // Cinemascope letterbox bars sliding into position on scroll
      gsap.fromTo(
        topBarRef.current,
        { height: '0%' },
        {
          height: '10%',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 40%',
            end: 'center center',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        bottomBarRef.current,
        { height: '0%' },
        {
          height: '10%',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 40%',
            end: 'center center',
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section ref={sectionRef} id="trailer" className="relative py-32 px-4 md:px-12 bg-[#060F10] text-[#F0EFEA] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#8C2F39] block mb-3">
            IV. THE TEASER
          </span>
          <h2
            ref={titleRef}
            className="font-serif text-3xl md:text-5xl lg:text-6xl font-light uppercase text-[#F0EFEA]"
          >
            OFFICIAL TRAILER
          </h2>
          <div className="w-12 h-[1px] bg-[#8C2F39] mx-auto mt-6" />
        </div>

        {/* Scroll-to-Expand Video Player */}
        <div
          ref={videoWrapperRef}
          className="relative w-full aspect-[16/9] max-w-5xl mx-auto overflow-hidden border border-[#1B2628] bg-[#060F10] shadow-2xl group"
        >
          {/* Top Letterbox Bar */}
          <div
            ref={topBarRef}
            className="absolute top-0 left-0 right-0 bg-[#060F10] z-20 pointer-events-none transition-all duration-300"
          />

          {/* Bottom Letterbox Bar */}
          <div
            ref={bottomBarRef}
            className="absolute bottom-0 left-0 right-0 bg-[#060F10] z-20 pointer-events-none transition-all duration-300"
          />

          {/* Video / Preview Stream */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop"
            loop
            playsInline
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* Dark Overlay when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center p-6 text-center">
              <button
                onClick={togglePlay}
                className="interactive w-20 h-20 md:w-24 md:h-24 rounded-full border border-[#8C2F39] bg-[#8C2F39]/30 backdrop-blur-md flex items-center justify-center text-[#F0EFEA] hover:bg-[#8C2F39] hover:scale-110 transition-all duration-500 shadow-2xl mb-4 group-hover:border-[#F0EFEA]"
                aria-label="Play trailer"
              >
                <Play className="w-8 h-8 md:w-10 md:h-10 ml-1 text-[#F0EFEA]" />
              </button>
              <span className="font-serif text-xl md:text-2xl text-[#F0EFEA] font-light">
                WATCH THE OFFICIAL TEASER
              </span>
              <span className="font-mono text-xs text-[#8B8F89] uppercase tracking-widest mt-1">
                2 MIN 14 SEC &bull; 4K CINEMASCOPE
              </span>
            </div>
          )}

          {/* Interactive Player Controls */}
          <div className="absolute bottom-4 left-6 right-6 z-30 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="interactive p-2 rounded-full bg-black/60 backdrop-blur-md text-[#F0EFEA] hover:text-[#8C2F39] transition-colors duration-300"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleMute}
                className="interactive p-2 rounded-full bg-black/60 backdrop-blur-md text-[#F0EFEA] hover:text-[#8C2F39] transition-colors duration-300"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            <div className="font-mono text-[10px] tracking-widest text-[#8B8F89] uppercase hidden sm:block">
              "EVEN IF WE NEVER TOUCH" &bull; 2026
            </div>

            <button
              onClick={() => {
                if (videoRef.current) {
                  if (videoRef.current.requestFullscreen) {
                    videoRef.current.requestFullscreen();
                  }
                }
              }}
              className="interactive p-2 rounded-full bg-black/60 backdrop-blur-md text-[#F0EFEA] hover:text-[#8C2F39] transition-colors duration-300"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrailerSection;
