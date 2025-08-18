'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameBoard } from '@/components/game/GameBoard';
import { Keyboard } from '@/components/game/Keyboard';
import { GameHeader } from '@/components/game/GameHeader';
import HelpModal from '@/components/game/HelpModal';
import StatsModal from '@/components/game/StatsModal';
import GameOverModal from '@/components/game/GameOverModal';
import { useGame } from '@/hooks/useGame';
import { useKeyboard } from '@/hooks/useKeyboard';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  const {
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
  } = useGame();

  useKeyboard({
    onKeyPress: addLetter,
    onEnter: submitGuess,
    onBackspace: deleteLetter,
    disabled: isGameComplete,
  });

  useEffect(() => {
    if (isGameComplete) {
      setShowGameOver(true);
    }
  }, [isGameComplete]);

  const handleNewGame = useCallback(() => {
    startNewGame();
    setShowGameOver(false);
  }, [startNewGame]);

  // Convert gameState.guesses (GameTile[][]) to string[] for components that expect it
  const guessStrings = gameState.guesses.map(row => 
    row.map(tile => tile.letter).join('')
  ).filter(guess => guess.length > 0);

  const handleShare = useCallback(async () => {
    const shareText = shareResults();
    if (shareText) {
      try {
        if (navigator.share) {
          await navigator.share({
            text: shareText,
          });
        } else {
          await navigator.clipboard.writeText(shareText);
        }
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  }, [shareResults]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GameHeader 
        onShare={handleShare}
        gameCompleted={isGameComplete}
      />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto w-full">
        <GameBoard 
          guesses={guessStrings}
          currentGuess={gameState.currentGuess}
          currentRow={gameState.currentRow}
          solution={gameState.solution}
          gameStatus={gameState.gameStatus}
          isRevealing={gameState.isRevealing}
          invalidGuess={showInvalidWord}
        />
        
        <div className="mt-8 w-full">
          <Keyboard 
            onKeyPress={addLetter}
            onEnter={submitGuess}
            onBackspace={deleteLetter}
            guessedLetters={{
              correct: new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(letter => getKeyboardLetterState(letter) === 'correct')),
              present: new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(letter => getKeyboardLetterState(letter) === 'present')),
              absent: new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(letter => getKeyboardLetterState(letter) === 'absent')),
            }}
            disabled={isGameComplete}
          />
        </div>
      </main>

      <HelpModal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
      />
      
      <StatsModal 
        isOpen={showStats} 
        onClose={() => setShowStats(false)}
        stats={stats}
        onReset={resetStats}
      />
      
      <GameOverModal 
        isOpen={showGameOver}
        onClose={() => setShowGameOver(false)}
        isWin={gameState.gameStatus === 'won'}
        word={gameState.solution}
        guesses={guessStrings}
        guessCount={gameState.currentRow}
        stats={stats}
        onNewGame={handleNewGame}
        onViewStats={() => setShowStats(true)}
      />

      <Toaster />
    </div>
  );
}