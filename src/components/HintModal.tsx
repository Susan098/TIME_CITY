import React, { useState } from 'react';
import { Lightbulb, Eye, X, HelpCircle, Sparkles } from 'lucide-react';

interface HintModalProps {
  levelId: number;
  levelName: string;
  hints: [string, string, string];
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  levelId,
  levelName,
  hints,
  onClose,
}) => {
  const [unlockedTier, setUnlockedTier] = useState<number>(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative flex flex-col gap-5 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-amber-400">
                TIME GUIDE · LEVEL {levelId}
              </h2>
              <p className="text-xs text-slate-400">{levelName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Tier Hint System */}
        <div className="flex flex-col gap-3">
          {/* Tier 1: Small Clue */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Tier 1 · Observation Clue
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">Revealed</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{hints[0]}</p>
          </div>

          {/* Tier 2: Stronger Clue */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Tier 2 · Direction Clue
              </span>
              {unlockedTier < 2 ? (
                <button
                  onClick={() => setUnlockedTier(2)}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  Reveal Clue
                </button>
              ) : (
                <span className="text-[11px] text-emerald-400 font-medium">Revealed</span>
              )}
            </div>
            {unlockedTier >= 2 ? (
              <p className="text-sm text-slate-300 leading-relaxed">{hints[1]}</p>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Need a stronger hint? Tap Reveal Clue to unmask.
              </p>
            )}
          </div>

          {/* Tier 3: Solution Help */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                Tier 3 · Solution Breakdown
              </span>
              {unlockedTier < 3 ? (
                <button
                  onClick={() => setUnlockedTier(3)}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  Reveal Solution
                </button>
              ) : (
                <span className="text-[11px] text-emerald-400 font-medium">Revealed</span>
              )}
            </div>
            {unlockedTier >= 3 ? (
              <p className="text-sm text-slate-300 leading-relaxed">{hints[2]}</p>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Completely stuck? Tap Reveal Solution for exact instructions.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
          >
            Got It! Resume Game
          </button>
        </div>
      </div>
    </div>
  );
};
