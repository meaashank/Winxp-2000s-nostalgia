import React, { useState, useRef } from 'react';
import { StickyNote } from '../types';
import { playKeyClick, playMouseClick } from '../utils/audio';
import { Plus, X, Pin, Palette, CornerDownRight } from 'lucide-react';

interface StickyNotesProps {
  notes: StickyNote[];
  onUpdateNote: (id: string, updates: Partial<StickyNote>) => void;
  onDeleteNote: (id: string) => void;
  onAddNote: () => void;
  onBringToFront: (id: string) => void;
}

const COLOR_MAP = {
  yellow: {
    bg: '#fcf08a',
    strip: '#f0df68',
    border: '#ded058',
    text: '#222222',
    pin: '#e53e3e',
  },
  pink: {
    bg: '#ffd2e1',
    strip: '#f8b9cf',
    border: '#e49ab4',
    text: '#2d1420',
    pin: '#3182ce',
  },
  cyan: {
    bg: '#d2f3ff',
    strip: '#bae4f4',
    border: '#9ecde0',
    text: '#0b2633',
    pin: '#dd6b20',
  },
  green: {
    bg: '#daf7ce',
    strip: '#c2e9b0',
    border: '#a4d48f',
    text: '#172e0d',
    pin: '#805ad5',
  },
  orange: {
    bg: '#ffe0b8',
    strip: '#f8cc96',
    border: '#e2af70',
    text: '#3b2207',
    pin: '#319795',
  },
};

export const StickyNotes: React.FC<StickyNotesProps> = ({
  notes,
  onUpdateNote,
  onDeleteNote,
  onAddNote,
  onBringToFront,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const dragRef = useRef<{ id: string; startX: number; startY: number; initX: number; initY: number } | null>(null);

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    // Only drag when interacting with the top strip or border
    if ((e.target as HTMLElement).tagName === 'TEXTAREA' || (e.target as HTMLElement).tagName === 'BUTTON') {
      return;
    }
    onBringToFront(id);
    playMouseClick();

    const note = notes.find((n) => n.id === id);
    if (!note) return;

    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      initX: note.position.x,
      initY: note.position.y,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragRef.current) return;
      const dx = moveEvent.clientX - dragRef.current.startX;
      const dy = moveEvent.clientY - dragRef.current.startY;
      onUpdateNote(dragRef.current.id, {
        position: {
          x: Math.max(10, Math.min(window.innerWidth - 180, dragRef.current.initX + dx)),
          y: Math.max(10, Math.min(window.innerHeight - 150, dragRef.current.initY + dy)),
        },
      });
    };

    const handlePointerUp = () => {
      dragRef.current = null;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const cycleColor = (note: StickyNote, e: React.MouseEvent) => {
    e.stopPropagation();
    playMouseClick();
    const colors: ('yellow' | 'pink' | 'cyan' | 'green' | 'orange')[] = ['yellow', 'pink', 'cyan', 'green', 'orange'];
    const nextIdx = (colors.indexOf(note.color) + 1) % colors.length;
    onUpdateNote(note.id, { color: colors[nextIdx] });
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {notes.map((note) => {
        const theme = COLOR_MAP[note.color] || COLOR_MAP.yellow;
        const isEditing = editingId === note.id;

        return (
          <div
            key={note.id}
            id={`sticky-note-${note.id}`}
            onPointerDown={(e) => handlePointerDown(note.id, e)}
            onClick={() => onBringToFront(note.id)}
            className="absolute pointer-events-auto select-none transition-shadow group"
            style={{
              left: `${note.position.x}px`,
              top: `${note.position.y}px`,
              width: '230px',
              minHeight: '190px',
              transform: `rotate(${note.rotation}deg)`,
              zIndex: note.zIndex,
              boxShadow: '2px 4px 10px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0,0,0,0.3)',
            }}
          >
            {/* Realistic Push Pin / Tape Mark */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
              <div
                className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-md flex items-center justify-center"
                style={{ backgroundColor: theme.pin }}
              >
                <div className="w-1 h-1 rounded-full bg-white/70" />
              </div>
            </div>

            {/* Note Container */}
            <div
              className="w-full h-full flex flex-col rounded-sm overflow-hidden"
              style={{
                backgroundColor: theme.bg,
                border: `1px solid ${theme.border}`,
                color: theme.text,
              }}
            >
              {/* Top Sticky Adhesive Strip (Draggable Header) */}
              <div
                className="h-6.5 w-full flex items-center justify-between px-2 cursor-grab active:cursor-grabbing border-b border-black/10"
                style={{ backgroundColor: theme.strip }}
              >
                <div className="flex items-center gap-1 opacity-70">
                  <span className="text-[10px] font-mono tracking-tighter uppercase font-bold">
                    {note.authorNote || 'Post-it® Note'}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  {/* Color Cycle Button */}
                  <button
                    type="button"
                    onClick={(e) => cycleColor(note, e)}
                    title="Change color"
                    className="p-0.5 hover:bg-black/10 rounded cursor-pointer transition-colors"
                  >
                    <Palette size={11} />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playMouseClick();
                      onDeleteNote(note.id);
                    }}
                    title="Remove note"
                    className="p-0.5 hover:bg-black/10 rounded cursor-pointer transition-colors"
                  >
                    <X size={11} />
                  </button>
                </div>
              </div>

              {/* Note Body with Authentic Handwriting / Type */}
              <div className="p-2.5 flex-1 flex flex-col justify-between">
                {isEditing ? (
                  <textarea
                    autoFocus
                    value={note.text}
                    onBlur={() => setEditingId(null)}
                    onChange={(e) => {
                      playKeyClick();
                      onUpdateNote(note.id, { text: e.target.value });
                    }}
                    className="w-full h-32 bg-transparent resize-none border-none outline-none font-handwritten text-[18px] leading-snug p-0 select-text"
                    style={{ color: theme.text }}
                  />
                ) : (
                  <div
                    onClick={() => {
                      setEditingId(note.id);
                      playMouseClick();
                    }}
                    className="w-full h-full font-handwritten text-[18px] leading-snug whitespace-pre-wrap cursor-text"
                    style={{ color: theme.text }}
                  >
                    {note.text}
                  </div>
                )}

                {/* Bottom Dog-ear corner fold effect */}
                <div className="flex justify-between items-end pt-2 text-[9px] opacity-40 font-mono">
                  <span>Cabin 04</span>
                  <CornerDownRight size={10} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
