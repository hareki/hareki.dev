import { useCallback, useLayoutEffect, useRef, useState } from 'react';

interface CaretPosition {
  x: number;
  y: number;
  height: number;
}

export function useCaretPosition(
  currentWordIndex: number,
  currentCharIndex: number,
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const letterRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const [caretPos, setCaretPos] = useState<CaretPosition>({ x: 0, y: 0, height: 0 });

  const registerRef = useCallback((key: string, el: HTMLSpanElement | null) => {
    if (el) {
      letterRefs.current.set(key, el);
    } else {
      letterRefs.current.delete(key);
    }
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {return;}

    const containerRect = container.getBoundingClientRect();

    // Try to get the current letter element (where the caret should appear before)
    const currentKey = `${currentWordIndex}-${currentCharIndex}`;
    const currentEl = letterRefs.current.get(currentKey);

    if (currentEl) {
      const rect = currentEl.getBoundingClientRect();
      setCaretPos({
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        height: rect.height,
      });
      return;
    }

    // If no current letter (past end of word), position after the last letter
    const prevKey = `${currentWordIndex}-${currentCharIndex - 1}`;
    const prevEl = letterRefs.current.get(prevKey);
    if (prevEl) {
      const rect = prevEl.getBoundingClientRect();
      setCaretPos({
        x: rect.right - containerRect.left,
        y: rect.top - containerRect.top,
        height: rect.height,
      });
      return;
    }

    // Fallback: first letter of current word
    const firstKey = `${currentWordIndex}-0`;
    const firstEl = letterRefs.current.get(firstKey);
    if (firstEl) {
      const rect = firstEl.getBoundingClientRect();
      setCaretPos({
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        height: rect.height,
      });
    }
  }, [currentWordIndex, currentCharIndex, containerRef]);

  return { caretPos, registerRef };
}
