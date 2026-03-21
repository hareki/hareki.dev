import { useTypingStore } from '../store';

import type { LetterStatus } from '../types';

const statusClasses: Record<LetterStatus, string> = {
  untyped: 'text-overlay1',
  correct: 'text-foreground',
  incorrect: 'text-red',
  extra: 'text-red opacity-50',
};

interface LetterProps {
  wordIndex: number;
  charIndex: number;
  registerRef: (key: string, el: HTMLSpanElement | null) => void;
}

const Letter = function Letter({
  wordIndex,
  charIndex,
  registerRef,
}: LetterProps) {
  const letter = useTypingStore(
    (s) => s.words[wordIndex].letters[charIndex],
  );
  const char = letter.status === 'extra' ? letter.typed! : letter.expected;

  const refCallback = (el: HTMLSpanElement | null) => {
    registerRef(`${wordIndex}-${charIndex}`, el);
  };

  return (
    <span ref={refCallback} className={statusClasses[letter.status]}>
      {char}
    </span>
  );
};

export default Letter;
