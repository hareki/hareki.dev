# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site (hareki.dev) built with Astro 6 + React 19 islands, deployed to Cloudflare Workers. Single-page site with interactive components (typing test game) and GitHub API integration.

## Commands

```bash
pnpm dev              # Dev server at localhost:4321 (with --host)
pnpm build            # Production build to dist/
pnpm preview          # Preview production build
pnpm diagnose         # Run typecheck + test + format + lint (use this for validation)
pnpm diagnose --fix   # Same but auto-fix issues
pnpm test             # Run all tests once (vitest run)
pnpm test:watch       # Run tests in watch mode
pnpm format           # Prettier on src/
pnpm lint             # ESLint on src/
pnpm typecheck        # astro check (TypeScript validation)
pnpm generate-types   # Generate Cloudflare Worker types
```

Use `pnpm diagnose` (not `npx tsc --noEmit`) for type checking and linting. To run a single test file: `pnpm vitest run path/to/file.test.ts`.

## Architecture

**Component model**: Astro for static UI and page structure, React only for interactive features (client islands). React 19 with Compiler enabled — no manual `useMemo`/`useCallback` needed.

**Styling**: Tailwind CSS 4 with Catppuccin color theme via CSS variables defined in `src/styles/`. Starwind UI component library in `src/components/starwind/`. Uses `tailwind-variants` for component variant generation and `tailwind-merge` for class merging.

**State management**: Zustand with a custom dispatch/reducer pattern for the typing game (`src/components/react/MonkeytypeAtHome/`).

**Data**: Co-located with the components that consume them. Only shared/global data remains in `src/data/` (contact info, git config). Feature-specific data lives in `data.ts` files next to their components (e.g., `src/components/sections/work-section/work-experience-section/data.ts`).

**GitHub integration**: Stats fetched via API at runtime with Cloudflare CDN caching (`src/lib/github/`).

**Testing**: Vitest with global test utilities enabled. Test setup in `vitest.setup.ts` mocks the Cloudflare Workers runtime. Tests are co-located with source files as `*.test.ts`.

**Deployment**: Cloudflare Workers via `@astrojs/cloudflare` adapter. Config in `wrangler.jsonc`.

## Key Conventions

### TypeScript

- Use `import { type Foo }` (inline type imports), enforced by ESLint
- Prefer `interface` over `type` aliases
- Path alias: `@/*` maps to `src/*`

### Code Style

- Function expressions only (no function declarations): `const foo = () => {}`
- Always use curly braces for blocks (enforced by `curly: 'error'`)
- No anonymous default exports
- `.tsx` files should prefer default exports

### Starwind UI

When using Starwind UI components, import exported TV (tailwind-variants) variants from the `.astro` component files instead of copy-pasting class strings. Starwind components live in `src/components/starwind/`.
