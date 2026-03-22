import { useEffect, useLayoutEffect, useRef } from 'react';

import { resolveTargetLetter, computeAnchorOffsets } from './utils';
import { useTypingStore } from '../../store';

interface CaretProps {
  wordsContainerRef: React.RefObject<HTMLDivElement | null>;
  caretRef: React.RefObject<HTMLDivElement | null>;
  letterRefs: React.RefObject<Map<string, HTMLSpanElement>>;
  caretAnchorPercent?: number;
}

const TOGGLE_DURATION_MS = 600 as const;
const LetterSliding = {
  DURATION_MS: 85,
  TIMING: 'linear',
} as const;

const TypingTransition = ({
  letterRefs,
  wordsContainerRef,
  caretAnchorPercent = 50,
  caretRef,
}: CaretProps) => {
  const currentWordIndex = useTypingStore((s) => s.currentWordIndex);
  const currentCharIndex = useTypingStore((s) => s.currentCharIndex);
  const effectiveTapeMode = useTypingStore((s) => s.getEffectiveTapeMode());

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
    const wordsContainer = wordsContainerRef.current;
    const caret = caretRef.current;
    if (!wordsContainer || !caret) {
      return;
    }

    // Derive the typing area from wordsContainer's parent — avoids depending
    // on a parent ref that React attaches *after* this child effect runs.
    const typingAreaContainer = wordsContainer.parentElement as HTMLDivElement;

    // 1. Resolve target letter
    const target = resolveTargetLetter(
      letterRefs.current,
      currentWordIndex,
      currentCharIndex,
    );
    if (!target) {
      return;
    }

    // 2. Detect toggle + cancel pending timeout
    const isToggle = prevTapeModeRef.current !== effectiveTapeMode;
    prevTapeModeRef.current = effectiveTapeMode;

    if (isToggle && toggleTimeoutRef.current) {
      clearTimeout(toggleTimeoutRef.current);
      toggleTimeoutRef.current = null;
    }

    // 3. Clear words transform in non-tape steady state
    if (!effectiveTapeMode && !isToggle && !toggleTimeoutRef.current) {
      wordsContainer.style.transform = '';
    }

    // 4. Shared DOM measurements
    const containerRect = typingAreaContainer.getBoundingClientRect();
    const letterRect = target.element.getBoundingClientRect();
    const letterX = target.useRightEdge ? letterRect.right : letterRect.left;
    const y = letterRect.top - containerRect.top;
    const height = letterRect.height;
    const toggleTransition = `transform ${TOGGLE_DURATION_MS}ms var(--ease-overshoot-soft)`;

    // 5. Compute caret X + words container side-effects
    let caretX: number;
    let caretTransition = `transform ${LetterSliding.DURATION_MS}ms ${LetterSliding.TIMING}`;
    let toggleCleanup: (() => void) | null = null;

    if (isToggle && effectiveTapeMode) {
      // TOGGLE ON: slide caret to anchor, shift words
      const { anchorX, naturalLeft } = computeAnchorOffsets(
        typingAreaContainer,
        wordsContainer,
        letterX,
        caretAnchorPercent,
      );
      caretX = anchorX;

      caretTransition = toggleTransition;
      wordsContainer.style.transition = toggleTransition;
      wordsContainer.style.transform = `translateX(${anchorX - naturalLeft}px)`;

      toggleCleanup = () => {
        caret.style.transition = '';
        wordsContainer.style.transition = `transform ${LetterSliding.DURATION_MS}ms ${LetterSliding.TIMING}`;
      };
    } else if (isToggle && !effectiveTapeMode) {
      caretTransition = toggleTransition;
      wordsContainer.style.transition = toggleTransition;
      wordsContainer.style.transform = 'translateX(0px)';

      // TOGGLE OFF: slide caret back, reset words
      const currentTranslateX = new DOMMatrix(
        getComputedStyle(wordsContainer).transform,
      ).m41;

      caretX = letterX - currentTranslateX - containerRect.left;

      toggleCleanup = () => {
        caret.style.transition = '';
        wordsContainer.style.transition = '';
        wordsContainer.style.transform = '';
      };
    } else if (effectiveTapeMode && wordsContainer) {
      // Normal tape mode: instant position at anchor
      const { anchorX, naturalLeft } = computeAnchorOffsets(
        typingAreaContainer,
        wordsContainer,
        letterX,
        caretAnchorPercent,
      );
      caretX = anchorX;
      wordsContainer.style.transition = `transform ${LetterSliding.DURATION_MS}ms ${LetterSliding.TIMING}`;
      wordsContainer.style.transform = `translateX(${anchorX - naturalLeft}px)`;
    } else {
      // Normal non-tape mode (or tape mode without wordsContainer)
      caretX = letterX - containerRect.left;
    }

    // 6. Apply caret styles (single place)
    caret.style.transition = caretTransition;
    caret.style.transform = `translate(${caretX}px, ${y}px)`;
    caret.style.height = `${height}px`;

    // 7. Schedule toggle cleanup
    if (toggleCleanup) {
      const fn = toggleCleanup;
      toggleTimeoutRef.current = setTimeout(() => {
        fn();
        toggleTimeoutRef.current = null;
      }, TOGGLE_DURATION_MS);
    }
  }, [
    caretAnchorPercent,
    caretRef,
    currentCharIndex,
    currentWordIndex,
    effectiveTapeMode,
    letterRefs,
    wordsContainerRef,
  ]);

  return null;
};

export default TypingTransition;
