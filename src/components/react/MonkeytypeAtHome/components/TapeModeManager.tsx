import { useEffect, useRef } from 'react';

import { useTypingStore } from '../store';
import { TEXT } from '../types';

interface TapeModeManagerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const TapeModeManager = ({ containerRef }: TapeModeManagerProps) => {
  const measureRef = useRef<HTMLDivElement>(null);

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
