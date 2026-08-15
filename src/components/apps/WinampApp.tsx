import React, { useState, useEffect, useRef } from 'react';
import {
  playWinampTrack,
  stopWinampSynth,
  WINAMP_PLAYLIST,
  playMouseClick,
} from '../../utils/audio';
import { Play, Pause, Square, SkipBack, SkipForward, Volume2, Disc } from 'lucide-react';

export const WinampApp: React.FC = () => {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [spectrumBars, setSpectrumBars] = useState<number[]>([40, 60, 80, 50, 70, 45, 30, 20]);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [showEq, setShowEq] = useState(false);
  const [eqValues, setEqValues] = useState<number[]>([0, 2, 4, 1, -1, 3, 2, 0]);
  const [useYoutube, setUseYoutube] = useState(false);

  const stopAudioRef = useRef<(() => void) | null>(null);

  const currentTrack = WINAMP_PLAYLIST[currentTrackIdx];

  const handlePlay = () => {
    playMouseClick();
    if (isPlaying) return;
    setIsPlaying(true);

    if (!useYoutube) {
      stopAudioRef.current = playWinampTrack(currentTrackIdx, (bars) => {
        setSpectrumBars(bars);
      });
    }
  };

  const handlePause = () => {
    playMouseClick();
    setIsPlaying(false);
    if (stopAudioRef.current) {
      stopAudioRef.current();
      stopAudioRef.current = null;
    }
    stopWinampSynth();
    setSpectrumBars([0, 0, 0, 0, 0, 0, 0, 0]);
  };

  const handleStop = () => {
    playMouseClick();
    handlePause();
  };

  const handleNext = () => {
    playMouseClick();
    const nextIdx = (currentTrackIdx + 1) % WINAMP_PLAYLIST.length;
    setCurrentTrackIdx(nextIdx);
    if (isPlaying) {
      if (stopAudioRef.current) stopAudioRef.current();
      stopAudioRef.current = playWinampTrack(nextIdx, (bars) => setSpectrumBars(bars));
    }
  };

  const handlePrev = () => {
    playMouseClick();
    const prevIdx = (currentTrackIdx - 1 + WINAMP_PLAYLIST.length) % WINAMP_PLAYLIST.length;
    setCurrentTrackIdx(prevIdx);
    if (isPlaying) {
      if (stopAudioRef.current) stopAudioRef.current();
      stopAudioRef.current = playWinampTrack(prevIdx, (bars) => setSpectrumBars(bars));
    }
  };

  useEffect(() => {
    return () => {
      if (stopAudioRef.current) stopAudioRef.current();
      stopWinampSynth();
    };
  }, []);

  return (
    <div className="w-full h-full bg-[#1b1c20] text-[#00ff00] font-mono text-[10px] flex flex-col p-1.5 select-none overflow-y-auto">
      {/* Winamp Main Player Head Unit */}
      <div className="bg-gradient-to-b from-[#3a3f47] via-[#24272c] to-[#121315] border-2 border-[#555a64] rounded-xs p-2 shadow-inner">
        {/* Top Header & Track Marquee Screen */}
        <div className="bg-[#000000] border border-[#333a44] p-1.5 rounded-xs flex items-center justify-between mb-2">
          {/* Animated 8-band Green LED Spectrum Analyzer */}
          <div className="flex items-end gap-1 h-7 w-20 bg-[#080808] p-0.5 border border-[#222]">
            {spectrumBars.map((bar, idx) => (
              <div
                key={idx}
                className="w-2 bg-gradient-to-t from-[#00aa00] via-[#88ff00] to-[#ffff00] rounded-xs transition-all duration-100"
                style={{ height: `${isPlaying ? bar : 5}%` }}
              />
            ))}
          </div>

          {/* Marquee Track Title Display */}
          <div className="flex-1 px-2 overflow-hidden">
            <div className="text-[#00ff44] text-[11px] font-pixel truncate tracking-wider">
              {isPlaying ? `▶ ${currentTrackIdx + 1}. ${currentTrack.artist} - ${currentTrack.title}` : `❚❚ WINAMP 2.91 - CABIN 04`}
            </div>
            <div className="flex justify-between text-[9px] text-[#00cc33] font-pixel mt-0.5">
              <span>128 KBPS / 44.1 KHZ</span>
              <span>{isPlaying ? 'STEREO' : 'IDLE'}</span>
              <span>{currentTrack.duration}</span>
            </div>
          </div>
        </div>

        {/* Transport & Playback Controls */}
        <div className="flex items-center justify-between gap-1 pt-1">
          {/* Main playback buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              title="Previous Track"
              className="p-1.5 bg-gradient-to-b from-[#555b66] to-[#2b2e34] hover:brightness-125 active:brightness-75 border border-white/30 rounded-xs text-white cursor-pointer shadow-xs"
            >
              <SkipBack size={10} />
            </button>
            <button
              type="button"
              onClick={handlePlay}
              title="Play"
              className={`p-1.5 bg-gradient-to-b from-[#555b66] to-[#2b2e34] hover:brightness-125 active:brightness-75 border border-white/30 rounded-xs cursor-pointer shadow-xs ${
                isPlaying ? 'text-[#00ff66] border-green-500' : 'text-white'
              }`}
            >
              <Play size={10} fill={isPlaying ? '#00ff66' : 'currentColor'} />
            </button>
            <button
              type="button"
              onClick={handlePause}
              title="Pause"
              className="p-1.5 bg-gradient-to-b from-[#555b66] to-[#2b2e34] hover:brightness-125 active:brightness-75 border border-white/30 rounded-xs text-white cursor-pointer shadow-xs"
            >
              <Pause size={10} />
            </button>
            <button
              type="button"
              onClick={handleStop}
              title="Stop"
              className="p-1.5 bg-gradient-to-b from-[#555b66] to-[#2b2e34] hover:brightness-125 active:brightness-75 border border-white/30 rounded-xs text-white cursor-pointer shadow-xs"
            >
              <Square size={10} fill="currentColor" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              title="Next Track"
              className="p-1.5 bg-gradient-to-b from-[#555b66] to-[#2b2e34] hover:brightness-125 active:brightness-75 border border-white/30 rounded-xs text-white cursor-pointer shadow-xs"
            >
              <SkipForward size={10} />
            </button>
          </div>

          {/* Volume slider */}
          <div className="flex items-center gap-1.5 text-gray-300">
            <Volume2 size={11} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 h-1.5 bg-[#111] accent-[#00ff44] rounded cursor-pointer"
            />
          </div>

          {/* Toggle buttons for EQ and Playlist */}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => {
                playMouseClick();
                setShowEq(!showEq);
              }}
              className={`px-1.5 py-0.5 rounded-xs border text-[9px] cursor-pointer ${
                showEq ? 'bg-[#00ff44] text-black font-bold border-[#00cc33]' : 'bg-[#2b2e34] text-gray-300 border-gray-600'
              }`}
            >
              EQ
            </button>
            <button
              type="button"
              onClick={() => {
                playMouseClick();
                setShowPlaylist(!showPlaylist);
              }}
              className={`px-1.5 py-0.5 rounded-xs border text-[9px] cursor-pointer ${
                showPlaylist ? 'bg-[#00ff44] text-black font-bold border-[#00cc33]' : 'bg-[#2b2e34] text-gray-300 border-gray-600'
              }`}
            >
              PL
            </button>
          </div>
        </div>
      </div>

      {/* Optional Equalizer Panel */}
      {showEq && (
        <div className="mt-1 bg-gradient-to-b from-[#24272c] to-[#121315] border border-[#555a64] rounded-xs p-1.5">
          <div className="text-[9px] text-[#00ff44] font-pixel mb-1 flex justify-between">
            <span>WINAMP EQUALIZER</span>
            <span>+12dB — 0 — -12dB</span>
          </div>
          <div className="flex justify-between items-center px-1">
            {['60', '170', '310', '600', '1K', '3K', '6K', '14K'].map((band, idx) => (
              <div key={band} className="flex flex-col items-center gap-1">
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={eqValues[idx]}
                  onChange={(e) => {
                    const next = [...eqValues];
                    next[idx] = Number(e.target.value);
                    setEqValues(next);
                  }}
                  className="h-12 -rotate-90 w-12 accent-[#00ff44] bg-[#111] cursor-pointer"
                />
                <span className="text-[8px] text-gray-400 font-mono">{band}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Playlist Drawer */}
      {showPlaylist && (
        <div className="mt-1 flex-1 bg-[#000000] border border-[#3a3f47] p-1.5 rounded-xs flex flex-col justify-between">
          <div className="text-[9px] text-[#00ff44] font-pixel border-b border-[#222] pb-0.5 mb-1 flex justify-between">
            <span>WINAMP PLAYLIST ({WINAMP_PLAYLIST.length} TRACKS)</span>
            <span>TOTAL: 20:17</span>
          </div>

          <div className="space-y-0.5 overflow-y-auto max-h-36 divide-y divide-[#151515]">
            {WINAMP_PLAYLIST.map((track, idx) => (
              <div
                key={track.title}
                onClick={() => {
                  playMouseClick();
                  setCurrentTrackIdx(idx);
                  if (isPlaying) {
                    if (stopAudioRef.current) stopAudioRef.current();
                    stopAudioRef.current = playWinampTrack(idx, (bars) => setSpectrumBars(bars));
                  }
                }}
                className={`flex items-center justify-between px-1.5 py-0.5 cursor-pointer rounded-xs text-[9.5px] font-pixel ${
                  currentTrackIdx === idx
                    ? 'bg-[#002244] text-[#00ff66] font-bold border-l-2 border-[#00ff44]'
                    : 'text-[#88bb88] hover:bg-[#111]'
                }`}
              >
                <div className="truncate pr-2">
                  <span>{idx + 1}. </span>
                  <span>{track.artist} - {track.title}</span>
                </div>
                <span className="text-gray-500 font-mono text-[9px]">{track.duration}</span>
              </div>
            ))}
          </div>

          {/* YouTube Archival Stream Drawer Option */}
          <div className="mt-2 pt-1 border-t border-[#222] flex items-center justify-between text-[9px] text-gray-400">
            <button
              type="button"
              onClick={() => setUseYoutube(!useYoutube)}
              className="text-[#00ff44] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Disc size={10} />
              <span>{useYoutube ? 'Switch to Chiptune Synth' : 'Load Official YouTube Playlist'}</span>
            </button>
            <span>Cabin 04 Soundcard</span>
          </div>

          {useYoutube && (
            <div className="mt-1 border border-[#333] rounded overflow-hidden">
              <iframe
                title="2000s Archival Playlist"
                width="100%"
                height="100"
                src="https://www.youtube.com/embed/videoseries?list=PL3-sRm8xAzY9w6N2m0_Xj_dE4q_d78Z4b&autoplay=0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
