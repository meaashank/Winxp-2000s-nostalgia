import React, { useState, useEffect } from 'react';
import { playMouseClick, playWindowsError, playWindowsBalloon } from '../../utils/audio';

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isOpen: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

const ROWS = 9;
const COLS = 9;
const MINES = 10;

export const MinesweeperApp: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [faceState, setFaceState] = useState<'happy' | 'gasp' | 'cool' | 'dead'>('happy');
  const [mineCount, setMineCount] = useState(MINES);
  const [timer, setTimer] = useState(0);

  // Initialize board
  const initBoard = () => {
    const newGrid: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          row: r,
          col: c,
          isMine: false,
          isOpen: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      newGrid.push(row);
    }

    // Place mines randomly
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newGrid[nr][nc].isMine) {
                count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }

    setGrid(newGrid);
    setGameState('idle');
    setFaceState('happy');
    setMineCount(MINES);
    setTimer(0);
  };

  useEffect(() => {
    initBoard();
  }, []);

  useEffect(() => {
    let interval: number;
    if (gameState === 'playing') {
      interval = window.setInterval(() => {
        setTimer((t) => Math.min(999, t + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const revealCell = (r: number, c: number) => {
    if (gameState === 'won' || gameState === 'lost') return;
    const cell = grid[r][c];
    if (cell.isFlagged || cell.isOpen) return;

    playMouseClick();

    if (gameState === 'idle') {
      setGameState('playing');
    }

    const nextGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    if (cell.isMine) {
      // Hit a mine! Game Over
      playWindowsError();
      setGameState('lost');
      setFaceState('dead');
      // Reveal all mines
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          if (nextGrid[i][j].isMine) {
            nextGrid[i][j].isOpen = true;
          }
        }
      }
      setGrid(nextGrid);
      return;
    }

    // Flood fill zero neighbor mines
    const queue: [number, number][] = [[r, c]];
    nextGrid[r][c].isOpen = true;

    while (queue.length > 0) {
      const [currR, currC] = queue.shift()!;
      if (nextGrid[currR][currC].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (
              nr >= 0 &&
              nr < ROWS &&
              nc >= 0 &&
              nc < COLS &&
              !nextGrid[nr][nc].isOpen &&
              !nextGrid[nr][nc].isFlagged &&
              !nextGrid[nr][nc].isMine
            ) {
              nextGrid[nr][nc].isOpen = true;
              if (nextGrid[nr][nc].neighborMines === 0) {
                queue.push([nr, nc]);
              }
            }
          }
        }
      }
    }

    // Check Win
    let unrevealedSafeCells = 0;
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (!nextGrid[i][j].isMine && !nextGrid[i][j].isOpen) {
          unrevealedSafeCells++;
        }
      }
    }

    if (unrevealedSafeCells === 0) {
      playWindowsBalloon();
      setGameState('won');
      setFaceState('cool');
    }

    setGrid(nextGrid);
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState === 'won' || gameState === 'lost') return;
    const cell = grid[r][c];
    if (cell.isOpen) return;

    playMouseClick();
    const nextGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    const newFlag = !cell.isFlagged;
    nextGrid[r][c].isFlagged = newFlag;
    setMineCount((prev) => (newFlag ? prev - 1 : prev + 1));
    setGrid(nextGrid);
  };

  const getNumberColor = (num: number) => {
    switch (num) {
      case 1: return '#0000ff';
      case 2: return '#008000';
      case 3: return '#ff0000';
      case 4: return '#000080';
      case 5: return '#800000';
      case 6: return '#008080';
      case 7: return '#000000';
      case 8: return '#808080';
      default: return 'transparent';
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#c0c0c0] p-3 select-none">
      {/* Outer Classic Sunken Frame */}
      <div className="p-2 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-md">
        {/* Scoreboard Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-[#c0c0c0] border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white">
          {/* 3-digit Red LED Mine Counter */}
          <div className="bg-black text-red-600 font-pixel text-2xl px-2 py-0.5 border border-[#808080]">
            {String(Math.max(-99, mineCount)).padStart(3, '0')}
          </div>

          {/* Smiley Reset Face */}
          <button
            type="button"
            onClick={initBoard}
            className="w-7 h-7 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] active:border-t-2 active:border-l-2 active:border-[#808080] active:border-b-2 active:border-r-2 active:border-white flex items-center justify-center text-base cursor-pointer"
          >
            {faceState === 'happy' && '🙂'}
            {faceState === 'gasp' && '😮'}
            {faceState === 'cool' && '😎'}
            {faceState === 'dead' && '😵'}
          </button>

          {/* 3-digit Red LED Timer */}
          <div className="bg-black text-red-600 font-pixel text-2xl px-2 py-0.5 border border-[#808080]">
            {String(timer).padStart(3, '0')}
          </div>
        </div>

        {/* 9x9 Minefield Matrix */}
        <div className="border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white p-1 bg-[#808080]">
          <div
            className="grid gap-[1px] bg-[#808080]"
            style={{ gridTemplateColumns: `repeat(${COLS}, 22px)` }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  onMouseDown={() => {
                    if (gameState !== 'won' && gameState !== 'lost' && !cell.isOpen) {
                      setFaceState('gasp');
                    }
                  }}
                  onMouseUp={() => {
                    if (gameState !== 'won' && gameState !== 'lost') {
                      setFaceState('happy');
                    }
                  }}
                  onClick={() => revealCell(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  className={`w-[22px] h-[22px] flex items-center justify-center font-bold text-[12px] cursor-pointer ${
                    cell.isOpen
                      ? 'bg-[#c0c0c0] border border-[#808080]'
                      : 'bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] active:border-[#808080]'
                  }`}
                >
                  {cell.isOpen ? (
                    cell.isMine ? (
                      '💣'
                    ) : cell.neighborMines > 0 ? (
                      <span style={{ color: getNumberColor(cell.neighborMines) }}>
                        {cell.neighborMines}
                      </span>
                    ) : (
                      ''
                    )
                  ) : cell.isFlagged ? (
                    '🚩'
                  ) : (
                    ''
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
