import React, { useState } from 'react';
import { SaveData } from '../types/game';
import { LEVELS } from '../game/levels';
import { Star, Sparkles, ArrowLeft, Lock, Play } from 'lucide-react';

interface WorldMapProps {
  saveData: SaveData;
  onSelectLevel: (levelId: number) => void;
  onBackToMenu: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  saveData,
  onSelectLevel,
  onBackToMenu,
}) => {
  // Determine default tab based on unlocked levels
  const highestLevel = Math.max(...(saveData.unlockedLevels || [1]));
  const defaultWorld = highestLevel > 20 ? 3 : highestLevel > 10 ? 2 : 1;
  const [selectedWorld, setSelectedWorld] = useState<1 | 2 | 3>(defaultWorld);

  const worldLevels = LEVELS.filter((l) => l.worldId === selectedWorld);

  const worldMeta = {
    1: {
      name: 'NEPAL: VALLEY OF TIME',
      subtitle: 'Ancient Pagodas, Terraced Hills & Himalayan Peaks',
      icon: '🌄',
      bannerColor: 'from-amber-600/30 to-orange-950/40 border-amber-500/40',
    },
    2: {
      name: 'CHRONO METROPOLIS',
      subtitle: 'Cyberpunk Neon Towers, Maglev Subways & Robot Citadels',
      icon: '🏙️',
      bannerColor: 'from-cyan-600/30 to-blue-950/40 border-cyan-500/40',
    },
    3: {
      name: 'THE LOST WORLD',
      subtitle: 'Floating Cosmic Islands, Inverted Gravity & Chrono Storms',
      icon: '🌌',
      bannerColor: 'from-purple-600/30 to-fuchsia-950/40 border-purple-500/40',
    },
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-6 overflow-y-auto select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full mb-4 pb-3 border-b border-slate-800">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors text-xs sm:text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Main Menu</span>
        </button>

        <div className="text-center">
          <h1 className="text-lg sm:text-2xl font-bold font-display tracking-wider text-slate-100">
            TIMELINE CHRONICLE
          </h1>
          <p className="text-xs text-slate-400">Select any unlocked territory to warp</p>
        </div>

        {/* Global Shards Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm font-bold text-sky-400">
          <Sparkles className="w-4 h-4 fill-sky-400" />
          <span>
            {Object.values(saveData.shards).filter(Boolean).length} / 30 Shards
          </span>
        </div>
      </div>

      {/* World Selection Tabs */}
      <div className="max-w-5xl mx-auto w-full mb-6">
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
          {[1, 2, 3].map((wId) => {
            const id = wId as 1 | 2 | 3;
            const isUnlocked = id === 1 || highestLevel >= (id === 2 ? 11 : 21);
            const isSelected = selectedWorld === id;

            return (
              <button
                key={id}
                onClick={() => isUnlocked && setSelectedWorld(id)}
                disabled={!isUnlocked}
                className={`py-3 px-3 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                    : isUnlocked
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    : 'opacity-40 cursor-not-allowed text-slate-600'
                }`}
              >
                <span className="text-lg">{worldMeta[id].icon}</span>
                <span className="text-xs sm:text-sm font-bold truncate">
                  World {id}
                </span>
                {!isUnlocked && <Lock className="w-3.5 h-3.5 ml-1 text-slate-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active World Banner */}
      <div className="max-w-5xl mx-auto w-full mb-6">
        <div
          className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r ${worldMeta[selectedWorld].bannerColor} border backdrop-blur-sm flex items-center justify-between`}
        >
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-0.5">
              World {selectedWorld} Territory
            </div>
            <h2 className="text-lg sm:text-2xl font-bold font-display text-slate-100">
              {worldMeta[selectedWorld].name}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {worldMeta[selectedWorld].subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 10 Levels Grid for the selected world */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pb-8">
        {worldLevels.map((lvl) => {
          const isUnlocked = (saveData.unlockedLevels || [1]).includes(lvl.id);
          const starsCount = saveData.stars[lvl.id] || 0;
          const hasShard = Boolean(saveData.shards[lvl.id]);
          const isCurrent = saveData.currentLevel === lvl.id;

          return (
            <div
              key={lvl.id}
              onClick={() => isUnlocked && onSelectLevel(lvl.id)}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[140px] relative ${
                isCurrent
                  ? 'bg-slate-900 border-amber-500/80 shadow-lg shadow-amber-500/10 scale-102 cursor-pointer'
                  : isUnlocked
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850 cursor-pointer'
                  : 'bg-slate-950/60 border-slate-900 opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Header: Level Number & Star rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">
                  #{lvl.id}
                </span>

                {isUnlocked ? (
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= starsCount
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="my-2">
                <div className="text-sm font-bold text-slate-200 line-clamp-1">
                  {lvl.name}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1">
                  {lvl.subtitle}
                </div>
              </div>

              {/* Bottom footer: Shard tag or Boss badge */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                {lvl.specialType === 'boss' ? (
                  <span className="text-[10px] uppercase font-bold text-rose-400">
                    👑 Boss Fight
                  </span>
                ) : hasShard ? (
                  <span className="text-[10px] text-sky-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-sky-400" />
                    Shard Found
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-600">
                    {isUnlocked ? 'Playable' : 'Locked'}
                  </span>
                )}

                {isUnlocked && (
                  <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 fill-slate-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
