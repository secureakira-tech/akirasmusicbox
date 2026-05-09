# Story 1.4: Design System & CSS Tokens

Status: review

## Story

As the author,
I want a complete CSS design token system and self-hosted fonts installed at the repo root,
so that every component built in later stories has a single source of truth for colors, spacing, animations, and typography — and dark mode works correctly from day one.

## Acceptance Criteria

1. `src/styles/tokens.css` exists with all color tokens as CSS custom properties in a light-mode `:root` block.
2. `src/styles/tokens.css` contains a `@media (prefers-color-scheme: dark)` block that overrides all color tokens with dark-mode values.
3. Light mode `--color-bg` is `#F5F0E8`; dark mode `--color-bg` is `#1C1510`.
4. Light mode `--color-text` is `#3D2B1F`; dark mode `--color-text` is `#F0E8DC`.
5. Embed dimension tokens (`--embed-height-spotify-compact`, `--embed-ratio-video`, etc.) are declared in `tokens.css`.
6. Boombox animation token `--boombox-echo-duration: 1.5s` and `@keyframes boombox-echo` are declared in `tokens.css`.
7. `src/styles/global.css` retains `@import "tailwindcss"` and `@plugin "@tailwindcss/typography"` at the top.
8. `src/styles/global.css` imports `./tokens.css` so custom properties are available during build verification.
9. `src/styles/global.css` contains `@font-face` declarations for Space Grotesk with `font-display: optional`.
10. `src/styles/global.css` contains a `@media (prefers-reduced-motion: reduce)` rule that sets `animation-duration` and `transition-duration` to `0.01ms`.
11. Fontsource packages are installed: `@fontsource/space-grotesk`, `@fontsource/source-serif-4`, `@fontsource/ibm-plex-mono`.
12. No hardcoded hex values or Tailwind palette classes (`text-gray-900`, `bg-white`, etc.) appear in any component or style file — only `var(--color-*)` references.
13. No `dark:` Tailwind variant utility classes exist anywhere in the codebase.
14. `npm run build` completes with zero errors.
15. Dark mode is verified in browser DevTools: OS dark mode toggle causes `--color-bg` to switch from `#F5F0E8` to `#1C1510`.

## Tasks / Subtasks

### Task 1 — Install Fontsource packages (AC: 11)
- [x] Run:
  ```bash
  npm install @fontsource/space-grotesk @fontsource/source-serif-4 @fontsource/ibm-plex-mono
  ```
- [x] Confirm all three packages appear in `package.json` dependencies.
- [x] Confirm `node_modules/@fontsource/space-grotesk/` exists with font files.

### Task 2 — Create `src/styles/tokens.css` (AC: 1–6)
- [x] Create `src/styles/tokens.css` with the EXACT content from the Dev Notes "Final tokens.css" section below.
- [x] Confirm light-mode `:root` block contains all 8 color tokens.
- [x] Confirm dark-mode `@media (prefers-color-scheme: dark) :root` block is present and overrides all 8 colors.
- [x] Confirm embed dimension tokens are present (5 values).
- [x] Confirm `--boombox-echo-duration: 1.5s` and `@keyframes boombox-echo` are present.
- [x] Confirm NO hardcoded hex values appear anywhere *else* in the codebase (tokens.css is the only legal location for hex values).

### Task 3 — Update `src/styles/global.css` (AC: 7–10)
- [x] Open the existing `src/styles/global.css` (currently just `@import "tailwindcss"` and `@plugin "@tailwindcss/typography"`).
- [x] Rewrite it with the content from the Dev Notes "Final global.css" section below.
- [x] Confirm `@import "tailwindcss"` remains the first line.
- [x] Confirm `@import "./tokens.css"` is present (makes tokens available during build).
- [x] Confirm `@font-face` declarations for Space Grotesk are present with `font-display: optional` (NOT `swap`).
- [x] Confirm the `@media (prefers-reduced-motion: reduce)` block is present.
- [x] Confirm no `@font-face` for Source Serif 4 or IBM Plex Mono — those are imported in BaseLayout.astro (Story 1.5).

### Task 4 — Run validation checks (AC: 12–14)
- [x] Run `npm run build` — must complete with zero errors.
- [x] Run `npx astro check` — must return 0 errors.
- [x] Grep for hardcoded hex values outside tokens.css: zero matches confirmed.
- [x] Grep for dark: Tailwind variants: zero matches confirmed.
- [x] Confirm `tokens.css` does NOT reference any hardcoded color in the animation — `@keyframes boombox-echo` uses `rgba` of the teal value.

### Task 5 — Verify dark mode in browser (AC: 15)
- [x] Run `npm run dev` and open `http://localhost:4321` in a browser.
- [x] Open DevTools → Elements tab → select `<html>` → Styles panel → find `:root` custom properties.
- [x] Confirm `--color-bg` is `#F5F0E8` (light) in normal mode.
- [x] In DevTools: use the OS dark mode emulation.
- [x] Confirm `--color-bg` switches to `#1C1510` when dark mode is emulated.
- [x] Confirm `--color-text` switches from `#3D2B1F` (light) to `#F0E8DC` (dark).

### Task 6 — Commit and push (AC: 1–15)
- [x] Stage: `git add src/styles/tokens.css src/styles/global.css package.json package-lock.json`
- [x] Review `git status` — confirmed no unintended files staged.
- [x] Commit (GPG signing is active): GPG-signed commit `3eeb8eb`
- [x] Push: `git push`
- [x] Verify CI passes.

## Dev Notes

### Final tokens.css

Create `src/styles/tokens.css` with exactly this content:

```css
:root {
  /* ── Colors — light mode ─────────────────────────────────────────────── */
  --color-bg:          #F5F0E8;   /* cream — page background              */
  --color-surface:     #EDE8DF;   /* slightly darker surface, cards       */
  --color-text:        #3D2B1F;   /* brown — primary text (~12:1 vs bg)   */
  --color-text-muted:  #6B4D3A;   /* muted metadata, secondary text       */
  --color-border:      #EAE3D5;   /* subtle borders, dividers             */
  --color-teal:        #256B6B;   /* interactive accent — links only      */
  --color-green:       #3A5C3A;   /* hi-fi sidebar zone marker            */
  --color-dark-orange: #C4520A;   /* structural editorial: embed borders  */

  /* ── Layout ──────────────────────────────────────────────────────────── */
  --measure:    65ch;
  --embed-gap:  3rem;

  /* ── Embed dimensions ────────────────────────────────────────────────── */
  --embed-ratio-video:             16 / 9;
  --embed-ratio-spotify-compact:   auto;
  --embed-height-spotify-compact:  80px;
  --embed-height-spotify-expanded: 352px;
  --embed-ratio-apple:             16 / 9;

  /* ── Animation ───────────────────────────────────────────────────────── */
  --boombox-echo-duration: 1.5s;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:          #1C1510;   /* warm near-black — NOT cool gray     */
    --color-surface:     #231A13;
    --color-text:        #F0E8DC;   /* warm off-white — NOT pure white     */
    --color-text-muted:  #9A8070;
    --color-border:      #3D2A1F;
    --color-teal:        #3AAFAF;   /* brightened for dark-bg contrast     */
    --color-green:       #5A9060;
    --color-dark-orange: #E06820;   /* warm amber shift — avoids error-red */
  }
}

@keyframes boombox-echo {
  0%   { box-shadow: 0 0 0 0    rgba(37, 107, 107, 0.4); }
  70%  { box-shadow: 0 0 0 12px rgba(37, 107, 107, 0);   }
  100% { box-shadow: 0 0 0 0    rgba(37, 107, 107, 0);   }
}
```

### Final global.css

Replace the existing `src/styles/global.css` (currently only the two Tailwind lines) with:

```css
@import "tailwindcss";
@import "./tokens.css";
@plugin "@tailwindcss/typography";

/*
 * Space Grotesk — font-display: optional (not swap)
 * Prevents FOUT on a display-font-heavy publication.
 * Weights used: 400 (UI labels), 500 (subheadings), 600 (H1/H2).
 * Source Serif 4 and IBM Plex Mono are imported in BaseLayout.astro (Story 1.5).
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

/* Disable all animations and transitions for users who request it */
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

**If the Fontsource file path is wrong after install**, find the actual woff2 file path:
```bash
find node_modules/@fontsource/space-grotesk/files -name "*latin*400*normal*.woff2"
```
Use that exact path in the `src: url(...)` above.

### Why tokens.css Is Imported in global.css (Not BaseLayout)

The architecture says `tokens.css` is imported once in `BaseLayout.astro`. However, BaseLayout doesn't exist until Story 1.5. For this story:
- `tokens.css` is imported in `global.css` so build verification works and the dev server renders correctly.
- When Story 1.5 creates `BaseLayout.astro`, consider whether to keep the import in `global.css` or move it to BaseLayout. Either works — CSS custom properties declared in any loaded stylesheet are available globally. The architecture preference is BaseLayout; the practical difference is negligible.

### Token Color Authority — Which Document Wins

The UX spec has two color tables that disagree slightly. Use the **dark mode table** values (most specific):

| Token | Light | Dark |
|---|---|---|
| `--color-bg` | `#F5F0E8` | `#1C1510` |
| `--color-surface` | `#EDE8DF` | `#231A13` |
| `--color-text` | `#3D2B1F` | `#F0E8DC` |
| `--color-text-muted` | `#6B4D3A` | `#9A8070` |
| `--color-border` | `#EAE3D5` | `#3D2A1F` |
| `--color-teal` | `#256B6B` | `#3AAFAF` |
| `--color-green` | `#3A5C3A` | `#5A9060` |
| `--color-dark-orange` | `#C4520A` | `#E06820` |

**Discard** the UX palette section's `#2A7F7F` for teal — that table predates the finalized dark mode table. `#256B6B` is the correct light-mode teal.

**Architecture example discrepancy:** The architecture shows `--color-text: #1C1510` as light-mode text. This is wrong — `#1C1510` is the dark-mode background. Ignore architecture example hex values; use the UX spec dark mode table above.

### Dark Mode Contract — DO NOT Invert

Dark mode is a parallel emotional environment, not a color inversion:
- Background `#1C1510` — warm near-black. Not `#000000`, not cool gray.
- Text `#F0E8DC` — warm off-white. Not `#FFFFFF`.
- Accents are brightened slightly (teal `#3AAFAF`, green `#5A9060`, orange `#E06820`) so they maintain contrast against the dark background.
- `--color-dark-orange` shifts to warm amber in dark mode to avoid reading as a clinical error state.

### Why No `dark:` Tailwind Classes

Dark mode is implemented ENTIRELY via CSS custom properties + `@media (prefers-color-scheme: dark)`. Tailwind's `dark:` utilities (e.g. `dark:text-white`, `dark:bg-slate-900`) conflict with this approach — they require class-based dark mode toggle, and mixing the two produces unpredictable results. **Never use `dark:` anywhere in this project.**

### Font Strategy — Space Grotesk vs Others

**Space Grotesk** (headings, UI):
- Custom `@font-face` in `global.css` with `font-display: optional`
- `optional` avoids FOUT on a heading-heavy publication; browser skips font if not cached in time
- Weights needed: 400, 500, 600 (see type scale in Dev Notes)
- Installed from `@fontsource/space-grotesk` (static package)

**Source Serif 4** (body prose):
- Installed from `@fontsource/source-serif-4`
- Imported in `BaseLayout.astro` in Story 1.5 (not this story)
- NOTE: UX spec requires `font-weight: 450`. The static `@fontsource/source-serif-4` package only has 400. For weight 450 you need `@fontsource-variable/source-serif-4` (variable). Story 1.5 should address this when setting up BaseLayout.

**IBM Plex Mono** (code, matrix number):
- Installed from `@fontsource/ibm-plex-mono`
- Imported in `BaseLayout.astro` in Story 1.5 (not this story)

### Boombox Animation — Teal Value

The `@keyframes boombox-echo` animation uses `rgba(37, 107, 107, 0.4)`. This is `#256B6B` (the light-mode teal) with 40% opacity. In dark mode, the animation still fires on the light value — this is acceptable for now. Story 1.6+ can update this to use `color-mix(in srgb, var(--color-teal) 40%, transparent)` when browser support is confirmed.

### prefers-reduced-motion Gate

The `@media (prefers-reduced-motion: reduce)` block in `global.css` overrides ALL animation durations to `0.01ms` (not `0` — some JS libraries break with `0`). This gates the boombox echo animation and any future CSS transitions. It is a global safety net, not a per-component override.

### No Tailwind Palette Classes

All color usage in components MUST use CSS custom properties:
```css
/* ✓ Correct */
color: var(--color-text);
background: var(--color-bg);

/* ✗ Wrong — breaks dark mode, breaks the single-source-of-truth contract */
color: #3D2B1F;
background-color: theme(colors.cream);
```

This rule applies to `.astro` component `<style>` blocks, utility classes, and inline styles.

### What Is NOT In This Story

- Font imports for Source Serif 4 and IBM Plex Mono in BaseLayout — Story 1.5
- Tailwind theme extension for named colors (e.g. `cream`, `teal`) — Story 1.5 / 1.6 as needed
- `src/styles/tokens.css` used in any actual component — Story 1.5 onwards
- Space Grotesk validation at H1 scale — Story 1.5/1.6 when real headlines exist

### Project Structure Notes

Files modified in this story (relative to repo root):
```
src/styles/tokens.css   # new — all CSS custom properties (colors, embeds, animations)
src/styles/global.css   # modified — add @import tokens.css, @font-face, prefers-reduced-motion
package.json            # modified — 3 new Fontsource dependencies
package-lock.json       # modified — updated lockfile
```

Files NOT touched:
- `astro.config.mjs` — no changes needed
- `vercel.json` — no changes needed
- Any `src/pages/` or `src/layouts/` files — don't exist yet

### Previous Story Intelligence

From Story 1.2 (Astro init):
- `src/styles/global.css` currently contains only `@import "tailwindcss"` and `@plugin "@tailwindcss/typography"` — safe to expand
- Tailwind v4 is confirmed working (no `tailwind.config.js`)
- `@tailwindcss/typography@^0.5.19` already installed

From Story 1.3 (Security headers):
- No impact on this story

From git log:
- Commit `e933288` established the Astro baseline
- Commit `ce01d38` added security headers to vercel.json

### References

- Token values: UX design spec dark mode table (authoritative)
- font-display decision: architecture.md → Cross-Cutting Concerns → "Font Swap / FOUT"
- Dark mode contract: architecture.md → Cross-Cutting Concerns → "CSS Custom Properties & Dark Mode"
- Embed dimensions: architecture.md → Implementation Patterns → "Embed Dimensions"
- prefers-reduced-motion: architecture.md (NFR compliance)
- UX-DR1–UX-DR5: Color palette and semantic rules
- UX-DR20: Dark mode is a hard requirement
- AR6: All color values in CSS custom properties
- AR7: No Tailwind palette classes

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- ✅ Task 1: Installed `@fontsource/space-grotesk`, `@fontsource/source-serif-4`, `@fontsource/ibm-plex-mono`. Confirmed woff2 files present in `node_modules/@fontsource/space-grotesk/files/`.
- ✅ Task 2: Created `src/styles/tokens.css` with 8 color tokens (light + dark), layout tokens, 5 embed dimension tokens, `--boombox-echo-duration: 1.5s`, and `@keyframes boombox-echo`. Teal value `#256B6B` (light) / `#3AAFAF` (dark) from UX dark mode table. Zero hardcoded hex outside tokens.css.
- ✅ Task 3: Updated `src/styles/global.css` — kept Tailwind directives, added `@import "./tokens.css"`, 3 Space Grotesk `@font-face` blocks (weights 400/500/600) with `font-display: optional`, `prefers-reduced-motion` gate. Source Serif 4 and IBM Plex Mono deferred to Story 1.5 (BaseLayout).
- ✅ Task 4: `npm run build` clean. `npx astro check` 0 errors. No hardcoded hex outside tokens.css. No `dark:` utilities.
- ✅ Task 5: Dark mode verified in browser — `--color-bg` switches from `#F5F0E8` (light) to `#1C1510` (dark) on DevTools emulation. All tokens confirmed live.
- ✅ Task 6: GPG-signed commit `3eeb8eb` pushed to main.

### File List

- `src/styles/tokens.css` (new)
- `src/styles/global.css` (modified)
- `package.json` (modified — 3 Fontsource packages added)
- `package-lock.json` (modified)
