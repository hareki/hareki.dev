import { cx } from 'tailwind-variants';

import Letter from './Letter';
import { useTypingStore } from '../store';

interface WordProps {
  wordIndex: number;
  registerRef: (key: string, el: HTMLSpanElement | null) => void;
}

const Word = ({ wordIndex, registerRef }: WordProps) => {
  const isCompleted = useTypingStore((s) => s.words[wordIndex].isCompleted);
  const isCorrect = useTypingStore((s) => s.words[wordIndex].isCorrect);
  const letterCount = useTypingStore((s) => s.words[wordIndex].letters.length);
  const showRedUnderline = isCompleted && !isCorrect;

  return (
    <span
      className={cx(
        showRedUnderline &&
          'underline decoration-red decoration-2 underline-offset-4',
      )}
    >
      {Array.from({ length: letterCount }, (_, i) => (
        <Letter
          key={i}
          wordIndex={wordIndex}
          charIndex={i}
          registerRef={registerRef}
        />
      ))}
    </span>
  );
};

export default Word;
