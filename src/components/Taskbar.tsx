import React, { useState, useEffect, useRef } from 'react';
import { WindowInstance, AppId } from '../types';
import { playMouseClick, playCrtDegauss, toggleAmbience } from '../utils/audio';
import {
  Volume2,
  Activity,
  StickyNote as StickyIcon,
  Sparkles,
  Power,
  LogOut,
  Folder,
  Settings,
  HelpCircle,
  PlaySquare,
} from 'lucide-react';

interface TaskbarProps {
  windows: WindowInstance[];
  activeWindowId: string | null;
  onFocusWindow: (id: string) => void;
  onToggleMinimize: (id: string) => void;
  onOpenApp: (appId: AppId) => void;
  onShowDesktop: () => void;
  onTriggerDegauss: () => void;
  onToggleStickyNote: () => void;
  onShutDownRequest: () => void;
  isAmbienceActive: boolean;
  onToggleAmbience: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  onFocusWindow,
  onToggleMinimize,
  onOpenApp,
  onShowDesktop,
  onTriggerDegauss,
  onToggleStickyNote,
  onShutDownRequest,
  isAmbienceActive,
  onToggleAmbience,
}) => {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const startMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close start menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        startMenuRef.current &&
        !startMenuRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('#start-button')
      ) {
        setIsStartOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* 1. Windows XP Luna Blue Taskbar */}
      <div
        id="xp-taskbar"
        className="fixed bottom-0 left-0 right-0 h-[30px] z-40 flex items-center justify-between select-none border-t border-[#0055ea]"
        style={{
          background: 'linear-gradient(180deg, #245edb 0%, #3f8cf3 9%, #245edb 18%, #245edb 92%, #1941a5 100%)',
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.4)',
        }}
      >
        {/* Left Side: Start Button & Quick Launch */}
        <div className="flex items-center h-full">
          {/* Windows XP Green "start" Button */}
          <button
            id="start-button"
            type="button"
            onClick={() => {
              playMouseClick();
              setIsStartOpen(!isStartOpen);
            }}
            className={`h-full px-3 flex items-center gap-1.5 cursor-pointer rounded-r-md transition-all select-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] ${
              isStartOpen
                ? 'bg-gradient-to-b from-[#2e7d32] via-[#388e3c] to-[#1b5e20] brightness-90'
                : 'bg-gradient-to-b from-[#388e3c] via-[#43a047] to-[#2e7d32] hover:brightness-110'
            }`}
            style={{
              clipPath: 'polygon(0 0, 95% 0, 100% 100%, 0% 100%)',
            }}
          >
            {/* Windows 4-color flag */}
            <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
              <div className="bg-[#f25022] rounded-[1px]" />
              <div className="bg-[#7fba00] rounded-[1px]" />
              <div className="bg-[#00a4ef] rounded-[1px]" />
              <div className="bg-[#ffb900] rounded-[1px]" />
            </div>
            <span
              className="text-white font-bold italic text-[14.5px] tracking-tight pr-1"
              style={{ textShadow: '1px 1px 2px #003300' }}
            >
              start
            </span>
          </button>

          {/* Quick Launch Separator & Icons */}
          <div className="h-[20px] border-r border-[#1941a5] mx-1 opacity-70" />
          <div className="flex items-center gap-1 px-1">
            <button
              type="button"
              onClick={onShowDesktop}
              title="Show Desktop"
              className="p-1 hover:bg-white/20 rounded text-xs cursor-pointer text-white"
            >
              🖥️
            </button>
            <button
              type="button"
              onClick={() => onOpenApp('internet_explorer')}
              title="Internet Explorer"
              className="p-1 hover:bg-white/20 rounded text-xs cursor-pointer"
            >
              🌐
            </button>
            <button
              type="button"
              onClick={() => onOpenApp('aim')}
              title="AOL Instant Messenger"
              className="p-1 hover:bg-white/20 rounded text-xs cursor-pointer"
            >
              🏃
            </button>
            <button
              type="button"
              onClick={() => onOpenApp('winamp')}
              title="Winamp"
              className="p-1 hover:bg-white/20 rounded text-xs cursor-pointer"
            >
              ⚡
            </button>
          </div>
          <div className="h-[20px] border-r border-[#1941a5] mx-1 opacity-70" />

          {/* Active / Open Window Tabs */}
          <div className="flex items-center gap-1 px-1 overflow-x-auto max-w-[50vw]">
            {windows
              .filter((w) => w.isOpen)
              .map((win) => {
                const isActive = activeWindowId === win.id && !win.isMinimized;
                return (
                  <button
                    key={win.id}
                    type="button"
                    onClick={() => {
                      playMouseClick();
                      if (isActive) {
                        onToggleMinimize(win.id);
                      } else {
                        onFocusWindow(win.id);
                      }
                    }}
                    className={`h-[24px] max-w-[150px] px-2 flex items-center gap-1.5 text-[11px] font-tahoma rounded-xs cursor-pointer truncate shadow-xs border ${
                      isActive
                        ? 'bg-[#1941a5] text-white border-[#002266] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] font-bold'
                        : 'bg-[#3c81f3] hover:bg-[#5293fb] text-white/90 border-[#1941a5]'
                    }`}
                  >
                    <span className="text-[12px]">{win.icon}</span>
                    <span className="truncate">{win.title}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right Side: System Tray / Notification Area */}
        <div
          className="h-full px-2.5 flex items-center gap-2 text-white border-l border-[#0055ea] shadow-inner select-none"
          style={{
            background: 'linear-gradient(180deg, #0c59b2 0%, #1570d5 10%, #0e5dbb 85%, #0b4e9e 100%)',
          }}
        >
          {/* Quick Sticky Note Button */}
          <button
            type="button"
            onClick={() => {
              playMouseClick();
              onToggleStickyNote();
            }}
            title="Add Sticky Note to Desktop"
            className="p-1 hover:bg-white/20 rounded cursor-pointer text-amber-300 flex items-center gap-0.5 text-[10px]"
          >
            <StickyIcon size={12} />
          </button>

          {/* Ambience Audio Toggle */}
          <button
            type="button"
            onClick={onToggleAmbience}
            title={isAmbienceActive ? 'Turn Off Rain & Cafe Room Tone' : 'Turn On Rain & Cafe Room Tone'}
            className={`p-1 hover:bg-white/20 rounded cursor-pointer text-[10px] flex items-center gap-1 ${
              isAmbienceActive ? 'text-green-300' : 'text-gray-400'
            }`}
          >
            <span>🌧️</span>
            <span className="font-mono text-[9px] hidden sm:inline">
              {isAmbienceActive ? 'AMB ON' : 'AMB OFF'}
            </span>
          </button>

          {/* Degauss Button */}
          <button
            type="button"
            onClick={() => {
              playCrtDegauss();
              onTriggerDegauss();
            }}
            title="CRT Degauss (Demagnetize Tube)"
            className="p-1 hover:bg-white/20 rounded cursor-pointer text-cyan-300 flex items-center gap-0.5 text-[10px]"
          >
            <Sparkles size={11} />
            <span className="font-mono text-[9px] hidden sm:inline">DEGAUSS</span>
          </button>

          {/* Network Flashing Icon */}
          <div className="flex items-center" title="Local Area Connection 100 Mbps (Cabin 04)">
            <Activity size={12} className="text-green-400 animate-pulse" />
          </div>

          {/* Volume */}
          <div className="flex items-center" title="Realtek AC'97 Audio">
            <Volume2 size={12} className="text-white" />
          </div>

          {/* Clock & Session Timer */}
          <div className="flex flex-col items-end pl-1 border-l border-white/20 font-tahoma text-[11px] leading-tight">
            <span>{timeStr || '10:48 PM'}</span>
          </div>
        </div>
      </div>

      {/* 2. Windows XP Start Menu Popup */}
      {isStartOpen && (
        <div
          ref={startMenuRef}
          className="fixed bottom-[30px] left-0 w-[340px] z-50 rounded-t-md overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-2 border-[#0055ea] flex flex-col font-tahoma select-none"
        >
          {/* User Profile Header */}
          <div className="h-[54px] bg-gradient-to-r from-[#0055ea] via-[#3593ff] to-[#0055ea] p-2.5 flex items-center gap-3 border-b border-[#0033aa]">
            <div className="w-9 h-9 rounded-sm bg-white p-0.5 border border-white/80 shadow-md flex items-center justify-center text-xl">
              🦆
            </div>
            <div>
              <div className="text-white font-bold text-[13.5px] leading-tight" style={{ textShadow: '1px 1px 2px #000' }}>
                Cabin 04 (Guest)
              </div>
              <div className="text-blue-100 text-[10px] font-mono">LAN ID: 192.168.1.104</div>
            </div>
          </div>

          {/* Split Two-Column Program Menu */}
          <div className="flex-1 flex bg-white text-[#111] text-[11px]">
            {/* Left White Column: Frequently Used Apps */}
            <div className="w-[190px] p-1.5 space-y-0.5 border-r border-[#95bdee] flex flex-col justify-between">
              <div className="space-y-0.5">
                <div
                  onClick={() => {
                    setIsStartOpen(false);
                    onOpenApp('internet_explorer');
                  }}
                  className="flex items-center gap-2 p-1.5 hover:bg-[#316ac5] hover:text-white rounded-xs cursor-pointer group"
                >
                  <span className="text-xl">🌐</span>
                  <div>
                    <div className="font-bold">Internet</div>
                    <div className="text-[9.5px] text-gray-500 group-hover:text-blue-100">Internet Explorer</div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setIsStartOpen(false);
                    onOpenApp('aim');
                  }}
                  className="flex items-center gap-2 p-1.5 hover:bg-[#316ac5] hover:text-white rounded-xs cursor-pointer group"
                >
                  <span className="text-xl">🏃</span>
                  <div>
                    <div className="font-bold">E-mail / Chat</div>
                    <div className="text-[9.5px] text-gray-500 group-hover:text-blue-100">AIM Messenger</div>
                  </div>
                </div>

                <div className="border-t border-[#d4d0c8] my-1" />

                <div
                  onClick={() => {
                    setIsStartOpen(false);
                    onOpenApp('winamp');
                  }}
                  className="flex items-center gap-2 p-1 hover:bg-[#316ac5] hover:text-white rounded-xs cursor-pointer"
                >
                  <span className="text-lg">⚡</span>
                  <span>Winamp Player</span>
                </div>

                <div
                  onClick={() => {
                    setIsStartOpen(false);
                    onOpenApp('limewire');
                  }}
                  className="flex items-center gap-2 p-1 hover:bg-[#316ac5] hover:text-white rounded-xs cursor-pointer"
                >
                  <span className="text-lg">🍋</span>
                  <span>LimeWire P2P</span>
                </div>

                <div
                  onClick={() => {
                    setIsStartOpen(false);
                    onOpenApp('cs_trainer');
                  }}
                  className="flex items-center gap-2 p-1 hover:bg-[#316ac5] hover:text-white rounded-xs cursor-pointer"
                >
                  <span className="text-lg">🎯</span>
                  <span>Counter-Strike 1.6</span>
                </div>

                <div
                  onClick={() => {
                    setIsStartOpen(false);
                    onOpenApp('minesweeper');
                  }}
                  className="flex items-center gap-2 p-1 hover:bg-[#316ac5] hover:text-white rounded-xs cursor-pointer"
                >
                  <span className="text-lg">💣</span>
                  <span>Minesweeper</span>
                </div>

                <div
                  onClick={() => {
                    setIsStartOpen(false);
                    onOpenApp('paint');
                  }}
                  className="flex items-center gap-2 p-1 hover:bg-[#316ac5] hover:text-white rounded-xs cursor-pointer"
                >
                  <span className="text-lg">🎨</span>
                  <span>Paint</span>
                </div>

                <div
                  onClick={() => {
                    setIsStartOpen(false);
                    onOpenApp('notepad');
                  }}
                  className="flex items-center gap-2 p-1 hover:bg-[#316ac5] hover:text-white rounded-xs cursor-pointer"
                >
                  <span className="text-lg">📄</span>
                  <span>Notepad</span>
                </div>
              </div>

              {/* All Programs arrow */}
              <div className="pt-2 border-t border-[#d4d0c8] flex items-center justify-between px-2 font-bold cursor-pointer hover:bg-gray-100 py-1">
                <span>All Programs</span>
                <span>▶</span>
              </div>
            </div>

            {/* Right Light Blue Column: System Folders & Settings */}
            <div className="flex-1 bg-[#d3e5fa] p-1.5 space-y-1 text-[#001144] font-medium border-l border-white flex flex-col justify-between">
              <div className="space-y-1">
                <div
                  onClick={() => {
                    setIsStartOpen(false);
                    onOpenApp('my_computer');
                  }}
                  className="flex items-center gap-2 p-1 hover:bg-[#316ac5] hover:text-white rounded-xs cursor-pointer font-bold"
                >
                  <Folder size={14} className="text-amber-700" />
                  <span>My Documents</span>
                </div>

                <div
                  onClick={() => {
                    setIsStartOpen(false);
                    onOpenApp('my_computer');
                  }}
                  className="flex items-center gap-2 p-1 hover:bg-[#316ac5] hover:text-white rounded-xs cursor-pointer"
                >
                  <Folder size={14} className="text-blue-700" />
                  <span>My Music</span>
                </div>

                <div
                  onClick={() => {
                    setIsStartOpen(false);
                    onOpenApp('my_computer');
                  }}
                  className="flex items-center gap-2 p-1 hover:bg-[#316ac5] hover:text-white rounded-xs cursor-pointer"
                >
                  <Folder size={14} className="text-purple-700" />
                  <span>My Computer</span>
                </div>

                <div className="border-t border-[#a0c4f2] my-1" />

                <div
                  onClick={() => {
                    setIsStartOpen(false);
                    onToggleStickyNote();
                  }}
                  className="flex items-center gap-2 p-1 hover:bg-[#316ac5] hover:text-white rounded-xs cursor-pointer"
                >
                  <StickyIcon size={14} className="text-amber-600" />
                  <span>Sticky Note</span>
                </div>

                <div
                  onClick={() => {
                    playCrtDegauss();
                    onTriggerDegauss();
                    setIsStartOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 hover:bg-[#316ac5] hover:text-white rounded-xs cursor-pointer"
                >
                  <Sparkles size={14} className="text-cyan-700" />
                  <span>CRT Degauss</span>
                </div>
              </div>

              <div className="space-y-0.5 pt-2 border-t border-[#a0c4f2]">
                <div className="flex items-center gap-2 p-1 hover:bg-[#316ac5] hover:text-white rounded-xs cursor-pointer">
                  <Settings size={13} />
                  <span>Control Panel</span>
                </div>
                <div className="flex items-center gap-2 p-1 hover:bg-[#316ac5] hover:text-white rounded-xs cursor-pointer">
                  <PlaySquare size={13} />
                  <span>Run...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Shut Down & Log Off Bar */}
          <div className="h-[38px] bg-gradient-to-r from-[#0055ea] via-[#246edb] to-[#0055ea] px-3 flex items-center justify-end gap-3 text-white text-[11px] font-bold border-t border-[#0033aa]">
            <button
              type="button"
              onClick={() => {
                setIsStartOpen(false);
                onShutDownRequest();
              }}
              className="flex items-center gap-1.5 px-2 py-1 hover:bg-white/20 rounded cursor-pointer"
            >
              <LogOut size={13} />
              <span>Log Off</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsStartOpen(false);
                onShutDownRequest();
              }}
              className="flex items-center gap-1.5 px-2 py-1 bg-[#d32f2f] hover:bg-[#e53935] rounded cursor-pointer shadow-xs"
            >
              <Power size={13} />
              <span>Turn Off Computer</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
