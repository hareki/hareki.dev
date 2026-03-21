import { cn } from 'tailwind-variants';

import Letter from './Letter';
import { useTypingStore } from '../store';

interface WordProps {
  wordIndex: number;
  registerRef: (key: string, el: HTMLSpanElement | null) => void;
}

const Word = function Word({ wordIndex, registerRef }: WordProps) {
  const word = useTypingStore((s) => s.words[wordIndex]);
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
};

export default Word;
