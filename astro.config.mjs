import tailwindcss from '@tailwindcss/vite';
// @ts-check
import { defineConfig } from 'astro/config';

import playformCompress from '@playform/compress';

import cloudflare from '@astrojs/cloudflare';

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
  ],

  adapter: cloudflare(),
});