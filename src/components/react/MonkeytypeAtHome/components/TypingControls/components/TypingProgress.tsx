import { cx } from 'tailwind-variants';

import { useTypingStore } from '../../../hooks/useTypingStore';

interface TypingProgressProps {
  className?: string;
}

const WordsTyped = () => {
  const wordsTyped = useTypingStore((s) => s.wordsTyped);

  return wordsTyped;
};

const TypingProgress = ({ className }: TypingProgressProps) => {
  const totalWords = useTypingStore((s) => s.words.length);

  return (
    <div
      className={cx('text-right text-base text-muted-foreground', className)}
    >
      <WordsTyped />/{totalWords}
    </div>
  );
};

export default TypingProgress;
