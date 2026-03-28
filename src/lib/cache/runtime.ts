import type { CacheProviderFactory } from 'astro';

declare const __CACHE_BUILD_ID__: string;

interface CloudflareCacheStorage extends CacheStorage {
  default: Cache;
}

const factory: CacheProviderFactory = () => ({
  name: 'cloudflare-cdn',

  // For CDN Providers
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

  // For Runtime Providers
  async onRequest(context, next) {
    if (context.request.method !== 'GET') {
      return next();
    }

    const cache = (caches as CloudflareCacheStorage).default;
    const url = new URL(context.url);
    url.searchParams.set('__v', __CACHE_BUILD_ID__);
    const cacheKey = new Request(url.toString(), { method: 'GET' });

    const cached = await cache.match(cacheKey);
    if (cached) {
      return new Response(cached.body, cached);
    }

    const response = await next();

    if (response.status !== 200) {
      return response;
    }

    const cdnCacheControl = response.headers.get('CDN-Cache-Control');
    if (!cdnCacheControl) {
      return response;
    }

    const headers = new Headers(response.headers);
    headers.set('Cache-Control', cdnCacheControl);
    headers.delete('CDN-Cache-Control');

    const responseToCache = new Response(response.clone().body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

    const waitUntil = (
      context as typeof context & {
        waitUntil?: (promise: Promise<unknown>) => void;
      }
    ).waitUntil;

    if (waitUntil) {
      waitUntil(cache.put(cacheKey, responseToCache));
    } else {
      await cache.put(cacheKey, responseToCache);
    }

    return response;
  },

  async invalidate() {
    // No-op. Could use Cloudflare's purge API in the future.
  },
});

export default factory;
