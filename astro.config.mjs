import tailwindcss from '@tailwindcss/vite';
// @ts-check
import { defineConfig } from 'astro/config';

import playformCompress from '@playform/compress';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    playformCompress({
      CSS: true,
      HTML: true,
      JavaScript: true,
    }),
  ],
});
