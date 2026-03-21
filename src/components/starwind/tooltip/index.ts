import Tooltip from './Tooltip.astro';
import TooltipContent from './TooltipContent.astro';
import TooltipTrigger from './TooltipTrigger.astro';
import { tooltip, tooltipCaret, tooltipContent } from './tooltipVariants';

const TooltipVariants = {
  tooltip,
  tooltipContent,
  tooltipCaret,
};

export { Tooltip, TooltipContent, TooltipTrigger, TooltipVariants };
