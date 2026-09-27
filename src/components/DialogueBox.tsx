import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';

interface DialogueBoxProps {
  dialogue: {
    name: string;
    title: string;
    avatar: string;
    lines: string[];
    currentLine: number;
  };
  onAdvance: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ dialogue, onAdvance }) => {
  const currentText = dialogue.lines[dialogue.currentLine] || '';
  const isLastLine = dialogue.currentLine >= dialogue.lines.length - 1;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 select-none animate-fadeIn">
      <div
        onClick={onAdvance}
        className="bg-slate-900/95 border-2 border-amber-500/50 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md cursor-pointer hover:border-amber-400 transition-all flex flex-col gap-2"
      >
        {/* Header: Name and Avatar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{dialogue.avatar}</span>
            <div>
              <div className="text-sm font-bold text-amber-400">{dialogue.name}</div>
              <div className="text-[11px] text-slate-400">{dialogue.title}</div>
            </div>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            {dialogue.currentLine + 1} / {dialogue.lines.length}
          </span>
        </div>

        {/* Text */}
        <p className="text-sm sm:text-base text-slate-100 min-h-[48px] flex items-center leading-relaxed">
          {currentText}
        </p>

        {/* Prompt */}
        <div className="flex items-center justify-end gap-1 text-xs text-amber-400/80 font-medium pt-1">
          <span>{isLastLine ? 'Tap to close' : 'Tap or press E to continue'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
