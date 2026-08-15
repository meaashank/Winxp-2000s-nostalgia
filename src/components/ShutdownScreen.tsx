import React, { useState } from 'react';
import { playCrtPowerOn, stopAmbience, stopWinampSynth } from '../utils/audio';
import { Power, RotateCcw, Moon, X } from 'lucide-react';

interface ShutdownScreenProps {
  onCancel: () => void;
  onRestart: () => void;
}

export const ShutdownScreen: React.FC<ShutdownScreenProps> = ({ onCancel, onRestart }) => {
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);

  const handleTurnOff = () => {
    setIsShuttingDown(true);
    stopAmbience();
    stopWinampSynth();

    setTimeout(() => {
      playCrtPowerOn(); // Relay click on turn off
      setIsTerminated(true);
    }, 1200);
  };

  if (isTerminated) {
    return (
      <div
        onClick={onRestart}
        className="fixed inset-0 z-50 w-full h-full bg-[#000000] flex flex-col items-center justify-center cursor-pointer select-none text-center p-6"
      >
        <div className="text-gray-600 font-mono text-[11px] uppercase tracking-widest mb-4">
          CABIN 04 — SESSION ENDED
        </div>
        <div className="text-gray-800 font-mono text-[10px]">
          [ PRESS ENTER OR CLICK TO RESTART TERMINAL ]
        </div>
      </div>
    );
  }

  if (isShuttingDown) {
    return (
      <div className="fixed inset-0 z-50 w-full h-full bg-gradient-to-r from-[#002266] via-[#0055cc] to-[#002266] flex flex-col items-center justify-center text-white select-none animate-crt-off">
        <div className="text-xl font-bold italic font-sans mb-2">Windows is shutting down...</div>
        <div className="text-xs text-blue-200 font-mono">Saving your cyber café session settings</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-black/60 backdrop-blur-xs flex items-center justify-center select-none font-tahoma text-[11px]">
      {/* Authentic Windows XP Turn Off Dialog */}
      <div className="w-[380px] bg-gradient-to-r from-[#0055ea] via-[#3593ff] to-[#0055ea] p-1 rounded-t-md shadow-2xl border-2 border-[#0055ea]">
        {/* Header */}
        <div className="px-3 py-1.5 flex justify-between items-center text-white font-bold">
          <span>Turn off computer</span>
          <button
            type="button"
            onClick={onCancel}
            className="w-5 h-5 bg-[#e81123] rounded-xs flex items-center justify-center hover:brightness-110 cursor-pointer"
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>

        {/* Dialog Body with 3 Action Buttons */}
        <div className="bg-[#003399] p-6 flex justify-around items-center border-t border-b border-white/40">
          {/* Stand By */}
          <button
            type="button"
            onClick={onCancel}
            className="flex flex-col items-center gap-2 text-white hover:scale-105 transition-transform cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#ffd54f] to-[#ff8f00] flex items-center justify-center shadow-lg border-2 border-white">
              <Moon size={20} className="text-white fill-white" />
            </div>
            <span className="font-bold text-[11px] group-hover:underline">Stand By</span>
          </button>

          {/* Turn Off */}
          <button
            type="button"
            onClick={handleTurnOff}
            className="flex flex-col items-center gap-2 text-white hover:scale-105 transition-transform cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#e53935] to-[#b71c1c] flex items-center justify-center shadow-lg border-2 border-white">
              <Power size={20} className="text-white" />
            </div>
            <span className="font-bold text-[11px] group-hover:underline">Turn Off</span>
          </button>

          {/* Restart */}
          <button
            type="button"
            onClick={onRestart}
            className="flex flex-col items-center gap-2 text-white hover:scale-105 transition-transform cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#43a047] to-[#1b5e20] flex items-center justify-center shadow-lg border-2 border-white">
              <RotateCcw size={20} className="text-white" />
            </div>
            <span className="font-bold text-[11px] group-hover:underline">Restart</span>
          </button>
        </div>

        {/* Bottom Cancel Button */}
        <div className="bg-[#002266] p-2 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1 bg-[#ece9d8] hover:bg-[#dfdbcc] border border-gray-400 font-bold text-[#111] rounded-xs cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
