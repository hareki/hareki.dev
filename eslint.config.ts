import js from '@eslint/js';
import eslintParserAstro from 'astro-eslint-parser';
import { defineConfig } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { importX } from 'eslint-plugin-import-x';
import globals from 'globals';
import tseslint, { parser as eslintParserTypeScript } from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{ts,tsx,astro}'],
    plugins: {
      // @ts-expect-error null and undefined is effectively the same
      'import-x': importX,
    },
    extends: ['import-x/flat/recommended'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      'import-x/no-cycle': 'error',
      'import-x/no-anonymous-default-export': 'error',
      'import-x/default': 'error',
      'import-x/no-named-as-default-member': 'off',
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['sibling', 'parent'],
            'index',
            'object',
            'type',
          ],

          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],

          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    files: ['**/*.{mjs,ts,tsx,astro}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-strict'],
  {
    files: ['**/*.{tsx,astro}'],
    extends: [eslintPluginBetterTailwindcss.configs.recommended],
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/styles/tailwind/index.css',
      },
    },
    rules: {
      'better-tailwindcss/enforce-consistent-variable-syntax': 'warn',
      'better-tailwindcss/enforce-consistent-important-position': 'warn',
      'better-tailwindcss/enforce-shorthand-classes': 'warn',
    },
  },
  {
    files: ['**/*.{astro}'],

    languageOptions: {
      parser: eslintParserAstro,
      parserOptions: {
        parser: eslintParserTypeScript,
      },
    },
  },
]);
