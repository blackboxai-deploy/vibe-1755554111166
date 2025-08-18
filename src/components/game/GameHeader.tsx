"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, BarChart3, Settings, Share2 } from "lucide-react";
import HelpModal from "./HelpModal";
import StatsModal from "./StatsModal";
import { useTheme } from "next-themes";

interface GameHeaderProps {
  onShare?: () => void;
  gameCompleted?: boolean;
}

export function GameHeader({ onShare, gameCompleted }: GameHeaderProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHelp(true)}
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>

        <h1 className="text-2xl font-bold tracking-wide">WORDLE</h1>

        <div className="flex items-center gap-2">
          {gameCompleted && onShare && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onShare}
              aria-label="Share results"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowStats(true)}
            aria-label="Statistics"
          >
            <BarChart3 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} stats={{gamesPlayed: 0, gamesWon: 0, currentStreak: 0, bestStreak: 0, guessDistribution: [0,0,0,0,0,0]}} onReset={() => {}} />
    </>
  );
}