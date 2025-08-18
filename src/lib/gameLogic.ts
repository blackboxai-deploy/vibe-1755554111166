export type LetterState = 'correct' | 'present' | 'absent' | 'empty';
export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  solution: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: GameStatus;
  currentRow: number;
  evaluations: LetterState[][];
  lastCompletedTs: number | null;
  lastPlayedTs: number | null;
  hardMode: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  guessDistribution: { [key: number]: number };
  averageGuesses: number;
}

export const WORD_LENGTH = 5;
export const MAX_CHALLENGES = 6;

export const getEmptyGameState = (solution: string): GameState => ({
  solution,
  guesses: [],
  currentGuess: '',
  gameStatus: 'playing',
  currentRow: 0,
  evaluations: [],
  lastCompletedTs: null,
  lastPlayedTs: Date.now(),
  hardMode: false,
});

export const getEmptyStats = (): GameStats => ({
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  averageGuesses: 0,
});

export const evaluateGuess = (guess: string, solution: string): LetterState[] => {
  const result: LetterState[] = new Array(WORD_LENGTH).fill('absent');
  const solutionChars = solution.split('');
  const guessChars = guess.split('');

  // First pass: mark correct letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === solutionChars[i]) {
      result[i] = 'correct';
      solutionChars[i] = '';
      guessChars[i] = '';
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] && solutionChars.includes(guessChars[i])) {
      result[i] = 'present';
      const index = solutionChars.indexOf(guessChars[i]);
      solutionChars[index] = '';
    }
  }

  return result;
};

export const getKeyboardState = (evaluations: LetterState[][], guesses: string[]): { [key: string]: LetterState } => {
  const keyboardState: { [key: string]: LetterState } = {};

  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i];
    const evaluation = evaluations[i];

    for (let j = 0; j < guess.length; j++) {
      const letter = guess[j];
      const state = evaluation[j];

      if (!keyboardState[letter] || 
          (keyboardState[letter] === 'absent' && state !== 'absent') ||
          (keyboardState[letter] === 'present' && state === 'correct')) {
        keyboardState[letter] = state;
      }
    }
  }

  return keyboardState;
};

export const isValidHardModeGuess = (guess: string, guesses: string[], evaluations: LetterState[][]): boolean => {
  if (guesses.length === 0) return true;

  const lastGuess = guesses[guesses.length - 1];
  const lastEvaluation = evaluations[evaluations.length - 1];

  // Check that all correct letters are in the same position
  for (let i = 0; i < lastEvaluation.length; i++) {
    if (lastEvaluation[i] === 'correct' && guess[i] !== lastGuess[i]) {
      return false;
    }
  }

  // Check that all present letters are included somewhere
  for (let i = 0; i < lastEvaluation.length; i++) {
    if (lastEvaluation[i] === 'present' && !guess.includes(lastGuess[i])) {
      return false;
    }
  }

  return true;
};

export const updateStats = (stats: GameStats, gameWon: boolean, guessCount: number): GameStats => {
  const newStats = { ...stats };
  
  newStats.gamesPlayed += 1;
  
  if (gameWon) {
    newStats.gamesWon += 1;
    newStats.currentStreak += 1;
    newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak);
    newStats.guessDistribution[guessCount] += 1;
  } else {
    newStats.currentStreak = 0;
  }

  // Calculate average guesses
  const totalGuesses = Object.entries(newStats.guessDistribution)
    .reduce((sum, [guesses, count]) => sum + (parseInt(guesses) * count), 0);
  newStats.averageGuesses = newStats.gamesWon > 0 ? totalGuesses / newStats.gamesWon : 0;

  return newStats;
};

export const generateShareText = (guesses: string[], evaluations: LetterState[][], gameStatus: GameStatus, isHardMode: boolean): string => {
  const title = 'Wordle Clone';
  const attempts = gameStatus === 'won' ? guesses.length : 'X';
  const maxAttempts = MAX_CHALLENGES;
  const hardModeIndicator = isHardMode ? '*' : '';
  
  let grid = '';
  
  for (let i = 0; i < evaluations.length; i++) {
    for (let j = 0; j < evaluations[i].length; j++) {
      const state = evaluations[i][j];
      switch (state) {
        case 'correct':
          grid += '🟩';
          break;
        case 'present':
          grid += '🟨';
          break;
        case 'absent':
          grid += '⬛';
          break;
        default:
          grid += '⬜';
      }
    }
    grid += '\n';
  }

  return `${title} ${attempts}/${maxAttempts}${hardModeIndicator}\n\n${grid}`;
};

export const isGameComplete = (gameStatus: GameStatus): boolean => {
  return gameStatus === 'won' || gameStatus === 'lost';
};

export const canAddLetter = (currentGuess: string): boolean => {
  return currentGuess.length < WORD_LENGTH;
};

export const canDeleteLetter = (currentGuess: string): boolean => {
  return currentGuess.length > 0;
};

export const canSubmitGuess = (currentGuess: string): boolean => {
  return currentGuess.length === WORD_LENGTH;
};

export const addLetter = (currentGuess: string, letter: string): string => {
  if (canAddLetter(currentGuess)) {
    return currentGuess + letter.toUpperCase();
  }
  return currentGuess;
};

export const deleteLetter = (currentGuess: string): string => {
  if (canDeleteLetter(currentGuess)) {
    return currentGuess.slice(0, -1);
  }
  return currentGuess;
};

export const submitGuess = (gameState: GameState, isValidWord: (word: string) => boolean): GameState => {
  const { currentGuess, solution, guesses, evaluations, hardMode } = gameState;

  if (!canSubmitGuess(currentGuess)) {
    return gameState;
  }

  if (!isValidWord(currentGuess)) {
    return gameState;
  }

  if (hardMode && !isValidHardModeGuess(currentGuess, guesses, evaluations)) {
    return gameState;
  }

  const newGuesses = [...guesses, currentGuess];
  const evaluation = evaluateGuess(currentGuess, solution);
  const newEvaluations = [...evaluations, evaluation];

  let gameStatus: GameStatus = 'playing';
  
  if (currentGuess === solution) {
    gameStatus = 'won';
  } else if (newGuesses.length >= MAX_CHALLENGES) {
    gameStatus = 'lost';
  }

  return {
    ...gameState,
    guesses: newGuesses,
    currentGuess: '',
    currentRow: newGuesses.length,
    evaluations: newEvaluations,
    gameStatus,
    lastCompletedTs: gameStatus !== 'playing' ? Date.now() : null,
  };
};

// Additional utility functions needed by useGame hook
import { getTodaysWord, isValidWord as isWordValid } from './wordList';

export const getRandomWord = (): string => {
  return getTodaysWord();
};

export const isValidWord = (word: string): boolean => {
  return isWordValid(word);
};

export interface GameTile {
  letter: string;
  state: LetterState;
}

export const checkGuess = (guess: string, solution: string): GameTile[] => {
  const result: GameTile[] = [];
  const evaluation = evaluateGuess(guess, solution);
  
  for (let i = 0; i < guess.length; i++) {
    result.push({
      letter: guess[i],
      state: evaluation[i]
    });
  }
  
  return result;
};