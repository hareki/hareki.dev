import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

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

  // Scroll offset calculation for tape mode — directly manipulate DOM
  useLayoutEffect(() => {
    const wordsContainer = wordsContainerRef.current;
    if (!wordsContainer) {return;}

    if (!isTapeModeOn) {
      wordsContainer.style.transform = '';
      return;
    }

    const typingArea = typingAreaRef.current;
    if (!typingArea) {return;}

    const typingAreaWidth = typingArea.offsetWidth;
    const computedAnchorX = typingAreaWidth * (caretAnchorPercent / 100);

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

    wordsContainer.style.transform = `translateX(${computedAnchorX - naturalLeft}px)`;
  }, [isTapeModeOn, currentWordIndex, currentCharIndex, typingAreaRef, wordsContainerRef, caretAnchorPercent]);

  // Hidden measuring element rendered inline by the consumer
  const measureElement = useMemo(
    () => (
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
    ),
    [],
  );

  return { measureElement };
}
