import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { TEXT } from '../types';

interface UseTapeModeOptions {
  isTapeModeOn: boolean;
  currentWordIndex: number;
  currentCharIndex: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  wordsContainerRef: React.RefObject<HTMLDivElement | null>;
  dispatch: React.Dispatch<{ type: 'SET_TAPE_MODE_FORCED'; forced: boolean }>;
}

export function useTapeMode({
  isTapeModeOn,
  currentWordIndex,
  currentCharIndex,
  containerRef,
  wordsContainerRef,
  dispatch,
}: UseTapeModeOptions) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Forced tape mode detection via ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) {return;}

    const checkOverflow = () => {
      const isOverflowing = measure.scrollWidth > container.offsetWidth;
      dispatch({ type: 'SET_TAPE_MODE_FORCED', forced: isOverflowing });
    };

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(container);
    checkOverflow();

    return () => observer.disconnect();
  }, [containerRef, dispatch]);

  // Scroll offset calculation for tape mode
  useLayoutEffect(() => {
    if (!isTapeModeOn) {
      setScrollOffset(0);
      return;
    }

    const container = containerRef.current;
    const wordsContainer = wordsContainerRef.current;
    if (!container || !wordsContainer) {return;}

    const containerRect = container.getBoundingClientRect();
    const anchorX = containerRect.width * 0.33;

    // Find the current letter's position
    const letters = wordsContainer.querySelectorAll('span > span');
    let letterIndex = 0;
    for (let w = 0; w < currentWordIndex; w++) {
      const wordEl = wordsContainer.children[w];
      if (wordEl) {letterIndex += wordEl.children.length;}
    }
    letterIndex += currentCharIndex;

    const currentLetterEl = letters[letterIndex] as HTMLElement | undefined;
    if (!currentLetterEl) {return;}

    const letterRect = currentLetterEl.getBoundingClientRect();
    const wordsRect = wordsContainer.getBoundingClientRect();
    const naturalCaretLeft = letterRect.left - wordsRect.left;

    const offset = Math.min(0, anchorX - naturalCaretLeft);
    setScrollOffset(offset);
  }, [isTapeModeOn, currentWordIndex, currentCharIndex, containerRef, wordsContainerRef]);

  // Hidden measuring element rendered inline by the consumer
  const measureElement = (
    <div
      ref={measureRef}
      className='
        pointer-events-none invisible absolute top-0 left-0 text-lg
        whitespace-nowrap
      '
      aria-hidden='true'
    >
      {TEXT}
    </div>
  );

  return { scrollOffset, measureElement };
}
