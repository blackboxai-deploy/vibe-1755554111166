"use client";

import React from 'react';
import { GameTile } from './GameTile';
import { cn } from '@/lib/utils';

export type TileState = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

export interface GameBoardProps {
  guesses: string[];
  currentGuess: string;
  currentRow: number;
  solution: string;
  gameStatus: 'playing' | 'won' | 'lost';
  isRevealing: boolean;
  invalidGuess: boolean;
}

export function GameBoard({
  guesses,
  currentGuess,
  currentRow,
  solution,
  gameStatus,
  isRevealing,
  invalidGuess
}: GameBoardProps) {
  const ROWS = 6;
  const COLS = 5;

  const getTileState = (rowIndex: number, colIndex: number): TileState => {
    const guess = guesses[rowIndex];
    
    if (!guess) return 'empty';
    
    const letter = guess[colIndex];
    if (!letter) return 'empty';
    
    if (rowIndex < currentRow) {
      // Completed row - check against solution
      if (solution[colIndex] === letter) {
        return 'correct';
      } else if (solution.includes(letter)) {
        // Check if this position should be yellow
        // Count occurrences to handle duplicate letters correctly
        const letterCount = solution.split('').filter(l => l === letter).length;
        const correctPositions = guess.split('').filter((l, i) => l === letter && solution[i] === letter).length;
        const yellowPositions = guess.split('').slice(0, colIndex).filter((l, i) => l === letter && solution[i] !== letter).length;
        
        if (yellowPositions < letterCount - correctPositions) {
          return 'present';
        }
        return 'absent';
      } else {
        return 'absent';
      }
    } else if (rowIndex === currentRow) {
      // Current row
      return 'filled';
    }
    
    return 'empty';
  };

  const getTileLetter = (rowIndex: number, colIndex: number): string => {
    if (rowIndex < currentRow) {
      return guesses[rowIndex]?.[colIndex] || '';
    } else if (rowIndex === currentRow) {
      return currentGuess[colIndex] || '';
    }
    return '';
  };

  const getRowDelay = (rowIndex: number): number => {
    if (rowIndex === currentRow - 1 && isRevealing) {
      return 0;
    }
    return 0;
  };

  const getTileDelay = (rowIndex: number, colIndex: number): number => {
    if (rowIndex === currentRow - 1 && isRevealing) {
      return colIndex * 100;
    }
    return 0;
  };

  return (
    <div className="grid grid-rows-6 gap-1 p-4 w-full max-w-sm mx-auto">
      {Array.from({ length: ROWS }, (_, rowIndex) => (
        <div
          key={rowIndex}
          className={cn(
            "grid grid-cols-5 gap-1",
            invalidGuess && rowIndex === currentRow && "animate-pulse"
          )}
          style={{
            animationDelay: `${getRowDelay(rowIndex)}ms`
          }}
        >
          {Array.from({ length: COLS }, (_, colIndex) => (
            <GameTile
              key={`${rowIndex}-${colIndex}`}
              letter={getTileLetter(rowIndex, colIndex)}
              state={getTileState(rowIndex, colIndex)}
              position={colIndex}
              delay={getTileDelay(rowIndex, colIndex)}
              isRevealing={isRevealing && rowIndex === currentRow - 1}
              isInvalid={invalidGuess && rowIndex === currentRow}
            />
          ))}
        </div>
      ))}
    </div>
  );
}