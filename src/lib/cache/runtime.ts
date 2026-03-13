import type { CacheProviderFactory } from 'astro';

const factory: CacheProviderFactory = () => ({
  name: 'cloudflare-cdn',

  setHeaders(options) {
    const headers = new Headers();
    if (options.maxAge !== undefined) {
      let value = `max-age=${options.maxAge}`;
      if (options.swr !== undefined) {
        value += `, stale-while-revalidate=${options.swr}`;
      }
      headers.set('CDN-Cache-Control', value);
    }
    if (options.tags?.length) {
      headers.set('Cache-Tag', options.tags.join(','));
    }
    return headers;
  },

  async invalidate() {
    // No-op. Could use Cloudflare's purge API in the future.
  },
});

export default factory;
