// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';

import playformCompress from '@playform/compress';

import cloudflare from '@astrojs/cloudflare';

import { cloudflareCdnCache } from './src/lib/cache/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://hareki.dev',
  build: {
    // PERF: This resource is render blocking anyway, inline it to avoid round trips
    inlineStylesheets: 'always',
  },

  vite: {
    plugins: [tailwindcss()],
    define: {
      __CACHE_BUILD_ID__: JSON.stringify(String(Date.now())),
    },
    server: {
      hmr: true,
    },
  },

  integrations: [
    playformCompress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          collapseInlineTagWhitespace: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true,
          preserveLineBreaks: false,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,

          // Causes react hydration errors
          // removeEmptyElements: true,

          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          sortAttributes: true,
          sortClassName: true,
          useShortDoctype: true,
        },
      },
      JavaScript: true,
    }),
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],

  env: {
    schema: {
      GITHUB_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },

  adapter: cloudflare(),

  experimental: {
    svgo: true,
    cache: {
      provider: cloudflareCdnCache(),
    },
  },
});
