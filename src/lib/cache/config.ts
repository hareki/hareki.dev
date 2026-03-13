import type { CacheProviderConfig } from 'astro';

export function cloudflareCdnCache(): CacheProviderConfig {
  return {
    entrypoint: new URL('./runtime.ts', import.meta.url),
  };
}
