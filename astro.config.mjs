// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import playformCompress from '@playform/compress';

import cloudflare from '@astrojs/cloudflare';

import { cloudflareCdnCache } from './src/lib/cache/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
      hmr: false,
    },
  },

  integrations: [
    playformCompress({
      CSS: true,
      HTML: true,
      JavaScript: true,
    }),
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],

  adapter: cloudflare(),

  experimental: {
    cache: {
      provider: cloudflareCdnCache(),
    },
  },
});
