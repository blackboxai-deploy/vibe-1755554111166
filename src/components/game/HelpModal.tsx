"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">How To Play</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <p>Guess the <strong>WORDLE</strong> in 6 tries.</p>
          
          <div className="space-y-2">
            <p>• Each guess must be a valid 5-letter word. Hit the enter button to submit.</p>
            <p>• After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
          </div>
          
          <div className="border-t pt-4">
            <p className="font-semibold mb-3">Examples</p>
            
            <div className="space-y-3">
              <div>
                <div className="flex gap-1 mb-2">
                  <div className="w-8 h-8 border-2 bg-green-500 text-white font-bold flex items-center justify-center text-sm">
                    W
                  </div>
                  <div className="w-8 h-8 border-2 border-gray-300 flex items-center justify-center text-sm font-bold">
                    E
                  </div>
                  <div className="w-8 h-8 border-2 border-gray-300 flex items-center justify-center text-sm font-bold">
                    A
                  </div>
                  <div className="w-8 h-8 border-2 border-gray-300 flex items-center justify-center text-sm font-bold">
                    R
                  </div>
                  <div className="w-8 h-8 border-2 border-gray-300 flex items-center justify-center text-sm font-bold">
                    Y
                  </div>
                </div>
                <p className="text-xs">The letter <strong>W</strong> is in the word and in the correct spot.</p>
              </div>
              
              <div>
                <div className="flex gap-1 mb-2">
                  <div className="w-8 h-8 border-2 border-gray-300 flex items-center justify-center text-sm font-bold">
                    P
                  </div>
                  <div className="w-8 h-8 border-2 bg-yellow-500 text-white font-bold flex items-center justify-center text-sm">
                    I
                  </div>
                  <div className="w-8 h-8 border-2 border-gray-300 flex items-center justify-center text-sm font-bold">
                    L
                  </div>
                  <div className="w-8 h-8 border-2 border-gray-300 flex items-center justify-center text-sm font-bold">
                    L
                  </div>
                  <div className="w-8 h-8 border-2 border-gray-300 flex items-center justify-center text-sm font-bold">
                    S
                  </div>
                </div>
                <p className="text-xs">The letter <strong>I</strong> is in the word but in the wrong spot.</p>
              </div>
              
              <div>
                <div className="flex gap-1 mb-2">
                  <div className="w-8 h-8 border-2 border-gray-300 flex items-center justify-center text-sm font-bold">
                    V
                  </div>
                  <div className="w-8 h-8 border-2 border-gray-300 flex items-center justify-center text-sm font-bold">
                    A
                  </div>
                  <div className="w-8 h-8 border-2 border-gray-300 flex items-center justify-center text-sm font-bold">
                    G
                  </div>
                  <div className="w-8 h-8 border-2 bg-gray-500 text-white font-bold flex items-center justify-center text-sm">
                    U
                  </div>
                  <div className="w-8 h-8 border-2 border-gray-300 flex items-center justify-center text-sm font-bold">
                    E
                  </div>
                </div>
                <p className="text-xs">The letter <strong>U</strong> is not in the word in any spot.</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="font-semibold text-center">A new WORDLE will be available each day!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}