# Story 1.2: Astro Project Initialization

Status: ready-for-dev

## Story

As the author,
I want the Astro project initialized at the repo root with all required integrations and locked version pins,
so that the site can build successfully and CI goes green for the first time.

## Acceptance Criteria

1. `package.json` exists at the repo root with version pins: `astro ^6.1.10`, `@tailwindcss/vite ^4.x`, `@tailwindcss/typography ^0.5.x`.
2. `package-lock.json` exists and is committed.
3. `astro.config.mjs` registers all four integrations: `@astrojs/mdx`, `@astrojs/sitemap`, Tailwind v4 via `@tailwindcss/vite`, and has `@astrojs/rss` installed (not in integrations array — used directly in pages).
4. `src/` directory exists with at minimum `pages/index.astro` and `env.d.ts`.
5. No `tailwind.config.js` exists — Tailwind v4 does not use one.
6. `@tailwindcss/typography` is installed and `@plugin "@tailwindcss/typography"` is declared in the project CSS entry point.
7. `npx astro check` completes with zero errors.
8. `npm run build` produces a `dist/` directory with no errors.
9. `dist/` is in `.gitignore` (Astro adds this automatically — verify it's present).
10. CI workflow on GitHub goes green after push (all four steps pass: `npm ci`, `astro check`, `tsc --noEmit`, `npm run build`).
11. The existing files from previous stories are preserved: `public/`, `.github/workflows/ci.yml`, `vercel.json`, `.gitignore` GPG entries.

## Tasks / Subtasks

### Task 1 — Initialize Astro at the repo root (AC: 1, 2, 4)
- [ ] From `/home/akira/akirasmusicbox/`, run:
  ```bash
  npm create astro@latest . -- --template minimal --typescript strict
  ```
  **Critical:** Use `.` (dot), NOT `akirasmusicbox` — the project initializes at the current directory (repo root), not a subdirectory.
- [ ] When prompted about git initialization: **skip / say no** — git is already initialized.
- [ ] When prompted about installing dependencies: **yes**.
- [ ] Verify `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `src/env.d.ts`, and `src/pages/index.astro` exist at the repo root.
- [ ] Verify existing files were NOT overwritten: `public/`, `.github/`, `vercel.json`, `.gitignore`.

### Task 2 — Lock version pins in package.json (AC: 1)
- [ ] Open `package.json` and set exact ranges for the three pinned packages:
  ```json
  "astro": "^6.1.10",
  "@tailwindcss/vite": "^4.x",
  "@tailwindcss/typography": "^0.5.x"
  ```
  **Do this before adding any integrations** — the architecture requires version pins to be set before writing any collection code or integration config.
- [ ] Run `npm install` after editing `package.json` to regenerate `package-lock.json` with the pinned versions.

### Task 3 — Add integrations in sequence (AC: 3)
- [ ] Add MDX:
  ```bash
  npx astro add mdx
  ```
  Accept all prompts. Verify `@astrojs/mdx` appears in `astro.config.mjs` integrations array.
- [ ] Add Sitemap:
  ```bash
  npx astro add sitemap
  ```
  Accept all prompts. Verify `@astrojs/sitemap` appears in `astro.config.mjs` integrations array.
- [ ] Add Tailwind (installs `@tailwindcss/vite` — Tailwind v4):
  ```bash
  npx astro add tailwind
  ```
  Accept all prompts. Verify the Tailwind Vite plugin is wired into `astro.config.mjs`. Confirm NO `tailwind.config.js` was created.
- [ ] Install RSS (not via `astro add` — install directly):
  ```bash
  npm install @astrojs/rss
  ```
  This package is used in `src/pages/rss.xml.ts` directly; it does not go in the integrations array.

### Task 4 — Install and configure @tailwindcss/typography (AC: 6)
- [ ] Install:
  ```bash
  npm install @tailwindcss/typography
  ```
- [ ] Find the CSS file that Tailwind's Astro integration created (likely `src/styles/global.css` or similar — check what `npx astro add tailwind` generated).
- [ ] Add at the top of that CSS file:
  ```css
  @plugin "@tailwindcss/typography";
  ```
  **This is the Tailwind v4 way** — NOT `require('@tailwindcss/typography')` in a config file. If you use the v3 pattern, `prose` styles will silently disappear.
- [ ] Verify the file does NOT contain `tailwind.config.js` references or `require()` calls.

### Task 5 — Verify .gitignore has dist/ (AC: 9)
- [ ] Open `.gitignore` and confirm `dist/` is listed (Astro adds it automatically during init).
- [ ] If missing, add it manually.
- [ ] Also confirm `.node_modules` or `node_modules/` is listed.

### Task 6 — Run validation checks (AC: 7, 8)
- [ ] Run: `npx astro check` — must complete with zero errors.
- [ ] Run: `npm run build` — must produce a `dist/` directory with no errors.
- [ ] Run: `npx tsc --noEmit` — must pass with zero errors.
- [ ] If any check fails, fix before proceeding. Do not mark this task complete with failing checks.

### Task 7 — Commit and push; verify CI goes green (AC: 10, 11)
- [ ] Stage all new and modified files. Explicitly exclude: `dist/`, `node_modules/`.
  ```bash
  git add astro.config.mjs package.json package-lock.json tsconfig.json src/ .gitignore
  ```
- [ ] Review `git status` — confirm `dist/` and `node_modules/` are NOT staged.
- [ ] Confirm `public/`, `.github/workflows/ci.yml`, `vercel.json` are unmodified (or stage any legitimate changes to them).
- [ ] Commit (GPG signing is active):
  ```bash
  git commit -m "feat(init): initialize Astro project with all integrations and version pins"
  ```
- [ ] Push: `git push`
- [ ] Wait for GitHub Actions to run. Verify all four CI steps pass: `npm ci`, `npx astro check`, `npx tsc --noEmit`, `npm run build`.
- [ ] If CI fails, investigate and fix before marking story complete.

## Dev Notes

### Critical: Initialize at Repo Root, Not a Subdirectory

The architecture command (`npm create astro@latest akirasmusicbox -- ...`) assumes you're running it from the parent directory. Since the current directory IS already `akirasmusicbox/`, use `.` as the target:

```bash
npm create astro@latest . -- --template minimal --typescript strict
```

If you accidentally create `akirasmusicbox/akirasmusicbox/`, stop immediately, delete the inner directory, and re-run with `.`.

### Tailwind v4 — This Is NOT v3

`npx astro add tailwind` on Astro 6 installs `@tailwindcss/vite`, which is the Tailwind v4 Vite plugin. **Tailwind v4 has fundamentally different configuration:**

| Feature | v3 | v4 (what we use) |
|---|---|---|
| Config file | `tailwind.config.js` | **Does not exist** |
| Typography plugin | `require()` in config | `@plugin` directive in CSS |
| Dark mode config | `darkMode: 'media'` in config | CSS `@media (prefers-color-scheme: dark)` — automatic |
| Content paths | `content: [...]` array | Vite handles automatically |

**If `tailwind.config.js` appears after `npx astro add tailwind`, delete it** — it will silently conflict with v4's approach.

The typography plugin setup:
```css
/* In your CSS entry file (wherever astro add tailwind created it) */
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

### Existing Files Are Safe

Astro's minimal template initializer is additive for the most part. However, it may prompt to overwrite `.gitignore`. If it does, **say no** and manually verify your GPG exclusion entries are still present after init.

After init, confirm these files from previous stories are intact:
- `public/pubkey.asc` ✓
- `public/.well-known/` ✓
- `vercel.json` (with GPG Content-Type headers) ✓
- `.github/workflows/ci.yml` ✓
- `.gitignore` (including GPG exclusion patterns) ✓

### `@astrojs/rss` Is NOT in the Integrations Array

RSS is used as a plain import in `src/pages/rss.xml.ts`. It does NOT need to be listed in `astro.config.mjs`'s `integrations` array. Just `npm install @astrojs/rss` and it will be imported directly when the RSS page is built in Story 1.5.

### Expected astro.config.mjs After This Story

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind'; // or the vite plugin form

export default defineConfig({
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwind()], // Tailwind v4 via Vite
  },
});
```

Note: the exact form of the Tailwind integration depends on how `npx astro add tailwind` wires it up in Astro 6. Accept what the command generates — don't manually edit the integration config unless it's wrong.

### Version Pin Rationale

These pins are set before any code because:
- Astro 4.x, 5.x, and 6.x have incompatible Content Collections APIs — unintended upgrades break builds silently
- Tailwind v3 vs v4 mix silently drops all `prose` styles — no error, just blank typography
- The `^` range allows patch/minor updates but not major version bumps

### What CI Going Green Means

This is the first time the GitHub Actions workflow passes. After E1-S1 created the workflow, every push has been failing on `npm ci` (no `package.json`). After this story, the CI turns green on main for the first time. This is a significant milestone — from here on, every PR must pass CI before merge.

### Project Structure Notes

Files created/modified in this story (relative to repo root):
```
astro.config.mjs        # new — Astro config with integrations
package.json            # new — with version pins
package-lock.json       # new — lockfile (commit this)
tsconfig.json           # new — TypeScript strict config from Astro template
src/
  env.d.ts              # new — Astro type declarations
  pages/
    index.astro         # new — minimal placeholder (real home page in Story 1.6)
  styles/
    global.css          # new — Tailwind entry point with @plugin typography
.gitignore              # modified — dist/ and node_modules/ added by Astro
```

Files NOT created in this story (come in later stories):
- `src/content.config.ts` — Story 1.5
- `src/layouts/BaseLayout.astro` — Story 1.5
- `src/layouts/PostLayout.astro` — Story 1.6
- Full `vercel.json` security headers — Story 1.3
- `src/styles/tokens.css` — Story 1.4
- Any real content in `src/content/posts/` — Story 1.5

### Previous Story Intelligence

From Story 1.0 (GPG):
- `public/` directory already exists with `pubkey.asc`, `.well-known/` — preserve these
- `vercel.json` already exists as a stub — preserve it, Story 1.3 expands it
- `.gitignore` already has GPG exclusion patterns — verify they survive the Astro init

From Story 1.1 (CI):
- `.github/workflows/ci.yml` already active
- CI has been failing on `npm ci` since Story 1.1 — this story makes it green

### References

- Init command: [Source: `_bmad-output/planning-artifacts/architecture.md` → Starter Template → "Selected Starter: Astro Minimal"]
- Version pins: [Source: architecture.md → Starter Template → "Version Pins"]
- Tailwind v4 constraint: [Source: architecture.md → Technical Constraints → "Tailwind v3 vs v4"]
- Typography in v4: [Source: architecture.md → Architectural Decisions → "Styling Solution"]
- `@astrojs/rss` as direct import: [Source: architecture.md → Starter Template → integrations list]
- AR1: Project initialized with correct command
- AR2: Version pins locked before collection code

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List
