import { memo } from 'react';

import { cn } from 'tailwind-variants';

import { Letter } from './Letter';

import type { WordState } from '../types';

interface WordProps {
  word: WordState;
  wordIndex: number;
  isActive: boolean;
  registerRef: (key: string, el: HTMLSpanElement | null) => void;
}

export const Word = memo(
  // isActive is used only in the memo comparator to force re-render when the active word changes
  function Word({ word, wordIndex, registerRef }: WordProps) {
    const showRedUnderline = word.isCompleted && !word.isCorrect;

    return (
      <span
        className={cn(
          showRedUnderline &&
            'underline decoration-red decoration-2 underline-offset-4',
        )}
      >
        {word.letters.map((letter, i) => (
          <Letter
            key={i}
            char={letter.status === 'extra' ? letter.typed! : letter.expected}
            status={letter.status}
            wordIndex={wordIndex}
            charIndex={i}
            registerRef={registerRef}
          />
        ))}
      </span>
    );
  },
  (prev, next) => prev.word === next.word && prev.isActive === next.isActive,
);
