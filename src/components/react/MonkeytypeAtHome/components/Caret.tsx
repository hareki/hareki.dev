import { type RefObject } from 'react';

import { cn } from 'tailwind-variants';

interface CaretProps {
  isBlinking: boolean;
  isVisible: boolean;
  ref: RefObject<HTMLDivElement | null>;
}

export const Caret = function Caret({
  isBlinking,
  isVisible,
  ref,
}: CaretProps) {
  return (
    <div
      ref={ref}
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
