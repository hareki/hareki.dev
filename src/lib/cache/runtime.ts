import type { CacheProviderFactory } from 'astro';

declare const __CACHE_BUILD_ID__: string;

interface CloudflareCacheStorage extends CacheStorage {
  default: Cache;
}

const factory: CacheProviderFactory = () => ({
  name: 'cloudflare-cdn',

  // https://docs.astro.build/en/reference/experimental-flags/route-caching/#writing-a-custom-cache-provider
  setHeaders(options) {
    console.log('[Worker]: setHeaders called');
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

  async onRequest(context, next) {
    console.log('[Worker] Invoking onRequest', context.url);
    if (context.request.method !== 'GET') {
      console.log('[Worker] Skipping non-GET request', context.request.method);
      return next();
    }

    // Right way to access the cloudflare global cache:
    // https://developers.cloudflare.com/workers/runtime-apis/cache/#accessing-cache
    // https://developers.cloudflare.com/workers/reference/how-the-cache-works/

    // Can't use the built in Astro `memoryCache` since different cloudflare workers do not share the same global state
    // https://developers.cloudflare.com/workers/reference/how-workers-works/#distributed-execution
    // https://developers.cloudflare.com/workers/reference/how-workers-works/#isolates
    const cache = (caches as CloudflareCacheStorage).default;
    const url = new URL(context.url);
    url.searchParams.set('__v', __CACHE_BUILD_ID__);
    const cacheKey = new Request(url.toString(), { method: 'GET' });

    const cached = await cache.match(cacheKey);
    if (cached) {
      // WORKER CACHE HIT: return cached response we previously created below
      console.log('[Worker] Cache hit', context.url);
      return new Response(cached.body, cached);
    }

    const response = await next();

    if (response.status !== 200) {
      console.log('[Worker] Skipping non-200 response', response.status);
      return response;
    }

    const cdnCacheControl = response.headers.get('CDN-Cache-Control');
    if (!cdnCacheControl) {
      console.log('[Worker] Skipping missing CDN-Cache-Control header');
      return response;
    }

    // WORKER CACHE MISS: create a cached response entry for future requests
    const headers = new Headers(response.headers);
    // Control how long the data live in Worker cache
    // https://developers.cloudflare.com/workers/examples/cache-api/
    // https://developers.cloudflare.com/workers/runtime-apis/cache/#headers
    headers.set('Cache-Control', cdnCacheControl);

    // Normally this would get cleaned up by Astro because it's set in `setHeaders`
    // https://docs.astro.build/en/reference/experimental-flags/route-caching/#setheaders
    // But since we're returning a cached response, the server island components don't re-run => no `setHeaders` is called
    // headers.delete('CDN-Cache-Control');

    const responseToCache = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

    // waitUntil should be there when using Cloudflare Workers
    // But there's a bug making it unavailable in both type and runtime levels
    // https://github.com/withastro/astro/issues/16145
    const waitUntil = (context as any).waitUntil;
    const cachedResponse = responseToCache.clone();

    if (waitUntil) {
      waitUntil(cache.put(cacheKey, cachedResponse));
    } else {
      await cache.put(cacheKey, cachedResponse);
    }

    console.log('[Worker] Cache miss, entry generated', context.url);
    return responseToCache;
  },

  async invalidate() {
    // No-op. Could use Cloudflare's purge API in the future.
    // https://developers.cloudflare.com/workers/reference/how-the-cache-works/#purge-assets-stored-with-the-cache-api
  },
});

export default factory;
