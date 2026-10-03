import React, { useState, useEffect } from 'react';

const Navbar = ({ onOpenCredits }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'py-4 bg-[#060F10]/85 backdrop-blur-lg border-b border-[#1B2628]/60 shadow-2xl'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand / Film Title & Director */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero');
          }}
          className="interactive group flex flex-col"
        >
          <span className="font-serif text-lg md:text-xl font-light tracking-widest text-[#F0EFEA] group-hover:text-[#8C2F39] transition-colors duration-300">
            EVEN IF WE NEVER TOUCH
          </span>
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#8B8F89] group-hover:text-[#F0EFEA] transition-colors duration-300">
            A FILM BY PRANSHUR MANJKHOLA
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection('synopsis')}
            className="interactive font-sans text-xs uppercase tracking-[0.2em] text-[#8B8F89] hover:text-[#F0EFEA] transition-colors duration-300"
          >
            Synopsis
          </button>
          <button
            onClick={() => scrollToSection('cast')}
            className="interactive font-sans text-xs uppercase tracking-[0.2em] text-[#8B8F89] hover:text-[#F0EFEA] transition-colors duration-300"
          >
            Characters
          </button>
          <button
            onClick={() => scrollToSection('story-sequence')}
            className="interactive font-sans text-xs uppercase tracking-[0.2em] text-[#8C2F39] hover:text-[#F0EFEA] transition-colors duration-300"
          >
            Sequence II
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="interactive font-sans text-xs uppercase tracking-[0.2em] text-[#8B8F89] hover:text-[#F0EFEA] transition-colors duration-300"
          >
            Stills
          </button>
          <button
            onClick={() => scrollToSection('trailer')}
            className="interactive font-sans text-xs uppercase tracking-[0.2em] text-[#8B8F89] hover:text-[#F0EFEA] transition-colors duration-300"
          >
            Trailer
          </button>
          <button
            onClick={() => scrollToSection('director')}
            className="interactive font-sans text-xs uppercase tracking-[0.2em] text-[#8B8F89] hover:text-[#F0EFEA] transition-colors duration-300"
          >
            Director's Note
          </button>
          <button
            onClick={onOpenCredits}
            className="interactive font-sans text-xs uppercase tracking-[0.2em] text-[#8B8F89] hover:text-[#8C2F39] transition-colors duration-300"
          >
            Credits
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={() => scrollToSection('screenings')}
            className="interactive px-5 py-2 rounded-full border border-[#8C2F39] bg-[#8C2F39]/10 text-[#F0EFEA] hover:bg-[#8C2F39] hover:text-[#F0EFEA] font-sans text-xs tracking-widest uppercase transition-all duration-300 shadow-sm hover:shadow-[#8C2F39]/30"
          >
            Screenings
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="interactive p-2 text-[#F0EFEA] focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`w-full h-[1.5px] bg-[#F0EFEA] transition-transform duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`w-full h-[1.5px] bg-[#F0EFEA] transition-opacity duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-full h-[1.5px] bg-[#F0EFEA] transition-transform duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#060F10]/95 backdrop-blur-xl border-b border-[#1B2628] px-6 py-8 flex flex-col space-y-6 animate-fadeIn">
          <button
            onClick={() => scrollToSection('synopsis')}
            className="text-left font-serif text-xl tracking-wider text-[#F0EFEA]"
          >
            Synopsis
          </button>
          <button
            onClick={() => scrollToSection('cast')}
            className="text-left font-serif text-xl tracking-wider text-[#F0EFEA]"
          >
            Characters
          </button>
          <button
            onClick={() => scrollToSection('story-sequence')}
            className="text-left font-serif text-xl tracking-wider text-[#8C2F39]"
          >
            Sequence II (Reunion)
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="text-left font-serif text-xl tracking-wider text-[#F0EFEA]"
          >
            Stills Gallery
          </button>
          <button
            onClick={() => scrollToSection('trailer')}
            className="text-left font-serif text-xl tracking-wider text-[#F0EFEA]"
          >
            Official Trailer
          </button>
          <button
            onClick={() => scrollToSection('director')}
            className="text-left font-serif text-xl tracking-wider text-[#F0EFEA]"
          >
            Director's Note
          </button>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onOpenCredits();
            }}
            className="text-left font-serif text-xl tracking-wider text-[#8C2F39]"
          >
            Full Credits & Crew
          </button>
          <button
            onClick={() => scrollToSection('screenings')}
            className="w-full py-3 rounded-full bg-[#8C2F39] text-[#F0EFEA] font-sans text-xs uppercase tracking-widest text-center"
          >
            Screenings & Tickets
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
