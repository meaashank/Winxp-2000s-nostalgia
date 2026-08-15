import React, { useState, useEffect } from 'react';
import { LimeWireItem } from '../../types';
import { playMouseClick, playKeyClick, playWindowsBalloon, playHddSeek } from '../../utils/audio';
import { Search, Download, Pause, Play, Trash2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const INITIAL_DOWNLOADS: LimeWireItem[] = [
  {
    id: '1',
    title: 'Linkin_Park_Numb_Official.mp3',
    category: 'audio',
    size: '3.4 MB',
    speed: '42.8 KB/s',
    status: 'downloading',
    progress: 78,
    sources: 14,
    eta: '00:48',
  },
  {
    id: '2',
    title: 'GTA_Vice_City_Secret_Cheats_Guide.zip',
    category: 'document',
    size: '1.2 MB',
    speed: '28.4 KB/s',
    status: 'completed',
    progress: 100,
    sources: 32,
    eta: '00:00',
  },
  {
    id: '3',
    title: 'Counter_Strike_1.6_Patch_v23b.exe',
    category: 'software',
    size: '24.1 MB',
    speed: '12.1 KB/s',
    status: 'downloading',
    progress: 99, // 99% realistic 2004 stall!
    sources: 2,
    eta: '02:14',
  },
  {
    id: '4',
    title: 'Halo_2_E3_Trailer_HQ.wmv',
    category: 'video',
    size: '48.6 MB',
    speed: '0.0 KB/s',
    status: 'paused',
    progress: 45,
    sources: 8,
    eta: '--:--',
  }
];

const SEARCH_CATALOG: Record<string, LimeWireItem[]> = {
  default: [
    { id: 's1', title: 'Eminem_Lose_Yourself.mp3', category: 'audio', size: '5.1 MB', speed: '54 KB/s', status: 'queued', progress: 0, sources: 48, eta: '01:20' },
    { id: 's2', title: 'Green_Day_Boulevard_of_Broken_Dreams.mp3', category: 'audio', size: '4.2 MB', speed: '48 KB/s', status: 'queued', progress: 0, sources: 36, eta: '01:10' },
    { id: 's3', title: 'Need_For_Speed_Underground_2_Crack.exe', category: 'software', size: '14.8 MB', speed: '32 KB/s', status: 'queued', progress: 0, sources: 11, eta: '06:40' },
    { id: 's4', title: 'Matrix_Reloaded_Burly_Brawl.wmv', category: 'video', size: '38.0 MB', speed: '40 KB/s', status: 'queued', progress: 0, sources: 19, eta: '12:00' },
    { id: 's5', title: 'Blink_182_I_Miss_You.mp3', category: 'audio', size: '3.8 MB', speed: '62 KB/s', status: 'queued', progress: 0, sources: 52, eta: '00:55' },
  ]
};

export const LimeWireApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'transfers'>('transfers');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloads, setDownloads] = useState<LimeWireItem[]>(INITIAL_DOWNLOADS);
  const [searchResults, setSearchResults] = useState<LimeWireItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Periodic download progress tick
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads((prev) =>
        prev.map((item) => {
          if (item.status !== 'downloading') return item;
          if (item.progress >= 99 && item.id === '3') {
            // Stall at 99% for authenticity
            return { ...item, speed: '0.4 KB/s', eta: 'Calculating...' };
          }
          if (item.progress >= 100) {
            return { ...item, status: 'completed', speed: '0.0 KB/s', eta: '00:00' };
          }
          const nextProg = Math.min(100, item.progress + 1);
          if (nextProg === 100) {
            playWindowsBalloon();
            playHddSeek();
          }
          return {
            ...item,
            progress: nextProg,
          };
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    playMouseClick();
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
      setSearchResults(SEARCH_CATALOG.default);
      setActiveTab('search');
    }, 600);
  };

  const startDownload = (item: LimeWireItem) => {
    playMouseClick();
    playHddSeek();
    const newDownload: LimeWireItem = {
      ...item,
      id: Date.now().toString(),
      status: 'downloading',
      progress: 5,
      speed: `${Math.floor(25 + Math.random() * 35)} KB/s`,
    };
    setDownloads([newDownload, ...downloads]);
    setActiveTab('transfers');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#ece9d8] text-[#111] font-tahoma text-[11px] select-text">
      {/* LimeWire Classic Lime Green Header */}
      <div className="bg-gradient-to-r from-[#2e7d32] via-[#4caf50] to-[#2e7d32] text-white p-2 flex items-center justify-between border-b border-[#1b5e20] shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#76ff03] flex items-center justify-center text-black font-bold text-sm shadow-inner">
            🍋
          </div>
          <div>
            <div className="font-bold text-white text-[12px] tracking-wide">LimeWire PRO 4.10 (Gnutella Network)</div>
            <div className="text-[9.5px] text-green-100 flex items-center gap-2">
              <span>● Ultrapeer Connected</span>
              <span>● 4,891,204 Users Online</span>
              <span>● 812 TB Shared</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded border border-white/20">
          <ShieldCheck size={13} className="text-green-300" />
          <span className="text-[10px] text-green-200">Turbo Charged</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#ece9d8] px-2 pt-1 border-b border-[#7f9db9] flex gap-1 select-none">
        <button
          type="button"
          onClick={() => {
            playMouseClick();
            setActiveTab('search');
          }}
          className={`px-3 py-1 rounded-t border-t border-l border-r font-bold text-[11px] cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'search'
              ? 'bg-white border-[#7f9db9] border-b-transparent -mb-[1px] text-[#003399]'
              : 'bg-[#e0dcc8] border-[#a09c88] text-gray-700'
          }`}
        >
          <Search size={12} />
          <span>Search</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playMouseClick();
            setActiveTab('transfers');
          }}
          className={`px-3 py-1 rounded-t border-t border-l border-r font-bold text-[11px] cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'transfers'
              ? 'bg-white border-[#7f9db9] border-b-transparent -mb-[1px] text-[#003399]'
              : 'bg-[#e0dcc8] border-[#a09c88] text-gray-700'
          }`}
        >
          <Download size={12} />
          <span>Downloads ({downloads.filter((d) => d.status === 'downloading').length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white overflow-hidden flex flex-col p-2">
        {/* TAB 1: SEARCH */}
        {activeTab === 'search' && (
          <div className="flex-1 flex flex-col">
            {/* Search Input Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-3 bg-[#f5f5ee] p-2 border border-[#d4d0c8] rounded">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search for Title, Artist, or Album (e.g. Linkin Park, GTA, Matrix)..."
                onChange={(e) => {
                  playKeyClick();
                  setSearchQuery(e.target.value);
                }}
                className="flex-1 bg-white border border-[#7f9db9] px-2 py-1 text-[11.5px] outline-none"
              />
              <button
                type="submit"
                className="px-4 py-1 bg-[#2e7d32] hover:bg-[#388e3c] text-white font-bold rounded cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Search size={12} />
                <span>Search Network</span>
              </button>
            </form>

            {/* Results Table */}
            <div className="flex-1 border border-[#7f9db9] overflow-y-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead className="bg-[#ece9d8] sticky top-0 border-b border-[#7f9db9] text-gray-700 font-bold select-none">
                  <tr>
                    <th className="p-1.5 border-r border-[#d4d0c8]">File Name</th>
                    <th className="p-1.5 border-r border-[#d4d0c8] w-20">Size</th>
                    <th className="p-1.5 border-r border-[#d4d0c8] w-24">Speed</th>
                    <th className="p-1.5 border-r border-[#d4d0c8] w-16">Sources</th>
                    <th className="p-1.5 w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {searchResults.map((item) => (
                    <tr key={item.id} className="hover:bg-[#eef2f8]">
                      <td className="p-1.5 flex items-center gap-1.5 font-medium">
                        <span>🎵</span>
                        <span className="truncate">{item.title}</span>
                      </td>
                      <td className="p-1.5 text-gray-600 font-mono">{item.size}</td>
                      <td className="p-1.5 text-green-700 font-bold font-mono">★★★★★ ({item.speed})</td>
                      <td className="p-1.5 text-gray-700">{item.sources} hosts</td>
                      <td className="p-1.5">
                        <button
                          type="button"
                          onClick={() => startDownload(item)}
                          className="px-2 py-0.5 bg-[#4caf50] hover:bg-[#43a047] text-white font-bold rounded text-[10px] cursor-pointer"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                  {searchResults.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">
                        {isSearching ? 'Searching Gnutella network hosts...' : 'Enter keywords and press "Search Network"'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: TRANSFERS / DOWNLOADS */}
        {activeTab === 'transfers' && (
          <div className="flex-1 flex flex-col border border-[#7f9db9] overflow-y-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead className="bg-[#ece9d8] sticky top-0 border-b border-[#7f9db9] text-gray-700 font-bold select-none">
                <tr>
                  <th className="p-1.5 border-r border-[#d4d0c8]">File Name</th>
                  <th className="p-1.5 border-r border-[#d4d0c8] w-20">Size</th>
                  <th className="p-1.5 border-r border-[#d4d0c8] w-20">Status</th>
                  <th className="p-1.5 border-r border-[#d4d0c8] w-36">Progress</th>
                  <th className="p-1.5 border-r border-[#d4d0c8] w-20">Speed</th>
                  <th className="p-1.5 w-16">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {downloads.map((item) => (
                  <tr key={item.id} className="hover:bg-[#eef2f8]">
                    <td className="p-1.5 flex items-center gap-1.5 font-medium truncate">
                      <span>{item.category === 'audio' ? '🎵' : item.category === 'video' ? '🎬' : '💾'}</span>
                      <span className="truncate">{item.title}</span>
                    </td>
                    <td className="p-1.5 text-gray-600 font-mono">{item.size}</td>
                    <td className="p-1.5">
                      {item.status === 'completed' && (
                        <span className="text-green-700 font-bold flex items-center gap-1">
                          <CheckCircle2 size={11} /> Done
                        </span>
                      )}
                      {item.status === 'downloading' && (
                        <span className="text-blue-700 font-bold">
                          {item.progress === 99 ? '99% (Stalled)' : 'Downloading'}
                        </span>
                      )}
                      {item.status === 'paused' && <span className="text-amber-700">Paused</span>}
                    </td>
                    <td className="p-1.5">
                      <div className="w-full bg-gray-200 border border-gray-400 h-3 rounded-xs overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-[#4caf50] to-[#81c784] transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-[8.5px] font-bold text-black/80 font-mono">
                          {item.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="p-1.5 font-mono text-gray-700">{item.speed}</td>
                    <td className="p-1.5 font-mono text-gray-600">{item.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Info Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d4d0c8] px-2 py-1 flex justify-between items-center text-[10px] text-gray-600 select-none">
        <span>Shared: C:\LimeWire\Shared (24 files)</span>
        <div className="flex gap-4 font-mono">
          <span>Down: 71.2 KB/s</span>
          <span>Up: 8.4 KB/s</span>
        </div>
      </div>
    </div>
  );
};
