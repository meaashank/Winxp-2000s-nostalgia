import React, { useState } from 'react';
import { playKeyClick, playMouseClick, playLaserPrinter } from '../../utils/audio';
import { Printer, FileText, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface NotepadAppProps {
  initialContent?: string;
  fileName?: string;
}

export const NotepadApp: React.FC<NotepadAppProps> = ({
  initialContent = `CABIN 04 - NOTES
================
- Prepaid session: 2 Hours ($4.00)
- LAN Party CS 1.6 starts at 11:30 PM
- Need to copy photos.zip to floppy disk before leaving
- Ask front desk for Mountain Dew / Bawls drink

Don't forget to log out when done!`,
  fileName = 'Untitled - Notepad',
}) => {
  const [content, setContent] = useState(initialContent);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'general' | 'paper'>('preview');
  const [copies, setCopies] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);
  const [printQuality, setPrintQuality] = useState<'FastRes 1200' | '600 dpi' | 'ProRes 1200'>('FastRes 1200');

  const handleOpenPrint = () => {
    playMouseClick();
    setIsPrintDialogOpen(true);
    setPrintSuccess(false);
    setIsPrinting(false);
  };

  const handleExecutePrint = () => {
    playLaserPrinter();
    setIsPrinting(true);
    setPrintSuccess(false);

    setTimeout(() => {
      setIsPrinting(false);
      setPrintSuccess(true);
      setTimeout(() => {
        setIsPrintDialogOpen(false);
        setPrintSuccess(false);
      }, 1800);
    }, 2400);
  };

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="w-full h-full flex flex-col bg-white text-[#111] font-terminal text-[12px] select-text relative">
      {/* Menu Bar & Quick Print Action */}
      <div className="bg-[#ece9d8] px-2 py-1 border-b border-[#d4d0c8] flex items-center justify-between text-[11px] font-tahoma select-none">
        <div className="flex items-center gap-3">
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">File</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Edit</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Format</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">View</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded-xs cursor-pointer">Help</span>
        </div>

        {/* 2004 HP LaserJet Print Button in toolbar */}
        <button
          type="button"
          onClick={handleOpenPrint}
          title="Print to HP LaserJet 1200 Series (Ctrl+P)"
          className="flex items-center gap-1.5 px-2 py-0.5 bg-[#ece9d8] hover:bg-[#d8d4c4] active:bg-[#c0bcac] border border-[#7f9db9] rounded-xs text-[#001144] font-bold text-[10.5px] cursor-pointer shadow-xs"
        >
          <Printer size={12} className="text-[#003399]" />
          <span>Print...</span>
        </button>
      </div>

      {/* Main Text Area */}
      <textarea
        value={content}
        onChange={(e) => {
          playKeyClick();
          setContent(e.target.value);
        }}
        placeholder="Type text here..."
        className="flex-1 w-full p-3 bg-white text-black outline-none resize-none font-terminal text-[12.5px] leading-relaxed select-text"
      />

      {/* Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d4d0c8] px-2 py-0.5 flex justify-between text-[10px] text-gray-600 font-tahoma select-none">
        <span>Lines: {content.split('\n').length} | Chars: {content.length}</span>
        <span className="text-[#003399] flex items-center gap-1 font-semibold">
          <Printer size={10} /> HP LaserJet 1200 (LPT1:) Ready
        </span>
      </div>

      {/* 2004 HP LaserJet Print Preview Dialog Modal */}
      {isPrintDialogOpen && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-2 select-none">
          <div
            id="hp-laserjet-print-dialog"
            className="w-full max-w-[520px] max-h-[92%] bg-[#ece9d8] border-2 border-[#0055ea] rounded-sm shadow-2xl flex flex-col font-tahoma text-[11px] overflow-hidden"
          >
            {/* Title Bar */}
            <div className="bg-gradient-to-r from-[#0055ea] via-[#3593ff] to-[#0055ea] text-white px-2 py-1 flex items-center justify-between font-bold text-[11.5px] shadow-xs">
              <div className="flex items-center gap-1.5">
                <Printer size={13} className="text-yellow-300" />
                <span>Print - HP LaserJet 1200 Series PCL 6</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  playMouseClick();
                  setIsPrintDialogOpen(false);
                }}
                className="w-4 h-4 bg-[#d13438] hover:bg-[#e81123] text-white flex items-center justify-center rounded-xs text-[10px] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="px-2 pt-1.5 flex gap-1 border-b border-[#919b9c] bg-[#ece9d8]">
              <button
                type="button"
                onClick={() => {
                  playMouseClick();
                  setActiveTab('preview');
                }}
                className={`px-3 py-1 rounded-t-xs border-t border-l border-r text-[10.5px] cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-white border-[#7f9db9] font-bold text-[#003399] -mb-[1px] pb-1.5 shadow-xs'
                    : 'bg-[#e0ded0] border-[#b4b0a4] text-gray-700 hover:bg-[#ebe8d8]'
                }`}
              >
                🖨️ Print Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  playMouseClick();
                  setActiveTab('general');
                }}
                className={`px-3 py-1 rounded-t-xs border-t border-l border-r text-[10.5px] cursor-pointer ${
                  activeTab === 'general'
                    ? 'bg-white border-[#7f9db9] font-bold text-[#003399] -mb-[1px] pb-1.5 shadow-xs'
                    : 'bg-[#e0ded0] border-[#b4b0a4] text-gray-700 hover:bg-[#ebe8d8]'
                }`}
              >
                ⚙️ General Setup
              </button>
              <button
                type="button"
                onClick={() => {
                  playMouseClick();
                  setActiveTab('paper');
                }}
                className={`px-3 py-1 rounded-t-xs border-t border-l border-r text-[10.5px] cursor-pointer ${
                  activeTab === 'paper'
                    ? 'bg-white border-[#7f9db9] font-bold text-[#003399] -mb-[1px] pb-1.5 shadow-xs'
                    : 'bg-[#e0ded0] border-[#b4b0a4] text-gray-700 hover:bg-[#ebe8d8]'
                }`}
              >
                📄 Paper / Quality
              </button>
            </div>

            {/* Dialog Content Body */}
            <div className="p-3 bg-white flex-1 overflow-y-auto min-h-[260px] max-h-[360px] text-[#111]">
              {/* TAB 1: Authentic 2004 HP LaserJet Print Preview */}
              {activeTab === 'preview' && (
                <div className="flex flex-col gap-2 items-center">
                  <div className="w-full flex items-center justify-between text-[10px] text-gray-600 border-b pb-1">
                    <span className="font-semibold text-[#003399]">
                      Simulated 8.5" x 11" Letter Output (HP LaserJet 1200 FastRes Engine)
                    </span>
                    <span>100% Scale · 1 Page</span>
                  </div>

                  {/* Authentic 2004 HP LaserJet Paper Sheet with Laser Crisp Typography */}
                  <div className="w-full max-w-[420px] bg-[#fbfbf8] border border-[#c4c0b4] rounded-xs shadow-[0_4px_12px_rgba(0,0,0,0.15)] p-4 font-mono text-[10.5px] text-[#0a0a0a] min-h-[220px] flex flex-col justify-between select-text">
                    {/* Header line printed on page */}
                    <div className="border-b border-[#444] pb-1 mb-2 flex justify-between text-[9px] text-[#333] tracking-tight font-serif italic">
                      <span>Document: {fileName}</span>
                      <span>{currentDateStr}</span>
                    </div>

                    {/* Laser Toner Text Body */}
                    <div className="flex-1 whitespace-pre-wrap font-mono text-[10px] text-[#000] leading-relaxed select-text min-h-[140px]">
                      {content || '(Blank Document)'}
                    </div>

                    {/* Authentic HP LaserJet Page Footer */}
                    <div className="border-t border-[#777] pt-1 mt-3 flex justify-between text-[8px] text-[#444] font-mono uppercase tracking-wider">
                      <span>HP LaserJet 1200 Series · Cabin 04 PCL6 Driver</span>
                      <span>Page 1 of 1</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: General Setup & Printer Details */}
              {activeTab === 'general' && (
                <div className="space-y-3">
                  {/* Printer Select Group */}
                  <fieldset className="border border-[#7f9db9] p-2 rounded-xs">
                    <legend className="px-1 text-[#003399] font-bold text-[10.5px]">Select Printer</legend>
                    <div className="flex items-start gap-2.5 bg-[#f9f9fa] p-2 border border-gray-300 rounded-xs mb-2">
                      <div className="p-1.5 bg-[#0055ea] text-white rounded-xs">
                        <Printer size={20} />
                      </div>
                      <div className="text-[10px] leading-tight space-y-0.5">
                        <div className="font-bold text-[#002266] text-[11px]">HP LaserJet 1200 Series PCL 6</div>
                        <div className="text-gray-600">Status: <span className="text-green-700 font-semibold">Ready (Idle)</span></div>
                        <div className="text-gray-600">Location: Cyber Café Front Counter (LPT1: Parallel)</div>
                        <div className="text-gray-600">Driver: Hewlett-Packard PCL 6 v5.04.14</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10.5px] pt-1">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="page-range" defaultChecked className="accent-[#0055ea]" />
                        <span>All pages</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-gray-500">
                        <input type="radio" name="page-range" disabled className="accent-[#0055ea]" />
                        <span>Current page only</span>
                      </label>
                    </div>
                  </fieldset>

                  {/* Copies */}
                  <fieldset className="border border-[#7f9db9] p-2 rounded-xs flex items-center justify-between">
                    <legend className="px-1 text-[#003399] font-bold text-[10.5px]">Copies</legend>
                    <div className="flex items-center gap-2">
                      <span>Number of copies:</span>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={copies}
                        onChange={(e) => setCopies(Math.max(1, Number(e.target.value)))}
                        className="w-14 px-1.5 py-0.5 border border-[#7f9db9] text-center font-bold"
                      />
                    </div>
                    <label className="flex items-center gap-1 text-[10px] text-gray-700 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-[#0055ea]" />
                      <span>Collate</span>
                    </label>
                  </fieldset>
                </div>
              )}

              {/* TAB 3: Paper / Quality */}
              {activeTab === 'paper' && (
                <div className="space-y-3">
                  <fieldset className="border border-[#7f9db9] p-2 rounded-xs">
                    <legend className="px-1 text-[#003399] font-bold text-[10.5px]">Paper Source & Size</legend>
                    <div className="space-y-2 text-[10.5px]">
                      <div className="flex justify-between items-center">
                        <span>Paper Size:</span>
                        <select className="border border-gray-400 px-1 py-0.5 bg-white text-[10px]">
                          <option>Letter (8.5 x 11 in)</option>
                          <option>Legal (8.5 x 14 in)</option>
                          <option>A4 (210 x 297 mm)</option>
                        </select>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Paper Tray:</span>
                        <select className="border border-gray-400 px-1 py-0.5 bg-white text-[10px]">
                          <option>Tray 1 (Priority Sheet Feed)</option>
                          <option>Tray 2 (250-Sheet Paper Cassette)</option>
                        </select>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="border border-[#7f9db9] p-2 rounded-xs">
                    <legend className="px-1 text-[#003399] font-bold text-[10.5px]">Print Quality & Resolution</legend>
                    <div className="space-y-1.5 text-[10.5px]">
                      {(['FastRes 1200', '600 dpi', 'ProRes 1200'] as const).map((q) => (
                        <label key={q} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="quality"
                            checked={printQuality === q}
                            onChange={() => setPrintQuality(q)}
                            className="accent-[#0055ea]"
                          />
                          <span>{q} {q === 'FastRes 1200' ? '(Recommended for clear text)' : ''}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}
            </div>

            {/* Printing Progress Overlay */}
            {isPrinting && (
              <div className="bg-[#fff9e6] border-t border-[#f0c36d] p-2 flex items-center justify-between text-[#8a5300] text-[10.5px]">
                <div className="flex items-center gap-2 font-bold animate-pulse">
                  <RefreshCw size={13} className="animate-spin text-amber-700" />
                  <span>Spooling document to HP LaserJet 1200 via LPT1 (Paper Feed in Progress)...</span>
                </div>
              </div>
            )}

            {printSuccess && (
              <div className="bg-[#e6ffe6] border-t border-[#66cc66] p-2 flex items-center gap-2 text-[#006600] text-[10.5px] font-bold">
                <Check size={14} className="text-green-700" />
                <span>Job printed successfully to HP LaserJet 1200 Series!</span>
              </div>
            )}

            {/* Bottom Dialog Action Buttons */}
            <div className="bg-[#ece9d8] border-t border-[#d4d0c8] p-2 flex items-center justify-between">
              <div className="text-[10px] text-gray-600 flex items-center gap-1 font-mono">
                <FileText size={11} /> HP LaserJet PCL6
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isPrinting}
                  onClick={handleExecutePrint}
                  className="px-4 py-1 bg-[#0055ea] hover:bg-[#0044cc] active:bg-[#003399] disabled:opacity-50 text-white font-bold rounded-xs cursor-pointer shadow-xs border border-[#0033aa] flex items-center gap-1"
                >
                  <Printer size={12} />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  disabled={isPrinting}
                  onClick={() => {
                    playMouseClick();
                    setIsPrintDialogOpen(false);
                  }}
                  className="px-3 py-1 bg-[#ece9d8] hover:bg-[#d8d4c4] active:bg-[#c4c0b0] text-[#111] rounded-xs cursor-pointer border border-[#7f9db9] shadow-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
