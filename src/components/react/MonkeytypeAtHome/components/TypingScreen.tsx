import { Caret } from './Caret';
import { Word } from './Word';
import { useCaretPosition } from '../hooks/useCaretPosition';
import { WORDS } from '../types';

import type { TypingState } from '../types';

interface TypingScreenProps {
  state: TypingState;
  isTapeModeOn: boolean;
  tapeScrollOffset: number;
  tapeAnchorX: number;
  typingAreaRef: React.RefObject<HTMLDivElement | null>;
  wordsContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const TypingScreen = ({
  state,
  isTapeModeOn,
  tapeScrollOffset,
  tapeAnchorX,
  typingAreaRef,
  wordsContainerRef,
}: TypingScreenProps) => {
  const { caretPos, registerRef } = useCaretPosition(
    state.currentWordIndex,
    state.currentCharIndex,
    typingAreaRef,
  );

  const showCaret = state.isFocused;
  const isBlinking = state.screen === 'idle';

  return (
    <div className='flex flex-col gap-4'>
      <div
        ref={typingAreaRef}
        className='relative overflow-hidden'
      >
        <div
          ref={wordsContainerRef}
          className='flex flex-wrap gap-x-2.5 text-lg/relaxed'
          style={
            isTapeModeOn
              ? {
                  flexWrap: 'nowrap',
                  whiteSpace: 'nowrap',
                  transform: `translateX(${tapeScrollOffset}px)`,
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

        {showCaret && (
          <Caret
            x={isTapeModeOn ? tapeAnchorX : caretPos.x}
            y={caretPos.y}
            height={caretPos.height}
            isBlinking={isBlinking}
          />
        )}
      </div>

      {state.screen === 'typing' && (
        <div className='text-right text-sm text-overlay1'>
          {state.wordsTyped}/{WORDS.length}
        </div>
      )}
    </div>
  );
};
