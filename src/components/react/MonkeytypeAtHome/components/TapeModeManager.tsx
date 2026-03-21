import { useEffect, useLayoutEffect, useRef } from 'react';

import { useTypingStore } from '../store';
import { TEXT } from '../types';

interface TapeModeManagerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  typingAreaRef: React.RefObject<HTMLDivElement | null>;
  wordsContainerRef: React.RefObject<HTMLDivElement | null>;
  caretAnchorPercent?: number;
}

const TapeModeManager = ({
  containerRef,
  typingAreaRef,
  wordsContainerRef,
  caretAnchorPercent = 50,
}: TapeModeManagerProps) => {
  const measureRef = useRef<HTMLDivElement>(null);

  const effectiveTapeMode = useTypingStore(
    (s) => s.isTapeModeOn || s.isTapeModeForced,
  );
  const currentWordIndex = useTypingStore((s) => s.currentWordIndex);
  const currentCharIndex = useTypingStore((s) => s.currentCharIndex);
  const dispatch = useTypingStore((s) => s.dispatch);

  // Forced tape mode detection via ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) {
      return;
    }

    const checkOverflow = (
      measureScrollWidth: number,
      containerContentWidth: number,
    ) => {
      const isOverflowing = measureScrollWidth > containerContentWidth;
      dispatch({ type: 'SET_TAPE_MODE_FORCED', forced: isOverflowing });
    };

    const observer = new ResizeObserver(([entry]) => {
      checkOverflow(measure.scrollWidth, entry.contentBoxSize[0].inlineSize);
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [containerRef, dispatch]);

  // Scroll offset calculation for tape mode — directly manipulate DOM
  useLayoutEffect(() => {
    const wordsContainer = wordsContainerRef.current;
    if (!wordsContainer) {
      return;
    }

    if (!effectiveTapeMode) {
      wordsContainer.style.transform = '';
      return;
    }

    const typingArea = typingAreaRef.current;
    if (!typingArea) {
      return;
    }

    const typingAreaWidth = typingArea.offsetWidth;
    const computedAnchorX = typingAreaWidth * (caretAnchorPercent / 100);

    // Find the current letter element using DOM children
    const wordEl = wordsContainer.children[currentWordIndex] as
      | HTMLElement
      | undefined;

    if (!wordEl) {
      return;
    }

    let letterRect: DOMRect;
    const letterEl = wordEl.children[currentCharIndex] as
      | HTMLElement
      | undefined;

    if (letterEl) {
      letterRect = letterEl.getBoundingClientRect();
    } else {
      // Past end of word: use right edge of last letter
      const lastEl = wordEl.lastElementChild as HTMLElement | null;
      if (!lastEl) {
        return;
      }
      const lastRect = lastEl.getBoundingClientRect();
      letterRect = new DOMRect(lastRect.right, lastRect.y, 0, lastRect.height);
    }

    const wordsRect = wordsContainer.getBoundingClientRect();
    const naturalLeft = letterRect.left - wordsRect.left;

    wordsContainer.style.transform = `translateX(${computedAnchorX - naturalLeft}px)`;
  }, [
    caretAnchorPercent,
    currentCharIndex,
    currentWordIndex,
    effectiveTapeMode,
    typingAreaRef,
    wordsContainerRef,
  ]);

  return (
    <div
      ref={measureRef}
      className='
        pointer-events-none invisible absolute text-lg whitespace-nowrap
      '
      aria-hidden='true'
    >
      {TEXT}
    </div>
  );
};

export default TapeModeManager;
