import React, { useState } from 'react';
import {
  playMouseClick,
  playKeyClick,
  playDialupHandshake,
} from '../../utils/audio';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  X,
  Home,
  Search,
  Star,
  Globe,
  Lock,
  Mail,
} from 'lucide-react';

export const InternetExplorerApp: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('http://www.google.com');
  const [inputUrl, setInputUrl] = useState('http://www.google.com');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'google' | 'myspace' | 'geocities' | 'newgrounds' | 'neopets' | 'hotmail' | 'mapquest' | 'ebay'>('google');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['http://www.google.com']);
  const [historyIdx, setHistoryIdx] = useState(0);

  const navigateTo = (url: string, tab: 'google' | 'myspace' | 'geocities' | 'newgrounds' | 'neopets' | 'hotmail' | 'mapquest' | 'ebay') => {
    playMouseClick();
    setIsLoading(true);
    setCurrentUrl(url);
    setInputUrl(url);
    setActiveTab(tab);

    const nextHist = history.slice(0, historyIdx + 1);
    nextHist.push(url);
    setHistory(nextHist);
    setHistoryIdx(nextHist.length - 1);

    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playMouseClick();
    const url = inputUrl.toLowerCase();
    if (url.includes('myspace')) navigateTo('http://www.myspace.com/xXemo_rawrXx', 'myspace');
    else if (url.includes('geocities')) navigateTo('http://www.geocities.com/cyber_den_2004', 'geocities');
    else if (url.includes('newgrounds')) navigateTo('http://www.newgrounds.com', 'newgrounds');
    else if (url.includes('neopets')) navigateTo('http://www.neopets.com/petlookup.phtml', 'neopets');
    else if (url.includes('hotmail') || url.includes('mail')) navigateTo('http://mail.hotmail.com/inbox', 'hotmail');
    else if (url.includes('mapquest')) navigateTo('http://www.mapquest.com/directions', 'mapquest');
    else if (url.includes('ebay')) navigateTo('http://www.ebay.com', 'ebay');
    else navigateTo('http://www.google.com', 'google');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#ece9d8] text-[#111] font-tahoma text-[11px] select-text">
      {/* 1. Menu Bar */}
      <div className="bg-[#ece9d8] px-2 py-0.5 border-b border-[#d4d0c8] flex items-center gap-3 text-[11px] select-none">
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">File</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Edit</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">View</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Favorites</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Tools</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Help</span>
      </div>

      {/* 2. Classic IE6 Large Toolbar */}
      <div className="bg-[#ece9d8] px-2 py-1 border-b border-[#d4d0c8] flex items-center justify-between gap-1 select-none">
        <div className="flex items-center gap-1">
          {/* Back */}
          <button
            type="button"
            disabled={historyIdx <= 0}
            onClick={() => {
              if (historyIdx > 0) {
                playMouseClick();
                setHistoryIdx(historyIdx - 1);
                const prevUrl = history[historyIdx - 1];
                setCurrentUrl(prevUrl);
                setInputUrl(prevUrl);
              }
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 border border-transparent hover:border-[#808080] active:border-white rounded-xs disabled:opacity-40 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-b from-[#8fd35f] to-[#458b1b] flex items-center justify-center text-white shadow-xs">
              <ArrowLeft size={12} strokeWidth={3} />
            </div>
            <span className="font-bold">Back</span>
          </button>

          {/* Forward */}
          <button
            type="button"
            disabled={historyIdx >= history.length - 1}
            onClick={() => {
              if (historyIdx < history.length - 1) {
                playMouseClick();
                setHistoryIdx(historyIdx + 1);
                const nextUrl = history[historyIdx + 1];
                setCurrentUrl(nextUrl);
                setInputUrl(nextUrl);
              }
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 border border-transparent hover:border-[#808080] active:border-white rounded-xs disabled:opacity-40 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-b from-[#8fd35f] to-[#458b1b] flex items-center justify-center text-white shadow-xs">
              <ArrowRight size={12} strokeWidth={3} />
            </div>
          </button>

          <span className="h-5 border-r border-[#d4d0c8] mx-1" />

          {/* Stop / Refresh */}
          <button
            type="button"
            onClick={() => {
              playMouseClick();
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 300);
            }}
            className="p-1 hover:border border-[#808080] rounded-xs cursor-pointer flex items-center gap-1"
          >
            <RotateCw size={14} className={isLoading ? 'animate-spin text-blue-600' : 'text-gray-700'} />
          </button>

          {/* Home */}
          <button
            type="button"
            onClick={() => navigateTo('http://www.google.com', 'google')}
            className="p-1 hover:border border-[#808080] rounded-xs cursor-pointer flex items-center gap-1"
          >
            <Home size={14} className="text-amber-700" />
          </button>

          <span className="h-5 border-r border-[#d4d0c8] mx-1" />

          {/* Search / Favorites */}
          <button
            type="button"
            onClick={() => navigateTo('http://www.google.com', 'google')}
            className="flex items-center gap-1 px-1 py-0.5 hover:border border-[#808080] rounded-xs cursor-pointer"
          >
            <Search size={13} className="text-blue-600" />
            <span>Search</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('http://www.geocities.com/cyber_den_2004', 'geocities')}
            className="flex items-center gap-1 px-1 py-0.5 hover:border border-[#808080] rounded-xs cursor-pointer"
          >
            <Star size={13} className="text-amber-500 fill-amber-400" />
            <span>Favorites</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('http://mail.hotmail.com/inbox', 'hotmail')}
            className="flex items-center gap-1 px-1 py-0.5 hover:border border-[#808080] rounded-xs cursor-pointer"
          >
            <Mail size={13} className="text-blue-700" />
            <span>Mail</span>
          </button>
        </div>

        {/* Windows Flag Spinning Throbber */}
        <div className="w-6 h-6 border border-[#808080] bg-black flex items-center justify-center shadow-inner">
          <div className={`text-[13px] ${isLoading ? 'animate-spin' : ''}`}>🌐</div>
        </div>
      </div>

      {/* 3. Address Bar */}
      <form onSubmit={handleUrlSubmit} className="bg-[#ece9d8] px-2 py-1 border-b border-[#7f9db9] flex items-center gap-2 select-none">
        <span className="text-gray-600 text-[10.5px]">Address</span>
        <div className="flex-1 bg-white border border-[#7f9db9] px-2 py-0.5 flex items-center gap-1.5 shadow-inner">
          <Globe size={12} className="text-blue-600 shrink-0" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full bg-transparent border-none outline-none font-tahoma text-[11px] text-[#111]"
          />
        </div>
        <button
          type="submit"
          className="px-2 py-0.5 bg-[#ece9d8] hover:bg-[#dfdbcc] border-t border-l border-white border-r border-b border-[#808080] font-bold text-[10px] cursor-pointer flex items-center gap-1"
        >
          <span>Go</span>
        </button>
      </form>

      {/* 4. Quick Bookmark Links Bar */}
      <div className="bg-[#f0ede0] px-2 py-1 border-b border-[#d4d0c8] flex items-center gap-2 overflow-x-auto text-[10px] select-none">
        <span className="font-bold text-gray-500">Links:</span>
        <button
          type="button"
          onClick={() => navigateTo('http://www.google.com', 'google')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          🔍 Google
        </button>
        <button
          type="button"
          onClick={() => navigateTo('http://www.myspace.com/xXemo_rawrXx', 'myspace')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          🎵 MySpace
        </button>
        <button
          type="button"
          onClick={() => navigateTo('http://www.geocities.com/cyber_den_2004', 'geocities')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          💾 GeoCities
        </button>
        <button
          type="button"
          onClick={() => navigateTo('http://www.newgrounds.com', 'newgrounds')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          ⚡ Newgrounds
        </button>
        <button
          type="button"
          onClick={() => navigateTo('http://www.neopets.com/petlookup.phtml', 'neopets')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          🐾 Neopets
        </button>
        <button
          type="button"
          onClick={() => navigateTo('http://www.mapquest.com/directions', 'mapquest')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          🗺️ MapQuest
        </button>
        <button
          type="button"
          onClick={() => navigateTo('http://www.ebay.com', 'ebay')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          🏷️ eBay
        </button>
        <button
          type="button"
          onClick={() => navigateTo('http://mail.hotmail.com/inbox', 'hotmail')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          📬 Hotmail (3)
        </button>
      </div>

      {/* 5. Browser Page Content Area */}
      <div className="flex-1 bg-white overflow-y-auto relative p-4 select-text">
        {/* GOOGLE (2004 Classic Minimalist White) */}
        {activeTab === 'google' && (
          <div className="max-w-xl mx-auto pt-6 flex flex-col items-center text-center">
            {/* 2004 Logo */}
            <div className="mb-4">
              <span className="text-4xl font-serif font-bold text-[#4285f4]">G</span>
              <span className="text-4xl font-serif font-bold text-[#ea4335]">o</span>
              <span className="text-4xl font-serif font-bold text-[#fbbc05]">o</span>
              <span className="text-4xl font-serif font-bold text-[#4285f4]">g</span>
              <span className="text-4xl font-serif font-bold text-[#34a853]">l</span>
              <span className="text-4xl font-serif font-bold text-[#ea4335]">e</span>
              <span className="text-xs text-gray-500 font-sans ml-1">™</span>
            </div>

            {/* Links bar */}
            <div className="flex gap-4 text-[11px] text-blue-800 mb-3 underline">
              <span className="cursor-pointer font-bold no-underline text-black">Web</span>
              <span className="cursor-pointer">Images</span>
              <span className="cursor-pointer">Groups</span>
              <span className="cursor-pointer">News</span>
              <span className="cursor-pointer">Froogle</span>
            </div>

            {/* Search Input Box */}
            <div className="w-full max-w-md flex flex-col items-center">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search 4,285,199,774 web pages"
                onChange={(e) => {
                  playKeyClick();
                  setSearchQuery(e.target.value);
                }}
                className="w-full border-2 border-[#7f9db9] p-1.5 text-[12px] outline-none shadow-inner"
              />
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => playMouseClick()}
                  className="px-3 py-1 bg-[#ece9d8] border border-gray-400 text-[11px] hover:border-black cursor-pointer"
                >
                  Google Search
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('http://www.myspace.com/xXemo_rawrXx', 'myspace')}
                  className="px-3 py-1 bg-[#ece9d8] border border-gray-400 text-[11px] hover:border-black cursor-pointer"
                >
                  I'm Feeling Lucky
                </button>
              </div>
            </div>

            {/* Results mockup if searched */}
            {searchQuery && (
              <div className="mt-6 text-left w-full border-t border-gray-200 pt-4 space-y-3">
                <div>
                  <a href="#link" className="text-blue-800 underline font-medium text-[13px]">
                    Results for "{searchQuery}" on early internet archives
                  </a>
                  <p className="text-gray-700 text-[11px]">
                    Showing matches indexed by the Google Stanford cluster. Updated August 2004.
                  </p>
                  <span className="text-green-800 text-[10px]">www.archive.org/web/2004/{searchQuery} - 14k - Cached</span>
                </div>
              </div>
            )}

            <div className="mt-12 text-[10px] text-gray-500">
              ©2004 Google - Searching 4.28 billion pages
            </div>
          </div>
        )}

        {/* MYSPACE PROFILE (Messy, Awkward HTML, Top 8, Bling) */}
        {activeTab === 'myspace' && (
          <div className="max-w-2xl mx-auto bg-[#0a0a0f] text-[#dddddd] p-4 border-2 border-[#334466] shadow-lg">
            {/* Top MySpace Nav */}
            <div className="bg-[#003399] text-white p-1.5 flex justify-between items-center text-[10px] mb-3">
              <span className="font-bold">MySpace.com | a place for friends</span>
              <div className="flex gap-2">
                <span>Home</span> | <span>Browse</span> | <span>Search</span> | <span>Invite</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left Column: Profile Card */}
              <div className="col-span-1 border border-gray-700 p-2 bg-[#141420]">
                <div className="font-bold text-[14px] text-orange-400">xX_rawr_xD_2004_Xx</div>
                <div className="text-[10px] text-gray-400">"it's not a phase mom"</div>

                {/* Avatar */}
                <div className="my-2 w-full h-40 bg-gradient-to-b from-purple-900 to-black border border-gray-600 flex items-center justify-center text-center p-2 text-[11px]">
                  📷 [Webcam Self-Portrait with mirror flash]
                </div>

                <div className="text-[10px] space-y-1 text-gray-300">
                  <div><strong>Mood:</strong> melancholic 🖤</div>
                  <div><strong>Status:</strong> at cyber cafe cabin 04</div>
                  <div><strong>City:</strong> Austin, TX</div>
                  <div><strong>Member Since:</strong> 03/14/2004</div>
                </div>

                {/* Contact Box */}
                <div className="mt-3 border border-gray-700 p-1.5 bg-black/50 text-[10px] space-y-1">
                  <div className="text-orange-400 font-bold">Contacting Me:</div>
                  <div className="text-blue-400 underline cursor-pointer">✉️ Send Message</div>
                  <div className="text-blue-400 underline cursor-pointer">➕ Add to Friends</div>
                  <div className="text-blue-400 underline cursor-pointer">⭐ Add to Favorites</div>
                </div>
              </div>

              {/* Right Column: About, Songs, Top 8 */}
              <div className="col-span-2 space-y-3">
                {/* Music Player */}
                <div className="bg-[#1b2230] border border-[#ff6600] p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">▶️</span>
                    <div>
                      <div className="text-orange-400 font-bold text-[11px]">Evanescence - Bring Me To Life.mp3</div>
                      <div className="text-[9px] text-gray-400">Autoplaying profile song (buffering 42%)</div>
                    </div>
                  </div>
                </div>

                {/* About Me */}
                <div className="border border-gray-700 p-2.5 bg-[#141420]">
                  <div className="text-orange-400 font-bold text-[12px] border-b border-gray-700 pb-1 mb-1.5">
                    About Me:
                  </div>
                  <p className="text-[10.5px] leading-relaxed text-gray-300">
                    hey welcome 2 my profile. please don't steal my HTML codes or glitter graphics!!
                    i spend most of my weekends at the cyber cafe playing Counter-Strike and chatting on AIM.
                    leave a comment or i'll remove you from my top 8 lol.
                  </p>
                  <div className="mt-2 text-[10px] text-pink-400">
                    Bands: The Used, Taking Back Sunday, My Chemical Romance, Linkin Park, Blink-182.
                  </div>
                </div>

                {/* The Legendary TOP 8 FRIENDS */}
                <div className="border border-gray-700 p-2 bg-[#141420]">
                  <div className="text-orange-400 font-bold text-[12px] border-b border-gray-700 pb-1 mb-2">
                    xX_rawr_Xx's Friend Space (Top 8):
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-[9px]">
                    {[
                      { name: 'Tom', title: 'Your first friend' },
                      { name: 'xXSarahXx', title: 'bestie 4ever' },
                      { name: 'sk8rboi', title: 'skate crew' },
                      { name: 'HaloMaster', title: 'LAN partner' },
                      { name: 'punkrockgirl', title: 'concert buddy' },
                      { name: 'Mike', title: 'school' },
                      { name: 'Dave', title: 'guitarist' },
                      { name: 'Cabin04 Admin', title: 'cyber cafe' },
                    ].map((friend) => (
                      <div key={friend.name} className="border border-gray-800 p-1 bg-black/40">
                        <div className="w-full h-12 bg-gray-800 flex items-center justify-center text-[10px]">
                          👤
                        </div>
                        <div className="text-blue-400 font-bold truncate mt-1">{friend.name}</div>
                        <div className="text-gray-500 truncate text-[8px]">{friend.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GEOCITIES "The Cyber Den 2004" */}
        {activeTab === 'geocities' && (
          <div className="max-w-xl mx-auto bg-[#000033] text-[#ffff00] p-4 border-4 border-double border-[#ff00ff] font-terminal text-center">
            <div className="text-2xl font-bold tracking-widest text-[#00ffff] mb-2 animate-pulse">
              ★★★ WELCOME TO THE CYBER DEN 2004 ★★★
            </div>
            <div className="text-xs text-pink-400 mb-4">
              Best viewed in 800x600 resolution with Internet Explorer 5.0+
            </div>

            {/* Under Construction GIF placeholder */}
            <div className="inline-block border-2 border-yellow-400 p-2 bg-black text-yellow-400 font-bold text-xs mb-4">
              🚧 ⚠️ SITE UNDER CONSTRUCTION — PLEASE EXCUSE THE PIXELS ⚠️ 🚧
            </div>

            <div className="text-left text-xs text-white bg-black/70 p-3 border border-blue-500 space-y-2 font-mono">
              <p>Hello websurfer! You have reached node #482 on the Cyber Highway WebRing.</p>
              <p>Here you will find:</p>
              <ul className="list-disc pl-5 text-green-400">
                <li>Free MIDI audio background downloads</li>
                <li>Counter Strike 1.6 server console config files</li>
                <li>ASCII Art collections</li>
                <li>Winamp classic skins collection</li>
              </ul>
            </div>

            {/* Animated Hit Counter */}
            <div className="mt-6 flex flex-col items-center">
              <span className="text-[10px] text-gray-300 font-sans">You are visitor number:</span>
              <div className="bg-black border-2 border-gray-600 px-3 py-1 font-pixel text-2xl text-red-500 tracking-widest mt-1">
                0 0 4 8 2 9
              </div>
            </div>
          </div>
        )}

        {/* NEWGROUNDS FLASH PORTAL */}
        {activeTab === 'newgrounds' && (
          <div className="max-w-xl mx-auto bg-[#181818] text-white p-3 border border-[#333]">
            <div className="bg-[#cc5500] text-black font-bold p-2 text-sm flex justify-between items-center">
              <span>NEWGROUNDS.COM - EVERYTHING BY EVERYONE</span>
              <span className="text-xs">Flash Portal 2004</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
              <div className="border border-gray-700 p-2 bg-[#222]">
                <div className="font-bold text-orange-400 mb-1">🎮 Alien Hominid Flash</div>
                <div className="h-24 bg-black flex items-center justify-center text-gray-500">
                  [Flash 6 Player Embed]
                </div>
                <div className="text-[10px] text-gray-400 mt-1">Rating: 4.88 / 5 (38,200 votes)</div>
              </div>
              <div className="border border-gray-700 p-2 bg-[#222]">
                <div className="font-bold text-orange-400 mb-1">⚔️ Madness Combat 3</div>
                <div className="h-24 bg-black flex items-center justify-center text-gray-500">
                  [Flash Animation by Krinkels]
                </div>
                <div className="text-[10px] text-gray-400 mt-1">Daily Feature Award</div>
              </div>
            </div>
          </div>
        )}

        {/* NEOPETS */}
        {activeTab === 'neopets' && (
          <div className="max-w-lg mx-auto bg-[#ffffea] text-[#333] p-4 border border-[#ffd700]">
            <div className="bg-[#ffcc00] p-2 font-bold text-sm text-[#003399]">
              NEOPETS - Virtual Pet Community
            </div>
            <div className="mt-3 flex items-center gap-4 border border-yellow-300 p-3 bg-white">
              <div className="w-24 h-24 bg-blue-100 border border-blue-400 flex items-center justify-center text-4xl">
                🐯
              </div>
              <div className="text-xs space-y-1">
                <div className="font-bold text-blue-900 text-sm">Shadow_Kougra_2004</div>
                <div><strong>Species:</strong> Kougra</div>
                <div><strong>Health:</strong> 14 / 14</div>
                <div><strong>Hunger:</strong> Dying (Feed with Giant Omelette!)</div>
                <div><strong>Mood:</strong> Delighted</div>
                <div><strong>Age:</strong> 412 days</div>
              </div>
            </div>
          </div>
        )}

        {/* HOTMAIL WEBMAIL */}
        {activeTab === 'hotmail' && (
          <div className="max-w-2xl mx-auto bg-white border border-[#7f9db9] text-xs">
            <div className="bg-[#003399] text-white p-2 flex justify-between items-center font-bold">
              <span>MSN Hotmail - Inbox (3 unread)</span>
              <span className="text-[10px]">guest_cabin04@hotmail.com</span>
            </div>
            <div className="p-2 border-b border-gray-200 flex gap-3 text-[11px] text-blue-800 bg-[#f0ede0]">
              <span className="font-bold cursor-pointer">New Message</span> |
              <span className="cursor-pointer">Delete</span> |
              <span className="cursor-pointer">Junk Mail</span>
            </div>
            <div className="divide-y divide-gray-200">
              {[
                { from: 'Mom', subject: 'Fw: Fw: Fw: The cutest puppy ever please read!!', date: 'Aug 14', size: '12 KB' },
                { from: 'CyberCafe Manager', subject: 'Receipt for Cabin 04 session - 2 hours prepaid', date: 'Aug 14', size: '3 KB' },
                { from: 'LAN Admin', subject: 'Counter-Strike 1.6 tournament signups this Saturday', date: 'Aug 13', size: '8 KB' },
                { from: 'eBay Notifications', subject: 'Outbid notice: Vintage Walkman Cassette Player', date: 'Aug 12', size: '5 KB' },
              ].map((mail) => (
                <div key={mail.subject} className="p-2 hover:bg-blue-50 cursor-pointer flex justify-between items-center text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold">✉️</span>
                    <span className="font-bold text-gray-800 w-28 truncate">{mail.from}</span>
                    <span className="text-blue-900 font-medium truncate">{mail.subject}</span>
                  </div>
                  <span className="text-gray-500 text-[10px]">{mail.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAPQUEST */}
        {activeTab === 'mapquest' && (
          <div className="max-w-lg mx-auto bg-white border border-gray-400 p-3 text-xs">
            <div className="bg-[#006699] text-white p-2 font-bold text-sm">
              MAPQUEST.COM - Driving Directions (Printable)
            </div>
            <div className="mt-3 p-2 bg-gray-50 border border-gray-300">
              <div className="font-bold text-gray-800">From: Midnight Cyber Café (Cabin 04)</div>
              <div className="font-bold text-gray-800">To: 24-Hour Diner & Convenience Store</div>
            </div>
            <div className="mt-3 space-y-1.5 text-[11px] text-gray-700">
              <div>1. Turn LEFT onto Elm Street — 0.4 miles</div>
              <div>2. Continue straight past the neon gas station — 1.2 miles</div>
              <div>3. Turn RIGHT on 4th Ave next to the arcade — 0.2 miles</div>
              <div className="font-bold text-green-800">Total Distance: 1.8 miles / Est. Time: 4 mins</div>
            </div>
          </div>
        )}

        {/* EBAY */}
        {activeTab === 'ebay' && (
          <div className="max-w-xl mx-auto bg-white border border-gray-300 p-3 text-xs">
            <div className="text-xl font-bold mb-2">
              <span className="text-red-500">e</span>
              <span className="text-blue-500">B</span>
              <span className="text-yellow-500">a</span>
              <span className="text-green-500">y</span>
              <span className="text-xs text-gray-500 font-normal ml-2">The World\'s Online Marketplace</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="border p-2">
                <div className="font-bold text-blue-800">Apple iPod Mini 4GB (Silver)</div>
                <div className="text-green-700 font-bold text-sm">$199.00</div>
                <div className="text-gray-500 text-[10px]">14 bids · 2 hrs left</div>
              </div>
              <div className="border p-2">
                <div className="font-bold text-blue-800">Sony PlayStation 2 Slim + 2 Games</div>
                <div className="text-green-700 font-bold text-sm">$149.50</div>
                <div className="text-gray-500 text-[10px]">22 bids · 45 mins left</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d4d0c8] px-2 py-0.5 flex items-center justify-between text-[10px] text-gray-600 select-none">
        <div className="flex items-center gap-1.5">
          <Globe size={11} className="text-blue-700" />
          <span>{isLoading ? 'Downloading picture...' : 'Done'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="border-l border-r border-[#808080] px-2 flex items-center gap-1">
            <Lock size={10} className="text-gray-500" />
            <span>Internet (Zone 1)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
