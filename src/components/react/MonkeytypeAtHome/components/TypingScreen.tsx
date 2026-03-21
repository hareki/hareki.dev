import { useRef } from 'react';

import Caret from './Caret';
import Word from './Word';
import { useTypingStore } from '../store';
import { WORDS } from '../types';

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

  const screen = useTypingStore((s) => s.screen);
  const wordsTyped = useTypingStore((s) => s.wordsTyped);
  const effectiveTapeMode = useTypingStore(
    (s) => s.isTapeModeOn || s.isTapeModeForced,
  );

  return (
    <div className='flex flex-col gap-4'>
      <div ref={typingAreaRef} className='relative overflow-hidden'>
        <div
          ref={wordsContainerRef}
          className='flex gap-x-2.5 text-lg/relaxed'
          style={
            effectiveTapeMode
              ? {
                  flexWrap: 'nowrap',
                  whiteSpace: 'nowrap',
                  transition: 'transform 80ms ease',
                }
              : undefined
          }
        >
          {WORDS.map((_, i) => (
            <Word key={i} wordIndex={i} registerRef={registerRef} />
          ))}
        </div>

        <Caret typingAreaRef={typingAreaRef} letterRefs={letterRefs} />
      </div>

      {screen === 'typing' && (
        <div className='text-right text-sm text-overlay1'>
          {wordsTyped}/{WORDS.length}
        </div>
      )}
    </div>
  );
};

export default TypingScreen;
