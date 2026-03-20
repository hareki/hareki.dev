import { cn } from 'tailwind-variants';

interface CaretProps {
  x: number;
  y: number;
  height: number;
  isBlinking: boolean;
}

export const Caret = ({ x, y, height, isBlinking }: CaretProps) => {
  return (
    <div
      className={cn('pointer-events-none absolute top-0 left-0 w-0.5 bg-foreground', isBlinking && 'animate-caret-blink')}
      style={{
        height,
        transform: `translate(${x}px, ${y}px)`,
        transition: 'transform 80ms ease',
      }}
    />
  );
};
