import { cn } from 'tailwind-variants';

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
  const isTypingPaused = useTypingStore((s) => s.isTypingPaused);

  return (
    <div
      className={cn(
        'text-right text-base text-muted-foreground',
        isTypingPaused && 'opacity-0',
        className,
      )}
    >
      <WordsTyped />/{totalWords}
    </div>
  );
};

export default TypingProgress;
