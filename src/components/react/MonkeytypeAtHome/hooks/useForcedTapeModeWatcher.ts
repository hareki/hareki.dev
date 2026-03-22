import { useEffect } from 'react';

import { useTypingStore } from '../store';

type ContainerRef = React.RefObject<HTMLDivElement | null>;

export const useForcedTapeModeWatcher = (
  containerRef: ContainerRef,
  wordsContainerRef: ContainerRef,
) => {
  const dispatch = useTypingStore((s) => s.dispatch);

  // Forced tape mode detection via ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    const wordsContainer = wordsContainerRef.current;
    if (!container || !wordsContainer) {
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
      checkOverflow(
        wordsContainer.scrollWidth,
        entry.contentBoxSize[0].inlineSize,
      );
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [containerRef, dispatch, wordsContainerRef]);
};
