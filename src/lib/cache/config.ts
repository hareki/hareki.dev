import type { CacheProviderConfig } from 'astro';

export const cloudflareCdnCache = (): CacheProviderConfig => ({
  entrypoint: new URL('./runtime.ts', import.meta.url),
});
