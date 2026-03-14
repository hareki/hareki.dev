import { fileURLToPath } from 'node:url';

import { includeIgnoreFile } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { importX } from 'eslint-plugin-import-x';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignorePath),
  {
    files: ['**/*.{mjs,ts,tsx,astro}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['**/*.{ts,tsx,astro}'],
    plugins: {
      'import-x': importX,
    },
    extends: [
      tseslint.configs.recommended,
      'import-x/flat/recommended',
      ...eslintPluginAstro.configs.recommended,
      ...eslintPluginAstro.configs['jsx-a11y-strict'],
      eslintPluginBetterTailwindcss.configs.recommended,
      eslintConfigPrettier,
    ],
    settings: {
      // Use espree for JS files so import-x doesn't parse them with the Astro parser
      'import-x/parsers': {
        espree: ['.js', '.cjs', '.mjs'],
      },
      'better-tailwindcss': {
        entryPoint: 'src/styles/tailwind/index.css',
      },
    },
    rules: {
      'better-tailwindcss/enforce-consistent-variable-syntax': 'warn',
      'better-tailwindcss/enforce-consistent-important-position': 'warn',
      'better-tailwindcss/enforce-shorthand-classes': 'warn',
      'better-tailwindcss/no-unknown-classes': [
        'warn',
        {
          ignore: ['^starwind'],
        },
      ],
      'better-tailwindcss/enforce-consistent-line-wrapping': [
        'warn',
        // Matches what we have in .prettierrc
        {
          printWidth: 80,
          lineBreakStyle: 'unix',
          indent: 2,
          strictness: 'loose',
        },
      ],

      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      // Starwind UI does a lot of "any" type casting
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      curly: 'error',
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
]);
