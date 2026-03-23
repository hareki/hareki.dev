# TopBanner Component Design

## Overview

A dismissable banner that sits directly below the header nav bar, visually extending it. First use case: inform users when `prefers-reduced-motion` is detected.

## Component: `TopBanner.astro`

**Location:** `src/layouts/main-layout/header/TopBanner.astro` — a sub-component of the header, only used by `Header.astro`.

### Props

| Prop         | Type     | Description                             |
| ------------ | -------- | --------------------------------------- |
| `message`    | `string` | Banner text content                     |
| `storageKey` | `string` | localStorage key for tracking dismissal |

### Markup

```html
<div data-slot="top-banner" data-storage-key="{storageKey}" class="..." hidden>
  <span>{message}</span>
  <button data-slot="top-banner-dismiss" aria-label="Dismiss banner">
    <!-- X icon -->
  </button>
</div>
```

- `hidden` by default — the client script removes `hidden` when appropriate
- `role="status"` is added dynamically by the script when the banner is shown, so assistive technologies don't register a live region before the banner is visible
- `data-slot` attributes for script querying, following Starwind conventions

### Styling

- **Background:** `bg-warning` (semantic token, maps to `--ctp-yellow`)
- **Text:** `text-warning-foreground` (semantic token, maps to `--ctp-base`)
- **Layout:** Full width, centered text, X button right-aligned
- **Padding:** Same horizontal padding as header content for alignment; small vertical padding
- **Typography:** `text-sm font-medium`
- **X button:** `text-warning-foreground` with hover opacity change
- **Border radius:** `rounded-b-md` on the bottom corners only to visually attach to the header's `rounded-md`

### Client-side Behavior (`<script>`)

The script follows the Astro lifecycle pattern used by Starwind components (Switch, Popover, AppearanceSettings): a setup function that runs on initial load and re-runs on `astro:after-swap` for view transition support.

**Setup function (`initTopBanner`):**

1. Query the banner element via `data-slot="top-banner"`
2. Read `localStorage.getItem(storageKey)` — if `"true"`, stay hidden
3. Check `matchMedia('(prefers-reduced-motion: reduce)')` — if matched and not dismissed, remove `hidden` and add `role="status"`
4. Listen for `change` on the matchMedia query to react if the user toggles the OS setting live
5. On X click: set `hidden`, remove `role="status"`, write `localStorage.setItem(storageKey, "true")`

**Cleanup function (`destroyTopBanner`):**

- Aborts the `AbortController` used to register the `matchMedia` change listener and dismiss button click listener, preventing listener accumulation across view transitions

**Lifecycle:**

- `initTopBanner` creates a **fresh** `AbortController` on each invocation (the previous one is already aborted by `destroyTopBanner`). All listeners (matchMedia `change`, dismiss `click`) use `{ signal }` from this controller.
- Runs `initTopBanner` on initial script load
- Registers `destroyTopBanner` on `document.addEventListener('astro:before-swap', ...)`
- Registers `initTopBanner` on `document.addEventListener('astro:after-swap', ...)`

**Note on localStorage:** The script calls `localStorage.getItem`/`setItem` directly with the raw `storageKey` string. The Astro `<script>` tag runs as an ES module and cannot access the component's props at runtime — the storage key value is embedded into the markup via a `data-storage-key` attribute on the banner element. The `STORAGE_KEYS` entry in `local-storage.ts` exists purely for documentation and key centralization.

## Integration in Header.astro

The banner renders inside the sticky wrapper `div`, after the `<header>` element:

```astro
<div class='sticky top-0 z-10 bg-background pt-4'>
  <header ...>
    <!-- existing nav content -->
  </header>

  <TopBanner
    message='Reduced motion detected, animations are minimized'
    storageKey='BANNER_reduced-motion-dismissed'
  />
</div>
```

This positions the banner as part of the sticky header block, between the nav and the page content.

## localStorage Integration

Add a new key to `STORAGE_KEYS` in `src/utils/local-storage.ts`:

```ts
bannerReducedMotionDismissed: 'BANNER_reduced-motion-dismissed',
```

The banner script uses this key directly via the `storageKey` prop (the raw string value), keeping the component generic. The `STORAGE_KEYS` entry is for documentation and consistency with the codebase convention of centralizing storage keys.

## Files to Create/Modify

| File                                             | Action                               |
| ------------------------------------------------ | ------------------------------------ |
| `src/layouts/main-layout/header/TopBanner.astro` | Create — the banner component        |
| `src/layouts/main-layout/header/Header.astro`    | Modify — import and render TopBanner |
| `src/utils/local-storage.ts`                     | Modify — add storage key             |
