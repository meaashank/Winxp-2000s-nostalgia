export type AppId =
  | 'my_computer'
  | 'internet_explorer'
  | 'aim'
  | 'winamp'
  | 'limewire'
  | 'minesweeper'
  | 'cs_trainer'
  | 'notepad'
  | 'paint'
  | 'control_panel'
  | 'sticky_notes_manager'
  | 'file_viewer'
  | 'recycle_bin';

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  extraData?: Record<string, any>;
}

export interface StickyNote {
  id: string;
  text: string;
  color: 'yellow' | 'pink' | 'cyan' | 'green' | 'orange';
  position: { x: number; y: number };
  rotation: number; // slight realistic tilt in degrees e.g. -2.5 to 3
  isPinnedToDesktop: boolean;
  authorNote?: string;
  zIndex: number;
}

export interface AimBuddy {
  screenName: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  statusMessage?: string;
  avatarBg?: string;
  isUnread?: boolean;
}

export interface AimMessage {
  id: string;
  from: string; // 'me' or screenName
  text: string;
  time: string;
  isBuzz?: boolean;
}

export interface LimeWireItem {
  id: string;
  title: string;
  category: 'audio' | 'video' | 'software' | 'document';
  size: string;
  speed: string;
  status: 'downloading' | 'completed' | 'paused' | 'failed' | 'queued';
  progress: number;
  sources: number;
  eta: string;
}

export interface WinampTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  durationSec: number;
  audioNotes?: string; // synthesis tune pattern
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'txt' | 'doc' | 'mp3' | 'jpg' | 'exe' | 'zip' | 'html';
  size?: string;
  modified?: string;
  content?: string;
  subItems?: FileItem[];
}
