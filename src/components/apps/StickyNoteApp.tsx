import React, { useState } from 'react';
import { StickyNote } from '../../types';
import { playMouseClick, playKeyClick, playWindowsBalloon } from '../../utils/audio';
import { Plus, Pin, Save, Trash2, Palette, Type, Check, FileText } from 'lucide-react';

interface StickyNoteAppProps {
  notes: StickyNote[];
  onAddStickyNote: (note: Omit<StickyNote, 'id' | 'zIndex'>) => void;
  onUpdateNote: (id: string, updates: Partial<StickyNote>) => void;
  onDeleteNote: (id: string) => void;
}

const COLOR_OPTIONS: { id: StickyNote['color']; label: string; bg: string; border: string; text: string; strip: string }[] = [
  { id: 'yellow', label: 'Classic Yellow', bg: '#fcf08a', border: '#ded058', text: '#222222', strip: '#f0df68' },
  { id: 'pink', label: 'Pastel Pink', bg: '#ffd2e1', border: '#e49ab4', text: '#2d1420', strip: '#f8b9cf' },
  { id: 'cyan', label: 'Matrix Cyan', bg: '#d2f3ff', border: '#9ecde0', text: '#0b2633', strip: '#bae4f4' },
  { id: 'green', label: 'Terminal Green', bg: '#daf7ce', border: '#a4d48f', text: '#172e0d', strip: '#c2e9b0' },
  { id: 'orange', label: 'Retro Amber', bg: '#ffe0b8', border: '#e2af70', text: '#3b2207', strip: '#f8cc96' },
];

export const StickyNoteApp: React.FC<StickyNoteAppProps> = ({
  notes,
  onAddStickyNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | 'new'>('new');
  const [draftTitle, setDraftTitle] = useState('Cabin 04 Quick Note');
  const [draftText, setDraftText] = useState('Remember to log out and return headphones to the front desk before midnight.');
  const [draftColor, setDraftColor] = useState<StickyNote['color']>('yellow');
  const [draftFont, setDraftFont] = useState<'handwritten' | 'tahoma' | 'terminal' | 'comic'>('handwritten');
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  const selectedTheme = COLOR_OPTIONS.find((c) => c.id === draftColor) || COLOR_OPTIONS[0];

  const handleSelectExisting = (note: StickyNote) => {
    playMouseClick();
    setSelectedNoteId(note.id);
    setDraftTitle(note.authorNote || 'Sticky Note');
    setDraftText(note.text);
    setDraftColor(note.color);
  };

  const handleCreateNew = () => {
    playMouseClick();
    setSelectedNoteId('new');
    setDraftTitle('New Desktop Note');
    setDraftText('Type your note content here...');
    setDraftColor('yellow');
  };

  const handleSaveToDesktop = () => {
    playMouseClick();
    playWindowsBalloon();

    if (selectedNoteId === 'new') {
      onAddStickyNote({
        text: draftText,
        color: draftColor,
        authorNote: draftTitle,
        position: {
          x: Math.min(window.innerWidth - 260, 450 + Math.floor(Math.random() * 150)),
          y: Math.min(window.innerHeight - 240, 120 + Math.floor(Math.random() * 150)),
        },
        rotation: Number((Math.random() * 4 - 2).toFixed(1)),
        isPinnedToDesktop: true,
      });
      setSaveNotification('Pinned to Desktop Screen!');
    } else {
      onUpdateNote(selectedNoteId, {
        text: draftText,
        color: draftColor,
        authorNote: draftTitle,
      });
      setSaveNotification('Desktop Note Updated!');
    }

    setTimeout(() => {
      setSaveNotification(null);
    }, 2400);
  };

  const handleDeleteCurrent = () => {
    if (selectedNoteId !== 'new') {
      playMouseClick();
      onDeleteNote(selectedNoteId);
      handleCreateNew();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#ece9d8] text-[#111] font-tahoma text-[11px] select-none">
      {/* 1. Classic Windows XP Menu Bar */}
      <div className="bg-[#ece9d8] px-2 py-0.5 border-b border-[#d4d0c8] flex items-center gap-3 text-[11px]">
        <span onClick={handleCreateNew} className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 cursor-pointer rounded-xs">
          New
        </span>
        <span onClick={handleSaveToDesktop} className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 cursor-pointer rounded-xs font-bold text-blue-800">
          Pin to Desktop
        </span>
        <span onClick={handleSaveToDesktop} className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 cursor-pointer rounded-xs">
          Save File
        </span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 cursor-pointer rounded-xs">
          Options
        </span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 cursor-pointer rounded-xs">
          Help
        </span>
      </div>

      {/* 2. Toolbar */}
      <div className="bg-[#ece9d8] px-2 py-1 border-b border-[#d4d0c8] flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCreateNew}
            className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-gray-50 border border-[#7f9db9] rounded-xs cursor-pointer shadow-xs"
          >
            <Plus size={12} className="text-green-700" />
            <span className="font-bold">New Note</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToDesktop}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#2e7d32] hover:bg-[#388e3c] text-white border border-[#1b5e20] rounded-xs cursor-pointer shadow-xs font-bold"
          >
            <Pin size={12} />
            <span>Pin to Desktop</span>
          </button>

          {selectedNoteId !== 'new' && (
            <button
              type="button"
              onClick={handleDeleteCurrent}
              className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-red-50 border border-red-300 text-red-700 rounded-xs cursor-pointer shadow-xs"
            >
              <Trash2 size={12} />
              <span>Delete</span>
            </button>
          )}
        </div>

        {/* Save feedback indicator */}
        {saveNotification && (
          <div className="flex items-center gap-1 text-green-800 font-bold bg-green-100 border border-green-400 px-2 py-0.5 rounded-xs animate-pulse">
            <Check size={12} />
            <span>{saveNotification}</span>
          </div>
        )}
      </div>

      {/* 3. Main Split View: Left List of Notes, Right Note Editor & Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Note Explorer */}
        <div className="w-[180px] bg-[#f5f5f0] border-r border-[#7f9db9] flex flex-col p-2 select-none shrink-0">
          <div className="font-bold text-gray-700 mb-1.5 flex items-center justify-between">
            <span>Desktop Notes ({notes.length})</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            <div
              onClick={handleCreateNew}
              className={`p-1.5 rounded-xs cursor-pointer border flex items-center gap-1.5 ${
                selectedNoteId === 'new'
                  ? 'bg-[#316ac5] text-white border-[#002266]'
                  : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-800'
              }`}
            >
              <Plus size={12} />
              <span className="font-bold truncate">+ Draft New Note</span>
            </div>

            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => handleSelectExisting(note)}
                className={`p-1.5 rounded-xs cursor-pointer border flex flex-col gap-0.5 ${
                  selectedNoteId === note.id
                    ? 'bg-[#316ac5] text-white border-[#002266]'
                    : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold truncate">{note.authorNote || 'Sticky Note'}</span>
                  <div
                    className="w-2.5 h-2.5 rounded-full border border-black/20"
                    style={{
                      backgroundColor: COLOR_OPTIONS.find((c) => c.id === note.color)?.bg || '#fcf08a',
                    }}
                  />
                </div>
                <div className="text-[9.5px] truncate opacity-80">{note.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Customizer & Visual Preview Canvas */}
        <div className="flex-1 flex flex-col bg-[#e0dcc8] p-3 overflow-y-auto">
          {/* Controls Header */}
          <div className="bg-white p-2 rounded-xs border border-[#7f9db9] mb-3 flex flex-wrap items-center justify-between gap-2 shadow-xs">
            {/* Note Title Input */}
            <div className="flex items-center gap-2">
              <label className="font-bold text-gray-700 text-[10.5px]">Header Title:</label>
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => {
                  playKeyClick();
                  setDraftTitle(e.target.value);
                }}
                className="bg-white border border-[#7f9db9] px-2 py-0.5 text-[11px] rounded-xs outline-none w-44"
              />
            </div>

            {/* Color Swatches */}
            <div className="flex items-center gap-1.5">
              <label className="font-bold text-gray-700 text-[10.5px] flex items-center gap-1">
                <Palette size={12} />
                <span>Paper:</span>
              </label>
              <div className="flex gap-1">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      playMouseClick();
                      setDraftColor(c.id);
                    }}
                    title={c.label}
                    className={`w-5 h-5 rounded-xs border-2 cursor-pointer transition-transform ${
                      draftColor === c.id ? 'border-black scale-110 shadow-xs' : 'border-gray-400 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.bg }}
                  />
                ))}
              </div>
            </div>

            {/* Font Style */}
            <div className="flex items-center gap-1.5">
              <label className="font-bold text-gray-700 text-[10.5px] flex items-center gap-1">
                <Type size={12} />
                <span>Font:</span>
              </label>
              <select
                value={draftFont}
                onChange={(e) => {
                  playMouseClick();
                  setDraftFont(e.target.value as any);
                }}
                className="bg-white border border-[#7f9db9] px-1 py-0.5 text-[10.5px] rounded-xs outline-none cursor-pointer"
              >
                <option value="handwritten">Marker Pen (Classic)</option>
                <option value="tahoma">Tahoma (Windows XP)</option>
                <option value="terminal">Terminal Monospace</option>
                <option value="comic">Casual Comic</option>
              </select>
            </div>
          </div>

          {/* Realistic Live Sticky Note Canvas */}
          <div className="flex-1 flex items-center justify-center p-4 bg-[#c8c4b0] rounded-xs border border-[#a09c88] shadow-inner relative overflow-hidden">
            {/* Background grid guide */}
            <div
              className="w-[280px] sm:w-[320px] rounded-sm overflow-hidden flex flex-col shadow-2xl transition-all"
              style={{
                backgroundColor: selectedTheme.bg,
                border: `1px solid ${selectedTheme.border}`,
                color: selectedTheme.text,
              }}
            >
              {/* Note Header / Strip */}
              <div
                className="h-7 px-3 flex items-center justify-between border-b border-black/10 select-none"
                style={{ backgroundColor: selectedTheme.strip }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600 border border-black/30 shadow-xs" />
                  <span className="font-mono text-[10.5px] font-bold uppercase tracking-tight">
                    {draftTitle || 'Post-it® Note'}
                  </span>
                </div>
                <span className="text-[9px] font-mono opacity-60">Cabin 04</span>
              </div>

              {/* Editable Text Area */}
              <div className="p-3 flex-1 flex flex-col">
                <textarea
                  value={draftText}
                  onChange={(e) => {
                    playKeyClick();
                    setDraftText(e.target.value);
                  }}
                  placeholder="Write your note here..."
                  className={`w-full h-44 bg-transparent border-none outline-none resize-none p-0 select-text leading-relaxed ${
                    draftFont === 'handwritten'
                      ? 'font-handwritten text-[20px]'
                      : draftFont === 'terminal'
                      ? 'font-terminal text-[13px]'
                      : draftFont === 'comic'
                      ? 'font-sans font-medium text-[13px]'
                      : 'font-tahoma text-[12.5px]'
                  }`}
                  style={{ color: selectedTheme.text }}
                />

                {/* Footer status */}
                <div className="flex justify-between items-center pt-2 border-t border-black/10 text-[9.5px] opacity-60 font-mono">
                  <span>{draftText.length} characters</span>
                  <span>Pinned to Screen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d4d0c8] px-2 py-0.5 flex justify-between text-[10px] text-gray-600 select-none">
        <span>Windows Sticky Notes Utility (Cabin 04 Edition)</span>
        <span>Local Disk (C:) \ My Documents \ Notes</span>
      </div>
    </div>
  );
};
