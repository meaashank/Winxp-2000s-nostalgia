import React, { useState, useEffect, useRef } from 'react';
import {
  playMouseClick,
  playKeyClick,
  playHddSeek,
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
  ExternalLink,
  Loader2,
} from 'lucide-react';

type VintagePortal =
  | 'google'
  | 'myspace'
  | 'geocities'
  | 'newgrounds'
  | 'neopets'
  | 'hotmail'
  | 'mapquest'
  | 'ebay';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export const InternetExplorerApp: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('http://www.google.com');
  const [inputUrl, setInputUrl] = useState('http://www.google.com');
  const [browserMode, setBrowserMode] = useState<'vintage' | 'live'>('vintage');
  const [activeVintageTab, setActiveVintageTab] = useState<VintagePortal>('google');
  const [liveProxyUrl, setLiveProxyUrl] = useState('');
  const [pageTitle, setPageTitle] = useState('Google - Microsoft Internet Explorer');
  const [statusText, setStatusText] = useState('Done');
  const [isLoading, setIsLoading] = useState(false);

  // Search state for Google 2004
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Browser History
  const [history, setHistory] = useState<
    Array<{ url: string; mode: 'vintage' | 'live'; vintageTab?: VintagePortal; title: string }>
  >([{ url: 'http://www.google.com', mode: 'vintage', vintageTab: 'google', title: 'Google' }]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for iframe link navigation messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'IE_NAVIGATE' && event.data.url) {
        const destUrl = event.data.url;
        navigateToLiveUrl(destUrl, false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [historyIdx, history]);

  const pushHistory = (item: {
    url: string;
    mode: 'vintage' | 'live';
    vintageTab?: VintagePortal;
    title: string;
  }) => {
    const nextHist = history.slice(0, historyIdx + 1);
    nextHist.push(item);
    setHistory(nextHist);
    setHistoryIdx(nextHist.length - 1);
  };

  const navigateToVintage = (tab: VintagePortal, customUrl?: string) => {
    playMouseClick();
    playHddSeek();
    setIsLoading(true);
    setStatusText('Opening page...');

    const urlMap: Record<VintagePortal, string> = {
      google: 'http://www.google.com',
      myspace: 'http://www.myspace.com/xXemo_rawrXx',
      geocities: 'http://www.geocities.com/cyber_den_2004',
      newgrounds: 'http://www.newgrounds.com',
      neopets: 'http://www.neopets.com/petlookup.phtml',
      hotmail: 'http://mail.hotmail.com/inbox',
      mapquest: 'http://www.mapquest.com/directions',
      ebay: 'http://www.ebay.com',
    };

    const titleMap: Record<VintagePortal, string> = {
      google: 'Google',
      myspace: 'MySpace.com - a place for friends',
      geocities: 'The Cyber Den 2004 - GeoCities',
      newgrounds: 'Newgrounds.com — Everything, By Everyone',
      neopets: 'Neopets - Virtual Pet Community',
      hotmail: 'MSN Hotmail - Inbox',
      mapquest: 'MapQuest Maps - Driving Directions',
      ebay: 'eBay - The World\'s Online Marketplace',
    };

    const targetUrl = customUrl || urlMap[tab];
    setCurrentUrl(targetUrl);
    setInputUrl(targetUrl);
    setBrowserMode('vintage');
    setActiveVintageTab(tab);
    setPageTitle(`${titleMap[tab]} - Microsoft Internet Explorer`);

    pushHistory({
      url: targetUrl,
      mode: 'vintage',
      vintageTab: tab,
      title: titleMap[tab],
    });

    setTimeout(() => {
      setIsLoading(false);
      setStatusText('Done');
    }, 450);
  };

  const navigateToLiveUrl = (rawUrl: string, addToHistory = true) => {
    playMouseClick();
    playHddSeek();
    setIsLoading(true);
    setStatusText('Connecting to site...');

    let formattedUrl = rawUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setCurrentUrl(formattedUrl);
    setInputUrl(formattedUrl);
    setBrowserMode('live');
    setLiveProxyUrl(`/api/proxy?url=${encodeURIComponent(formattedUrl)}`);
    setPageTitle(`${formattedUrl} - Microsoft Internet Explorer`);

    if (addToHistory) {
      pushHistory({
        url: formattedUrl,
        mode: 'live',
        title: formattedUrl,
      });
    }

    setTimeout(() => {
      setStatusText('Downloading page elements...');
    }, 500);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputUrl.trim();
    if (!query) return;

    const lower = query.toLowerCase();

    // Check for vintage presets
    if (lower.includes('myspace')) {
      navigateToVintage('myspace');
    } else if (lower.includes('geocities')) {
      navigateToVintage('geocities');
    } else if (lower.includes('newgrounds')) {
      navigateToVintage('newgrounds');
    } else if (lower.includes('neopets')) {
      navigateToVintage('neopets');
    } else if (lower.includes('hotmail') || lower.includes('mail.msn')) {
      navigateToVintage('hotmail');
    } else if (lower.includes('mapquest')) {
      navigateToVintage('mapquest');
    } else if (lower.includes('ebay')) {
      navigateToVintage('ebay');
    } else if (lower === 'http://www.google.com' || lower === 'google.com' || lower === 'www.google.com' || lower === 'http://google.com') {
      navigateToVintage('google');
    } else if (
      lower.startsWith('http://') ||
      lower.startsWith('https://') ||
      lower.includes('.com') ||
      lower.includes('.org') ||
      lower.includes('.net') ||
      lower.includes('.io') ||
      lower.includes('.edu') ||
      lower.includes('.gov') ||
      lower.includes('.me') ||
      lower.includes('localhost')
    ) {
      // Direct live website navigation!
      navigateToLiveUrl(query);
    } else {
      // Query entered in address bar -> Run live search on 2004 Google!
      navigateToVintage('google');
      setSearchQuery(query);
      performSearch(query);
    }
  };

  // Perform live web search
  const performSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    playMouseClick();
    setIsSearching(true);
    setHasSearched(true);
    setStatusText('Searching indexed web pages...');

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(queryText)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.warn('Search failed', err);
      setSearchResults([
        {
          title: `${queryText} - Wikipedia`,
          url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(queryText)}`,
          snippet: `Search encyclopedic knowledge on Wikipedia for "${queryText}".`,
        },
      ]);
    } finally {
      setIsSearching(false);
      setStatusText('Done');
    }
  };

  const handleBack = () => {
    if (historyIdx > 0) {
      playMouseClick();
      playHddSeek();
      const prevIdx = historyIdx - 1;
      const target = history[prevIdx];
      setHistoryIdx(prevIdx);
      setCurrentUrl(target.url);
      setInputUrl(target.url);
      setPageTitle(`${target.title} - Microsoft Internet Explorer`);
      setBrowserMode(target.mode);

      if (target.mode === 'vintage' && target.vintageTab) {
        setActiveVintageTab(target.vintageTab);
      } else {
        setLiveProxyUrl(`/api/proxy?url=${encodeURIComponent(target.url)}`);
      }
    }
  };

  const handleForward = () => {
    if (historyIdx < history.length - 1) {
      playMouseClick();
      playHddSeek();
      const nextIdx = historyIdx + 1;
      const target = history[nextIdx];
      setHistoryIdx(nextIdx);
      setCurrentUrl(target.url);
      setInputUrl(target.url);
      setPageTitle(`${target.title} - Microsoft Internet Explorer`);
      setBrowserMode(target.mode);

      if (target.mode === 'vintage' && target.vintageTab) {
        setActiveVintageTab(target.vintageTab);
      } else {
        setLiveProxyUrl(`/api/proxy?url=${encodeURIComponent(target.url)}`);
      }
    }
  };

  const handleRefresh = () => {
    playMouseClick();
    setIsLoading(true);
    setStatusText('Refreshing page...');

    if (browserMode === 'live' && iframeRef.current) {
      iframeRef.current.src = `/api/proxy?url=${encodeURIComponent(currentUrl)}&t=${Date.now()}`;
    }

    setTimeout(() => {
      setIsLoading(false);
      setStatusText('Done');
    }, 600);
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
            onClick={handleBack}
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
            onClick={handleForward}
            className="flex items-center gap-1 px-1.5 py-0.5 border border-transparent hover:border-[#808080] active:border-white rounded-xs disabled:opacity-40 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-b from-[#8fd35f] to-[#458b1b] flex items-center justify-center text-white shadow-xs">
              <ArrowRight size={12} strokeWidth={3} />
            </div>
          </button>

          <span className="h-5 border-r border-[#d4d0c8] mx-1" />

          {/* Stop */}
          <button
            type="button"
            onClick={() => {
              playMouseClick();
              setIsLoading(false);
              setStatusText('Done');
            }}
            className="p-1 hover:border border-[#808080] rounded-xs cursor-pointer flex items-center gap-1"
            title="Stop loading (Esc)"
          >
            <X size={14} className="text-red-600" />
          </button>

          {/* Refresh */}
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1 hover:border border-[#808080] rounded-xs cursor-pointer flex items-center gap-1"
            title="Refresh (F5)"
          >
            <RotateCw size={14} className={isLoading ? 'animate-spin text-blue-600' : 'text-gray-700'} />
          </button>

          {/* Home */}
          <button
            type="button"
            onClick={() => navigateToVintage('google')}
            className="p-1 hover:border border-[#808080] rounded-xs cursor-pointer flex items-center gap-1"
            title="Home"
          >
            <Home size={14} className="text-amber-700" />
          </button>

          <span className="h-5 border-r border-[#d4d0c8] mx-1" />

          {/* Search */}
          <button
            type="button"
            onClick={() => {
              navigateToVintage('google');
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:border border-[#808080] rounded-xs cursor-pointer"
          >
            <Search size={13} className="text-blue-600" />
            <span>Search</span>
          </button>

          {/* Favorites */}
          <button
            type="button"
            onClick={() => navigateToVintage('geocities')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:border border-[#808080] rounded-xs cursor-pointer"
          >
            <Star size={13} className="text-amber-500 fill-amber-400" />
            <span>Favorites</span>
          </button>

          {/* Mail */}
          <button
            type="button"
            onClick={() => navigateToVintage('hotmail')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:border border-[#808080] rounded-xs cursor-pointer"
          >
            <Mail size={13} className="text-blue-700" />
            <span>Mail</span>
          </button>
        </div>

        {/* Windows Flag / Spinning Globe Throbber */}
        <div className="w-6 h-6 border border-[#808080] bg-black flex items-center justify-center shadow-inner select-none">
          <div className={`text-[13px] ${isLoading ? 'animate-spin' : ''}`}>🌐</div>
        </div>
      </div>

      {/* 3. Address Bar */}
      <form onSubmit={handleUrlSubmit} className="bg-[#ece9d8] px-2 py-1 border-b border-[#7f9db9] flex items-center gap-2 select-none">
        <span className="text-gray-600 text-[10.5px] font-semibold">Address</span>
        <div className="flex-1 bg-white border border-[#7f9db9] px-2 py-0.5 flex items-center gap-1.5 shadow-inner">
          <Globe size={12} className="text-blue-600 shrink-0" />
          <input
            type="text"
            value={inputUrl}
            placeholder="Type a web address (e.g. en.wikipedia.org, example.com) or search query..."
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full bg-transparent border-none outline-none font-tahoma text-[11px] text-[#111]"
          />
        </div>
        <button
          type="submit"
          className="px-2.5 py-0.5 bg-[#ece9d8] hover:bg-[#dfdbcc] active:bg-[#c8c4b4] border-t border-l border-white border-r border-b border-[#808080] font-bold text-[10.5px] cursor-pointer flex items-center gap-1 text-[#002266]"
        >
          <span className="text-green-700">➔</span>
          <span>Go</span>
        </button>
      </form>

      {/* 4. Quick Bookmark Links Bar with Live & Vintage Destinations */}
      <div className="bg-[#f0ede0] px-2 py-0.5 border-b border-[#d4d0c8] flex items-center gap-2 overflow-x-auto text-[10px] select-none">
        <span className="font-bold text-gray-500">Links:</span>
        <button
          type="button"
          onClick={() => navigateToVintage('google')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-0.5 shrink-0"
        >
          🔍 Google (2004)
        </button>
        <button
          type="button"
          onClick={() => navigateToLiveUrl('https://en.wikipedia.org/wiki/2004')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-0.5 shrink-0 font-semibold"
        >
          📖 Wikipedia (Live)
        </button>
        <button
          type="button"
          onClick={() => navigateToLiveUrl('https://wiby.me')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-0.5 shrink-0"
        >
          🌐 Wiby (Retro Web)
        </button>
        <button
          type="button"
          onClick={() => navigateToLiveUrl('https://news.ycombinator.com')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-0.5 shrink-0"
        >
          📰 Hacker News
        </button>
        <button
          type="button"
          onClick={() => navigateToVintage('myspace')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-0.5 shrink-0"
        >
          🎵 MySpace
        </button>
        <button
          type="button"
          onClick={() => navigateToVintage('geocities')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-0.5 shrink-0"
        >
          💾 GeoCities
        </button>
        <button
          type="button"
          onClick={() => navigateToVintage('newgrounds')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-0.5 shrink-0"
        >
          ⚡ Newgrounds
        </button>
        <button
          type="button"
          onClick={() => navigateToVintage('neopets')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-0.5 shrink-0"
        >
          🐾 Neopets
        </button>
        <button
          type="button"
          onClick={() => navigateToVintage('mapquest')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-0.5 shrink-0"
        >
          🗺️ MapQuest
        </button>
        <button
          type="button"
          onClick={() => navigateToVintage('ebay')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-0.5 shrink-0"
        >
          🏷️ eBay
        </button>
        <button
          type="button"
          onClick={() => navigateToVintage('hotmail')}
          className="text-blue-700 hover:underline cursor-pointer flex items-center gap-0.5 shrink-0"
        >
          📬 Hotmail
        </button>
      </div>

      {/* 5. Browser Page Content Viewport */}
      <div className="flex-1 bg-white overflow-hidden relative select-text">
        {/* MODE A: LIVE PROXY WEB BROWSING (Loads any real website inside 2004 IE6 frame) */}
        {browserMode === 'live' && (
          <div className="w-full h-full flex flex-col bg-white">
            {/* Live Web Status Overlay Banner */}
            <div className="bg-[#f9f9f9] border-b border-[#e0e0e0] px-2 py-0.5 text-[10px] text-gray-600 flex items-center justify-between select-none">
              <span className="flex items-center gap-1">
                <Globe size={11} className="text-blue-600" />
                <span className="font-mono">{currentUrl}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.open(currentUrl, '_blank')}
                  className="text-blue-700 hover:underline flex items-center gap-0.5 text-[9.5px]"
                  title="Open in new window"
                >
                  <ExternalLink size={9} /> Open in new tab
                </button>
              </div>
            </div>

            {/* Live Web Iframe via Stripped / Secure Proxy */}
            <iframe
              ref={iframeRef}
              src={liveProxyUrl}
              title={currentUrl}
              onLoad={() => {
                setIsLoading(false);
                setStatusText('Done');
              }}
              className="flex-1 w-full h-full border-none bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        )}

        {/* MODE B: VINTAGE 2004 PORTALS & GOOGLE 2004 LIVE SEARCH */}
        {browserMode === 'vintage' && (
          <div className="w-full h-full overflow-y-auto p-4">
            {/* GOOGLE (2004 Classic Minimalist White with Real Search Index) */}
            {activeVintageTab === 'google' && (
              <div className="max-w-xl mx-auto pt-4 flex flex-col items-center text-center">
                {/* 2004 Logo */}
                <div
                  onClick={() => {
                    setHasSearched(false);
                    setSearchQuery('');
                  }}
                  className="mb-3 cursor-pointer"
                >
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
                  <span
                    onClick={() => navigateToLiveUrl(`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(searchQuery || '2004')}`)}
                    className="cursor-pointer"
                  >
                    Encyclopedia
                  </span>
                  <span
                    onClick={() => navigateToLiveUrl(`https://wiby.me/?q=${encodeURIComponent(searchQuery || 'technology')}`)}
                    className="cursor-pointer"
                  >
                    Retro Web
                  </span>
                  <span
                    onClick={() => navigateToVintage('geocities')}
                    className="cursor-pointer"
                  >
                    WebRing
                  </span>
                  <span
                    onClick={() => navigateToVintage('ebay')}
                    className="cursor-pointer"
                  >
                    Froogle
                  </span>
                </div>

                {/* Search Input Box */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    performSearch(searchQuery);
                  }}
                  className="w-full max-w-md flex flex-col items-center"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    placeholder="Search 4,285,199,774 live web pages..."
                    onChange={(e) => {
                      playKeyClick();
                      setSearchQuery(e.target.value);
                    }}
                    className="w-full border-2 border-[#7f9db9] p-1.5 text-[12px] outline-none shadow-inner"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="px-3 py-1 bg-[#ece9d8] border border-gray-400 text-[11px] hover:border-black active:bg-[#d8d4c4] cursor-pointer font-medium"
                    >
                      {isSearching ? 'Searching...' : 'Google Search'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (searchQuery.trim()) {
                          navigateToLiveUrl(`https://en.wikipedia.org/wiki/${encodeURIComponent(searchQuery.trim().replace(/ /g, '_'))}`);
                        } else {
                          navigateToVintage('myspace');
                        }
                      }}
                      className="px-3 py-1 bg-[#ece9d8] border border-gray-400 text-[11px] hover:border-black active:bg-[#d8d4c4] cursor-pointer"
                    >
                      I'm Feeling Lucky
                    </button>
                  </div>
                </form>

                {/* Real Live Search Results */}
                {isSearching && (
                  <div className="mt-6 flex items-center gap-2 text-gray-600 text-[11.5px]">
                    <Loader2 size={15} className="animate-spin text-blue-600" />
                    <span>Querying Google index servers for "{searchQuery}"...</span>
                  </div>
                )}

                {hasSearched && !isSearching && (
                  <div className="mt-5 text-left w-full border-t border-gray-200 pt-3 space-y-4">
                    <div className="text-[10px] text-gray-500 flex justify-between">
                      <span>Results for <strong>{searchQuery}</strong></span>
                      <span>Showing {searchResults.length} matches (0.14 seconds)</span>
                    </div>

                    {searchResults.length === 0 ? (
                      <div className="text-gray-600 text-[11.5px] py-4 text-center">
                        <p>No results found for "<strong>{searchQuery}</strong>".</p>
                        <p className="text-[10px] text-gray-400 mt-1">Make sure all words are spelled correctly or try more general keywords.</p>
                      </div>
                    ) : (
                      searchResults.map((result, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => navigateToLiveUrl(result.url)}
                            className="text-[#0000cc] hover:underline font-medium text-[13px] text-left block cursor-pointer"
                          >
                            {result.title}
                          </button>
                          <p className="text-[#222] text-[11px] leading-snug">
                            {result.snippet}
                          </p>
                          <div className="text-[#008000] text-[10px] flex items-center gap-2">
                            <span>{result.url}</span>
                            <span className="text-gray-400">-</span>
                            <button
                              type="button"
                              onClick={() => navigateToLiveUrl(result.url)}
                              className="text-[#7777cc] hover:underline cursor-pointer"
                            >
                              Browse Live
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {!hasSearched && (
                  <div className="mt-8 grid grid-cols-2 gap-2 text-left w-full border-t border-gray-200 pt-3 text-[10.5px]">
                    <div className="p-2 bg-[#f8f9fa] border border-gray-200 rounded-xs">
                      <div className="font-bold text-[#002266] mb-1">💡 Real Web Browsing Available</div>
                      <p className="text-gray-600">
                        Type any URL (e.g. <code>en.wikipedia.org</code>, <code>news.ycombinator.com</code>) in the Address Bar to browse the live web within 2004 Internet Explorer!
                      </p>
                    </div>
                    <div className="p-2 bg-[#f8f9fa] border border-gray-200 rounded-xs">
                      <div className="font-bold text-[#002266] mb-1">⭐ Vintage 2004 Portals</div>
                      <p className="text-gray-600">
                        Explore period archives: MySpace Top 8, GeoCities Cyber Den, Newgrounds Flash Portal, Neopets, Hotmail, and eBay.
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-10 text-[10px] text-gray-500">
                  ©2004 Google - Searching 4,285,199,774 web pages
                </div>
              </div>
            )}

            {/* MYSPACE PROFILE */}
            {activeVintageTab === 'myspace' && (
              <div className="max-w-2xl mx-auto bg-[#0a0a0f] text-[#dddddd] p-4 border-2 border-[#334466] shadow-lg">
                <div className="bg-[#003399] text-white p-1.5 flex justify-between items-center text-[10px] mb-3">
                  <span className="font-bold">MySpace.com | a place for friends</span>
                  <div className="flex gap-2">
                    <span>Home</span> | <span>Browse</span> | <span>Search</span> | <span>Invite</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 border border-gray-700 p-2 bg-[#141420]">
                    <div className="font-bold text-[14px] text-orange-400">xX_rawr_xD_2004_Xx</div>
                    <div className="text-[10px] text-gray-400">"it's not a phase mom"</div>

                    <div className="my-2 w-full h-40 bg-gradient-to-b from-purple-900 to-black border border-gray-600 flex items-center justify-center text-center p-2 text-[11px]">
                      📷 [Webcam Self-Portrait with mirror flash]
                    </div>

                    <div className="text-[10px] space-y-1 text-gray-300">
                      <div><strong>Mood:</strong> melancholic 🖤</div>
                      <div><strong>Status:</strong> at cyber cafe cabin 04</div>
                      <div><strong>City:</strong> Austin, TX</div>
                      <div><strong>Member Since:</strong> 03/14/2004</div>
                    </div>

                    <div className="mt-3 border border-gray-700 p-1.5 bg-black/50 text-[10px] space-y-1">
                      <div className="text-orange-400 font-bold">Contacting Me:</div>
                      <div className="text-blue-400 underline cursor-pointer">✉️ Send Message</div>
                      <div className="text-blue-400 underline cursor-pointer">➕ Add to Friends</div>
                      <div className="text-blue-400 underline cursor-pointer">⭐ Add to Favorites</div>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-3">
                    <div className="bg-[#1b2230] border border-[#ff6600] p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">▶️</span>
                        <div>
                          <div className="text-orange-400 font-bold text-[11px]">Evanescence - Bring Me To Life.mp3</div>
                          <div className="text-[9px] text-gray-400">Autoplaying profile song (buffering 42%)</div>
                        </div>
                      </div>
                    </div>

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

            {/* GEOCITIES */}
            {activeVintageTab === 'geocities' && (
              <div className="max-w-xl mx-auto bg-[#000033] text-[#ffff00] p-4 border-4 border-double border-[#ff00ff] font-terminal text-center">
                <div className="text-2xl font-bold tracking-widest text-[#00ffff] mb-2 animate-pulse">
                  ★★★ WELCOME TO THE CYBER DEN 2004 ★★★
                </div>
                <div className="text-xs text-pink-400 mb-4">
                  Best viewed in 800x600 resolution with Internet Explorer 5.0+
                </div>

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

                <div className="mt-6 flex flex-col items-center">
                  <span className="text-[10px] text-gray-300 font-sans">You are visitor number:</span>
                  <div className="bg-black border-2 border-gray-600 px-3 py-1 font-pixel text-2xl text-red-500 tracking-widest mt-1">
                    0 0 4 8 2 9
                  </div>
                </div>
              </div>
            )}

            {/* NEWGROUNDS */}
            {activeVintageTab === 'newgrounds' && (
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
            {activeVintageTab === 'neopets' && (
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

            {/* HOTMAIL */}
            {activeVintageTab === 'hotmail' && (
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
            {activeVintageTab === 'mapquest' && (
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
            {activeVintageTab === 'ebay' && (
              <div className="max-w-xl mx-auto bg-white border border-gray-300 p-3 text-xs">
                <div className="text-xl font-bold mb-2">
                  <span className="text-red-500">e</span>
                  <span className="text-blue-500">B</span>
                  <span className="text-yellow-500">a</span>
                  <span className="text-green-500">y</span>
                  <span className="text-xs text-gray-500 font-normal ml-2">The World's Online Marketplace</span>
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
        )}
      </div>

      {/* 6. Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d4d0c8] px-2 py-0.5 flex items-center justify-between text-[10px] text-gray-600 select-none">
        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
          <Globe size={11} className="text-blue-700 shrink-0" />
          <span className="truncate">{statusText}</span>
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
