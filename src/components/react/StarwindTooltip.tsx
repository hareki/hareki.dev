import { useEffect, type ReactNode } from 'react';

import { IconCaretUpFilled } from '@tabler/icons-react';

import { TooltipVariants } from '@/components/starwind/tooltip';
import { initStarwind } from '@/lib/starwind/event';

interface StarwindTooltipProps {
  children: ReactNode;
  content: ReactNode;
  openDelay?: number;
  closeDelay?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  animationDuration?: number;
  disableHoverableContent?: boolean;
  className?: string;
}

const { tooltip, tooltipCaret, tooltipContent } = TooltipVariants;

const StarwindTooltip = ({
  children,
  content,
  openDelay = 300,
  closeDelay = 300,
  side = 'top',
  align = 'center',
  sideOffset = 8,
  animationDuration = 150,
  disableHoverableContent = false,
  className,
}: StarwindTooltipProps) => {
  useEffect(() => {
    initStarwind();
  }, []);

  return (
    <div
      className={tooltip({ class: className })}
      data-state='closed'
      data-open-delay={openDelay}
      data-close-delay={closeDelay}
      {...(!disableHoverableContent && { 'data-content-hoverable': '' })}
      data-slot='tooltip'
    >
      {children}
      <div
        className={tooltipContent()}
        data-state='closed'
        data-side={side}
        data-align={align}
        data-side-offset={sideOffset}
        data-avoid-collisions=''
        role='tooltip'
        style={{ animationDuration: `${animationDuration}ms` }}
        data-slot='tooltip-content'
      >
        {content}
        <IconCaretUpFilled className={tooltipCaret()} />
      </div>
    </div>
  );
};

export default StarwindTooltip;
