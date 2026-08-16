import React, { useState } from 'react';
import { usePlaylist, DEFAULT_PLAYLIST_ID } from './PlaylistProvider';
import { ListMusic, Plus, Play, Trash2, RotateCcw, Youtube, Music, Sparkles, Check, AlertCircle } from 'lucide-react';
import { playMouseClick, playWindowsBalloon } from '../utils/audio';

const CURATED_PRESETS = [
  {
    id: DEFAULT_PLAYLIST_ID,
    title: 'Cabin 04: Classic Gaming & Lo-Fi Chill',
    desc: 'Default authentic 2000s PC room chillhop & OST playlist',
    badge: 'DEFAULT',
  },
  {
    id: 'PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj',
    title: 'Billboard 2000s Nostalgia Hits',
    desc: 'Classic 2000-2009 pop, rock, and alternative anthem tracks',
    badge: '2000s HITS',
  },
  {
    id: 'PLOzDu-MXXLh8VO5A0HNgH_x8z6b_OqCgZ',
    title: 'Synthwave & Retrowave 80s/90s Cyber',
    desc: 'Nostalgic retro electronic synthesizer rhythms',
    badge: 'SYNTH',
  },
  {
    id: 'PL6NdkXsTSxKhH5Vz0oA6b6B2x7V_5uJ_q',
    title: 'Lo-Fi Chill Gaming Beats',
    desc: 'Mellow beats for late night browsing & programming',
    badge: 'LO-FI',
  },
];

export const PlaylistManagerModal: React.FC = () => {
  const {
    playlists,
    activePlaylist,
    playlistId,
    loadPlaylist,
    addCustomPlaylist,
    removeCustomPlaylist,
    resetToDefaultPlaylist,
    isAddPlaylistModalOpen,
    setIsAddPlaylistModalOpen,
  } = usePlaylist();

  const [inputUrl, setInputUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isAddPlaylistModalOpen) return null;

  const handleClose = () => {
    playMouseClick();
    setIsAddPlaylistModalOpen(false);
    setFeedback(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      setFeedback({ type: 'error', message: 'Please enter a YouTube playlist URL or ID.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const result = await addCustomPlaylist(inputUrl, customTitle);
      if (result.success) {
        playWindowsBalloon();
        setFeedback({
          type: 'success',
          message: `Loaded playlist: "${result.playlist?.title || 'Custom Playlist'}"`,
        });
        setInputUrl('');
        setCustomTitle('');
      } else {
        setFeedback({
          type: 'error',
          message: result.message || 'Could not load YouTube playlist. Please verify the URL.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'An unexpected error occurred while loading the playlist.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 select-none font-sans text-xs">
      <div className="w-full max-w-[540px] bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Windows XP Luna Titlebar */}
        <div className="bg-gradient-to-r from-[#0055ea] via-[#2a77ff] to-[#0055ea] text-white px-3 py-1.5 flex items-center justify-between shadow-xs border-b border-[#003bb3]">
          <div className="flex items-center gap-2 font-bold tracking-wide text-[12px] drop-shadow-xs">
            <ListMusic size={15} className="text-yellow-300" />
            <span>Playlist Manager - Winamp & YouTube Stream</span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            title="Close"
            className="w-5 h-5 bg-gradient-to-b from-[#f25d59] to-[#b30e1b] hover:from-[#f87875] hover:to-[#cb1323] active:from-[#a00b17] active:to-[#880812] border border-white/40 rounded-xs text-white flex items-center justify-center text-xs font-black cursor-pointer shadow-xs"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 overflow-y-auto space-y-4 text-[#222]">
          {/* Informational Session Banner */}
          <div className="bg-[#fffde7] border border-[#ecd97a] p-2 rounded-xs flex items-start gap-2 text-[11px] text-[#554300]">
            <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Session Playlists:</span> You can paste any YouTube playlist or video URL.
              Custom playlists stay active for your current browser tab session, while the default Cabin 04 playlist is
              always preserved.
            </div>
          </div>

          {/* Add New Playlist Form */}
          <form onSubmit={handleAdd} className="bg-white border border-[#7f9db9] p-3 rounded-xs space-y-2.5 shadow-xs">
            <div className="font-bold text-[11.5px] text-[#003399] flex items-center gap-1.5 border-b border-gray-200 pb-1">
              <Plus size={13} className="text-green-600" />
              <span>Add Custom YouTube Playlist</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                YouTube Playlist / Video URL or ID:
              </label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://www.youtube.com/playlist?list=PL... or PL... or video URL"
                className="w-full px-2 py-1.5 bg-white border border-[#7f9db9] rounded-xs text-black font-mono text-[11px] focus:outline-hidden focus:border-[#0055ea] focus:ring-1 focus:ring-[#0055ea]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Playlist Display Name (Optional):
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. My Favorite 2000s Gaming Tracks"
                className="w-full px-2 py-1.5 bg-white border border-[#7f9db9] rounded-xs text-black text-[11px] focus:outline-hidden focus:border-[#0055ea] focus:ring-1 focus:ring-[#0055ea]"
              />
            </div>

            {feedback && (
              <div
                className={`p-2 rounded-xs text-[11px] flex items-center gap-1.5 ${
                  feedback.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-300'
                    : 'bg-red-50 text-red-800 border border-red-300'
                }`}
              >
                {feedback.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                <span>{feedback.message}</span>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-3.5 py-1.5 bg-gradient-to-b from-[#fbfbfb] to-[#d8d4c4] hover:brightness-105 active:brightness-95 border border-[#7f9db9] rounded-xs font-bold text-[11px] text-[#003399] flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Plus size={12} className="text-green-600" />
                <span>{isSubmitting ? 'Loading Stream...' : 'Load & Play Playlist'}</span>
              </button>
            </div>
          </form>

          {/* Active & Session Playlists List */}
          <div className="bg-white border border-[#7f9db9] p-3 rounded-xs space-y-2 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-1">
              <div className="font-bold text-[11.5px] text-[#003399] flex items-center gap-1.5">
                <Music size={13} className="text-[#0055ea]" />
                <span>Available Playlists ({playlists.length})</span>
              </div>
              {playlistId !== DEFAULT_PLAYLIST_ID && (
                <button
                  type="button"
                  onClick={() => {
                    playMouseClick();
                    resetToDefaultPlaylist();
                  }}
                  className="text-[10px] text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={10} />
                  <span>Reset to Default</span>
                </button>
              )}
            </div>

            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {playlists.map((pl) => {
                const isActive = pl.id === playlistId;
                return (
                  <div
                    key={pl.id}
                    className={`p-2 rounded-xs border flex items-center justify-between gap-2 transition-colors ${
                      isActive
                        ? 'bg-[#e8f1ff] border-[#0055ea]'
                        : 'bg-[#fafafa] hover:bg-[#f0f4f9] border-gray-200'
                    }`}
                  >
                    <div
                      onClick={() => {
                        playMouseClick();
                        loadPlaylist(pl.id);
                      }}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[11.5px] truncate text-[#111]">
                          {pl.title}
                        </span>
                        {isActive && (
                          <span className="px-1.5 py-0.2 bg-[#0055ea] text-white text-[9px] font-bold rounded-xs shrink-0">
                            ACTIVE
                          </span>
                        )}
                        {pl.isCustom && (
                          <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-bold rounded-xs shrink-0">
                            CUSTOM
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono truncate">
                        ID: {pl.id}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          playMouseClick();
                          loadPlaylist(pl.id);
                        }}
                        className={`p-1.5 rounded-xs border text-[10px] font-bold cursor-pointer ${
                          isActive
                            ? 'bg-green-600 text-white border-green-700'
                            : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
                        }`}
                        title={isActive ? 'Currently playing' : 'Switch to this playlist'}
                      >
                        <Play size={11} fill={isActive ? 'currentColor' : 'none'} />
                      </button>

                      {pl.isCustom && (
                        <button
                          type="button"
                          onClick={() => {
                            playMouseClick();
                            removeCustomPlaylist(pl.id);
                          }}
                          className="p-1.5 bg-white hover:bg-red-50 hover:text-red-700 border border-gray-300 rounded-xs text-gray-500 cursor-pointer"
                          title="Remove custom playlist"
                        >
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Presets Section */}
          <div className="bg-white border border-[#7f9db9] p-3 rounded-xs space-y-2 shadow-xs">
            <div className="font-bold text-[11.5px] text-[#003399] flex items-center gap-1.5 border-b border-gray-200 pb-1">
              <Youtube size={13} className="text-red-600" />
              <span>Nostalgic Curated Presets</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {CURATED_PRESETS.map((preset) => {
                const isSelected = playlistId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      playMouseClick();
                      loadPlaylist(preset.id);
                    }}
                    className={`p-2 text-left rounded-xs border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#e8f1ff] border-[#0055ea] ring-1 ring-[#0055ea]'
                        : 'bg-[#fafafa] hover:bg-[#f0f4f9] border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-[11px] text-[#111] truncate">{preset.title}</span>
                      <span className="text-[8.5px] px-1 py-0.5 bg-gray-200 text-gray-700 rounded-xs font-mono font-bold shrink-0">
                        {preset.badge}
                      </span>
                    </div>
                    <div className="text-[9.5px] text-gray-500 line-clamp-1">{preset.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#ece9d8] border-t border-[#d8d4c4] px-3.5 py-2 flex items-center justify-between">
          <div className="text-[10px] text-gray-500 font-mono">
            Press <span className="font-bold text-gray-700 bg-gray-200 px-1 py-0.5 rounded-xs">Spacebar</span> anytime to Play/Pause
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-1 bg-gradient-to-b from-[#fbfbfb] to-[#d8d4c4] hover:brightness-105 active:brightness-95 border border-[#7f9db9] rounded-xs font-bold text-[11px] text-gray-800 cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
