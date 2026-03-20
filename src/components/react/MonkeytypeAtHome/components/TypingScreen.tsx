import { useRef } from 'react';

import { Caret } from './Caret';
import { Word } from './Word';
import { useCaretPosition } from '../hooks/useCaretPosition';
import { WORDS } from '../types';

import type { TypingState } from '../types';

interface TypingScreenProps {
  state: TypingState;
  isTapeModeOn: boolean;
  typingAreaRef: React.RefObject<HTMLDivElement | null>;
  wordsContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const TypingScreen = ({
  state,
  isTapeModeOn,
  typingAreaRef,
  wordsContainerRef,
}: TypingScreenProps) => {
  const caretRef = useRef<HTMLDivElement>(null);

  const { registerRef } = useCaretPosition(
    state.currentWordIndex,
    state.currentCharIndex,
    typingAreaRef,
    caretRef,
    isTapeModeOn,
  );

  const isBlinking = state.screen === 'idle';

  return (
    <div className='flex flex-col gap-4'>
      <div ref={typingAreaRef} className='relative overflow-hidden'>
        <div
          ref={wordsContainerRef}
          className='flex flex-wrap gap-x-2.5 text-lg/relaxed'
          style={
            isTapeModeOn
              ? {
                  flexWrap: 'nowrap',
                  whiteSpace: 'nowrap',
                  transition: 'transform 80ms ease',
                }
              : undefined
          }
        >
          {state.words.map((word, i) => (
            <Word
              key={i}
              word={word}
              wordIndex={i}
              isActive={i === state.currentWordIndex}
              registerRef={registerRef}
            />
          ))}
        </div>

        <Caret
          ref={caretRef}
          isBlinking={isBlinking}
          isVisible={state.isFocused}
        />
      </div>

      {state.screen === 'typing' && (
        <div className='text-right text-sm text-overlay1'>
          {state.wordsTyped}/{WORDS.length}
        </div>
      )}
    </div>
  );
};
