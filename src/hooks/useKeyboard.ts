import { useEffect, useCallback } from 'react';

interface UseKeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  disabled?: boolean;
}

export const useKeyboard = ({
  onKeyPress,
  onEnter,
  onBackspace,
  disabled = false,
}: UseKeyboardProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return;

      const key = event.key.toLowerCase();

      // Prevent default behavior for game keys
      if (
        (key >= 'a' && key <= 'z') ||
        key === 'enter' ||
        key === 'backspace'
      ) {
        event.preventDefault();
      }

      // Handle letter input
      if (key >= 'a' && key <= 'z') {
        onKeyPress(key.toUpperCase());
        return;
      }

      // Handle special keys
      switch (key) {
        case 'enter':
          onEnter();
          break;
        case 'backspace':
          onBackspace();
          break;
      }
    },
    [onKeyPress, onEnter, onBackspace, disabled]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return null;
};