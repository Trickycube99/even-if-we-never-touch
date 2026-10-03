import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import FilmGrain from './components/FilmGrain';
import DustParticles from './components/DustParticles';
import Navbar from './components/Navbar';
import CreditsModal from './components/CreditsModal';

import HeroCanvas from './sections/HeroCanvas';
import Synopsis from './sections/Synopsis';
import CastSection from './sections/CastSection';
import CinematicStorySection from './sections/CinematicStorySection';
import GallerySection from './sections/GallerySection';
import TrailerSection from './sections/TrailerSection';
import DirectorsNote from './sections/DirectorsNote';
import ScreeningsCredits from './sections/ScreeningsCredits';
import FooterBookend from './sections/FooterBookend';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [creditsOpen, setCreditsOpen] = useState(false);

  useEffect(() => {
    // 1. Force manual scroll restoration so page always reloads at top (y = 0)
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Scroll to top immediately on refresh
    window.scrollTo(0, 0);

    if (ScrollTrigger.clearScrollMemory) {
      ScrollTrigger.clearScrollMemory('hard');
    }

    // 2. Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.scrollTo(0, { immediate: true });
    lenis.on('scroll', ScrollTrigger.update);

    const updateRaf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(0);

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      gsap.ticker.remove(updateRaf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#060F10] text-[#F0EFEA] overflow-x-hidden">
      {/* Subtle Film Noise Overlay */}
      <FilmGrain />

      {/* Soft Drifting Ash/Dust Particles */}
      <DustParticles />

      {/* Main Navigation Header */}
      <Navbar onOpenCredits={() => setCreditsOpen(true)} />

      <main className="relative z-20 w-full bg-[#060F10]">
        {/* Hero Section: Pinned 180-Frame Hands Canvas Animation (Dataset 1) */}
        <HeroCanvas />

        {/* Section 1: Line-by-Line Reveal Synopsis */}
        <Synopsis />

        {/* Section 2: Character Dossiers with Parallax & Sepia Hover */}
        <CastSection />

        {/* Section 3: Second Pinned Scroll Sequence - Boy & Girl Canvas Animation (Dataset 2) */}
        <CinematicStorySection />

        {/* Section 4: Horizontal Scroll Stills Gallery */}
        <GallerySection />

        {/* Section 5: Scroll-to-Expand Trailer */}
        <TrailerSection />

        {/* Section 6: Director's Note from Pranshur Manjkhola */}
        <DirectorsNote />

        {/* Section 7: Screenings & Distribution Contact */}
        <ScreeningsCredits onOpenCredits={() => setCreditsOpen(true)} />
      </main>

      {/* Section 8: Reverse Scrubbing Frame Canvas Footer Bookend */}
      <FooterBookend />

      {/* Full Credits Modal */}
      <CreditsModal isOpen={creditsOpen} onClose={() => setCreditsOpen(false)} />
    </div>
  );
};

export default App;
