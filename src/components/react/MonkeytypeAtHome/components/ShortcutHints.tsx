import { cx } from 'tailwind-variants';

import { useTypingStore } from '../store';

const kbdClass = cx('rounded-sm border border-overlay0 px-1.5 py-0.5 text-xs');

const ghostButtonClass = cx(
  `
    flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-overlay1
    transition-colors select-none
    hover:bg-overlay0/10
  `,
);

interface ShortcutHintsProps {
  onRestart: () => void;
  restartButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const ShortcutHints = function ShortcutHints({
  onRestart,
  restartButtonRef,
}: ShortcutHintsProps) {
  const isTapeModeOn = useTypingStore((s) => s.isTapeModeOn);
  const isTapeModeForced = useTypingStore((s) => s.isTapeModeForced);
  const dispatch = useTypingStore((s) => s.dispatch);

  const handleToggleTapeMode = () => {
    dispatch({ type: 'TOGGLE_TAPE_MODE' });
  };

  return (
    <div className='flex items-center gap-4 text-sm'>
      <button
        ref={restartButtonRef}
        type='button'
        className={cx(
          ghostButtonClass,
          `
            outline-none
            focus-visible:bg-overlay0/10
          `,
        )}
        onClick={onRestart}
        tabIndex={0}
      >
        <kbd className={kbdClass}>Tab</kbd>
        <kbd className={kbdClass}>Enter</kbd>
        <span>Restart</span>
      </button>

      {!isTapeModeForced && (
        <button
          type='button'
          className={cx(ghostButtonClass, isTapeModeOn && 'bg-overlay0/10')}
          onClick={handleToggleTapeMode}
          tabIndex={-1}
        >
          <kbd className={kbdClass}>Cmd/Ctrl</kbd>
          <kbd className={kbdClass}>.</kbd>
          <span>Tape Mode</span>
        </button>
      )}
    </div>
  );
};

export default ShortcutHints;
