import React, { useRef, useState, useEffect } from 'react';
import { playMouseClick } from '../../utils/audio';
import { Pencil, Eraser, Trash2, Palette } from 'lucide-react';

const COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
];

export const PaintApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : selectedColor;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 4 : brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    playMouseClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#ece9d8] text-[#111] font-tahoma text-[11px] select-none">
      {/* Menu Bar */}
      <div className="bg-[#ece9d8] px-2 py-0.5 border-b border-[#d4d0c8] flex items-center gap-3 text-[11px]">
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">File</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Edit</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Image</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Colors</span>
      </div>

      <div className="flex-1 flex overflow-hidden p-1 gap-1">
        {/* Left Tool Palette */}
        <div className="w-16 bg-[#d4d0c8] border border-[#808080] p-1 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => {
              playMouseClick();
              setTool('pencil');
            }}
            className={`p-1 flex items-center justify-center border ${
              tool === 'pencil' ? 'bg-[#b0b0b0] border-[#404040]' : 'bg-[#e0e0e0] border-white'
            }`}
            title="Pencil"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              playMouseClick();
              setTool('eraser');
            }}
            className={`p-1 flex items-center justify-center border ${
              tool === 'eraser' ? 'bg-[#b0b0b0] border-[#404040]' : 'bg-[#e0e0e0] border-white'
            }`}
            title="Eraser"
          >
            <Eraser size={14} />
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            className="p-1 flex items-center justify-center border bg-[#e0e0e0] border-white hover:bg-red-100"
            title="Clear"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-[#808080] p-2 overflow-auto flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={480}
            height={320}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="bg-white border-2 border-black cursor-crosshair shadow-md"
          />
        </div>
      </div>

      {/* Bottom Color Palette */}
      <div className="bg-[#d4d0c8] border-t border-[#808080] p-1 flex items-center gap-2">
        <div className="w-6 h-6 border-2 border-black shadow-inner" style={{ backgroundColor: selectedColor }} />
        <div className="grid grid-cols-8 gap-1">
          {COLORS.map((c) => (
            <div
              key={c}
              onClick={() => {
                playMouseClick();
                setSelectedColor(c);
                if (tool === 'eraser') setTool('pencil');
              }}
              className="w-4 h-4 border border-black cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
