import { useRef } from 'react';

import { cx } from 'tailwind-variants';

import Caret from './Caret';
import Word from './Word';
import { useTypingStore } from '../store';
import { WORDS } from '../types';
import TypingProgress from './TypingProgress';

interface TypingScreenProps {
  typingAreaRef: React.RefObject<HTMLDivElement | null>;
  wordsContainerRef: React.RefObject<HTMLDivElement | null>;
}

const TypingScreen = ({
  typingAreaRef,
  wordsContainerRef,
}: TypingScreenProps) => {
  const letterRefs = useRef<Map<string, HTMLSpanElement>>(new Map());

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
        ref={typingAreaRef}
        className={cx(
          `relative overflow-hidden`,
          effectiveTapeMode && 'mask-fade-x',
        )}
      >
        <div ref={wordsContainerRef} className='flex gap-x-2.5 text-lg/relaxed'>
          {WORDS.map((_, i) => (
            <Word key={i} wordIndex={i} registerRef={registerRef} />
          ))}
        </div>

        <Caret
          typingAreaRef={typingAreaRef}
          letterRefs={letterRefs}
          wordsContainerRef={wordsContainerRef}
        />
      </div>

      <TypingProgress />
    </div>
  );
};

export default TypingScreen;
