// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField, fontProviders } from 'astro/config';
import playformCompress from '@playform/compress';
import cloudflare from '@astrojs/cloudflare';
import { cloudflareWorkerCache } from './src/lib/cache/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

// https://astro.build/config
export default defineConfig({
  site: 'https://hareki.dev',
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Maple Mono',
      optimizedFallbacks: false,
      fallbacks: ['monospace'],
      cssVariable: '--font-maple-mono',
      options: {
        /* 
        Generated with the following command, basic latin characters with "ễ" letter for the HeroSection
        pyftsubset ./MapleMonoNL-<FONT_WEIGHT>.ttf.woff2 \
          --output-file="./MapleMono-<FONT_WEIGHT>.woff2" \
          --flavor=woff2 \
          --layout-features="kern,calt" \
          --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD,U+1EC5" \
          --no-hinting \
          --desubroutinize 
        */
        variants: [
          {
            src: ['./src/assets/fonts/MapleMono-Medium.woff2'],
            weight: 'normal',
            style: 'normal',
          },

          {
            src: ['./src/assets/fonts/MapleMono-Bold.woff2'],
            weight: 'bold',
            style: 'normal',
          },
        ],
      },
    },
  ],
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
    sitemap(),
    robotsTxt(),
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
      provider: cloudflareWorkerCache(),
    },
  },
});
