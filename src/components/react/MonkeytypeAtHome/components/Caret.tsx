import { cx } from 'tailwind-variants';

import { useTypingStore } from '../store';

interface CaretProps {
  ref: React.RefObject<HTMLDivElement | null>;
}

const Caret = ({ ref }: CaretProps) => {
  const isBlinking = useTypingStore((s) => s.screen === 'idle');
  const isFocused = useTypingStore((s) => s.isFocused);

  return (
    <div
      id='caret'
      ref={ref}
      className={cx(
        `
          pointer-events-none absolute top-0 left-0 w-0.5 rounded-full
          bg-rosewater
        `,
        isBlinking && 'animate-caret-blink',
        !isFocused && 'invisible',
      )}
    />
  );
};

export default Caret;
