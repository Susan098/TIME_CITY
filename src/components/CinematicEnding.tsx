import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface CinematicEndingProps {
  onFinish: () => void;
}

export const CinematicEnding: React.FC<CinematicEndingProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    // Stage 0: Returning to Patan village
    const t1 = setTimeout(() => setPhase(1), 3500); // Everything seems peaceful
    const t2 = setTimeout(() => setPhase(2), 7000); // Mysterious portal appears
    const t3 = setTimeout(() => setPhase(3), 11000); // Screen fades to black
    const t4 = setTimeout(() => setPhase(4), 14000); // "THE STORY IS NOT OVER..."
    const t5 = setTimeout(() => setPhase(5), 17500); // "TO BE CONTINUED"

    soundManager.playMusic(1); // Peaceful Himalayan theme

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black text-slate-100 flex flex-col items-center justify-center p-6 select-none transition-all duration-1000">
      {phase < 3 && (
        <div className="relative w-full max-w-3xl aspect-video rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-gradient-to-b from-sky-400/20 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
          {/* Himalayan background silhouette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-slate-950/80 to-slate-950" />

          {/* Peaceful Nepal elements */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <span className="text-4xl animate-bounce">🏔️</span>

            {phase === 0 && (
              <div className="space-y-2 animate-fadeIn">
                <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                  Epoch Restored
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-100">
                  Return to the Valley of Time
                </h2>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  With The Time Eater defeated, the timelines have stabilized. The morning bells of Patan chime across the tranquil mountains.
                </p>
              </div>
            )}

            {phase === 1 && (
              <div className="space-y-2 animate-fadeIn">
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-emerald-400">
                  A Fragile Peace
                </h2>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  The prayer flags flutter in the gentle breeze. The tea shops open their doors. Everything appears restored to its rightful era...
                </p>
              </div>
            )}

            {phase === 2 && (
              <div className="space-y-3 animate-fadeIn flex flex-col items-center">
                {/* Glowing anomaly portal */}
                <div className="w-20 h-20 rounded-full border-4 border-cyan-400 bg-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.8)] animate-spin flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-cyan-400">
                  A New Rift Awakens!
                </h2>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Suddenly, the Time Core on your wrist pulses with unknown celestial energy. A strange dimensional gate tears open the sky...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fade to Black text phases */}
      {phase === 3 && (
        <div className="text-center animate-fadeIn">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping mx-auto mb-4" />
        </div>
      )}

      {phase === 4 && (
        <div className="text-center space-y-4 animate-fadeIn">
          <h1 className="text-2xl sm:text-4xl font-bold font-display text-slate-100 tracking-wider">
            “THE STORY IS NOT OVER…”
          </h1>
        </div>
      )}

      {phase >= 5 && (
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            TIME CITY · ECHOES OF TIME
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 tracking-wider">
            TO BE CONTINUED
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            You have mastered all 30 levels across Nepal, Chrono Metropolis, and The Lost World!
          </p>

          <button
            onClick={onFinish}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-cyan-500 text-slate-950 font-bold rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto"
          >
            <span>Return to Main Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Skip button */}
      <button
        onClick={onFinish}
        className="fixed bottom-6 right-6 text-xs text-slate-500 hover:text-slate-300 transition-colors"
      >
        Skip Cutscene ⏭️
      </button>
    </div>
  );
};
