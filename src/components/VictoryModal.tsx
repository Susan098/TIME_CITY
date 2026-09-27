import React from 'react';
import { Star, Coins, Sparkles, ArrowRight, RotateCcw, Map } from 'lucide-react';

interface VictoryModalProps {
  levelId: number;
  levelName: string;
  stars: number;
  coins: number;
  hasShard: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onOpenMap: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  levelId,
  levelName,
  stars,
  coins,
  hasShard,
  onNextLevel,
  onReplay,
  onOpenMap,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-6 text-center text-slate-100">
        {/* Banner */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Timeline Restored
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-100">
            LEVEL {levelId} COMPLETE!
          </h2>
          <p className="text-xs text-slate-400">{levelName}</p>
        </div>

        {/* Stars */}
        <div className="flex items-center justify-center gap-3">
          {[1, 2, 3].map((starNum) => (
            <div
              key={starNum}
              className={`transition-all duration-500 transform ${
                starNum <= stars ? 'scale-110 text-amber-400' : 'text-slate-700 scale-90'
              }`}
            >
              <Star
                className={`w-10 h-10 sm:w-12 sm:h-12 ${
                  starNum <= stars ? 'fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]' : ''
                }`}
              />
            </div>
          ))}
        </div>

        {/* Rewards summary */}
        <div className="grid grid-cols-2 gap-3 w-full bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2.5 justify-center">
            <Coins className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div className="text-xs text-slate-400">Coins</div>
              <div className="text-sm font-bold text-slate-200">+{coins}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 justify-center">
            <Sparkles className={`w-5 h-5 ${hasShard ? 'text-sky-400 fill-sky-400' : 'text-slate-600'}`} />
            <div className="text-left">
              <div className="text-xs text-slate-400">Time Shard</div>
              <div className="text-sm font-bold text-slate-200">{hasShard ? 'Discovered!' : 'Missed'}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          {levelId < 30 ? (
            <button
              onClick={onNextLevel}
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
            >
              <span>Next Level</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onNextLevel}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-cyan-500 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all active:scale-98"
            >
              <span>Watch Grand Finale</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onReplay}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>
            <button
              onClick={onOpenMap}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Map className="w-3.5 h-3.5" />
              <span>World Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
