import React, { useState, useEffect } from 'react';
import { SaveData, Timeline } from '../types/game';
import { Play, RotateCcw, Map, Trophy, Settings, Sparkles, Clock, Globe } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface MainMenuProps {
  saveData: SaveData;
  onContinue: () => void;
  onNewGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  saveData,
  onContinue,
  onNewGame,
  onOpenLevelSelect,
  onOpenAchievements,
  onOpenSettings,
}) => {
  const [activeEra, setActiveEra] = useState<Timeline>('present');
  const [confirmNewGame, setConfirmNewGame] = useState(false);

  // Cycle era every 4.5 seconds for visual dynamic backdrop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveEra((prev) => (prev === 'past' ? 'present' : prev === 'present' ? 'future' : 'past'));
    }, 4500);

    // Play title music (gentle Himalayan theme)
    soundManager.playMusic(1);

    return () => clearInterval(timer);
  }, []);

  const eraThemes = {
    past: {
      label: 'PAST · ANCIENT ERA',
      color: 'text-amber-400',
      bgGradients: 'from-amber-950/80 via-slate-950 to-slate-950',
      accentBorder: 'border-amber-500/40',
      tag: 'Golden Pagodas & Ancient Temples',
    },
    present: {
      label: 'PRESENT · MODERN ERA',
      color: 'text-emerald-400',
      bgGradients: 'from-emerald-950/70 via-slate-950 to-slate-950',
      accentBorder: 'border-emerald-500/40',
      tag: 'Kathmandu Streets & Mountain Trails',
    },
    future: {
      label: 'FUTURE · CYBERPUNK ERA',
      color: 'text-cyan-400',
      bgGradients: 'from-cyan-950/80 via-slate-950 to-slate-950',
      accentBorder: 'border-cyan-500/40',
      tag: 'Neon Megacity & Floating Skyways',
    },
  };

  const currentTheme = eraThemes[activeEra];
  const hasSave = saveData.unlockedLevels.length > 1 || (saveData.stars[1] || 0) > 0;

  return (
    <div
      className={`fixed inset-0 z-40 bg-gradient-to-b ${currentTheme.bgGradients} text-slate-100 flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto transition-colors duration-1000`}
    >
      {/* Background Poster Image with measured scrim */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-30 mix-blend-luminosity">
        <img
          src="/src/assets/images/time_city_poster_1790510435453.jpg"
          alt="Time City Poster"
          className="w-full h-full object-cover scale-105"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Top Bar Zone */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        {/* Timeline Era Indicator in header */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <Clock className={`w-3.5 h-3.5 ${currentTheme.color}`} />
          <span className={`text-[11px] font-bold tracking-wider ${currentTheme.color}`}>
            {currentTheme.label}
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">· {currentTheme.tag}</span>
        </div>

        {/* Global Progress Badges */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAchievements}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-amber-400 transition-colors"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Achievements</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center justify-center transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Title Center Hero */}
      <div className="flex flex-col items-center justify-center text-center my-auto py-8">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs font-semibold text-slate-300 mb-3 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>30 Levels · 3 Worlds · Timeline Manipulation</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-slate-100 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          TIME CITY
        </h1>

        <div className="text-lg sm:text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 mt-1 mb-8 uppercase font-display">
          Echoes of Time
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs sm:max-w-sm">
          {/* Continue Button */}
          {hasSave && (
            <button
              onClick={onContinue}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500 hover:opacity-95 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2.5 shadow-2xl transition-all transform hover:scale-102 active:scale-98"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span className="tracking-wide">CONTINUE (LEVEL {saveData.currentLevel || 1})</span>
            </button>
          )}

          {/* New Game Button */}
          {confirmNewGame ? (
            <div className="bg-slate-900 border border-rose-500/50 rounded-2xl p-3 flex flex-col gap-2 animate-fadeIn">
              <span className="text-xs text-rose-300 font-semibold">
                Reset all progress and start fresh?
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setConfirmNewGame(false);
                    onNewGame();
                  }}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Yes, New Game
                </button>
                <button
                  onClick={() => setConfirmNewGame(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                if (hasSave) setConfirmNewGame(true);
                else onNewGame();
              }}
              className={`w-full py-3.5 px-6 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-98 ${
                hasSave
                  ? 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-200'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>START NEW ADVENTURE</span>
            </button>
          )}

          {/* World Map & Level Select */}
          <button
            onClick={onOpenLevelSelect}
            className="w-full py-3 px-6 bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-200 font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors active:scale-98"
          >
            <Map className="w-4 h-4 text-cyan-400" />
            <span>WORLD MAP · 30 LEVELS</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="w-full py-2.5 px-6 bg-slate-900/50 hover:bg-slate-900/80 text-slate-400 hover:text-slate-200 font-medium text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>GAME SETTINGS & CONTROLS</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 max-w-5xl mx-auto w-full pt-4 border-t border-slate-800/80 gap-2">
        <div className="flex items-center gap-2">
          <span>PC (Keyboard) & Android (Touchscreen)</span>
          <span>·</span>
          <span>Offline Playable</span>
        </div>
        <div>
          <span>“What happens if I change time here?”</span>
        </div>
      </div>
    </div>
  );
};
