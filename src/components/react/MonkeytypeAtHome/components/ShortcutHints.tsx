import { memo } from 'react';

import { cn } from 'tailwind-variants';

import { isMac } from '../utils';

const kbdClass = 'rounded border border-overlay0 px-1.5 py-0.5 text-xs';

const ghostButtonClass =
  'flex cursor-pointer select-none items-center gap-1.5 rounded-md px-2 py-1 text-overlay1 transition-colors hover:bg-overlay0/10';

interface ShortcutHintsProps {
  isTapeModeOn: boolean;
  isTapeModeForced: boolean;
  onRestart: () => void;
  onToggleTapeMode: () => void;
  restartButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export const ShortcutHints = memo(function ShortcutHints({
  isTapeModeOn,
  isTapeModeForced,
  onRestart,
  onToggleTapeMode,
  restartButtonRef,
}: ShortcutHintsProps) {
  const modKey = isMac() ? 'Cmd' : 'Ctrl';

  return (
    <div className='flex items-center gap-4 text-sm'>
      <button
        ref={restartButtonRef}
        type='button'
        className={cn(ghostButtonClass, 'outline-none focus-visible:bg-overlay0/10')}
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
          className={cn(ghostButtonClass, isTapeModeOn && 'bg-overlay0/10')}
          onClick={onToggleTapeMode}
          tabIndex={-1}
        >
          <kbd className={kbdClass}>{modKey}</kbd>
          <kbd className={kbdClass}>.</kbd>
          <span>Tape Mode</span>
        </button>
      )}
    </div>
  );
});
