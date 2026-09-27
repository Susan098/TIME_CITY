import React from 'react';
import { Play, RotateCcw, Settings, Map, Home } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onOpenMap: () => void;
  onMainMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onOpenSettings,
  onOpenMap,
  onMainMenu,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-fadeIn">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col items-center gap-5 text-center text-slate-100">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-100 tracking-wide">
          GAME PAUSED
        </h2>

        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={onResume}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Resume Game</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Level</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>

          <button
            onClick={onOpenMap}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Map className="w-4 h-4" />
            <span>World Map</span>
          </button>

          <button
            onClick={onMainMenu}
            className="w-full py-2.5 px-4 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-medium text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
