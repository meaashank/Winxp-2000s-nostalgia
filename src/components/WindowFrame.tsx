import React, { useRef } from 'react';
import { WindowInstance } from '../types';
import { playMouseClick } from '../utils/audio';
import { Minus, Square, X } from 'lucide-react';

interface WindowFrameProps {
  instance: WindowInstance;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onUpdatePosition: (x: number, y: number) => void;
  onUpdateSize?: (width: number, height: number) => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  instance,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onUpdatePosition,
  children,
}) => {
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);

  if (!instance.isOpen || instance.isMinimized) {
    return null;
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    onFocus();
    // Only drag from titlebar, not from titlebar buttons
    if ((e.target as HTMLElement).closest('button')) return;

    if (instance.isMaximized) return;

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: instance.position.x,
      initY: instance.position.y,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragRef.current) return;
      const dx = moveEvent.clientX - dragRef.current.startX;
      const dy = moveEvent.clientY - dragRef.current.startY;
      onUpdatePosition(
        Math.max(-50, Math.min(window.innerWidth - 100, dragRef.current.initX + dx)),
        Math.max(0, Math.min(window.innerHeight - 80, dragRef.current.initY + dy))
      );
    };

    const handlePointerUp = () => {
      dragRef.current = null;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const style: React.CSSProperties = instance.isMaximized
    ? {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 60, // Above taskbar (z-40) and desktop (z-10) for true fullscreen immersion
        borderRadius: 0,
        borderWidth: '2px',
      }
    : {
        position: 'absolute',
        left: `${instance.position.x}px`,
        top: `${instance.position.y}px`,
        width: `${instance.size.width}px`,
        height: `${instance.size.height}px`,
        zIndex: instance.zIndex,
        borderWidth: '3px',
      };

  return (
    <div
      id={`window-${instance.id}`}
      onMouseDown={onFocus}
      className={`flex flex-col select-none transition-all overflow-hidden ${
        instance.isMaximized ? 'rounded-none border-[#0055ea]' : 'rounded-t-[7px]'
      } ${
        isActive
          ? 'shadow-[0_8px_24px_rgba(0,0,0,0.6),0_2px_6px_rgba(0,0,0,0.4)] border-[#0055ea]'
          : 'shadow-[0_4px_14px_rgba(0,0,0,0.4)] border-[#7f9db9]'
      }`}
      style={{
        ...style,
        borderStyle: 'solid',
      }}
    >
      {/* Windows XP Title Bar (Luna Blue Gradient) */}
      <div
        onPointerDown={handlePointerDown}
        onDoubleClick={onMaximize}
        className={`h-[28px] px-2 flex items-center justify-between cursor-move text-white font-bold text-[12px] tracking-wide relative overflow-hidden select-none ${
          isActive
            ? 'bg-gradient-to-r from-[#0058ee] via-[#3593ff] to-[#0058ee]'
            : 'bg-gradient-to-r from-[#7697d9] via-[#8faadc] to-[#7697d9]'
        }`}
        style={{
          textShadow: '1px 1px 1px #000000',
        }}
      >
        {/* Left side: Icon + Title */}
        <div className="flex items-center gap-1.5 truncate pr-2">
          <span className="text-[14px] leading-none select-none">{instance.icon}</span>
          <span className="truncate font-tahoma text-[11.5px]">{instance.title}</span>
        </div>

        {/* Right side: XP Minimize / Maximize / Close Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Minimize */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playMouseClick();
              onMinimize();
            }}
            className="w-[21px] h-[21px] rounded-[3px] bg-[#0055ea] hover:brightness-110 active:brightness-90 border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center cursor-pointer text-white"
            title="Minimize"
          >
            <Minus size={11} strokeWidth={3} className="mt-1" />
          </button>

          {/* Maximize / Restore */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playMouseClick();
              onMaximize();
            }}
            className="w-[21px] h-[21px] rounded-[3px] bg-[#0055ea] hover:brightness-110 active:brightness-90 border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center cursor-pointer text-white"
            title={instance.isMaximized ? 'Restore' : 'Maximize'}
          >
            <Square size={10} strokeWidth={2.5} />
          </button>

          {/* Close Button (Red XP button) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playMouseClick();
              onClose();
            }}
            className="w-[21px] h-[21px] rounded-[3px] bg-[#e81123] hover:bg-[#f23b49] active:bg-[#bf0e1c] border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center cursor-pointer text-white"
            title="Close"
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Window Content Container */}
      <div className="flex-1 bg-[#ece9d8] overflow-hidden flex flex-col relative">
        {children}
      </div>
    </div>
  );
};
