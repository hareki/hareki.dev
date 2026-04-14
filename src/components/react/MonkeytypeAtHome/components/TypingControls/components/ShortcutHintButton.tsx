import type { ComponentProps, MouseEvent } from 'react';

import { cn } from 'tailwind-variants';

interface ShortcutHintButtonProps {
  keys: string[];
  label: string;
  onClick: () => void;
  ref?: React.RefObject<HTMLButtonElement | null>;
  checked?: boolean;
  className?: string;
  hidden?: boolean;
}

const ShortcutHintButton = ({
  keys,
  label,
  onClick,
  ref,
  checked,
  className,
  hidden,
}: ShortcutHintButtonProps) => {
  const isCheckbox = checked !== undefined;
  const checkedProps: ComponentProps<'button'> = isCheckbox
    ? { 'aria-checked': checked, role: 'checkbox' }
    : {};

  // PERF: Avoid stealing input focus and flashing isFocused state
  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <button
      {...checkedProps}
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden}
      ref={ref}
      className={cn(
        `
          group flex h-9 bouncy-click cursor-pointer items-center gap-1.5
          rounded-sm px-2.5 text-subtext1-foreground transition-all outline-none
          select-none
          hover:bg-primary/10 hover:text-primary
          focus-visible:ring-2 focus-visible:ring-primary/75
          motion-safe:not-disabled:hocus:scale-102
        `,
        checked && 'bg-primary/15 text-primary',
        className,
      )}
      onMouseDown={handleMouseDown}
      onClick={onClick}
    >
      <div className='space-x-1'>
        {keys.map((key) => (
          <kbd
            key={key}
            className={cn(
              `
                rounded-xs border border-subtext1-foreground px-1.5 py-0.5
                font-display text-xs transition-colors
                group-hover:border-primary
              `,
              checked && 'border-primary bg-primary text-background',
            )}
          >
            {key}
          </kbd>
        ))}
      </div>
      <span>{label}</span>
    </button>
  );
};

export default ShortcutHintButton;
