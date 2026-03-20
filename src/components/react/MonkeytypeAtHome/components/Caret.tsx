import { useLayoutEffect, useRef } from 'react';

import { cn } from 'tailwind-variants';

import { useTypingStore } from '../store';

interface CaretProps {
  typingAreaRef: React.RefObject<HTMLDivElement | null>;
  letterRefs: React.RefObject<Map<string, HTMLSpanElement>>;
}

export const Caret = function Caret({ typingAreaRef, letterRefs }: CaretProps) {
  const caretRef = useRef<HTMLDivElement>(null);

  const isBlinking = useTypingStore((s) => s.screen === 'idle');
  const isVisible = useTypingStore((s) => s.isFocused);
  const currentWordIndex = useTypingStore((s) => s.currentWordIndex);
  const currentCharIndex = useTypingStore((s) => s.currentCharIndex);
  const effectiveTapeMode = useTypingStore(
    (s) => s.isTapeModeOn || s.isTapeModeForced,
  );

  useLayoutEffect(() => {
    const container = typingAreaRef.current;
    const caret = caretRef.current;
    if (!container || !caret) {
      return;
    }

    const containerRect = container.getBoundingClientRect();

    let x: number;
    let y: number;
    let height: number;

    // Try to get the current letter element (where the caret should appear before)
    const currentKey = `${currentWordIndex}-${currentCharIndex}`;
    const currentEl = letterRefs.current.get(currentKey);

    if (currentEl) {
      const rect = currentEl.getBoundingClientRect();
      x = rect.left - containerRect.left;
      y = rect.top - containerRect.top;
      height = rect.height;
    } else {
      // If no current letter (past end of word), position after the last letter
      const prevKey = `${currentWordIndex}-${currentCharIndex - 1}`;
      const prevEl = letterRefs.current.get(prevKey);
      if (prevEl) {
        const rect = prevEl.getBoundingClientRect();
        x = rect.right - containerRect.left;
        y = rect.top - containerRect.top;
        height = rect.height;
      } else {
        // Fallback: first letter of current word
        const firstKey = `${currentWordIndex}-0`;
        const firstEl = letterRefs.current.get(firstKey);
        if (firstEl) {
          const rect = firstEl.getBoundingClientRect();
          x = rect.left - containerRect.left;
          y = rect.top - containerRect.top;
          height = rect.height;
        } else {
          return;
        }
      }
    }

    // In tape mode, x is pinned to the anchor (center of container)
    if (effectiveTapeMode) {
      x = container.offsetWidth * 0.5;
    }

    caret.style.transform = `translate(${x}px, ${y}px)`;
    caret.style.height = `${height}px`;
  }, [
    currentWordIndex,
    currentCharIndex,
    typingAreaRef,
    letterRefs,
    effectiveTapeMode,
  ]);

  return (
    <div
      ref={caretRef}
      className={cn(
        'pointer-events-none absolute top-0 left-0 w-0.5 bg-foreground',
        isBlinking && 'animate-caret-blink',
        !isVisible && 'invisible',
      )}
      style={{
        transition: 'transform 80ms ease',
      }}
    />
  );
};
