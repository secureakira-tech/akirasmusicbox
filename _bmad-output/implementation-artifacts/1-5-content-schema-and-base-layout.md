# Story 1.5: Content Schema & BaseLayout

Status: in-progress

## Story

As the author,
I want a validated Zod content schema and a complete BaseLayout component,
so that every future post has type-safe frontmatter, every page shares a consistent HTML head (fonts, SEO, OG, RSS, GPG link, analytics stub, skip link), and `npm run build` confirms schema enforcement before any real posts are authored.

## Acceptance Criteria

1. `src/content.config.ts` exists and exports a `posts` collection with a Zod schema covering all required and optional fields.
2. `pubDate` is typed as `z.coerce.date()` — accepts ISO 8601 string from MDX frontmatter and coerces to `Date`.
3. `description` is `z.string()` with no `.optional()` — it is required on every post.
4. `hifiSidebar` is `z.boolean().default(false)` — optional in frontmatter, defaults to `false`.
5. Optional taxonomy fields (`genre`, `era`, `instrument`, `mood`, `postType`) are declared with `.optional()`.
6. `src/layouts/BaseLayout.astro` exists, accepts a typed `Props` interface (`title`, `description?`, `ogImage?`, `canonicalUrl?`), and renders a complete `<head>` section.
7. BaseLayout renders Space Grotesk (400/500/600), Source Serif 4 (400 normal + 400 italic), and IBM Plex Mono (400) via `@font-face` declarations in `src/styles/global.css`.
8. Source Serif 4 uses `font-display: swap`; IBM Plex Mono uses `font-display: optional`.
9. BaseLayout `<head>` contains: canonical link, `<title>`, `<meta name="description">`, all Open Graph tags (`og:type`, `og:title`, `og:description`, `og:image`, `og:url`), Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`).
10. BaseLayout `<head>` contains RSS autodiscovery: `<link rel="alternate" type="application/rss+xml" href="/rss.xml" title="Akira's Music Box">`.
11. BaseLayout `<head>` contains GPG key link: `<link rel="pgpkey" href="/pubkey.asc">`.
12. BaseLayout `<head>` contains a Plausible `<script>` tag stub (commented out) with the SRI `integrity` attribute noted as a placeholder.
13. BaseLayout renders a skip link as the first focusable element: `<a href="#main-content">Skip to content</a>`, visually hidden unless focused.
14. BaseLayout renders `<main id="main-content">` wrapping the default `<slot />`.
15. BaseLayout supports named slots: `nav` (before `<main>`) and `footer` (after `<main>`).
16. `astro.config.mjs` has a `site` property set to `'https://akirasmusicbox.vercel.app'`.
17. `src/content/posts/2026-05-01-schema-test.mdx` exists with all frontmatter fields populated.
18. `src/pages/index.astro` is updated to use `BaseLayout` instead of importing `global.css` directly; the direct import is removed.
19. `npm run build` completes with zero errors and zero type errors.
20. `npx astro check` returns 0 errors.
21. No hardcoded hex color values appear outside `src/styles/tokens.css`. No `dark:` Tailwind utility classes exist anywhere.

## Tasks / Subtasks

### Task 1 — Add `site` to `astro.config.mjs` (AC: 16)
- [x] Open `astro.config.mjs`.
- [x] Add `site: 'https://akirasmusicbox.vercel.app'` to the `defineConfig({})` call.
- [x] Final file must match the exact content from Dev Notes "Final astro.config.mjs" below.

### Task 2 — Add Source Serif 4 and IBM Plex Mono `@font-face` to `global.css` (AC: 7, 8)
- [x] Open `src/styles/global.css`.
- [x] After the last Space Grotesk `@font-face` block, add `@font-face` declarations for Source Serif 4 (400 normal, 400 italic) and IBM Plex Mono (400 normal).
- [x] Source Serif 4: `font-display: swap`.
- [x] IBM Plex Mono: `font-display: optional`.
- [x] Remove the comment "Source Serif 4 and IBM Plex Mono are imported in BaseLayout.astro (Story 1.5)." — they're now in global.css.
- [x] Final file must match the exact content from Dev Notes "Final global.css" below.

### Task 3 — Create `src/content.config.ts` (AC: 1–5)
- [x] Create `src/content.config.ts` (NOT `src/content/config.ts` — Astro v6 uses the root-level path).
- [x] Use the exact schema from Dev Notes "Final content.config.ts" below. (Note: `z` imported from `zod` directly, not `astro:content` — Astro v6 deprecates the re-export.)
- [x] Confirm `pubDate` uses `z.coerce.date()`.
- [x] Confirm `description` uses `z.string()` with NO `.optional()`.
- [x] Confirm `hifiSidebar` uses `z.boolean().default(false)`.
- [x] Confirm all taxonomy fields (`genre`, `era`, `instrument`, `mood`, `postType`) are `.optional()`.

### Task 4 — Create `src/layouts/BaseLayout.astro` (AC: 6, 9–15)
- [x] Create directory `src/layouts/` if it does not exist.
- [x] Create `src/layouts/BaseLayout.astro` using the exact content from Dev Notes "Final BaseLayout.astro" below.
- [x] Confirm `Props` interface has `title: string`, `description?: string`, `ogImage?: string`, `canonicalUrl?: string`.
- [x] Confirm `global.css` is imported in the frontmatter (moves canonical import location from index.astro to here).
- [x] Confirm all Open Graph meta tags are present.
- [x] Confirm RSS autodiscovery link is present with exact attributes.
- [x] Confirm `<link rel="pgpkey">` is present.
- [x] Confirm Plausible `<script>` block is commented out with SRI placeholder note.
- [x] Confirm skip link is the very first element inside `<body>`.
- [x] Confirm `<main id="main-content">` wraps the default slot.
- [x] Confirm named slots `nav` and `footer` are present.

### Task 5 — Create sample MDX post (AC: 17)
- [x] Create directory `src/content/posts/` if it does not exist.
- [x] Create `src/content/posts/2026-05-01-schema-test.mdx` with all frontmatter fields from Dev Notes "Sample MDX post" below.
- [x] Confirm all required fields (`title`, `pubDate`, `description`) are present.
- [x] Confirm `hifiSidebar` is present as a boolean (`false`).

### Task 6 — Update `src/pages/index.astro` (AC: 18)
- [x] Open `src/pages/index.astro`.
- [x] Replace the direct `import '../styles/global.css'` with `BaseLayout` usage.
- [x] Use the exact content from Dev Notes "Final index.astro" below.

### Task 7 — Validate build and type-check (AC: 19–21)
- [x] Run `npm run build` — must complete with zero errors. ✅
- [x] Run `npx astro check` — must return 0 errors. ✅ (0 errors, 0 warnings, 0 hints after fixing `z` import)
- [x] Grep for hardcoded hex outside tokens.css: zero matches. ✅
- [x] Grep for `dark:` utility classes: zero matches. ✅
- [x] Confirm Astro recognized the posts collection (build output shows content collection entries processed). ✅

### Task 8 — Commit and push (AC: 1–21)
- [ ] Stage: `git add src/content.config.ts src/layouts/BaseLayout.astro src/content/posts/2026-05-01-schema-test.mdx src/pages/index.astro src/styles/global.css astro.config.mjs`
- [ ] Run `git status` — confirm no unintended files staged.
- [ ] Commit (GPG signing is active — do not bypass).
- [ ] Push: `git push`
- [ ] Verify CI (Vercel preview deploy) passes.

## Dev Notes

### Architecture constraints (must not violate)

- **`src/content.config.ts` NOT `src/content/config.ts`** — Astro v6 moved the config file to the root of `src/`. Using the old path silently skips the schema, causing untyped collections.
- **`z.coerce.date()` is load-bearing** — `z.string()` for `pubDate` produces an invalid RSS `<pubDate>` node. This breaks feed readers. Do not simplify.
- **`description` must be required** — it is the RSS excerpt and OG description. Making it `.optional()` would silently produce empty RSS entries and broken OG previews.
- **No `dark:` Tailwind classes anywhere** — dark mode is entirely via CSS custom properties in `@media (prefers-color-scheme: dark)`. `dark:` utilities conflict with this approach.
- **`tokens.css` is the only place for hex values** — BaseLayout must use `var(--color-*)` for any inline color styles.
- **`font-display: optional` for Space Grotesk (already done in Story 1.4)** — do not change this to `swap`.
- **Source Serif 4: `font-display: swap`** — body text should appear quickly; the system serif fallback is acceptable during load.
- **IBM Plex Mono: `font-display: optional`** — used sparingly for matrix numbers; a brief period with a monospace fallback is acceptable.
- **Plausible script is intentionally commented out** — the SRI hash must be computed from the actual Plausible script before enabling. Leaving it as a commented stub is correct behavior for this story.

### Final `astro.config.mjs`

```js
// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://akirasmusicbox.vercel.app',
  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});
```

### Final `global.css`

Replace the entire file with this content:

```css
@import "tailwindcss";
@import "./tokens.css";
@plugin "@tailwindcss/typography";

/*
 * Space Grotesk — font-display: optional (not swap)
 * Prevents FOUT on a display-font-heavy publication.
 * Weights: 400 (UI labels), 500 (subheadings), 600 (H1/H2).
 */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  font-display: optional;
  src: url('@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
                 U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                 U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-display: optional;
  src: url('@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
                 U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                 U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 600;
  font-display: optional;
  src: url('@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
                 U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                 U+2212, U+2215, U+FEFF, U+FFFD;
}

/*
 * Source Serif 4 — font-display: swap
 * Body prose text. Swap is acceptable: system serif fallback is close enough.
 * Weight 400 normal + italic. (No weight-450 static file in Fontsource; 400 is used.)
 */
@font-face {
  font-family: 'Source Serif 4';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('@fontsource/source-serif-4/files/source-serif-4-latin-400-normal.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
                 U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                 U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Source Serif 4';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url('@fontsource/source-serif-4/files/source-serif-4-latin-400-italic.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
                 U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                 U+2212, U+2215, U+FEFF, U+FFFD;
}

/*
 * IBM Plex Mono — font-display: optional
 * Used sparingly: matrix issue numbers, inline code. Brief monospace fallback acceptable.
 */
@font-face {
  font-family: 'IBM Plex Mono';
  font-style: normal;
  font-weight: 400;
  font-display: optional;
  src: url('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
                 U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                 U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Disable all animations for users who request reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Final `content.config.ts`

```typescript
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    genre: z.string().optional(),
    era: z.string().optional(),
    instrument: z.string().optional(),
    mood: z.string().optional(),
    postType: z.string().optional(),
    hifiSidebar: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

### Final `BaseLayout.astro`

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

const {
  title,
  description = "Akira's Music Box — a personal publication about music.",
  ogImage = '/og-default.png',
  canonicalUrl = Astro.url.href,
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="generator" content={Astro.generator} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <link rel="canonical" href={canonicalUrl} />

    <title>{title}</title>
    <meta name="description" content={description} />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:url" content={canonicalUrl} />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />

    <!-- RSS autodiscovery -->
    <link rel="alternate" type="application/rss+xml" href="/rss.xml" title="Akira's Music Box" />

    <!-- GPG public key -->
    <link rel="pgpkey" href="/pubkey.asc" />

    <!--
      Plausible analytics — SRI hash placeholder.
      Before enabling: compute the sha256 hash of the Plausible script file and replace
      SRI_HASH_PLACEHOLDER. Update hash on every Plausible script release.
      Also update vercel.json script-src to include https://plausible.io.
    -->
    <!-- <script
      defer
      data-domain="akirasmusicbox.vercel.app"
      src="https://plausible.io/js/script.js"
      integrity="sha256-SRI_HASH_PLACEHOLDER"
      crossorigin="anonymous"
    ></script> -->
  </head>
  <body>
    <!--
      Skip link (WCAG 2.1 AA — keyboard navigation).
      Visually hidden until focused; appears top-left on focus.
      Uses inline CSS vars for colors (avoids hardcoded hex, works in dark mode).
    -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded focus:outline-none"
      style="background-color: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-border);"
    >
      Skip to content
    </a>

    <slot name="nav" />

    <main id="main-content">
      <slot />
    </main>

    <slot name="footer" />
  </body>
</html>
```

### Sample MDX post (`src/content/posts/2026-05-01-schema-test.mdx`)

```mdx
---
title: "Schema Test Post"
pubDate: "2026-05-01"
description: "Placeholder post to verify Content Collections schema validation on build. Delete or replace before publishing."
genre: "Electronic"
era: "2020s"
instrument: "Synthesizer"
mood: "Energetic"
postType: "review"
hifiSidebar: false
---

This is a placeholder post. Its only purpose is to confirm that the Zod schema in `src/content.config.ts` validates correctly during `npm run build`.

All frontmatter fields are intentionally populated to exercise the full schema.
```

### Final `index.astro`

Replace the full file with this simplified wrapper (Story 1.6 will fully implement the home page):

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Akira's Music Box">
  <h1>Akira's Music Box</h1>
</BaseLayout>
```

### Key risks and their mitigations

| Risk | Mitigation |
|------|-----------|
| Wrong config file path (`src/content/config.ts` instead of `src/content.config.ts`) | Task 3 explicitly calls this out — verify path before running build |
| `z.string()` used for `pubDate` instead of `z.coerce.date()` | AC #2 and schema snippet are explicit; build will not catch this at compile time — only RSS generation will fail later |
| `dark:` Tailwind class accidentally added | Task 7 grep check catches this before commit |
| Hardcoded hex in skip link inline style | The skip link style must use `var(--color-*)` — confirmed in Dev Notes |
| Plausible script accidentally uncommented | Script block is in an HTML comment — must remain commented until SRI hash is computed |
| `font-display: swap` applied to Space Grotesk | Space Grotesk @font-face is in `global.css` and already uses `optional` — do not touch those blocks |

### References

- Astro Content Collections v6 path: `src/content.config.ts` [Source: architecture.md#AR19]
- `z.coerce.date()` requirement for RSS: [Source: architecture.md#AR8]
- `description` required for RSS: [Source: architecture.md line ~38]
- BaseLayout head structure: [Source: architecture.md#SEO/Open Graph section]
- RSS autodiscovery link spec: [Source: architecture.md#10-RSS-autodiscovery]
- GPG link: [Source: architecture.md#UX-DR24]
- Plausible SRI: [Source: architecture.md#Risk-10]
- Skip link pattern: WCAG 2.1 AA Success Criterion 2.4.1
- `font-display` strategy: [Source: architecture.md#font-display-strategy section]
- Fontsource static file paths verified against installed packages in `node_modules/@fontsource/`

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (create-story)

### Debug Log References

### Completion Notes List

### File List
