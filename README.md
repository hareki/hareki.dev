# hareki.dev

Personal portfolio site built with [Astro](https://astro.build/) and deployed on [Cloudflare Workers](https://workers.cloudflare.com/).

**[Live Site](https://hareki.dev)**

## Highlights

- **Zero-JS baseline** — Astro renders static HTML; JavaScript is only shipped for the interactive typing test via a React island (`client:idle`)
- **Interactive typing test** — A Monkeytype-inspired game built with React 19 + Zustand, featuring real-time WPM/accuracy tracking, tape mode, and keyboard shortcuts; render-optimized so each keystroke re-renders only the affected letter component
- **Live GitHub data** — Repository stats (recent commits, language breakdown, lines changed) fetched via Astro Server Islands — Astro's equivalent of Next.js async Server Components — with Cloudflare CDN caching and skeleton loading states
- **4-flavor Catppuccin theming** — Full light/dark theme support (Latte, Frappe, Macchiato, Mocha) with 14 selectable accent colors, respecting OS color scheme preference
- **Accessibility-first** — Semantic HTML, ARIA labels/live regions, full keyboard navigation, and `prefers-reduced-motion` support

## Tech Stack

| Layer            | Technology                        |
| :--------------- | :-------------------------------- |
| Framework        | Astro 6                           |
| Interactive UI   | React 19 (with Compiler)          |
| State Management | Zustand 5                         |
| Styling          | Tailwind CSS 4, tailwind-variants |
| Components       | Starwind UI                       |
| Icons            | Tabler Icons                      |
| Font             | Maple Mono                        |
| Deployment       | Cloudflare Workers                |
| Testing          | Vitest 4                          |
| Linting          | ESLint 10, Prettier, CommitLint   |

## Project Structure

```
src/
├── components/
│   ├── react/              # React islands (typing test game)
│   ├── sections/           # Page sections (hero, work, beyond-work)
│   ├── starwind/           # Starwind UI components
│   └── ui/                 # Shared utility components
├── data/                   # Global/shared data (contact info, git config)
├── layouts/                # Root layout, header, footer
├── lib/
│   ├── cache/              # Cloudflare CDN cache helpers
│   └── github/             # GitHub API queries and types
├── pages/                  # Single-page entry (index.astro)
└── styles/                 # Catppuccin theme, Tailwind config, fonts
```

Feature-specific data is co-located with its component in `data.ts` files (e.g., work experience data lives in `sections/work-section/work-experience-section/data.ts`).

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server at localhost:4321
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview
```

### Environment Variables

| Variable       | Required | Description                                             |
| :------------- | :------- | :------------------------------------------------------ |
| `GITHUB_TOKEN` | No       | GitHub personal access token for higher API rate limits |

## Development

```bash
# Typecheck + test + format + lint
pnpm diagnose

# Same with auto-fix
pnpm diagnose --fix

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

The project enforces [Conventional Commits](https://www.conventionalcommits.org/) via CommitLint and runs lint-staged checks on pre-commit through Husky.

## Design Credits

- Color palette: [Catppuccin](https://github.com/catppuccin/catppuccin)
- Font: [Maple Mono](https://github.com/subframe7536/maple-font)
- Icons: [Tabler Icons](https://tabler.io/icons)
- Design inspiration: [Jason Cameron](https://www.jasonmcameron.com/), [Duy Le](https://www.duyle.dev/), [Brittany Chiang](https://brittanychiang.com/)
