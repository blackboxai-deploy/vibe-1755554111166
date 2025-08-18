"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  guessDistribution: number[];
}

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onReset: () => void;
}

export default function StatsModal({ isOpen, onClose, stats, onReset }: StatsModalProps) {
  const winPercentage = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const maxGuesses = Math.max(...stats.guessDistribution, 1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Statistics</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
              <div className="text-xs text-muted-foreground">Played</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{winPercentage}</div>
              <div className="text-xs text-muted-foreground">Win %</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Current Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.bestStreak}</div>
              <div className="text-xs text-muted-foreground">Max Streak</div>
            </div>
          </div>

          {/* Guess Distribution */}
          <div>
            <h3 className="text-sm font-semibold mb-3">GUESS DISTRIBUTION</h3>
            <div className="space-y-1">
              {stats.guessDistribution.map((count, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 text-sm font-bold">{index + 1}</div>
                  <div className="flex-1 bg-muted rounded">
                    <div
                      className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded min-w-[20px] text-right"
                      style={{
                        width: `${Math.max((count / maxGuesses) * 100, count > 0 ? 10 : 0)}%`
                      }}
                    >
                      {count > 0 ? count : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-center">
            <Button 
              onClick={onReset} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              Reset Statistics
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}