import React from 'react';
import { X } from 'lucide-react';

const creditsData = [
  {
    category: 'DIRECTED & WRITTEN BY',
    names: ['Pranshur Manjkhola'],
  },
  {
    category: 'STARRING',
    names: ['Rohan Mehra as Kabir Mehta', 'Tara Sutaria as Ananya Sen', 'Jaideep Ahlawat as Dev Anand'],
  },
  {
    category: 'PRODUCERS',
    names: ['Pranshur Manjkhola', 'Vikramaditya Motwane', 'Guneet Monga Kapoor'],
  },
  {
    category: 'DIRECTOR OF PHOTOGRAPHY',
    names: ['Avik Mukhopadhyay, ISC'],
  },
  {
    category: 'ORIGINAL MUSIC SCORE',
    names: ['Dustin O’Halloran', 'Hauschka (Volker Bertelmann)'],
  },
  {
    category: 'FILM EDITING',
    names: ['A. Sreekar Prasad'],
  },
  {
    category: 'PRODUCTION DESIGN',
    names: ['Nitin Zihani Choudhary'],
  },
  {
    category: 'COSTUME DESIGN',
    names: ['Dolly Ahluwalia'],
  },
  {
    category: 'SOUND DESIGN & SUPERVISION',
    names: ['Resul Pookutty, CAS, MPSE'],
  },
  {
    category: 'ART RESTORATION CONSULTANT',
    names: ['Dr. Ananya Chatterji, National Museum Institute'],
  },
  {
    category: 'SPECIAL THANKS',
    names: ['The People of Rishikesh & Almora Coast', 'National Film Development Corporation of India (NFDC)', 'Cannes Film Market'],
  },
];

const CreditsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12 overflow-y-auto animate-fadeIn">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="interactive fixed top-8 right-8 z-10 p-3 rounded-full border border-[#434A48] text-[#F0EFEA] hover:border-[#8C2F39] hover:bg-[#8C2F39]/20 transition-all duration-300"
        aria-label="Close credits modal"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Credits Document Container */}
      <div className="max-w-3xl w-full my-auto py-16 px-6 text-center space-y-12">
        <div className="space-y-2">
          <span className="font-mono text-xs text-[#8C2F39] tracking-[0.3em] uppercase">
            FULL CINEMATIC CREDITS
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-light text-[#F0EFEA] tracking-wider">
            EVEN IF WE NEVER TOUCH
          </h2>
          <p className="font-mono text-xs text-[#8B8F89] tracking-widest uppercase">
            A FILM BY PRANSHUR MANJKHOLA &bull; 2026
          </p>
        </div>

        <div className="w-16 h-[1px] bg-[#8C2F39] mx-auto" />

        {/* Roles List */}
        <div className="space-y-10">
          {creditsData.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-[#8C2F39]">
                {group.category}
              </h3>
              {group.names.map((name, nIdx) => (
                <p key={nIdx} className="font-serif text-xl md:text-2xl text-[#F0EFEA] font-light">
                  {name}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="w-16 h-[1px] bg-[#1B2628] mx-auto pt-6" />

        <div className="font-mono text-[10px] text-[#434A48] tracking-widest uppercase">
          MANJKHOLA PRODUCTIONS &bull; PARIS / NEW DELHI &bull; PRINT NO. 001/2026
        </div>
      </div>
    </div>
  );
};

export default CreditsModal;
