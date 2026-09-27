import React from 'react';
import { SaveData } from '../types/game';
import { INITIAL_ACHIEVEMENTS } from '../game/engine';
import { Trophy, X, CheckCircle2, Lock } from 'lucide-react';

interface AchievementsModalProps {
  saveData: SaveData;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  saveData,
  onClose,
}) => {
  const achievements = INITIAL_ACHIEVEMENTS.map((ach) => ({
    ...ach,
    unlocked: Boolean(saveData.achievements[ach.id]),
    progress:
      ach.id === 'time_traveler'
        ? Math.min(ach.maxProgress || 50, saveData.timeSwitchesCount || 0)
        : ach.id === 'secret_hunter'
        ? Math.min(
            ach.maxProgress || 15,
            Object.values(saveData.shards).filter(Boolean).length
          )
        : ach.progress,
  }));

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5 text-slate-100 max-h-[88vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-slate-100">
                ACHIEVEMENTS
              </h2>
              <p className="text-xs text-slate-400">
                Unlocked {unlockedCount} of {achievements.length} badges
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                ach.unlocked
                  ? 'bg-slate-950/70 border-amber-500/40'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="text-3xl shrink-0 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                {ach.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3
                    className={`text-sm font-bold ${
                      ach.unlocked ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  >
                    {ach.title}
                  </h3>
                  {ach.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {ach.description}
                </p>

                {ach.maxProgress && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>
                        {ach.progress} / {ach.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full transition-all"
                        style={{
                          width: `${((ach.progress || 0) / ach.maxProgress) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
