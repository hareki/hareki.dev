import type { BadgeColor } from '@/components/ui/Badge.astro';

const GITHUB_LANGUAGE_COLORS: Record<string, BadgeColor> = {
  JavaScript: 'yellow',
  TypeScript: 'blue',
  Go: 'blue',
  Rust: 'maroon',
  Ruby: 'red',
  Shell: 'green',
  Lua: 'blue',
  HTML: 'red',
  CSS: 'mauve',
  GLSL: 'teal',
  Svelte: 'peach',
  Astro: 'peach',
};

export const getLanguageBadgeColor = (language: string): BadgeColor => {
  const hex = GITHUB_LANGUAGE_COLORS[language];

  if (!hex) {
    return 'blue';
  }
  return hex;
};
