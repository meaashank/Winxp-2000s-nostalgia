import React, { useState } from 'react';
import { usePlaylist } from './PlaylistProvider';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Youtube, ChevronUp, ChevronDown } from 'lucide-react';
import { playMouseClick } from '../utils/audio';

export const MusicPlayerDock: React.FC = () => {
  const {
    currentTrack,
    currentTrackIndex,
    tracks,
    isPlaying,
    isLoading,
    togglePlay,
    nextTrack,
    prevTrack,
    volume,
    setVolume,
    spectrumBars,
    playlistId,
  } = usePlaylist();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div
      id="music-player-dock"
      className="fixed bottom-[34px] right-2 z-40 select-none font-mono text-[11px]"
    >
      {/* Collapsed / Expanded Dock Card */}
      <div className="bg-[#1b1e24] text-white border-2 border-[#3b4252] rounded-t-sm shadow-[0_-4px_15px_rgba(0,0,0,0.6)] overflow-hidden max-w-[340px]">
        {/* Dock Header */}
        <div
          onClick={() => {
            playMouseClick();
            setIsExpanded(!isExpanded);
          }}
          className="bg-gradient-to-r from-[#2e3440] via-[#3b4252] to-[#2e3440] px-2.5 py-1.5 flex items-center justify-between cursor-pointer border-b border-[#4c566a] hover:brightness-110"
        >
          <div className="flex items-center gap-2 truncate">
            <div className={`p-1 rounded-xs ${isPlaying ? 'bg-green-600 text-white animate-pulse' : 'bg-[#434c5e] text-gray-300'}`}>
              <Music size={11} />
            </div>
            <div className="truncate">
              <div className="text-[10px] font-bold text-green-400 truncate flex items-center gap-1.5">
                <span>{isPlaying ? 'PLAYING' : 'PAUSED'}</span>
                <span className="text-gray-400 font-normal">| YT: {playlistId.slice(0, 10)}...</span>
              </div>
              <div className="text-[10px] text-gray-200 truncate">
                {currentTrack ? `${currentTrack.artist} - ${currentTrack.title}` : 'Loading YouTube Playlist...'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-400 pl-2">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </div>
        </div>

        {/* Expanded Controls & Video View */}
        {isExpanded && (
          <div className="p-2.5 bg-[#181a1f] space-y-2 border-t border-[#2e3440]">
            {/* Track Info Card */}
            <div className="flex items-center gap-2 bg-[#0e1013] p-1.5 rounded-xs border border-[#2e3440]">
              {currentTrack?.thumbnailUrl && (
                <img
                  src={currentTrack.thumbnailUrl}
                  alt="Track thumbnail"
                  referrerPolicy="no-referrer"
                  className="w-12 h-9 object-cover rounded-xs border border-gray-700 shrink-0"
                />
              )}
              <div className="flex-1 truncate">
                <div className="text-[#00ff66] font-bold text-[10.5px] truncate">
                  {currentTrack ? currentTrack.title : 'Connecting to Stream...'}
                </div>
                <div className="text-gray-400 text-[9.5px] truncate">
                  {currentTrack ? currentTrack.artist : 'YouTube Playlist Stream'}
                </div>
                <div className="text-[8.5px] text-blue-400 flex items-center gap-1 mt-0.5">
                  <Youtube size={10} />
                  <span>Track {currentTrackIndex + 1} of {tracks.length}</span>
                </div>
              </div>
            </div>

            {/* Spectrum mini analyzer */}
            <div className="flex items-end gap-1 h-5 bg-black p-1 rounded-xs border border-gray-800">
              {spectrumBars.map((bar, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-gradient-to-t from-green-600 via-lime-400 to-yellow-300 rounded-xs"
                  style={{ height: `${isPlaying ? Math.max(8, bar) : 5}%` }}
                />
              ))}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    playMouseClick();
                    prevTrack();
                  }}
                  className="p-1.5 bg-[#2e3440] hover:bg-[#434c5e] active:bg-[#4c566a] border border-gray-600 rounded-xs text-white cursor-pointer"
                  title="Previous Track"
                >
                  <SkipBack size={11} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playMouseClick();
                    togglePlay();
                  }}
                  className={`p-1.5 ${
                    isPlaying ? 'bg-green-600 hover:bg-green-500' : 'bg-[#2e3440] hover:bg-[#434c5e]'
                  } border border-gray-600 rounded-xs text-white cursor-pointer`}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={11} /> : <Play size={11} />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playMouseClick();
                    nextTrack();
                  }}
                  className="p-1.5 bg-[#2e3440] hover:bg-[#434c5e] active:bg-[#4c566a] border border-gray-600 rounded-xs text-white cursor-pointer"
                  title="Next Track"
                >
                  <SkipForward size={11} />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-1 text-gray-300 text-[10px]">
                <Volume2 size={11} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-14 h-1.5 bg-black accent-green-500 rounded cursor-pointer"
                />
              </div>

              {/* Video Preview Toggle */}
              <button
                type="button"
                onClick={() => {
                  playMouseClick();
                  setShowVideo(!showVideo);
                }}
                className={`px-1.5 py-0.5 border text-[9px] rounded-xs cursor-pointer ${
                  showVideo ? 'bg-red-700 text-white border-red-500' : 'bg-[#2e3440] text-gray-300 border-gray-600'
                }`}
              >
                {showVideo ? 'Hide Video' : 'View Video'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* YouTube Player Iframe Host Container */}
      <div
        className={`${
          showVideo && isExpanded
            ? 'fixed bottom-[170px] right-2 z-50 border-2 border-[#4c566a] bg-black rounded shadow-2xl p-1'
            : 'absolute -top-[9999px] -left-[9999px] opacity-0 pointer-events-none w-1 h-1 overflow-hidden'
        }`}
      >
        <div id="youtube-player-hidden-frame" />
      </div>
    </div>
  );
};
