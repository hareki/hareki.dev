import type { BadgeColor } from '@/components/ui/Badge.astro';

interface Technology {
  name: string;
  color: BadgeColor;
}

interface CorePrinciple {
  name: string;
  description: string;
}

const CORE_PRINCIPLES: CorePrinciple[] = [
  {
    name: 'Performance:',
    description:
      "Astro's zero-JS baseline. Render-optimized React for the typing test",
  },
  {
    name: 'System-Aware:',
    description: 'Honors system color scheme and reduced-motion preferences',
  },
  {
    name: 'Accessible:',
    description: 'Semantic markup, keyboard navigable, screen-reader friendly',
  },

  {
    name: 'Subtle Motion:',
    description:
      'Minimal transitions that respond to hover, focus, and interaction',
  },
];

const TECHNOLOGIES: Technology[] = [
  {
    name: 'Astro',
    color: 'maroon',
  },
  {
    name: 'Tailwind',
    color: 'sky',
  },
  {
    name: 'Starwind UI',
    color: 'text',
  },
  {
    name: 'React',
    color: 'blue',
  },
  {
    name: 'Zustand',
    color: 'text',
  },
];

export const ThisWebSiteData = {
  CORE_PRINCIPLES,
  TECHNOLOGIES,
};
