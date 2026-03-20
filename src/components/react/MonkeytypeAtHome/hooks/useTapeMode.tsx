import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { TEXT } from '../types';

interface UseTapeModeOptions {
  isTapeModeOn: boolean;
  currentWordIndex: number;
  currentCharIndex: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  typingAreaRef: React.RefObject<HTMLDivElement | null>;
  wordsContainerRef: React.RefObject<HTMLDivElement | null>;
  dispatch: React.Dispatch<{ type: 'SET_TAPE_MODE_FORCED'; forced: boolean }>;
  caretAnchorPercent?: number;
}

export function useTapeMode({
  isTapeModeOn,
  currentWordIndex,
  currentCharIndex,
  containerRef,
  typingAreaRef,
  wordsContainerRef,
  dispatch,
  caretAnchorPercent = 50,
}: UseTapeModeOptions) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [anchorX, setAnchorX] = useState(0);

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
      setAnchorX(0);
      return;
    }

    const typingArea = typingAreaRef.current;
    const wordsContainer = wordsContainerRef.current;
    if (!typingArea || !wordsContainer) {return;}

    const typingAreaWidth = typingArea.offsetWidth;
    const computedAnchorX = typingAreaWidth * (caretAnchorPercent / 100);
    setAnchorX(computedAnchorX);

    // Find the current letter element using DOM children
    const wordEl = wordsContainer.children[currentWordIndex] as HTMLElement | undefined;
    if (!wordEl) {return;}

    let letterRect: DOMRect;
    const letterEl = wordEl.children[currentCharIndex] as HTMLElement | undefined;
    if (letterEl) {
      letterRect = letterEl.getBoundingClientRect();
    } else {
      // Past end of word: use right edge of last letter
      const lastEl = wordEl.lastElementChild as HTMLElement | null;
      if (!lastEl) {return;}
      const lastRect = lastEl.getBoundingClientRect();
      letterRect = new DOMRect(lastRect.right, lastRect.y, 0, lastRect.height);
    }

    const wordsRect = wordsContainer.getBoundingClientRect();
    const naturalLeft = letterRect.left - wordsRect.left;

    setScrollOffset(computedAnchorX - naturalLeft);
  }, [isTapeModeOn, currentWordIndex, currentCharIndex, typingAreaRef, wordsContainerRef, caretAnchorPercent]);

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

  return { scrollOffset, anchorX, measureElement };
}
