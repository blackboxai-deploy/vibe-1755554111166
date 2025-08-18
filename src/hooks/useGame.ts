import { useState, useEffect, useCallback } from 'react';
import { getRandomWord, isValidWord, checkGuess } from '@/lib/gameLogic';
import { useLocalStorage } from './useLocalStorage';

export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface GameTile {
  letter: string;
  state: LetterState;
}

export interface GameState {
  solution: string;
  guesses: GameTile[][];
  currentGuess: string;
  currentRow: number;
  gameStatus: 'playing' | 'won' | 'lost';
  isRevealing: boolean;
  lastCompletedTs: number | null;
  lastPlayedTs: number | null;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  guessDistribution: number[];
}

const GAME_STATE_KEY = 'wordle-game-state';
const GAME_STATS_KEY = 'wordle-game-stats';

const initialGameState: GameState = {
  solution: '',
  guesses: Array(6).fill(null).map(() => Array(5).fill({ letter: '', state: 'empty' })),
  currentGuess: '',
  currentRow: 0,
  gameStatus: 'playing',
  isRevealing: false,
  lastCompletedTs: null,
  lastPlayedTs: null,
};

const initialStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
};

export const useGame = () => {
  const [gameState, setGameState] = useLocalStorage<GameState>(GAME_STATE_KEY, initialGameState);
  const [stats, setStats] = useLocalStorage<GameStats>(GAME_STATS_KEY, initialStats);
  const [showInvalidWord, setShowInvalidWord] = useState(false);

  const isGameComplete = gameState.gameStatus !== 'playing';
  const canSubmit = gameState.currentGuess.length === 5 && !gameState.isRevealing;

  const startNewGame = useCallback(() => {
    const newSolution = getRandomWord();
    setGameState({
      ...initialGameState,
      solution: newSolution,
      lastPlayedTs: Date.now(),
    });
  }, [setGameState]);

  const addLetter = useCallback((letter: string) => {
    if (gameState.currentGuess.length < 5 && gameState.gameStatus === 'playing' && !gameState.isRevealing) {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess + letter.toUpperCase(),
      }));
    }
  }, [gameState.currentGuess.length, gameState.gameStatus, gameState.isRevealing, setGameState]);

  const deleteLetter = useCallback(() => {
    if (gameState.currentGuess.length > 0 && !gameState.isRevealing) {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1),
      }));
    }
  }, [gameState.currentGuess.length, gameState.isRevealing, setGameState]);

  const submitGuess = useCallback(async () => {
    if (!canSubmit) return;

    if (!isValidWord(gameState.currentGuess)) {
      setShowInvalidWord(true);
      setTimeout(() => setShowInvalidWord(false), 1000);
      return;
    }

    setGameState(prev => ({ ...prev, isRevealing: true }));

    // Simulate reveal animation delay
    setTimeout(() => {
      const guessResult = checkGuess(gameState.currentGuess, gameState.solution);
      const newGuesses = [...gameState.guesses];
      newGuesses[gameState.currentRow] = guessResult;

      const isWin = gameState.currentGuess === gameState.solution;
      const isLoss = gameState.currentRow === 5 && !isWin;
      
      let newGameStatus: 'playing' | 'won' | 'lost' = 'playing';
      if (isWin) newGameStatus = 'won';
      else if (isLoss) newGameStatus = 'lost';

      const newState: GameState = {
        ...gameState,
        guesses: newGuesses,
        currentGuess: '',
        currentRow: gameState.currentRow + 1,
        gameStatus: newGameStatus,
        isRevealing: false,
        lastCompletedTs: (isWin || isLoss) ? Date.now() : gameState.lastCompletedTs,
      };

      setGameState(newState);

      // Update stats if game is complete
      if (isWin || isLoss) {
        setStats(prevStats => {
          const newStats = { ...prevStats };
          newStats.gamesPlayed += 1;
          
          if (isWin) {
            newStats.gamesWon += 1;
            newStats.currentStreak += 1;
            newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak);
            newStats.guessDistribution[gameState.currentRow] += 1;
          } else {
            newStats.currentStreak = 0;
          }
          
          return newStats;
        });
      }
    }, 1500);
  }, [canSubmit, gameState, setGameState, setStats]);

  const getKeyboardLetterState = useCallback((letter: string): LetterState => {
    const upperLetter = letter.toUpperCase();
    let hasCorrect = false;
    let hasPresent = false;
    let hasAbsent = false;
    
    for (const guess of gameState.guesses) {
      for (const tile of guess) {
        if (tile.letter === upperLetter) {
          if (tile.state === 'correct') hasCorrect = true;
          else if (tile.state === 'present') hasPresent = true;
          else if (tile.state === 'absent') hasAbsent = true;
        }
      }
    }
    
    // Return the highest priority state found
    if (hasCorrect) return 'correct';
    if (hasPresent) return 'present';
    if (hasAbsent) return 'absent';
    return 'empty';
  }, [gameState.guesses]);

  const resetStats = useCallback(() => {
    setStats(initialStats);
  }, [setStats]);

  const shareResults = useCallback(() => {
    if (!isGameComplete) return '';

    const guessCount = gameState.gameStatus === 'won' ? gameState.currentRow : 'X';
    let shareText = `Wordle ${guessCount}/6\n\n`;

    for (let i = 0; i < gameState.currentRow; i++) {
      const guess = gameState.guesses[i];
      let row = '';
      for (const tile of guess) {
        if (tile.state === 'correct') row += '🟩';
        else if (tile.state === 'present') row += '🟨';
        else row += '⬜';
      }
      shareText += row + '\n';
    }

    return shareText.trim();
  }, [isGameComplete, gameState]);

  // Initialize game on first load
  useEffect(() => {
    if (!gameState.solution) {
      startNewGame();
    }
  }, [gameState.solution, startNewGame]);

  // Check if it's a new day and reset game
  useEffect(() => {
    const now = new Date();
    const lastPlayed = gameState.lastPlayedTs ? new Date(gameState.lastPlayedTs) : null;
    
    if (lastPlayed && 
        (now.getDate() !== lastPlayed.getDate() || 
         now.getMonth() !== lastPlayed.getMonth() || 
         now.getFullYear() !== lastPlayed.getFullYear())) {
      startNewGame();
    }
  }, [gameState.lastPlayedTs, startNewGame]);

  return {
    gameState,
    stats,
    showInvalidWord,
    isGameComplete,
    canSubmit,
    addLetter,
    deleteLetter,
    submitGuess,
    startNewGame,
    getKeyboardLetterState,
    resetStats,
    shareResults,
  };
};