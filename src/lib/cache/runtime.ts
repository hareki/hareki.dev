import type { CacheProviderFactory } from 'astro';

declare const __CACHE_BUILD_ID__: string;

interface CloudflareCacheStorage extends CacheStorage {
  /** 
   Accessing cloudflare local data center cache
     - https://developers.cloudflare.com/workers/runtime-apis/cache/#accessing-cache
     - https://developers.cloudflare.com/workers/reference/how-the-cache-works/
  */
  default: Cache;
}

const logger = (message: string) => console.log(`[Routing Cache] ${message}`);

// Currently using exclusively to cache server island responses
const cloudflareCacheFactory: CacheProviderFactory = () => ({
  name: 'cloudflare-worker',

  // https://docs.astro.build/en/reference/experimental-flags/route-caching/#writing-a-custom-cache-provider
  setHeaders(options) {
    const headers = new Headers();
    if (options.maxAge !== undefined) {
      let value = `max-age=${options.maxAge}`;
      if (options.swr !== undefined) {
        value += `, stale-while-revalidate=${options.swr}`;
      }
      // This will also help us cache the response in CDN level?
      headers.set('CDN-Cache-Control', value);
    }
    if (options.tags?.length) {
      headers.set('Cache-Tag', options.tags.join(','));
    }
    return headers;
  },

  async onRequest(context, next) {
    if (context.request.method !== 'GET') {
      return next();
    }

    // Can't use the built in Astro `memoryCache` since different cloudflare workers do not share the same global state
    // https://developers.cloudflare.com/workers/reference/how-workers-works/#distributed-execution
    // https://developers.cloudflare.com/workers/reference/how-workers-works/#isolates
    const cloudflareCache = (caches as CloudflareCacheStorage).default;
    const url = new URL(context.url);
    url.searchParams.set('__v', __CACHE_BUILD_ID__);
    const cacheKey = new Request(url.toString(), { method: 'GET' });

    const cachedResponse = await cloudflareCache.match(cacheKey);
    if (cachedResponse) {
      // WORKER CACHE HIT: return cached response we previously created below
      logger(`Cache hit for ${context.url.href}`);
      return new Response(cachedResponse.body, cachedResponse);
    }

    let originalResponse;
    try {
      originalResponse = await next();
    } catch (error) {
      logger(`Error fetching response for ${context.url.href}`);
      throw error;
    }

    if (originalResponse.status !== 200) {
      return originalResponse;
    }

    const cdnCacheControl = originalResponse.headers.get('CDN-Cache-Control');
    if (!cdnCacheControl) {
      return originalResponse;
    }

    // WORKER CACHE MISS: create a cached response entry for future requests

    // Instruct the browsers to cache this response, so not even network requests are made for the same client.
    // Also control how long the data live in Worker cache,
    // these cached responses are used to serve other clients that don't have cache in their browsers yet
    // https://developers.cloudflare.com/workers/examples/cache-api/
    // https://developers.cloudflare.com/workers/runtime-apis/cache/#headers
    const headers = new Headers(originalResponse.headers);
    headers.set('Cache-Control', cdnCacheControl);

    const transformedResponse = new Response(originalResponse.body, {
      status: originalResponse.status,
      statusText: originalResponse.statusText,
      headers,
    });

    // waitUntil should be there when using Cloudflare Workers
    // But there's a bug making it unavailable in both type and runtime levels
    // https://github.com/withastro/astro/issues/16145
    const waitUntil = (context as any).waitUntil;
    const responseToCache = transformedResponse.clone();

    if (waitUntil) {
      waitUntil(cloudflareCache.put(cacheKey, responseToCache));
    } else {
      await cloudflareCache.put(cacheKey, responseToCache);
    }

    logger(`Cache miss for ${context.url.href}`);
    return transformedResponse;
  },

  async invalidate() {
    // No-op. Could use Cloudflare's purge API in the future.
    // https://developers.cloudflare.com/workers/reference/how-the-cache-works/#purge-assets-stored-with-the-cache-api
    // Right now I can go to cloudflare dashboard and purge them manually
  },
});

export default cloudflareCacheFactory;
