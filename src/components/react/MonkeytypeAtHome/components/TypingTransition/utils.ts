import type { TargetLetter } from './types';

export const resolveTargetLetter = (
  letterRefs: Map<string, HTMLSpanElement>,
  wordIndex: number,
  charIndex: number,
): TargetLetter | null => {
  const el = letterRefs.get(`${wordIndex}-${charIndex}`);
  if (el) {
    return { element: el, useRightEdge: false };
  }

  const prevEl = letterRefs.get(`${wordIndex}-${charIndex - 1}`);
  if (prevEl) {
    return { element: prevEl, useRightEdge: true };
  }

  const firstEl = letterRefs.get(`${wordIndex}-0`);
  return firstEl ? { element: firstEl, useRightEdge: false } : null;
};

export const computeAnchorOffsets = (
  container: HTMLDivElement,
  wordsContainer: HTMLDivElement,
  letterX: number,
  anchorPercent: number,
) => {
  const anchorX = container.offsetWidth * (anchorPercent / 100);
  const naturalLeft = letterX - wordsContainer.getBoundingClientRect().left;
  return { anchorX, naturalLeft };
};
