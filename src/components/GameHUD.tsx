import React from 'react';
import { PlayerState, Timeline } from '../types/game';
import { Heart, Zap, Coins, Sparkles, Lightbulb, Pause, Clock } from 'lucide-react';

interface GameHUDProps {
  player: PlayerState;
  levelName: string;
  levelId: number;
  worldId: 1 | 2 | 3;
  allowedTimelines: Timeline[];
  escapeTimer?: number;
  smartHintNotice?: boolean;
  onOpenHint: () => void;
  onPause: () => void;
  onSwitchTimeline: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  player,
  levelName,
  levelId,
  worldId,
  allowedTimelines,
  escapeTimer,
  smartHintNotice,
  onOpenHint,
  onPause,
  onSwitchTimeline,
}) => {
  const worldName =
    worldId === 1 ? 'Valley of Time (Nepal)' : worldId === 2 ? 'Chrono Metropolis' : 'The Lost World';

  return (
    <div className="absolute inset-0 pointer-events-none p-3 sm:p-5 flex flex-col justify-between select-none">
      {/* Top Bar Zone */}
      <div className="flex items-start justify-between gap-2">
        {/* Left: Health & Energy */}
        <div className="flex flex-col gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 sm:px-4 sm:py-3 shadow-lg pointer-events-auto">
          {/* Hearts */}
          <div className="flex items-center gap-1">
            {Array.from({ length: player.maxHealth }).map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${
                  i < player.health ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-600 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Energy Bar */}
          <div className="flex items-center gap-1.5 w-24 sm:w-32">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
              <div
                className="bg-amber-400 h-full transition-all duration-150 rounded-full"
                style={{ width: `${(player.energy / player.maxEnergy) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Timeline Core & Level Name */}
        <div className="flex flex-col items-center pointer-events-auto">
          <div className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-wide mb-1 text-center">
            {levelName} · <span className="text-slate-300">Level {levelId}</span>
          </div>

          {/* Timeline Switcher Pill */}
          <div
            onClick={onSwitchTimeline}
            className="flex items-center gap-1 p-1 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-full shadow-lg cursor-pointer hover:border-slate-500 transition-all active:scale-95"
            title="Click or press Q to switch timeline"
          >
            {/* Past */}
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                player.timeline === 'past'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                  : allowedTimelines.includes('past')
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 opacity-40'
              }`}
            >
              PAST
            </span>

            {/* Present */}
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                player.timeline === 'present'
                  ? 'bg-emerald-500 text-slate-950 shadow-md scale-105'
                  : allowedTimelines.includes('present')
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 opacity-40'
              }`}
            >
              PRESENT
            </span>

            {/* Future */}
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                player.timeline === 'future'
                  ? 'bg-cyan-400 text-slate-950 shadow-md scale-105'
                  : allowedTimelines.includes('future')
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 opacity-40'
              }`}
            >
              FUTURE
            </span>
          </div>
        </div>

        {/* Right: Coins, Shards, Timer & Pause */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg">
            {/* Coins */}
            <div className="flex items-center gap-1 text-amber-400 font-bold text-xs sm:text-sm tabular-nums">
              <Coins className="w-4 h-4" />
              <span>{player.coinsCollectedInLevel}</span>
            </div>

            {/* Shard */}
            <div className="flex items-center gap-1 text-sky-400 font-bold text-xs sm:text-sm">
              <Sparkles
                className={`w-4 h-4 ${player.shardCollectedInLevel ? 'fill-sky-400 text-sky-300' : 'text-slate-600'}`}
              />
            </div>

            {/* Escape Countdown */}
            {escapeTimer !== undefined && escapeTimer > 0 && (
              <div className="flex items-center gap-1 text-rose-400 font-mono font-bold text-xs sm:text-sm">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>{Math.ceil(escapeTimer)}s</span>
              </div>
            )}
          </div>

          {/* Pause Button */}
          <button
            onClick={onPause}
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-slate-900/90 border border-slate-800 hover:border-slate-600 text-slate-200 rounded-xl shadow-lg transition-transform active:scale-90"
            aria-label="Pause Game"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Area: Smart Hint notification & Quick Hint trigger */}
      <div className="flex items-end justify-between w-full pointer-events-none">
        {/* Smart Hint Notice */}
        {smartHintNotice ? (
          <div
            onClick={onOpenHint}
            className="pointer-events-auto flex items-center gap-2 bg-amber-500/90 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl shadow-xl cursor-pointer transition-all animate-bounce"
          >
            <Lightbulb className="w-4 h-4 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">
              Something here might change with time… 💡
            </span>
          </div>
        ) : (
          <div />
        )}

        {/* Floating Hint Trigger Button */}
        <button
          onClick={onOpenHint}
          className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 border border-amber-500/40 text-amber-300 px-3 py-2 rounded-xl shadow-lg transition-transform active:scale-95"
          aria-label="Open Time Guide Hint"
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold">Hint (H)</span>
        </button>
      </div>
    </div>
  );
};
