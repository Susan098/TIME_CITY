import React from 'react';
import { GameSettings } from '../types/game';
import { Settings, Volume2, Music, Smartphone, Monitor, X, Sliders, Vibrate } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-slate-100">
                SYSTEM SETTINGS
              </h2>
              <p className="text-xs text-slate-400">Audio, graphics and controller settings</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Section */}
        <div className="flex flex-col gap-3">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            Audio Controls
          </div>

          {/* Music Volume */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Music className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold">Music Volume</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={(e) => onUpdateSettings({ musicVolume: parseFloat(e.target.value) })}
              className="w-36 accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* SFX Volume */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold">Sound FX Volume</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={(e) => onUpdateSettings({ sfxVolume: parseFloat(e.target.value) })}
              className="w-36 accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Vibration */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Vibrate className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold">Vibration Feedback</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ vibration: !settings.vibration })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                settings.vibration
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.vibration ? 'ENABLED' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Graphics Section */}
        <div className="flex flex-col gap-3">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
            Visual Quality
          </div>

          <div className="grid grid-cols-3 gap-2 bg-slate-950/60 border border-slate-800 rounded-2xl p-1.5">
            {(['low', 'medium', 'high'] as const).map((q) => (
              <button
                key={q}
                onClick={() => onUpdateSettings({ graphics: q })}
                className={`py-2 text-xs uppercase font-bold rounded-xl transition-all ${
                  settings.graphics === q
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Controls Section */}
        <div className="flex flex-col gap-3">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            Mobile Touch Configuration
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">On-Screen Virtual Controls</span>
              <button
                onClick={() => onUpdateSettings({ touchControls: !settings.touchControls })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  settings.touchControls
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {settings.touchControls ? 'ACTIVE' : 'HIDDEN'}
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5">
              <span className="text-sm font-semibold">Button Sizing</span>
              <div className="flex gap-1.5">
                {(['normal', 'large'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => onUpdateSettings({ buttonSize: sz })}
                    className={`px-3 py-1 text-xs uppercase font-bold rounded-lg transition-colors ${
                      settings.buttonSize === sz
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5">
              <span className="text-sm font-semibold">Button Opacity</span>
              <input
                type="range"
                min="0.3"
                max="1.0"
                step="0.05"
                value={settings.buttonOpacity}
                onChange={(e) => onUpdateSettings({ buttonOpacity: parseFloat(e.target.value) })}
                className="w-36 accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* PC Keyboard Shortcuts Reference */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
            PC Keyboard Controls
          </div>
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-slate-300">
            <div><span className="font-mono text-cyan-400 font-bold">A / D</span> · Move Left / Right</div>
            <div><span className="font-mono text-cyan-400 font-bold">W / Space</span> · Jump</div>
            <div><span className="font-mono text-cyan-400 font-bold">Q</span> · Switch Timeline</div>
            <div><span className="font-mono text-cyan-400 font-bold">Shift</span> · Dash</div>
            <div><span className="font-mono text-cyan-400 font-bold">F</span> · Time Ability / Pulse</div>
            <div><span className="font-mono text-cyan-400 font-bold">E</span> · Interact / Talk</div>
            <div><span className="font-mono text-cyan-400 font-bold">H</span> · Time Guide Hint</div>
            <div><span className="font-mono text-cyan-400 font-bold">ESC</span> · Pause</div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-1 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
          >
            Save & Return
          </button>
        </div>
      </div>
    </div>
  );
};
