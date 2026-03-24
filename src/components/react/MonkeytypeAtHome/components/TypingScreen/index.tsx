import { useRef } from 'react';

import { cx } from 'tailwind-variants';

import Caret from './components/Caret';
import TypingTransition from './components/TypingTransition';
import Word from './components/Word';
import { useForcedTapeModeWatcher } from '../../hooks/useForcedTapeModeWatcher';
import { useTypingStore } from '../../hooks/useTypingStore';
import { selectEffectiveTapeMode } from '../../hooks/useTypingStore/selectors';

interface TypingScreenProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

const TypingScreen = ({ containerRef, className }: TypingScreenProps) => {
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const caretRef = useRef<HTMLDivElement>(null);

  useForcedTapeModeWatcher(containerRef, wordsContainerRef);

  const registerRef = (key: string, el: HTMLSpanElement | null) => {
    if (el) {
      letterRefs.current.set(key, el);
    } else {
      letterRefs.current.delete(key);
    }
  };

  const wordCount = useTypingStore((s) => s.words.length);
  const text = useTypingStore((s) => s.text);
  const effectiveTapeMode = useTypingStore(selectEffectiveTapeMode);

  return (
    <div className={cx('flex flex-col gap-4', className)}>
      <div
        data-typing-area
        key={text}
        className={cx(
          `relative component-transition overflow-hidden`,
          effectiveTapeMode && 'mask-fade-x',
        )}
      >
        <p className='sr-only'>{text}</p>
        <div
          data-words-container
          ref={wordsContainerRef}
          aria-hidden='true'
          className='flex gap-x-2.5 text-xl font-medium'
        >
          {Array.from({ length: wordCount }, (_, i) => (
            <Word key={i} wordIndex={i} registerRef={registerRef} />
          ))}
        </div>

        <Caret ref={caretRef} />
        <TypingTransition
          letterRefs={letterRefs}
          wordsContainerRef={wordsContainerRef}
          caretRef={caretRef}
        />
      </div>
    </div>
  );
};

export default TypingScreen;
