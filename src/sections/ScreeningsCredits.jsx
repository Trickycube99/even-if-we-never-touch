import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Calendar, MapPin, Send, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const festivals = [
  { name: 'CANNES FILM FESTIVAL', detail: 'Official Selection 2026 &bull; Un Certain Regard' },
  { name: 'VENICE INTERNATIONAL', detail: 'Nominee &bull; Golden Lion' },
  { name: 'TELLURIDE FILM FESTIVAL', detail: 'Special Screening 2026' },
  { name: 'TIFF (TORONTO)', detail: 'Official Selection &bull; Masters Category' },
];

const screenings = [
  { date: 'OCT 24, 2026', city: 'PARIS', venue: 'Le Champo Espace Cinephile', status: 'RVP / LIMITED SEATS' },
  { date: 'NOV 02, 2026', city: 'LONDON', venue: 'BFI Southbank', status: 'TICKETS AVAILABLE' },
  { date: 'NOV 12, 2026', city: 'NEW YORK', venue: 'Film at Lincoln Center', status: 'SOLD OUT' },
  { date: 'NOV 28, 2026', city: 'TOKYO', venue: 'Bunkamura Le Cinema', status: 'TICKETS AVAILABLE' },
  { date: 'DEC 05, 2026', city: 'NEW DELHI', venue: 'India Habitat Centre', status: 'TICKETS AVAILABLE' },
];

const ScreeningsCredits = ({ onOpenCredits }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', category: 'Press Inquiry', message: '' });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', category: 'Press Inquiry', message: '' });
    }, 4000);
  };

  return (
    <section ref={sectionRef} id="screenings" className="relative py-32 px-6 md:px-16 bg-[#060F10] text-[#F0EFEA] border-t border-[#1B2628]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#8C2F39] block mb-3">
            VI. DISTRIBUTION & EXHIBITION
          </span>
          <h2
            ref={titleRef}
            className="font-serif text-3xl md:text-5xl lg:text-6xl font-light uppercase text-[#F0EFEA]"
          >
            SCREENINGS & CREDITS
          </h2>
          <div className="w-12 h-[1px] bg-[#8C2F39] mx-auto mt-6" />
        </div>

        {/* Festival Laurels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {festivals.map((fest, idx) => (
            <div
              key={idx}
              className="bg-[#1B2628]/30 border border-[#1B2628] rounded-xl p-6 text-center hover:border-[#8C2F39] transition-colors duration-300"
            >
              <Award className="w-8 h-8 text-[#8C2F39] mx-auto mb-3" />
              <h3 className="font-serif text-lg text-[#F0EFEA] font-light mb-1">
                {fest.name}
              </h3>
              <p
                className="font-mono text-[10px] text-[#8B8F89] uppercase tracking-widest"
                dangerouslySetInnerHTML={{ __html: fest.detail }}
              />
            </div>
          ))}
        </div>

        {/* Screenings & Contact Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Upcoming Screenings Column */}
          <div className="lg:col-span-7 bg-[#1B2628]/20 border border-[#1B2628] rounded-xl p-8">
            <div className="flex items-center justify-between mb-8 border-b border-[#1B2628] pb-4">
              <h3 className="font-serif text-2xl font-light text-[#F0EFEA] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#8C2F39]" />
                UPCOMING PREMIERES
              </h3>
              <span className="font-mono text-xs text-[#8B8F89] uppercase tracking-widest">
                FALL 2026
              </span>
            </div>

            <div className="space-y-4">
              {screenings.map((sc, idx) => (
                <div
                  key={idx}
                  className="interactive flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-[#060F10] border border-[#1B2628] hover:border-[#8C2F39] transition-all duration-300 gap-2"
                >
                  <div className="flex items-center space-x-4">
                    <span className="font-mono text-xs text-[#8C2F39] w-24">
                      {sc.date}
                    </span>
                    <div>
                      <h4 className="font-serif text-lg text-[#F0EFEA] font-light flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#8B8F89]" />
                        {sc.city}
                      </h4>
                      <p className="font-sans text-xs text-[#8B8F89]">
                        {sc.venue}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border ${
                      sc.status === 'SOLD OUT'
                        ? 'border-[#434A48] text-[#434A48]'
                        : 'border-[#8C2F39] text-[#8C2F39] bg-[#8C2F39]/10'
                    }`}
                  >
                    {sc.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Credits Trigger Button */}
            <div className="mt-8 pt-6 border-t border-[#1B2628] text-center">
              <button
                onClick={onOpenCredits}
                className="interactive px-8 py-3 rounded-full border border-[#8C2F39] bg-[#8C2F39]/10 text-[#F0EFEA] hover:bg-[#8C2F39] font-sans text-xs tracking-widest uppercase transition-all duration-300"
              >
                VIEW FULL CAST & CREW CREDITS
              </button>
            </div>
          </div>

          {/* Contact / Press Form Column */}
          <div className="lg:col-span-5 bg-[#1B2628]/20 border border-[#1B2628] rounded-xl p-8">
            <h3 className="font-serif text-2xl font-light text-[#F0EFEA] mb-2">
              DISTRIBUTION & PRESS
            </h3>
            <p className="font-sans text-xs text-[#8B8F89] mb-6">
              For festival booking, theatrical distribution inquiries, or press kit requests, contact Manjkhola Productions.
            </p>

            {formSubmitted ? (
              <div className="py-12 text-center space-y-3 bg-[#060F10] border border-[#8C2F39] rounded-lg animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-[#8C2F39] mx-auto" />
                <h4 className="font-serif text-xl text-[#F0EFEA]">Message Transmitted</h4>
                <p className="font-sans text-xs text-[#8B8F89]">
                  Our press office will respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#8B8F89] mb-1">
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Elena Vance"
                    className="w-full bg-[#060F10] border border-[#1B2628] rounded-md px-4 py-2.5 text-sm text-[#F0EFEA] placeholder-[#434A48] focus:outline-none focus:border-[#8C2F39] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#8B8F89] mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="elena@filmjournal.com"
                    className="w-full bg-[#060F10] border border-[#1B2628] rounded-md px-4 py-2.5 text-sm text-[#F0EFEA] placeholder-[#434A48] focus:outline-none focus:border-[#8C2F39] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#8B8F89] mb-1">
                    INQUIRY TYPE
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#060F10] border border-[#1B2628] rounded-md px-4 py-2.5 text-sm text-[#F0EFEA] focus:outline-none focus:border-[#8C2F39] transition-colors"
                  >
                    <option value="Press Inquiry">Press & Media Inquiry</option>
                    <option value="Theatrical Booking">Theatrical / Festival Booking</option>
                    <option value="Distribution">Global Distribution Rights</option>
                    <option value="General">General Correspondence</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#8B8F89] mb-1">
                    MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter your inquiry..."
                    className="w-full bg-[#060F10] border border-[#1B2628] rounded-md px-4 py-2.5 text-sm text-[#F0EFEA] placeholder-[#434A48] focus:outline-none focus:border-[#8C2F39] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="interactive w-full py-3 rounded-md bg-[#8C2F39] text-[#F0EFEA] font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#A63844] transition-colors duration-300"
                >
                  <Send className="w-4 h-4" />
                  SUBMIT INQUIRY
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScreeningsCredits;
