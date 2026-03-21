import { cx } from 'tailwind-variants';

import { useTypingStore } from '../store';
import { WORDS } from '../types';

interface TypingProgressProps {
  className?: string;
}

const TypingProgress = ({ className }: TypingProgressProps) => {
  const wordsTyped = useTypingStore((s) => s.wordsTyped);

  return (
    <div
      className={cx('text-right text-base text-muted-foreground', className)}
    >
      {wordsTyped}/{WORDS.length}
    </div>
  );
};

export default TypingProgress;
