import React, { useState, useEffect } from 'react';
import { playMouseClick, playWindowsError, playWindowsBalloon } from '../../utils/audio';
import { Trophy, RotateCcw, Award, Check } from 'lucide-react';

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isOpen: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

interface ScoreEntry {
  id: string;
  name: string;
  time: number;
  date: string;
}

const ROWS = 9;
const COLS = 9;
const MINES = 10;
const STORAGE_KEY = 'minesweeper_top5_scores_2004';

const DEFAULT_SCORES: ScoreEntry[] = [
  { id: '1', name: 'xX_Sniper_Xx', time: 14, date: '08/10/2004' },
  { id: '2', name: 'Neo_Matrix', time: 19, date: '08/12/2004' },
  { id: '3', name: 'Admin_Cabin01', time: 27, date: '08/14/2004' },
  { id: '4', name: 'Kougra_Fan', time: 38, date: '08/15/2004' },
  { id: '5', name: 'Dragon_Slayer', time: 49, date: '08/15/2004' },
];

export const MinesweeperApp: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [faceState, setFaceState] = useState<'happy' | 'gasp' | 'cool' | 'dead'>('happy');
  const [mineCount, setMineCount] = useState(MINES);
  const [timer, setTimer] = useState(0);

  // Leaderboard state
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [playerNameInput, setPlayerNameInput] = useState('Cabin04 Guest');
  const [recordedWinTime, setRecordedWinTime] = useState<number | null>(null);

  // Load scores from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setScores(JSON.parse(stored));
      } else {
        setScores(DEFAULT_SCORES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SCORES));
      }
    } catch {
      setScores(DEFAULT_SCORES);
    }
  }, []);

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
    setIsNewHighScore(false);
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

  const handleWin = (finalTime: number) => {
    playWindowsBalloon();
    setGameState('won');
    setFaceState('cool');
    setRecordedWinTime(finalTime);

    const qualifiesForTop5 =
      scores.length < 5 || finalTime < scores[scores.length - 1].time;

    setIsNewHighScore(qualifiesForTop5);
    setShowLeaderboard(true);
  };

  const saveScoreAndClose = () => {
    if (recordedWinTime !== null && isNewHighScore) {
      const dateStr = new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
      const newEntry: ScoreEntry = {
        id: String(Date.now()),
        name: playerNameInput.trim() || 'Anonymous Sweeper',
        time: recordedWinTime,
        date: dateStr,
      };

      const updated = [...scores, newEntry]
        .sort((a, b) => a.time - b.time)
        .slice(0, 5);

      setScores(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save to localStorage', err);
      }
    }
    setShowLeaderboard(false);
    setIsNewHighScore(false);
    setRecordedWinTime(null);
  };

  const resetLeaderboard = () => {
    playMouseClick();
    setScores(DEFAULT_SCORES);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SCORES));
    } catch {
      // ignore
    }
  };

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
      handleWin(timer);
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
      case 1:
        return '#0000ff';
      case 2:
        return '#008000';
      case 3:
        return '#ff0000';
      case 4:
        return '#000080';
      case 5:
        return '#800000';
      case 6:
        return '#008080';
      case 7:
        return '#000000';
      case 8:
        return '#808080';
      default:
        return 'transparent';
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between bg-[#ece9d8] select-none font-tahoma relative">
      {/* 2004 Menu Bar */}
      <div className="w-full bg-[#ece9d8] px-2 py-0.5 border-b border-[#d4d0c8] flex items-center justify-between text-[11px] select-none">
        <div className="flex items-center gap-3">
          <span onClick={initBoard} className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">
            Game
          </span>
          <span
            onClick={() => {
              playMouseClick();
              setShowLeaderboard(true);
            }}
            className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer"
          >
            Leaderboard
          </span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Help</span>
        </div>

        {/* Top 5 Leaderboard Quick Button */}
        <button
          type="button"
          onClick={() => {
            playMouseClick();
            setShowLeaderboard(true);
          }}
          className="flex items-center gap-1 px-1.5 py-0.5 bg-[#ece9d8] hover:bg-[#d8d4c4] border border-[#7f9db9] rounded-xs text-[10px] font-bold text-[#002266] cursor-pointer shadow-xs"
        >
          <Trophy size={11} className="text-amber-600" />
          <span>Top 5</span>
        </button>
      </div>

      {/* Main Playing Area */}
      <div className="flex-1 w-full flex items-center justify-center p-3">
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

      {/* Top 5 Leaderboard Dialog Modal */}
      {showLeaderboard && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center p-2 select-none">
          <div className="w-full max-w-[340px] bg-[#ece9d8] border-2 border-[#0055ea] rounded-sm shadow-2xl flex flex-col font-tahoma text-[11px] overflow-hidden">
            {/* Title Bar */}
            <div className="bg-gradient-to-r from-[#0055ea] via-[#3593ff] to-[#0055ea] text-white px-2 py-1 flex items-center justify-between font-bold text-[11.5px] shadow-xs">
              <div className="flex items-center gap-1.5">
                <Trophy size={13} className="text-yellow-300" />
                <span>Fastest Mine Sweepers - Top 5</span>
              </div>
              <button
                type="button"
                onClick={saveScoreAndClose}
                className="w-4 h-4 bg-[#d13438] hover:bg-[#e81123] text-white flex items-center justify-center rounded-xs text-[10px] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-3 space-y-3 bg-[#ece9d8] text-[#111]">
              {/* Winner Congrats Banner if just won */}
              {isNewHighScore && (
                <div className="bg-[#fff9e6] border border-[#f0c36d] p-2 rounded-xs text-[#8a5300] text-[10.5px] space-y-1.5">
                  <div className="font-bold flex items-center gap-1 text-[11px]">
                    <Award size={13} className="text-amber-600" />
                    <span>You swept the board in {recordedWinTime} seconds!</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="font-semibold text-gray-700">Enter Your Handle:</span>
                    <input
                      type="text"
                      maxLength={18}
                      value={playerNameInput}
                      onChange={(e) => setPlayerNameInput(e.target.value)}
                      className="flex-1 bg-white border border-[#7f9db9] px-1.5 py-0.5 text-[10.5px] font-bold text-[#002266] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Leaderboard Table */}
              <div className="bg-white border border-[#7f9db9] rounded-xs overflow-hidden shadow-inner">
                <div className="bg-[#d4e4f8] px-2 py-1 font-bold text-[10px] text-[#002266] grid grid-cols-12 border-b border-[#b0c8e8]">
                  <span className="col-span-2">Rank</span>
                  <span className="col-span-5">Player</span>
                  <span className="col-span-2 text-right">Time</span>
                  <span className="col-span-3 text-right">Date</span>
                </div>

                <div className="divide-y divide-gray-100 text-[10.5px]">
                  {scores.map((entry, index) => {
                    const medals = ['🥇', '🥈', '🥉', '4th', '5th'];
                    return (
                      <div
                        key={entry.id}
                        className={`px-2 py-1 grid grid-cols-12 items-center ${
                          index === 0
                            ? 'bg-amber-50/60 font-bold text-[#002266]'
                            : index % 2 === 1
                            ? 'bg-[#f8f9fc]'
                            : 'bg-white'
                        }`}
                      >
                        <span className="col-span-2 flex items-center gap-1">
                          <span>{medals[index] || `#${index + 1}`}</span>
                        </span>
                        <span className="col-span-5 truncate font-medium">{entry.name}</span>
                        <span className="col-span-2 text-right font-mono font-bold text-red-600">
                          {entry.time}s
                        </span>
                        <span className="col-span-3 text-right text-[9.5px] text-gray-500 font-mono">
                          {entry.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dialog Action Buttons */}
              <div className="flex justify-between items-center pt-1">
                <button
                  type="button"
                  onClick={resetLeaderboard}
                  className="px-2 py-0.5 bg-[#ece9d8] hover:bg-[#d8d4c4] border border-[#7f9db9] rounded-xs text-[10px] text-gray-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={10} />
                  <span>Reset Scores</span>
                </button>

                <button
                  type="button"
                  onClick={saveScoreAndClose}
                  className="px-4 py-1 bg-[#0055ea] hover:bg-[#0044cc] text-white font-bold rounded-xs cursor-pointer shadow-xs border border-[#0033aa] flex items-center gap-1 text-[10.5px]"
                >
                  <Check size={12} />
                  <span>OK</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
