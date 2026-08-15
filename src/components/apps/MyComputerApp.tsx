import React, { useState } from 'react';
import { FileItem } from '../../types';
import { playMouseClick, playHddSeek } from '../../utils/audio';
import { HardDrive, Folder, FileText, Image, Music, ArrowLeft, ArrowUp } from 'lucide-react';

interface MyComputerAppProps {
  onOpenFile: (file: FileItem) => void;
}

const FILE_SYSTEM: FileItem[] = [
  {
    id: 'c_drive',
    name: 'Local Disk (C:)',
    type: 'folder',
    subItems: [
      {
        id: 'my_docs',
        name: 'My Documents',
        type: 'folder',
        subItems: [
          {
            id: 'gta_cheats',
            name: 'GTA_Vice_City_Cheats.txt',
            type: 'txt',
            size: '2 KB',
            modified: '08/12/2004',
            content: `=========================================
GTA VICE CITY PC CHEATS (CABIN 04 ARCHIVE)
=========================================

HEALTH & ARMOR:
- ASPIRINE : Full Health
- PRECIOUSPROTECTION : Full Body Armor

WEAPONS:
- THUGSTOOLS : Thug Weapons (Brass knuckles, baseball bat, 9mm, shotgun)
- PROFESSIONALTOOLS : Professional Weapons (Katana, revolver, M4, sniper)
- NUTTERTOOLS : Heavy Military Weapons (Minigun, rocket launcher, grenades)

VEHICLES:
- PANZER : Spawn Rhino Military Tank
- GETTHEREFAST : Spawn Sabre Turbo
- THELASTRIDE : Spawn Romero's Hearse
- ROCKANDROLLCAR : Spawn Love Fist Limo

WEATHER & TIME:
- LIFEISPASSINGBY : Speed up clock
- APLEASANTDAY : Nice clear weather
- CATSANDDOGS : Heavy rainy weather

NOTE: Do not save game after using cheat codes!`,
          },
          {
            id: 'homework',
            name: 'homework_final2.doc',
            type: 'doc',
            size: '18 KB',
            modified: '08/14/2004',
            content: `ESSAY TITLE: The Impact of High-Speed Broadband Internet in 2004
STUDENT: Cabin 04 Guest
CLASS: US History / Modern Technology

With the decline of 56k dial-up modems and the proliferation of DSL and cable internet, cyber cafés and LAN centers have become the modern town squares of youth culture. Real-time peer-to-peer applications such as Gnutella and instant messaging platforms connect millions around the world instantly.`,
          },
          {
            id: 'passwords',
            name: 'passwords_DO_NOT_SHARE.txt',
            type: 'txt',
            size: '1 KB',
            modified: '08/02/2004',
            content: `AIM: **********
RuneScape: dragon_slayer_04
Neopets: kougra_fan
Hotmail: ilovemyspace2004`,
          },
          {
            id: 'myspace_layout',
            name: 'myspace_layout_glitter.html',
            type: 'html',
            size: '4 KB',
            modified: '08/10/2004',
            content: `<style>
body { background: #000000 url('glitter_stars.gif'); color: #ff00ff; }
table, td { border: 1px dashed #00ffff; }
.top8 { font-family: 'Comic Sans MS'; color: #ffff00; }
</style>
<center><h1>★ WELCOME TO MY CYBER SPACE ★</h1></center>`,
          },
        ],
      },
      {
        id: 'my_pictures',
        name: 'My Pictures',
        type: 'folder',
        subItems: [
          {
            id: 'summer_2004',
            name: 'summer2004_skatepark.jpg',
            type: 'jpg',
            size: '240 KB',
            modified: '07/28/2004',
            content: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23223344"/><circle cx="200" cy="120" r="50" fill="%23e0a060"/><path d="M120 280 Q200 190 280 280" stroke="%23ff6600" stroke-width="8" fill="none"/><text x="200" y="270" fill="white" font-family="monospace" font-size="14" text-anchor="middle">AUSTIN SKATEPARK - JULY 2004</text></svg>',
          },
        ],
      },
      {
        id: 'downloads_folder',
        name: 'Downloads',
        type: 'folder',
        subItems: [
          {
            id: 'numb_mp3',
            name: 'Linkin_Park_Numb.mp3',
            type: 'mp3',
            size: '3.4 MB',
            modified: '08/15/2004',
          },
          {
            id: 'cs_patch',
            name: 'CS16_patch.exe',
            type: 'exe',
            size: '24.1 MB',
            modified: '08/15/2004',
          },
        ],
      },
      {
        id: 'games_folder',
        name: 'Games',
        type: 'folder',
        subItems: [
          { id: 'cs_game', name: 'Counter-Strike 1.6', type: 'exe', size: '380 MB' },
          { id: 'minesweeper_game', name: 'Minesweeper.exe', type: 'exe', size: '120 KB' },
        ],
      },
    ],
  },
];

export const MyComputerApp: React.FC<MyComputerAppProps> = ({ onOpenFile }) => {
  const [currentFolder, setCurrentFolder] = useState<FileItem[]>(FILE_SYSTEM);
  const [pathBreadcrumbs, setPathBreadcrumbs] = useState<string[]>(['My Computer']);
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);

  const navigateIntoFolder = (item: FileItem) => {
    playMouseClick();
    playHddSeek();
    if (item.subItems) {
      setCurrentFolder(item.subItems);
      setPathBreadcrumbs([...pathBreadcrumbs, item.name]);
      setSelectedItem(null);
    }
  };

  const navigateBack = () => {
    playMouseClick();
    playHddSeek();
    if (pathBreadcrumbs.length <= 1) return;
    setPathBreadcrumbs(['My Computer']);
    setCurrentFolder(FILE_SYSTEM);
    setSelectedItem(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#ece9d8] text-[#111] font-tahoma text-[11px] select-text">
      {/* Menu bar */}
      <div className="bg-[#ece9d8] px-2 py-0.5 border-b border-[#d4d0c8] flex items-center gap-3 text-[11px] select-none">
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">File</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Edit</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">View</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Tools</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Help</span>
      </div>

      {/* Explorer Toolbar */}
      <div className="bg-[#ece9d8] px-2 py-1 border-b border-[#d4d0c8] flex items-center gap-1 select-none">
        <button
          type="button"
          onClick={navigateBack}
          disabled={pathBreadcrumbs.length <= 1}
          className="flex items-center gap-1 px-2 py-0.5 border border-transparent hover:border-gray-400 disabled:opacity-40 cursor-pointer"
        >
          <ArrowLeft size={13} className="text-green-700" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={navigateBack}
          disabled={pathBreadcrumbs.length <= 1}
          className="flex items-center gap-1 px-2 py-0.5 border border-transparent hover:border-gray-400 disabled:opacity-40 cursor-pointer"
        >
          <ArrowUp size={13} className="text-green-700" />
          <span>Up</span>
        </button>

        <span className="h-4 border-r border-gray-300 mx-1" />
        <span className="text-gray-600 font-mono text-[10.5px]">Address: {pathBreadcrumbs.join(' \\ ')}</span>
      </div>

      {/* Main Split: Left Sidebar & Right File Grid */}
      <div className="flex-1 flex overflow-hidden bg-white">
        {/* Left Windows XP Tasks Panel (Classic Blue/White Gradient) */}
        <div className="w-[180px] bg-gradient-to-b from-[#7aa1e6] to-[#6375d6] p-2 text-white flex flex-col gap-3 select-none shrink-0 border-r border-[#7f9db9]">
          {/* System Tasks Box */}
          <div className="bg-white/95 text-[#002266] rounded-t-sm overflow-hidden border border-white shadow-xs">
            <div className="bg-[#d4e4f8] px-2 py-1 font-bold text-[11px] border-b border-[#b0c8e8] flex justify-between">
              <span>System Tasks</span>
            </div>
            <div className="p-2 space-y-1 text-[10.5px]">
              <div className="text-blue-700 hover:underline cursor-pointer">💾 View system information</div>
              <div className="text-blue-700 hover:underline cursor-pointer">➕ Add or remove programs</div>
              <div className="text-blue-700 hover:underline cursor-pointer">⚙️ Change a setting</div>
            </div>
          </div>

          {/* Other Places Box */}
          <div className="bg-white/95 text-[#002266] rounded-t-sm overflow-hidden border border-white shadow-xs">
            <div className="bg-[#d4e4f8] px-2 py-1 font-bold text-[11px] border-b border-[#b0c8e8]">
              <span>Other Places</span>
            </div>
            <div className="p-2 space-y-1 text-[10.5px]">
              <div onClick={navigateBack} className="text-blue-700 hover:underline cursor-pointer">💻 My Computer</div>
              <div className="text-blue-700 hover:underline cursor-pointer">📁 My Network Places</div>
              <div className="text-blue-700 hover:underline cursor-pointer">🗑️ Recycle Bin</div>
            </div>
          </div>
        </div>

        {/* Right Files View Grid */}
        <div className="flex-1 p-3 overflow-y-auto bg-white select-none">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {currentFolder.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  playMouseClick();
                  setSelectedItem(item);
                }}
                onDoubleClick={() => {
                  if (item.type === 'folder') {
                    navigateIntoFolder(item);
                  } else {
                    onOpenFile(item);
                  }
                }}
                className={`flex flex-col items-center p-2 rounded-sm cursor-pointer border ${
                  selectedItem?.id === item.id
                    ? 'bg-[#316ac5]/20 border-[#316ac5] text-[#002266]'
                    : 'border-transparent hover:bg-[#eef2f8]'
                }`}
              >
                {/* Icon */}
                <div className="text-3xl mb-1">
                  {item.type === 'folder' && '📁'}
                  {item.type === 'txt' && '📄'}
                  {item.type === 'doc' && '📝'}
                  {item.type === 'jpg' && '🖼️'}
                  {item.type === 'mp3' && '🎵'}
                  {item.type === 'exe' && '🎮'}
                  {item.type === 'html' && '🌐'}
                </div>
                <div className="text-[11px] text-center font-tahoma break-words line-clamp-2">
                  {item.name}
                </div>
                {item.size && <div className="text-[9px] text-gray-500 font-mono mt-0.5">{item.size}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d4d0c8] px-2 py-0.5 flex justify-between text-[10px] text-gray-600 select-none">
        <span>{currentFolder.length} objects</span>
        <span>Local intranet</span>
      </div>
    </div>
  );
};
