import { useRef } from 'react';

import { cx } from 'tailwind-variants';

import Caret from './Caret';
import Word from './Word';
import { useForcedTapeMode } from '../hooks/useForcedTapeMode';
import { useTypingStore } from '../store';
import { WORDS } from '../types';

interface TypingScreenProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const TypingScreen = ({ containerRef }: TypingScreenProps) => {
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<Map<string, HTMLSpanElement>>(new Map());

  useForcedTapeMode(containerRef, wordsContainerRef);

  const registerRef = (key: string, el: HTMLSpanElement | null) => {
    if (el) {
      letterRefs.current.set(key, el);
    } else {
      letterRefs.current.delete(key);
    }
  };

  const effectiveTapeMode = useTypingStore((s) => s.getEffectiveTapeMode());

  return (
    <div className='flex flex-col gap-4'>
      <div
        data-typing-area
        className={cx(
          `relative overflow-hidden`,
          effectiveTapeMode && 'mask-fade-x',
        )}
      >
        <div
          data-words-container
          ref={wordsContainerRef}
          className='flex gap-x-2.5 text-xl font-medium'
        >
          {WORDS.map((_, i) => (
            <Word key={i} wordIndex={i} registerRef={registerRef} />
          ))}
        </div>

        <Caret letterRefs={letterRefs} wordsContainerRef={wordsContainerRef} />
      </div>
    </div>
  );
};

export default TypingScreen;
