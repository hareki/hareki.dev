import { useEffect, useLayoutEffect, useRef } from 'react';

import { cx } from 'tailwind-variants';

import { useTypingStore } from '../store';

interface CaretProps {
  typingAreaRef: React.RefObject<HTMLDivElement | null>;
  wordsContainerRef: React.RefObject<HTMLDivElement | null>;
  letterRefs: React.RefObject<Map<string, HTMLSpanElement>>;
  caretAnchorPercent?: number;
}

const TOGGLE_DURATION_MS = 600;

const Caret = ({
  typingAreaRef,
  letterRefs,
  wordsContainerRef,
  caretAnchorPercent = 50,
}: CaretProps) => {
  const caretRef = useRef<HTMLDivElement>(null);

  const isBlinking = useTypingStore((s) => s.screen === 'idle');
  const isVisible = useTypingStore((s) => s.isFocused);
  const currentWordIndex = useTypingStore((s) => s.currentWordIndex);
  const currentCharIndex = useTypingStore((s) => s.currentCharIndex);
  const effectiveTapeMode = useTypingStore(
    (s) => s.isTapeModeOn || s.isTapeModeForced,
  );

  const prevTapeModeRef = useRef(effectiveTapeMode);
  const toggleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toggleTimeoutRef.current) {
        clearTimeout(toggleTimeoutRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const container = typingAreaRef.current;
    const caret = caretRef.current;
    const wordsContainer = wordsContainerRef.current;
    if (!container || !caret) {
      return;
    }

    // Resolve target letter element (single lookup for both modes)
    const currentKey = `${currentWordIndex}-${currentCharIndex}`;
    let targetEl = letterRefs.current.get(currentKey);
    let useRightEdge = false;

    if (!targetEl) {
      // Past end of word: use previous letter's right edge
      const prevKey = `${currentWordIndex}-${currentCharIndex - 1}`;
      targetEl = letterRefs.current.get(prevKey);
      useRightEdge = true;

      if (!targetEl) {
        // Fallback: first letter of current word
        targetEl = letterRefs.current.get(`${currentWordIndex}-0`);
        if (!targetEl) {
          return;
        }
        useRightEdge = false;
      }
    }

    const isToggle = prevTapeModeRef.current !== effectiveTapeMode;
    prevTapeModeRef.current = effectiveTapeMode;

    // Cancel any pending toggle cleanup on re-toggle
    if (isToggle && toggleTimeoutRef.current) {
      clearTimeout(toggleTimeoutRef.current);
      toggleTimeoutRef.current = null;
    }

    // For non-tape, non-toggle: clear transform before measuring.
    // Skip if a toggle-off transition is still in progress.
    if (
      !effectiveTapeMode &&
      !isToggle &&
      !toggleTimeoutRef.current &&
      wordsContainer
    ) {
      wordsContainer.style.transform = '';
    }

    const containerRect = container.getBoundingClientRect();
    const letterRect = targetEl.getBoundingClientRect();
    const letterX = useRightEdge ? letterRect.right : letterRect.left;
    const y = letterRect.top - containerRect.top;
    const height = letterRect.height;
    const toggleTransition = `transform ${TOGGLE_DURATION_MS}ms var(--ease-overshoot-soft)`;

    if (isToggle && effectiveTapeMode && wordsContainer) {
      // TOGGLE ON: smooth slide to anchor
      const anchorX = container.offsetWidth * (caretAnchorPercent / 100);
      const wordsRect = wordsContainer.getBoundingClientRect();
      const naturalLeft = letterX - wordsRect.left;

      caret.style.transition = toggleTransition;
      caret.style.transform = `translate(${anchorX}px, ${y}px)`;
      caret.style.height = `${height}px`;

      wordsContainer.style.transition = toggleTransition;
      wordsContainer.style.transform = `translateX(${anchorX - naturalLeft}px)`;

      toggleTimeoutRef.current = setTimeout(() => {
        caret.style.transition = '';
        wordsContainer.style.transition = 'transform 80ms ease-in-out';
        toggleTimeoutRef.current = null;
      }, TOGGLE_DURATION_MS);
    } else if (isToggle && !effectiveTapeMode && wordsContainer) {
      // TOGGLE OFF: smooth slide back to natural position
      const computedTransform = getComputedStyle(wordsContainer).transform;
      const currentTranslateX = new DOMMatrix(computedTransform).m41;
      const naturalLetterX = letterX - currentTranslateX;

      caret.style.transition = toggleTransition;
      caret.style.transform = `translate(${naturalLetterX - containerRect.left}px, ${y}px)`;
      caret.style.height = `${height}px`;

      wordsContainer.style.transition = toggleTransition;
      wordsContainer.style.transform = 'translateX(0px)';

      toggleTimeoutRef.current = setTimeout(() => {
        caret.style.transition = '';
        wordsContainer.style.transition = '';
        wordsContainer.style.transform = '';
        toggleTimeoutRef.current = null;
      }, TOGGLE_DURATION_MS);
    } else if (effectiveTapeMode) {
      // Normal tape mode keystroke
      caret.style.transition = '';
      const anchorX = container.offsetWidth * (caretAnchorPercent / 100);

      caret.style.transform = `translate(${anchorX}px, ${y}px)`;
      caret.style.height = `${height}px`;

      if (wordsContainer) {
        const wordsRect = wordsContainer.getBoundingClientRect();
        const naturalLeft = letterX - wordsRect.left;
        wordsContainer.style.transform = `translateX(${anchorX - naturalLeft}px)`;
      }
    } else {
      // Normal non-tape mode
      caret.style.transition = '';
      caret.style.transform = `translate(${letterX - containerRect.left}px, ${y}px)`;
      caret.style.height = `${height}px`;
    }
  }, [
    caretAnchorPercent,
    currentCharIndex,
    currentWordIndex,
    effectiveTapeMode,
    letterRefs,
    typingAreaRef,
    wordsContainerRef,
  ]);

  return (
    <div
      id='caret'
      ref={caretRef}
      className={cx(
        `
          pointer-events-none absolute top-0 left-0 w-0.5 bg-foreground
          transition-transform duration-75 ease-in-out
        `,
        isBlinking && 'animate-caret-blink',
        !isVisible && 'invisible',
      )}
    />
  );
};

export default Caret;
