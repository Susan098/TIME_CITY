import React, { useRef, useState, useCallback, useEffect } from 'react';
import { soundManager } from '../audio/soundManager';

interface MobileControlsProps {
  onInput: (action: 'left' | 'right' | 'jump' | 'dash' | 'attack' | 'interact' | 'timeSwitch', active: boolean) => void;
  size?: 'normal' | 'large';
  opacity?: number;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onInput,
  size = 'normal',
  opacity = 0.75,
}) => {
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const joystickTouchId = useRef<number | null>(null);
  const joystickCenter = useRef({ x: 0, y: 0 });
  const joystickBaseRef = useRef<HTMLDivElement>(null);

  const buttonClass =
    size === 'large'
      ? 'w-16 h-16 text-sm font-bold'
      : 'w-13 h-13 text-xs font-bold';

  const handleJoystickStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (joystickTouchId.current !== null) return;
    const touch = e.changedTouches[0];
    joystickTouchId.current = touch.identifier;

    if (joystickBaseRef.current) {
      const rect = joystickBaseRef.current.getBoundingClientRect();
      joystickCenter.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
    setIsDragging(true);
    handleJoystickMove(e);
  };

  const handleJoystickMove = useCallback((e: React.TouchEvent | TouchEvent) => {
    if (joystickTouchId.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystickTouchId.current) {
        const dx = touch.clientX - joystickCenter.current.x;
        const dy = touch.clientY - joystickCenter.current.y;
        const distance = Math.hypot(dx, dy);
        const maxDist = 45;

        const clampedDist = Math.min(distance, maxDist);
        const angle = Math.atan2(dy, dx);

        const nx = Math.cos(angle) * clampedDist;
        const ny = Math.sin(angle) * clampedDist;

        setJoystickPos({ x: nx, y: ny });

        // Left / Right threshold
        if (nx > 12) {
          onInput('right', true);
          onInput('left', false);
        } else if (nx < -12) {
          onInput('left', true);
          onInput('right', false);
        } else {
          onInput('left', false);
          onInput('right', false);
        }

        // Upward jump threshold on joystick
        if (ny < -26) {
          onInput('jump', true);
        }
        break;
      }
    }
  }, [onInput]);

  const handleJoystickEnd = useCallback((e: React.TouchEvent | TouchEvent) => {
    if (joystickTouchId.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystickTouchId.current) {
        joystickTouchId.current = null;
        setIsDragging(false);
        setJoystickPos({ x: 0, y: 0 });
        onInput('left', false);
        onInput('right', false);
        onInput('jump', false);
        break;
      }
    }
  }, [onInput]);

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => handleJoystickMove(e);
    const onTouchEnd = (e: TouchEvent) => handleJoystickEnd(e);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [handleJoystickMove, handleJoystickEnd]);

  const handleActionButton = (
    action: 'jump' | 'dash' | 'attack' | 'interact' | 'timeSwitch',
    active: boolean
  ) => {
    if (active) soundManager.triggerVibration(18);
    onInput(action, active);
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-30"
      style={{ opacity }}
    >
      {/* Left Thumb Zone: Virtual Joystick */}
      <div className="absolute bottom-6 left-6 pointer-events-auto">
        <div
          ref={joystickBaseRef}
          onTouchStart={handleJoystickStart}
          className="relative w-32 h-32 rounded-full bg-slate-900/60 border-2 border-slate-700/60 flex items-center justify-center backdrop-blur-sm shadow-xl active:border-cyan-500/50"
        >
          {/* Inner stick handle */}
          <div
            className={`w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-md transition-transform duration-75 flex items-center justify-center text-slate-950 font-bold text-lg ${
              isDragging ? 'scale-110 shadow-cyan-500/40' : ''
            }`}
            style={{
              transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
            }}
          >
            ✦
          </div>
        </div>
      </div>

      {/* Right Thumb Zone: Action Buttons */}
      <div className="absolute bottom-6 right-6 pointer-events-auto flex items-end gap-3">
        {/* Secondary cluster: Interact & Dash */}
        <div className="flex flex-col gap-2.5 items-center">
          {/* Interact (E) */}
          <button
            onTouchStart={() => handleActionButton('interact', true)}
            onTouchEnd={() => handleActionButton('interact', false)}
            onMouseDown={() => handleActionButton('interact', true)}
            onMouseUp={() => handleActionButton('interact', false)}
            className={`${buttonClass} rounded-full bg-amber-600/90 text-amber-100 border border-amber-400/50 flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform`}
            aria-label="Interact"
          >
            <span>💬</span>
            <span className="text-[10px]">Talk</span>
          </button>

          {/* Dash (Shift) */}
          <button
            onTouchStart={() => handleActionButton('dash', true)}
            onTouchEnd={() => handleActionButton('dash', false)}
            onMouseDown={() => handleActionButton('dash', true)}
            onMouseUp={() => handleActionButton('dash', false)}
            className={`${buttonClass} rounded-full bg-indigo-600/90 text-indigo-100 border border-indigo-400/50 flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform`}
            aria-label="Dash"
          >
            <span>⚡</span>
            <span className="text-[10px]">Dash</span>
          </button>
        </div>

        {/* Primary cluster: Attack, Time Switch, Jump */}
        <div className="flex flex-col gap-2.5 items-center">
          {/* Time Switch (⏳ / Q) */}
          <button
            onTouchStart={() => handleActionButton('timeSwitch', true)}
            onTouchEnd={() => handleActionButton('timeSwitch', false)}
            onMouseDown={() => handleActionButton('timeSwitch', true)}
            onMouseUp={() => handleActionButton('timeSwitch', false)}
            className={`${buttonClass} rounded-full bg-gradient-to-r from-amber-500 to-cyan-500 text-slate-950 font-bold border-2 border-white/60 flex flex-col items-center justify-center shadow-xl active:scale-90 transition-transform`}
            aria-label="Switch Timeline"
          >
            <span>⏳</span>
            <span className="text-[10px]">Time</span>
          </button>

          {/* Time Pulse Attack (F) */}
          <button
            onTouchStart={() => handleActionButton('attack', true)}
            onTouchEnd={() => handleActionButton('attack', false)}
            onMouseDown={() => handleActionButton('attack', true)}
            onMouseUp={() => handleActionButton('attack', false)}
            className={`${buttonClass} rounded-full bg-rose-600/90 text-rose-100 border border-rose-400/50 flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform`}
            aria-label="Attack"
          >
            <span>💥</span>
            <span className="text-[10px]">Pulse</span>
          </button>
        </div>

        {/* Big Jump Button (W / Space) */}
        <div className="flex items-center">
          <button
            onTouchStart={() => handleActionButton('jump', true)}
            onTouchEnd={() => handleActionButton('jump', false)}
            onMouseDown={() => handleActionButton('jump', true)}
            onMouseUp={() => handleActionButton('jump', false)}
            className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-emerald-500/95 text-slate-950 font-black text-sm border-2 border-emerald-300 flex flex-col items-center justify-center shadow-2xl active:scale-90 transition-transform`}
            aria-label="Jump"
          >
            <span className="text-xl">▲</span>
            <span className="text-xs font-bold tracking-wider">JUMP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
