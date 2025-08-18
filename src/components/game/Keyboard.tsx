"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  guessedLetters: {
    correct: Set<string>;
    present: Set<string>;
    absent: Set<string>;
  };
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"]
];

export function Keyboard({
  onKeyPress,
  onEnter,
  onBackspace,
  guessedLetters,
  disabled = false
}: KeyboardProps) {
  const getKeyStatus = (key: string) => {
    if (guessedLetters.correct.has(key)) return "correct";
    if (guessedLetters.present.has(key)) return "present";
    if (guessedLetters.absent.has(key)) return "absent";
    return "default";
  };

  const handleKeyClick = (key: string) => {
    if (disabled) return;
    
    if (key === "ENTER") {
      onEnter();
    } else if (key === "BACKSPACE") {
      onBackspace();
    } else {
      onKeyPress(key);
    }
  };

  const getKeyStyles = (key: string, status: string) => {
    const baseStyles = "h-12 font-bold text-sm transition-all duration-200 hover:scale-105";
    
    if (key === "ENTER" || key === "BACKSPACE") {
      return cn(
        baseStyles,
        "px-3 bg-gray-400 hover:bg-gray-500 text-white",
        disabled && "opacity-50 cursor-not-allowed hover:scale-100"
      );
    }

    const statusStyles = {
      correct: "bg-green-500 hover:bg-green-600 text-white border-green-500",
      present: "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500",
      absent: "bg-gray-500 hover:bg-gray-600 text-white border-gray-500",
      default: "bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600"
    };

    return cn(
      baseStyles,
      "px-2 min-w-[2.5rem] border-2",
      statusStyles[status as keyof typeof statusStyles],
      disabled && "opacity-50 cursor-not-allowed hover:scale-100"
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto px-2">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={cn(
            "flex justify-center gap-1 mb-2",
            rowIndex === 1 && "px-4",
            rowIndex === 2 && "px-0"
          )}
        >
          {row.map((key) => {
            const status = key.length === 1 ? getKeyStatus(key) : "default";
            
            return (
              <Button
                key={key}
                variant="outline"
                className={getKeyStyles(key, status)}
                onClick={() => handleKeyClick(key)}
                disabled={disabled}
                aria-label={
                  key === "ENTER" 
                    ? "Submit guess" 
                    : key === "BACKSPACE" 
                    ? "Delete letter" 
                    : `Letter ${key}`
                }
              >
                {key === "BACKSPACE" ? "⌫" : key}
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
}