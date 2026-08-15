import React, { useState, useEffect } from 'react';
import { playMouseClick, playKeyClick } from '../../utils/audio';
import { Target, Crosshair, Trophy, RotateCcw } from 'lucide-react';

export const CounterStrikeTrainer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);
  const [spawnTime, setSpawnTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [roundTimeLeft, setRoundTimeLeft] = useState(25);

  const spawnTarget = () => {
    const x = Math.floor(15 + Math.random() * 70);
    const y = Math.floor(15 + Math.random() * 70);
    setTargetPos({ x, y });
    setSpawnTime(Date.now());
  };

  const handleStart = () => {
    playMouseClick();
    setIsPlaying(true);
    setScore(0);
    setMisses(0);
    setReactionTimes([]);
    setRoundTimeLeft(25);
    spawnTarget();
  };

  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setRoundTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            setTargetPos(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleHitTarget = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPlaying || !targetPos) return;

    playKeyClick();
    const rt = Date.now() - spawnTime;
    setReactionTimes((prev) => [...prev, rt]);
    setScore((s) => s + 100 + Math.max(0, 500 - rt));
    spawnTarget();
  };

  const handleMiss = () => {
    if (!isPlaying) return;
    playMouseClick();
    setMisses((m) => m + 1);
  };

  const avgReaction =
    reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;

  return (
    <div className="w-full h-full flex flex-col bg-[#1a201c] text-[#e0e8e2] font-mono text-[11px] select-none">
      {/* Header bar */}
      <div className="bg-[#243028] border-b border-[#3b4e40] px-3 py-1.5 flex justify-between items-center text-[#9bc5a2]">
        <div className="flex items-center gap-2">
          <Crosshair size={14} className="text-[#a4d48f]" />
          <span className="font-bold text-[12px] text-white">CS 1.6 LAN Reflex Arena (de_dust2)</span>
        </div>
        <div className="flex gap-4 text-[10px]">
          <span>SCORE: <strong className="text-white">{score}</strong></span>
          <span>TIME: <strong className="text-amber-400">{roundTimeLeft}s</strong></span>
          <span>AVG RT: <strong className="text-green-400">{avgReaction > 0 ? `${avgReaction}ms` : '--'}</strong></span>
        </div>
      </div>

      {/* Crosshair Game Canvas */}
      <div
        onClick={handleMiss}
        className="flex-1 relative bg-[#2a372e] border-2 border-[#151c17] m-2 overflow-hidden cursor-crosshair flex items-center justify-center"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(80, 100, 80, 0.2) 0%, rgba(15, 20, 15, 0.9) 100%), linear-gradient(#2f3d33 1px, transparent 1px), linear-gradient(90deg, #2f3d33 1px, transparent 1px)',
          backgroundSize: '100% 100%, 20px 20px, 20px 20px',
        }}
      >
        {!isPlaying && roundTimeLeft === 25 && (
          <div className="text-center p-6 bg-black/80 border border-[#4a6350] rounded-sm max-w-sm">
            <Target size={36} className="mx-auto mb-2 text-[#76ff03]" />
            <h3 className="text-sm font-bold text-white mb-1">AIM & REFLEX WARMUP</h3>
            <p className="text-[10.5px] text-gray-300 mb-4">
              Click terrorist targets as fast as possible. Test your 2004 optical ball-mouse latency!
            </p>
            <button
              type="button"
              onClick={handleStart}
              className="px-4 py-1.5 bg-[#4caf50] hover:bg-[#43a047] text-black font-bold rounded cursor-pointer uppercase tracking-wider"
            >
              Start Round
            </button>
          </div>
        )}

        {!isPlaying && roundTimeLeft === 0 && (
          <div className="text-center p-6 bg-black/85 border border-[#4a6350] rounded-sm max-w-sm">
            <Trophy size={36} className="mx-auto mb-2 text-amber-400" />
            <h3 className="text-sm font-bold text-white mb-1">ROUND OVER</h3>
            <div className="text-[11px] text-gray-300 space-y-1 mb-4">
              <div>Final Score: <span className="text-white font-bold">{score}</span></div>
              <div>Hits: <span className="text-green-400 font-bold">{reactionTimes.length}</span> / Misses: <span className="text-red-400">{misses}</span></div>
              <div>Average Reaction Time: <span className="text-amber-400 font-bold">{avgReaction} ms</span></div>
            </div>
            <button
              type="button"
              onClick={handleStart}
              className="px-4 py-1.5 bg-[#4caf50] hover:bg-[#43a047] text-black font-bold rounded cursor-pointer uppercase flex items-center gap-1.5 mx-auto"
            >
              <RotateCcw size={12} />
              <span>Retry Warmup</span>
            </button>
          </div>
        )}

        {/* Target */}
        {isPlaying && targetPos && (
          <div
            onClick={handleHitTarget}
            className="absolute w-10 h-10 -ml-5 -mt-5 rounded-full bg-gradient-to-br from-red-500 to-amber-600 border-2 border-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
            style={{
              left: `${targetPos.x}%`,
              top: `${targetPos.y}%`,
            }}
          >
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-red-600" />
            </div>
          </div>
        )}
      </div>

      {/* Footer advice */}
      <div className="bg-[#1f2821] border-t border-[#3b4e40] px-3 py-1 text-[10px] text-gray-400 flex justify-between">
        <span>Cabin 04 LAN Server: 192.168.1.104</span>
        <span>Sensitivity: 2.5 | 800 DPI</span>
      </div>
    </div>
  );
};
