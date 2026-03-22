import { cx } from 'tailwind-variants';

import { useTypingStore } from '../store';

interface TypingProgressProps {
  className?: string;
}

const TypingProgress = ({ className }: TypingProgressProps) => {
  const wordsTyped = useTypingStore((s) => s.wordsTyped);
  const totalWords = useTypingStore((s) => s.words.length);

  return (
    <div
      className={cx('text-right text-base text-muted-foreground', className)}
    >
      {wordsTyped}/{totalWords}
    </div>
  );
};

export default TypingProgress;
