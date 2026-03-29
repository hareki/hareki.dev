import { describe, it, expect } from 'vitest';

import { getLanguageBadgeColor } from './language-colors';

describe('getLanguageBadgeColor', () => {
  it('returns mapped color for known languages', () => {
    expect(getLanguageBadgeColor('TypeScript')).toBe('blue');
    expect(getLanguageBadgeColor('JavaScript')).toBe('yellow');
    expect(getLanguageBadgeColor('Rust')).toBe('maroon');
    expect(getLanguageBadgeColor('Astro')).toBe('peach');
  });

  it('returns "text" for unknown languages', () => {
    expect(getLanguageBadgeColor('Haskell')).toBe('text');
    expect(getLanguageBadgeColor('Unknown')).toBe('text');
  });
});
