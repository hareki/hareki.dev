import { cn } from 'tailwind-variants';

import Letter from './Letter';
import { useTypingStore } from '../../../hooks/useTypingStore';
import { selectShowRedUnderline } from '../../../hooks/useTypingStore/selectors';

interface WordProps {
  wordIndex: number;
  registerRef: (key: string, el: HTMLSpanElement | null) => void;
}

const Word = ({ wordIndex, registerRef }: WordProps) => {
  const letterCount = useTypingStore((s) => s.words[wordIndex].letters.length);
  const showRedUnderline = useTypingStore(selectShowRedUnderline(wordIndex));

  return (
    <span
      className={cn(
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
