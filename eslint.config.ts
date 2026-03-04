import { fileURLToPath } from 'node:url';

import { includeIgnoreFile } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { importX } from 'eslint-plugin-import-x';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignorePath),
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,astro}'],
    plugins: {
      // @ts-expect-error null and undefined is effectively the same
      'import-x': importX,
    },
    extends: ['import-x/flat/recommended'],
    rules: {
      // Starwind UI does a lot of "any" type casting
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      // Rules don't with astro eslint parser
      'import-x/no-unresolved': 'off',
      'import-x/namespace': 'off',

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
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
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
      'better-tailwindcss/no-unknown-classes': 'off',
    },
  },
]);
