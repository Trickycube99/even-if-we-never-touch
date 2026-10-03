import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const intervalRef = useRef(null);

  // Initialize Web Audio API synth piano engine for quiet, melancholic atmosphere
  const initAudio = () => {
    if (audioContextRef.current) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);

      audioContextRef.current = ctx;
      gainNodeRef.current = masterGain;
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  };

  // Play a soft, warm synthesized piano note
  const playPianoNote = (freq, duration = 3.5, delay = 0) => {
    const ctx = audioContextRef.current;
    if (!ctx || ctx.state !== 'running' || !gainNodeRef.current) return;

    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle'; // Warm fundamental tone
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, ctx.currentTime + delay); // Soft, muted feel

    const now = ctx.currentTime + delay;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.12, now + 0.15); // Gentle attack
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration); // Long piano decay

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(gainNodeRef.current);

    osc.start(now);
    osc.stop(now + duration);
  };

  // Melancholic chord progression frequencies (Hz): Cm9, Fm7, AbMaj7, Bb6
  const chords = [
    [130.81, 155.56, 196.00, 233.08, 293.66], // C3, Eb3, G3, Bb3, D4
    [174.61, 207.65, 261.63, 311.13, 392.00], // F3, Ab3, C4, Eb4, G4
    [207.65, 261.63, 311.13, 392.00, 440.00], // Ab3, C4, Eb4, G4, A4
    [116.54, 174.61, 233.08, 293.66, 349.23], // Bb2, F3, Bb3, D4, F4
  ];

  const startPianoLoop = () => {
    let step = 0;
    const playChord = () => {
      const currentChord = chords[step % chords.length];
      currentChord.forEach((noteFreq, idx) => {
        playPianoNote(noteFreq, 4.5, idx * 0.45); // Arpeggiated entry
      });
      step++;
    };

    playChord();
    intervalRef.current = setInterval(playChord, 5500);
  };

  const toggleSound = () => {
    initAudio();

    if (!audioContextRef.current) return;

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (!isPlaying) {
      setIsPlaying(true);
      setHasInteracted(true);
      startPianoLoop();
    } else {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  // Swell volume on scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!gainNodeRef.current || !isPlaying || !audioContextRef.current) return;
      const scrollRatio = Math.min(1, window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));
      // Swell from 0.05 up to 0.18 max volume
      const targetGain = 0.05 + scrollRatio * 0.13;
      gainNodeRef.current.gain.setTargetAtTime(targetGain, audioContextRef.current.currentTime, 0.2);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  return (
    <button
      onClick={toggleSound}
      className="interactive flex items-center gap-3 px-4 py-2 rounded-full border border-[#8B8F89]/30 bg-[#060F10]/70 backdrop-blur-md text-[#F0EFEA] hover:border-[#8C2F39] transition-all duration-300 group"
      title={isPlaying ? 'Mute ambient piano score' : 'Play ambient piano score'}
      aria-label="Toggle ambient score"
    >
      <div className="relative flex items-center justify-center w-5 h-5">
        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-[#8C2F39] animate-pulse" />
        ) : (
          <VolumeX className="w-4 h-4 text-[#8B8F89] group-hover:text-[#F0EFEA]" />
        )}
      </div>
      <span className="font-mono text-xs tracking-widest uppercase text-[#8B8F89] group-hover:text-[#F0EFEA]">
        {isPlaying ? 'Score: Active' : 'Sound: Muted'}
      </span>
      {isPlaying && (
        <div className="flex items-end gap-[2px] h-3 ml-1">
          <div className="w-[2px] h-full bg-[#8C2F39] animate-bounce" style={{ animationDuration: '0.8s' }} />
          <div className="w-[2px] h-2/3 bg-[#8C2F39] animate-bounce" style={{ animationDuration: '1.1s' }} />
          <div className="w-[2px] h-4/5 bg-[#8C2F39] animate-bounce" style={{ animationDuration: '0.6s' }} />
        </div>
      )}
    </button>
  );
};

export default AudioPlayer;
