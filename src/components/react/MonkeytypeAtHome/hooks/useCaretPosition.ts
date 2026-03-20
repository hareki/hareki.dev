import { useCallback, useLayoutEffect, useRef } from 'react';

export function useCaretPosition(
  currentWordIndex: number,
  currentCharIndex: number,
  containerRef: React.RefObject<HTMLDivElement | null>,
  caretRef: React.RefObject<HTMLDivElement | null>,
  isTapeModeOn: boolean,
) {
  const letterRefs = useRef<Map<string, HTMLSpanElement>>(new Map());

  const registerRef = useCallback((key: string, el: HTMLSpanElement | null) => {
    if (el) {
      letterRefs.current.set(key, el);
    } else {
      letterRefs.current.delete(key);
    }
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const caret = caretRef.current;
    if (!container || !caret) {return;}

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
    if (isTapeModeOn) {
      x = container.offsetWidth * 0.5;
    }

    caret.style.transform = `translate(${x}px, ${y}px)`;
    caret.style.height = `${height}px`;
  }, [currentWordIndex, currentCharIndex, containerRef, caretRef, isTapeModeOn]);

  return { registerRef };
}
