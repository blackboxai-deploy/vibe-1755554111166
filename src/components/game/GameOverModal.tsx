"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Trophy, Target, Calendar, BarChart3 } from "lucide-react";
import { useState } from "react";

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  isWin: boolean;
  word: string;
  guesses: string[];
  guessCount: number;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    bestStreak: number;
    guessDistribution: number[];
  };
  onNewGame: () => void;
  onViewStats: () => void;
}

export default function GameOverModal({
  isOpen,
  onClose,
  isWin,
  word,
  guesses,
  guessCount,
  stats,
  onNewGame,
  onViewStats,
}: GameOverModalProps) {
  const [shareSuccess, setShareSuccess] = useState(false);

  const generateShareText = () => {
    const date = new Date().toLocaleDateString();
    const attempts = isWin ? guessCount : "X";
    let grid = `Wordle ${date} ${attempts}/6\n\n`;
    
    guesses.forEach((guess) => {
      if (guess) {
        let row = "";
        for (let i = 0; i < 5; i++) {
          const letter = guess[i];
          if (letter === word[i]) {
            row += "🟩";
          } else if (word.includes(letter)) {
            row += "🟨";
          } else {
            row += "⬜";
          }
        }
        grid += row + "\n";
      }
    });
    
    return grid;
  };

  const handleShare = async () => {
    const shareText = generateShareText();
    
    try {
      if (navigator.share) {
        await navigator.share({
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const winPercentage = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {isWin ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Trophy className="h-6 w-6" />
                Congratulations!
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-red-600">
                <Target className="h-6 w-6" />
                Game Over
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Result Message */}
          <div className="text-center">
            {isWin ? (
              <div className="space-y-2">
                <p className="text-lg">
                  You solved it in{" "}
                  <Badge variant="secondary" className="text-lg px-2 py-1">
                    {guessCount}
                  </Badge>{" "}
                  {guessCount === 1 ? "guess" : "guesses"}!
                </p>
                <p className="text-sm text-muted-foreground">
                  The word was: <span className="font-bold uppercase">{word}</span>
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg">Better luck next time!</p>
                <p className="text-sm text-muted-foreground">
                  The word was: <span className="font-bold uppercase">{word}</span>
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{winPercentage}%</div>
              <div className="text-xs text-muted-foreground">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Current Streak</div>
            </div>
          </div>

          {/* Share Grid Preview */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-center">Your Result</h4>
            <div className="bg-muted p-3 rounded-lg">
              <div className="font-mono text-sm text-center space-y-1">
                {guesses.map((guess, index) => {
                  if (!guess) return null;
                  return (
                    <div key={index} className="flex justify-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const letter = guess[i];
                        let emoji = "⬜";
                        if (letter === word[i]) {
                          emoji = "🟩";
                        } else if (word.includes(letter)) {
                          emoji = "🟨";
                        }
                        return <span key={i}>{emoji}</span>;
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleShare} 
              className="w-full" 
              variant="default"
            >
              <Share2 className="h-4 w-4 mr-2" />
              {shareSuccess ? "Copied to Clipboard!" : "Share Result"}
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={onViewStats} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                View Stats
              </Button>
              
              <Button 
                onClick={onNewGame} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                New Game
              </Button>
            </div>
          </div>

          {/* Next Game Info */}
          <div className="text-center text-xs text-muted-foreground border-t pt-4">
            <p>Next puzzle available at midnight</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}