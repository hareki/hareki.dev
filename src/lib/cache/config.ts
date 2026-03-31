import type { CacheProviderConfig } from 'astro';

export const cloudflareWorkerCache = (): CacheProviderConfig => ({
  entrypoint: new URL('./runtime.ts', import.meta.url),
});
