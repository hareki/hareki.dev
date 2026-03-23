import type { ComponentProps } from 'react';

import { cx } from 'tailwind-variants';

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

  return (
    <button
      {...checkedProps}
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden}
      ref={ref}
      className={cx(
        `
          group -mx-1.5 flex bouncy-click cursor-pointer items-center gap-1.5
          rounded-md p-1.5 text-muted-foreground transition-all outline-none
          select-none
          hover:bg-primary/10 hover:text-primary
          focus-visible:ring-2 focus-visible:ring-primary/70
          motion-safe:hocus:scale-102
        `,
        checked && 'bg-primary/10 text-primary',
        className,
      )}
      onClick={onClick}
    >
      <div className='space-x-1'>
        {keys.map((key) => (
          <kbd
            key={key}
            className={cx(
              `
                rounded-sm border border-muted-foreground px-1.5 py-0.5 text-xs
                transition-colors
                group-hover:border-primary
              `,
              checked && 'border-primary bg-primary/60 text-background',
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
