import type { LetterStatus } from '../types';

const statusClasses: Record<LetterStatus, string> = {
  untyped: 'text-overlay1',
  correct: 'text-foreground',
  incorrect: 'text-red',
  extra: 'text-red opacity-50',
};

interface LetterProps {
  char: string;
  status: LetterStatus;
  wordIndex: number;
  charIndex: number;
  registerRef: (key: string, el: HTMLSpanElement | null) => void;
}

export const Letter = function Letter({
  char,
  status,
  wordIndex,
  charIndex,
  registerRef,
}: LetterProps) {
  const refCallback = (el: HTMLSpanElement | null) => {
    registerRef(`${wordIndex}-${charIndex}`, el);
  };

  return (
    <span ref={refCallback} className={statusClasses[status]}>
      {char}
    </span>
  );
};
