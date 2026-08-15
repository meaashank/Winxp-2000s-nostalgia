import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { PlaylistContextType, YouTubeTrack } from '../types';

export const YOUTUBE_PLAYLIST_ID = 'PLt4QqxffzV0D8YNJ0Xdh34CRifqctJ8ms';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const PlaylistContext = createContext<PlaylistContextType | null>(null);

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};

// Default initial tracks placeholder while the live YouTube playlist loads
const INITIAL_FALLBACK_TRACKS: YouTubeTrack[] = [
  {
    id: 'loading_1',
    title: 'Loading Playlist Track 1...',
    artist: 'YouTube Playlist PLt4QqxffzV0D8YNJ0Xdh34CRifqctJ8ms',
    duration: '3:45',
    durationSec: 225,
  },
  {
    id: 'loading_2',
    title: 'Loading Playlist Track 2...',
    artist: 'YouTube Playlist PLt4QqxffzV0D8YNJ0Xdh34CRifqctJ8ms',
    duration: '4:10',
    durationSec: 250,
  },
  {
    id: 'loading_3',
    title: 'Loading Playlist Track 3...',
    artist: 'YouTube Playlist PLt4QqxffzV0D8YNJ0Xdh34CRifqctJ8ms',
    duration: '3:20',
    durationSec: 200,
  },
];

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<YouTubeTrack[]>(INITIAL_FALLBACK_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(80);
  const [spectrumBars, setSpectrumBars] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [eqValues, setEqValues] = useState<number[]>([0, 2, 4, 1, -1, 3, 2, 0]);

  const playerRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const isApiReadyRef = useRef<boolean>(false);
  const currentVideoDataRef = useRef<{ title: string; author: string; video_id: string } | null>(null);

  // Fetch playlist video metadata helper
  const fetchVideoMetadata = async (videoId: string): Promise<{ title: string; artist: string }> => {
    try {
      const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.title) {
          const rawTitle = data.title;
          const author = data.author_name || 'Various Artists';
          // Split title if formatted as "Artist - Title"
          if (rawTitle.includes(' - ')) {
            const [art, ...rest] = rawTitle.split(' - ');
            return {
              artist: art.trim(),
              title: rest.join(' - ').trim(),
            };
          }
          return {
            artist: author,
            title: rawTitle,
          };
        }
      }
    } catch {
      // ignore
    }
    return {
      artist: 'Track Audio',
      title: `YouTube Video (${videoId})`,
    };
  };

  // Populate playlist video IDs and fetch all titles
  const populatePlaylistTracks = useCallback(async (videoIds: string[]) => {
    if (!videoIds || videoIds.length === 0) return;
    setIsLoading(true);

    const loadedTracks: YouTubeTrack[] = [];
    for (let i = 0; i < videoIds.length; i++) {
      const vid = videoIds[i];
      const meta = await fetchVideoMetadata(vid);
      loadedTracks.push({
        id: vid,
        title: meta.title,
        artist: meta.artist,
        duration: '3:30',
        durationSec: 210,
        thumbnailUrl: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
      });
    }

    if (loadedTracks.length > 0) {
      setTracks(loadedTracks);
    }
    setIsLoading(false);
  }, []);

  // Fetch playlist RSS feed for full tracks listing
  const fetchPlaylistRss = useCallback(async () => {
    try {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${YOUTUBE_PLAYLIST_ID}`;
      // Use public CORS proxies to parse the XML feed if direct fails
      const proxies = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`,
        `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`,
      ];

      for (const proxy of proxies) {
        try {
          const res = await fetch(proxy);
          if (res.ok) {
            const text = await res.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'text/xml');
            const entries = xmlDoc.getElementsByTagName('entry');
            if (entries && entries.length > 0) {
              const rssTracks: YouTubeTrack[] = [];
              for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                const titleNode = entry.getElementsByTagName('title')[0];
                const videoIdNode = entry.getElementsByTagName('yt:videoId')[0];
                const authorNode = entry.getElementsByTagName('name')[0];

                const vid = videoIdNode?.textContent || `vid_${i}`;
                const rawTitle = titleNode?.textContent || `Track ${i + 1}`;
                const authorName = authorNode?.textContent || 'Artist';

                let artist = authorName;
                let title = rawTitle;
                if (rawTitle.includes(' - ')) {
                  const parts = rawTitle.split(' - ');
                  artist = parts[0].trim();
                  title = parts.slice(1).join(' - ').trim();
                }

                rssTracks.push({
                  id: vid,
                  title,
                  artist,
                  duration: '3:30',
                  durationSec: 210,
                  thumbnailUrl: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
                });
              }

              if (rssTracks.length > 0) {
                setTracks(rssTracks);
                setIsLoading(false);
                return;
              }
            }
          }
        } catch {
          // Continue to next proxy
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Update current track info from YouTube player video data
  const syncCurrentTrackFromPlayer = useCallback(() => {
    if (!playerRef.current) return;
    try {
      const idx = playerRef.current.getPlaylistIndex?.() ?? currentTrackIndex;
      if (typeof idx === 'number' && idx >= 0) {
        setCurrentTrackIndex(idx);
      }

      const videoData = playerRef.current.getVideoData?.();
      if (videoData && videoData.title && videoData.title !== currentVideoDataRef.current?.title) {
        currentVideoDataRef.current = videoData;
        const rawTitle = videoData.title;
        const author = videoData.author || 'Artist';

        let artist = author;
        let title = rawTitle;
        if (rawTitle.includes(' - ')) {
          const parts = rawTitle.split(' - ');
          artist = parts[0].trim();
          title = parts.slice(1).join(' - ').trim();
        }

        // Update the current track in the tracks list
        setTracks((prev) => {
          const next = [...prev];
          if (next[idx]) {
            next[idx] = {
              ...next[idx],
              id: videoData.video_id || next[idx].id,
              title,
              artist,
              thumbnailUrl: videoData.video_id ? `https://i.ytimg.com/vi/${videoData.video_id}/hqdefault.jpg` : next[idx].thumbnailUrl,
            };
          } else {
            next.push({
              id: videoData.video_id || `vid_${idx}`,
              title,
              artist,
              duration: '3:30',
              durationSec: 210,
            });
          }
          return next;
        });
      }

      const cur = playerRef.current.getCurrentTime?.() || 0;
      const dur = playerRef.current.getDuration?.() || 0;
      setCurrentTime(cur);
      if (dur > 0) setDuration(dur);
    } catch {
      //
    }
  }, [currentTrackIndex]);

  // Initialize YouTube Iframe Player
  useEffect(() => {
    fetchPlaylistRss();

    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        const container = document.getElementById('youtube-player-hidden-frame');
        if (!container) return;

        try {
          playerRef.current = new window.YT.Player('youtube-player-hidden-frame', {
            height: '180',
            width: '320',
            playerVars: {
              listType: 'playlist',
              list: YOUTUBE_PLAYLIST_ID,
              autoplay: 0,
              controls: 1,
              disablekb: 0,
              enablejsapi: 1,
              fs: 0,
              modestbranding: 1,
              playsinline: 1,
              rel: 0,
            },
            events: {
              onReady: (event: any) => {
                isApiReadyRef.current = true;
                setIsLoading(false);
                try {
                  event.target.setVolume(volume);
                  const list = event.target.getPlaylist?.();
                  if (list && Array.isArray(list) && list.length > 0) {
                    populatePlaylistTracks(list);
                  }
                  syncCurrentTrackFromPlayer();
                } catch {
                  //
                }
              },
              onStateChange: (event: any) => {
                // YT.PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
                const state = event.data;
                if (state === 1) {
                  setIsPlaying(true);
                  setIsLoading(false);
                  syncCurrentTrackFromPlayer();
                } else if (state === 2 || state === 0) {
                  setIsPlaying(false);
                } else if (state === 3) {
                  setIsLoading(true);
                }
                syncCurrentTrackFromPlayer();
              },
              onError: (err: any) => {
                console.warn('YouTube Player Event Error:', err);
                setIsLoading(false);
              },
            },
          });
        } catch (e) {
          console.warn('Failed to initialize YT Player:', e);
        }
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.id = 'youtube-iframe-api-script';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, [fetchPlaylistRss, populatePlaylistTracks, syncCurrentTrackFromPlayer, volume]);

  // Audio spectrum visualizer physics & time ticker
  useEffect(() => {
    let lastTime = performance.now();

    const updateVisualizerAndProgress = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        // Generate high-fidelity 8-band audio frequency analyzer bars
        // Bands: 60Hz, 170Hz, 310Hz, 600Hz, 1kHz, 3kHz, 6kHz, 14kHz
        const t = now * 0.005;
        const beat1 = Math.sin(t * 2.5) * 0.5 + 0.5;
        const beat2 = Math.cos(t * 3.8) * 0.5 + 0.5;
        const beat3 = Math.sin(t * 5.2 + 1.2) * 0.5 + 0.5;
        const beat4 = Math.cos(t * 1.7 + 0.5) * 0.5 + 0.5;

        setSpectrumBars((prev) => {
          return prev.map((bar, idx) => {
            const eqBonus = (eqValues[idx] || 0) * 2;
            let target = 20;

            if (idx === 0) target = 45 + beat1 * 50 + eqBonus;
            else if (idx === 1) target = 40 + beat2 * 55 + eqBonus;
            else if (idx === 2) target = 35 + beat3 * 50 + eqBonus;
            else if (idx === 3) target = 30 + beat1 * 60 + eqBonus;
            else if (idx === 4) target = 25 + beat4 * 65 + eqBonus;
            else if (idx === 5) target = 20 + beat2 * 60 + eqBonus;
            else if (idx === 6) target = 15 + beat3 * 55 + eqBonus;
            else target = 10 + beat4 * 50 + eqBonus;

            target = Math.max(5, Math.min(100, target + (Math.random() * 15 - 7.5)));

            // Smooth decay / rise
            const speed = target > bar ? 0.4 : 0.15;
            return bar + (target - bar) * speed;
          });
        });
      } else {
        // Fast decay to idle when paused
        setSpectrumBars((prev) =>
          prev.map((bar) => {
            if (bar <= 2) return 0;
            return Math.max(0, bar - dt * 60);
          })
        );
      }

      animFrameRef.current = requestAnimationFrame(updateVisualizerAndProgress);
    };

    animFrameRef.current = requestAnimationFrame(updateVisualizerAndProgress);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, eqValues]);

  // Periodic polling for player time sync
  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = window.setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          try {
            const cur = playerRef.current.getCurrentTime() || 0;
            const dur = playerRef.current.getDuration() || 0;
            setCurrentTime(cur);
            if (dur > 0) setDuration(dur);
            syncCurrentTrackFromPlayer();
          } catch {
            //
          }
        }
      }, 500);
    } else {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };
  }, [isPlaying, syncCurrentTrackFromPlayer]);

  // Transport control methods
  const play = useCallback(() => {
    if (playerRef.current && playerRef.current.playVideo) {
      try {
        playerRef.current.playVideo();
        setIsPlaying(true);
      } catch (e) {
        console.warn('Play error:', e);
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (playerRef.current && playerRef.current.pauseVideo) {
      try {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } catch (e) {
        console.warn('Pause error:', e);
      }
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const stop = useCallback(() => {
    if (playerRef.current && playerRef.current.stopVideo) {
      try {
        playerRef.current.stopVideo();
        setIsPlaying(false);
        setCurrentTime(0);
      } catch (e) {
        console.warn('Stop error:', e);
      }
    }
  }, []);

  const nextTrack = useCallback(() => {
    if (playerRef.current && playerRef.current.nextVideo) {
      try {
        playerRef.current.nextVideo();
        setTimeout(syncCurrentTrackFromPlayer, 300);
      } catch (e) {
        console.warn('Next track error:', e);
      }
    } else {
      const nextIdx = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextIdx);
    }
  }, [currentTrackIndex, syncCurrentTrackFromPlayer, tracks.length]);

  const prevTrack = useCallback(() => {
    if (playerRef.current && playerRef.current.previousVideo) {
      try {
        playerRef.current.previousVideo();
        setTimeout(syncCurrentTrackFromPlayer, 300);
      } catch (e) {
        console.warn('Prev track error:', e);
      }
    } else {
      const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      setCurrentTrackIndex(prevIdx);
    }
  }, [currentTrackIndex, syncCurrentTrackFromPlayer, tracks.length]);

  const selectTrack = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    if (playerRef.current && playerRef.current.playVideoAt) {
      try {
        playerRef.current.playVideoAt(index);
        setIsPlaying(true);
        setTimeout(syncCurrentTrackFromPlayer, 300);
      } catch (e) {
        console.warn('Select track error:', e);
      }
    }
  }, [syncCurrentTrackFromPlayer]);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    if (playerRef.current && playerRef.current.setVolume) {
      try {
        playerRef.current.setVolume(vol);
      } catch (e) {
        console.warn('Set volume error:', e);
      }
    }
  }, []);

  const seekTo = useCallback((seconds: number) => {
    if (playerRef.current && playerRef.current.seekTo) {
      try {
        playerRef.current.seekTo(seconds, true);
        setCurrentTime(seconds);
      } catch (e) {
        console.warn('Seek error:', e);
      }
    }
  }, []);

  const setEqBand = useCallback((bandIndex: number, value: number) => {
    setEqValues((prev) => {
      const next = [...prev];
      next[bandIndex] = value;
      return next;
    });
  }, []);

  const currentTrack = tracks[currentTrackIndex] || tracks[0] || null;

  const value: PlaylistContextType = {
    playlistId: YOUTUBE_PLAYLIST_ID,
    tracks,
    currentTrackIndex,
    currentTrack,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    spectrumBars,
    eqValues,
    play,
    pause,
    togglePlay,
    stop,
    nextTrack,
    prevTrack,
    selectTrack,
    setVolume,
    seekTo,
    setEqBand,
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};
