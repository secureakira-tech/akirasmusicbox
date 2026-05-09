---
stepsCompleted:
  - step-01-init
  - step-02-context
  - step-03-starter
  - step-04-decisions
  - step-05-patterns
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/implementation-readiness-report-2026-04-28.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
workflowType: 'architecture'
project_name: 'akirasmusicbox'
user_name: 'a k i r a '
date: '2026-04-28'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements (37 total across 5 categories):**

- **Content Publishing (FR1–FR7):** Author writes MDX locally, pushes to Git, deploys via Vercel. Frontmatter drives all taxonomy and sidebar flagging. No CMS, no admin UI. Author workflow: draft → `astro dev` preview → `git push` → Vercel auto-deploy → Buttondown queue. Three steps, no more.

- **Reading Experience (FR8–FR13):** Full post with inline embeds, artist support links, hi-fi sidebar, archive navigation, newsletter subscribe, About page.

- **Audio & Media (FR14–FR16):** Spotify, Apple Music, YouTube iframes render and play without layout shift. All images carry descriptive alt text.

- **Artist Support (FR17–FR19):** Bandcamp, social profiles, merch, Patreon — direct links only, no button-styled CTAs.

- **Newsletter & Subscriber (FR20+):** Email capture via Buttondown plain HTML form. RSS feed delivers crafted prose excerpt (defined in frontmatter as a required `description` field — `z.string()` in Zod schema), music citation, and direct link. No JS required for subscribe path.

**Non-Functional Requirements (architectural weight):**

| NFR | Implication |
|---|---|
| CLS = 0 on all embeds | Dimension-reserved containers before iframe loads — explicit `aspect-ratio` CSS required, not optional |
| WCAG 2.1 AA | Teal contrast adjusted to `#256B6B` (~4.6:1 on cream); all animations gated behind `prefers-reduced-motion` |
| Zero trackers | Plausible only; no cookies; no consent banner; Plausible script must be pinned with SRI |
| Strict CSP | Must live in `vercel.json` (not `<meta>` — `frame-ancestors` is broken in meta delivery); exact embed origins listed |
| Dark mode | `prefers-color-scheme: dark`, CSS custom properties redefined at `:root`, no JS toggle; a separate emotional environment, not a color inversion |
| No autoplay | `allow="autoplay"` absent from all iframes; requires explicit pre-launch test checklist |
| Static build | Vercel, Astro, pre-rendered HTML only; no SSR, no edge functions at launch |
| Privacy claim integrity | "No trackers. No cookies. No algorithms." is a verifiable technical claim this audience will check — every architectural decision either supports or undermines it |

**Scale & Complexity:**

- Primary domain: Static web publishing with embedded third-party media
- Complexity level: Low — solo author, no auth, no database, no real-time features
- Estimated architectural components: ~8 custom Astro components + 1 page template + 2 layout files
- Taxonomy system (genre, era, instrument, mood, post-type, hi-fi presence) should be built but **not prematurely optimised** — it earns its maintenance cost at ~50 issues, not at launch

---

### Technical Constraints & Dependencies

| Constraint | Implication |
|---|---|
| **Astro version must be pinned** | Astro 4.x and 5.x have incompatible Content Collections APIs; pin in `package.json` before writing any collection code |
| **Tailwind v3 vs v4 — pick one, document it** | Tailwind v4 drops `tailwind.config.js`; typography plugin declared in CSS (`@plugin`); mixing v3 patterns with v4 runtime silently drops all `prose` styles |
| Content Collections + Zod | Frontmatter schema is the single source of truth for taxonomy; `pubDate` must be `z.coerce.date()` not `z.string()` for valid RSS `<pubDate>` nodes |
| `@tailwindcss/typography` | `not-prose` required on every custom component inside `<article class="prose">` — see component list in Cross-Cutting Concerns |
| MDX component registration | Register all custom components globally via `components` prop in `@astrojs/mdx` integration config — author never writes import statements in content files |
| Fontsource (self-hosted) | Font imports in `BaseLayout.astro`; `font-display` strategy must be set explicitly — Fontsource defaults to `swap`, which causes FOUT on a display-font-heavy publication; consider `optional` with `size-adjust` fallback descriptors |
| Buttondown embed endpoint | Newsletter form POSTs to Buttondown; success = redirect; no JS required; no CSRF risk (no auth, no session; Buttondown double opt-in handles abuse) |
| Plausible analytics | Script tag with **SRI hash pinned**; no cookies; satisfies zero-tracker posture; re-pin hash on Plausible script updates |
| Vercel deployment | Git push → Vercel build (<2 min) → live; use branch preview deploys for draft review — author workflow should default to feature branches, not direct main commits |
| Third-party iframes (3 platforms) | CSP `frame-src` in `vercel.json` must list exact origins: `open.spotify.com embed.spotify.com` (Spotify), `www.youtube.com www.youtube-nocookie.com` (YouTube — prefer nocookie), `embed.music.apple.com` (Apple Music) |
| `astro.config.mjs` integrations | Required: `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`, Tailwind integration (method depends on v3/v4 decision) |

---

### Cross-Cutting Concerns

**1. CSP policy (`vercel.json` — single source of truth for all headers)**

CSP must be a `vercel.json` response header, not a `<meta>` tag — `frame-ancestors` is undefined behaviour in meta delivery. All security headers live in one `vercel.json` `headers` block:

- `Content-Security-Policy` — `script-src 'self' [plausible-origin]`; `frame-src` exact origins; no `'unsafe-inline'`, no `'unsafe-eval'`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
- MIME type for `.asc` files: `Content-Type: application/pgp-keys`

HSTS is handled by Vercel on production domains — do not add manually without understanding `max-age` and preload implications.

**2. CSS custom properties + dark mode**

All color values are CSS custom properties defined once in `src/styles/global.css`. Two `:root` blocks — one default (light), one inside `@media (prefers-color-scheme: dark)`. Zero hardcoded hex values or hardcoded Tailwind palette classes (`text-gray-900`, `bg-white`) in any component — these will not respond to the dark mode media query. One token change propagates everywhere.

Dark mode is **not a color inversion** — it is a separate emotional environment. `#1C1510` background, `#F0E8DC` text. The earthy warmth of the light palette must be preserved in the dark.

**3. `not-prose` discipline — component list**

Every custom component rendered inside `<article class="prose">` must carry `not-prose` on its outermost wrapper. Confirmed in-prose components:

- `PrimaryEmbed` ✓
- `ReferenceEmbed` ✓
- `Note` ✓
- `ArtistSupport` ✓
- `ClosingRitual` ✓
- `NewsletterSubscribe` ✓
- `HiFiSidebar` — rendered outside `<article>` in the grid sidebar column; `not-prose` not required but verify in `PostLayout.astro`

**4. `prefers-reduced-motion` gate**

Applied globally in `global.css` — not per-component:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Gates all transitions and animations site-wide including the boombox echo.

**5. Responsive breakpoint contract**

Single custom breakpoint: `min-width: 68.75em` (≈1100px, in `em` for zoom/reflow compliance). Two-column grid above; single column below. The sidebar column collapse is **not automatic** — it requires explicit implementation. Source order: `<article>` first, `<aside>` second, always — CSS Grid handles visual placement, not source order.

**6. Embed states — all four required in both modes**

Every embed component (PrimaryEmbed, ReferenceEmbed) must implement all four states in both light and dark mode before the component is considered complete:

| State | Implementation |
|---|---|
| Loading | Fixed-dimension placeholder via `aspect-ratio` CSS — exists in DOM before iframe loads; CLS = 0 |
| Loaded | Full iframe rendered |
| Playing | Boombox echo: `@keyframes boombox-echo`, single teal pulse ~1.5s, not looped, triggered by JS click listener on wrapper (not iframe); `.embed-playing` class added to wrapper |
| Failed | Styled block, same dimensions, same border, site-voice message with platform link; never a blank gap |

**Boombox echo mutual exclusion:** If multiple embeds are on one page, the click listener must use `querySelectorAll` + loop and remove `.embed-playing` from all siblings before adding it to the clicked wrapper. Astro `<script>` tags are deduped — account for this in listener registration.

**7. Embed CLS mechanism (explicit)**

```css
.embed-wrapper {
  position: relative;
  aspect-ratio: 16 / 9; /* YouTube; override per embed type */
}
.embed-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
```

Spotify compact (audio-only): `aspect-ratio: unset; height: 80px`. Spotify expanded: `height: 352px`. YouTube: `16/9`. These must be enumerated per embed variant, not guessed at implementation time.

**8. `PostLayout.astro` sticky sidebar contract**

```css
.post-layout {
  display: grid;
  grid-template-columns: minmax(0, 700px) 220px;
  gap: 4rem;
}
.hifi-sidebar {
  position: sticky;
  top: calc(52px + 2rem);
  align-self: start;
}
```

`position: sticky` breaks silently if any ancestor has `overflow: hidden` or `overflow: auto`. **Never set overflow on `.post-layout` or any of its ancestors.** This is the most common silent layout bug in sticky sidebar implementations.

**9. Font swap / FOUT**

Fontsource defaults to `font-display: swap`. For a publication with a distinctive heading font (Space Grotesk), swap causes a visible flash on first load. Override in `src/styles/global.css`:

```css
@font-face {
  font-family: 'Space Grotesk';
  font-display: optional; /* or swap with size-adjust fallback */
}
```

Evaluate `optional` vs `swap` with `size-adjust` fallback descriptors before launch.

**10. RSS autodiscovery**

`<link rel="alternate" type="application/rss+xml" href="/rss.xml" title="akirasmusicbox">` must be in `<head>` of `BaseLayout.astro`. Without this, feed readers will not discover the feed. The `description` frontmatter field (required in Zod schema) is the source for RSS excerpts — never auto-generated, never optional.

---

### UX Invariants — Things That Must Not Be Simplified

These constraints look like implementation details. They are load-bearing product decisions. A developer reading only the architecture doc must not simplify them.

| Invariant | Why it is non-negotiable |
|---|---|
| **Embed wrapper has fixed dimensions before iframe loads** | CLS=0 is the reading rhythm. A 40px layout shift mid-sentence breaks Priya's Thursday ritual and she does not come back. |
| **Boombox echo is a named CSS keyframe, fires once, does not loop** | It is not a hover state. Not a loading spinner. It is the moment the record starts playing — a single breath. If it loops or shares state with interactive teal, the emotional register collapses. |
| **Sidebar content relocates on mobile, it does not disappear** | `display: none` on the `<aside>` below 1100px is wrong. The `<details>`/`<summary>` blocks are the mobile presentation of the same content. The superscript markers in prose link to notes that must be accessible. |
| **Dark mode is a parallel emotional environment, not an inversion** | `filter: invert()` or a naive color swap produces a cold blue-grey result that reads as a hospital intake form. The warm earth tones (`#1C1510`, `#F0E8DC`) are specified for a reason. |
| **Newsletter form is plain HTML, zero JS, no modal, no toast** | The constraint is trust. The audience will notice — and leave — if a JS-dependent form appears on a site that claims to require none. |
| **Newsletter subscribe appears post-end only** | Structural, not configurable. A mid-scroll prompt is a values violation for this audience, not a UX improvement. |
| **All color values use CSS custom properties** | Hardcoded Tailwind palette classes (`text-gray-900`, `bg-white`) do not respond to `prefers-color-scheme: dark`. One instance breaks the entire dark mode system. |

---

### GPG Key Publication

**Canonical page:** `/pgp` (or `/contact` if contact information will be consolidated). Link from `/about` with a one-liner. Do not embed the full key block on `/about`.

**File structure:**

```
public/
  pubkey.asc          # raw armored public key, served at /pubkey.asc
  .well-known/
    security.txt      # security contact file
    openpgpkey/       # WKD (Web Key Directory) — see below
      hu/
        <z-base32-hash>   # binary key, precomputed hash
      policy              # empty file
```

**`vercel.json` additions** (merges with CSP headers block):

```json
{
  "headers": [
    {
      "source": "/(.*)\\.asc",
      "headers": [{ "key": "Content-Type", "value": "application/pgp-keys" }]
    },
    {
      "source": "/.well-known/openpgpkey/(.*)",
      "headers": [{ "key": "Content-Type", "value": "application/octet-stream" }]
    }
  ]
}
```

**`/pgp` page content:**
- Full 40-character fingerprint, formatted in groups of four
- Inline armored ASCII block in `<pre>` — copyable
- Direct download link to `/pubkey.asc`
- Link to keys.openpgp.org search by fingerprint
- `<link rel="pgpkey" href="/pubkey.asc" />` in `<head>` of `BaseLayout.astro` (or scoped to `/pgp`)

**`/.well-known/security.txt`:**

```
Contact: mailto:<email>
Encryption: https://akirasmusicbox.com/pubkey.asc
Preferred-Languages: en
Expires: <date, ~1 year from publication>
```

**Web Key Directory (WKD):** Implement. Compute the z-base32 hash of the email localpart with `gpg --with-wkd-hash --fingerprint <email>`. Export binary key (not armored) to the correct path. Supported by Thunderbird, GPG `--auto-key-locate`, and others. One-time setup, meaningful for a technical audience.

**Keyservers:** Upload to keys.openpgp.org only. Do not upload to SKS keyservers (certificate-spam vulnerability can bloat keys to tens of megabytes).

**Key hygiene — document in architecture spec and calendar:**

| Item | Requirement |
|---|---|
| Key algorithm | Ed25519 or RSA-4096 minimum |
| Expiry | Set 1–2 year expiry; expiry is a forcing function, not a liability |
| Revocation certificate | Generate now, store offline, document location |
| Rotation reminder | Calendar alert 60 days before expiry |
| Key rotation | Keep retired public key published with a retirement note; do not silently replace |
| Private key | Must never appear in the repository; audit `.gitignore` |

**Record in this document:**
- Full fingerprint: `E6C3 5F6B 598A E564 0744  1A51 8218 2BAB BB58 ECEF`
- Key creation date: `2026-05-09`
- Expiry date: `2027-05-09`
- Keyservers: keys.openpgp.org
- Revocation certificate location: `Offline — USB thumb drive (not in repo)`

---

### Implementation Risk Register

Ordered by likelihood of causing a build failure or silent regression in the first week:

| # | Risk | Mitigation |
|---|---|---|
| 1 | Astro 4/5 version mismatch between local and Vercel | Pin `"astro": "4.x"` (or explicit 5.x) in `package.json` before writing any collection code |
| 2 | Tailwind v3/v4 fork — silent `prose` class failure | Pick one, document it, lock it; verify `prose` applies on a blank post before building any component |
| 3 | CSP in `<meta>` tag instead of `vercel.json` | `frame-ancestors` is ignored in meta delivery; put all headers in `vercel.json` from day one |
| 4 | Iframe CLS — no server-rendered placeholder | Always spec `aspect-ratio` dimensions per embed type before building `PrimaryEmbed` |
| 5 | `not-prose` violation on a new component | Maintain the component list in this document; treat it as a checklist, not a suggestion |
| 6 | Font swap FOUT on first load | Resolve `font-display` strategy before publishing first issue |
| 7 | RSS `<pubDate>` invalid due to `z.string()` in schema | Use `z.coerce.date()` for `pubDate` in Zod schema from day one |
| 8 | Boombox echo on multi-embed page — no mutual exclusion | JS listener must use `querySelectorAll` + loop; remove `.embed-playing` from siblings on click |
| 9 | Sticky sidebar broken by `overflow: hidden` on ancestor | Never set `overflow` on `.post-layout` or its ancestors; test sticky before shipping any post |
| 10 | Plausible SRI hash outdated after Plausible script update | Track Plausible script version; update SRI hash in `BaseLayout.astro` on each Plausible release |

---

## Starter Template Evaluation

### Primary Technology Domain

Static publishing site — Astro (SSG), MDX content, Tailwind CSS, Vercel.

### Starter Options Considered

| Option | Assessment |
|---|---|
| Community blog starters (Foxi, AstroWind, Blogster) | Rejected — opinionated layouts and theme scaffolding would need to be torn out; adds noise without value for a solo-authored publication |
| `create astro` blog template | Rejected — ships with placeholder content structure that conflicts with the Zod-enforced taxonomy schema we're building |
| `create astro` minimal + manual integration | **Selected** — zero overhead, full control, aligns with low-complexity project profile |

### Selected Starter: Astro Minimal + Manual Integrations

**Rationale:** This project has ~8 custom components and a well-defined content schema. A community starter optimises for team onboarding and design decisions already made — neither applies here. Starting minimal means the architecture doc *is* the project structure.

**Initialization Command:**

```bash
npm create astro@latest akirasmusicbox -- --template minimal --typescript strict
```

**Then add integrations:**

```bash
cd akirasmusicbox
npx astro add mdx
npx astro add sitemap
npx astro add tailwind        # installs @tailwindcss/vite for Tailwind v4
npm install @astrojs/rss
```

**Version Pins (set in `package.json` before writing any collection code):**

```json
{
  "astro": "^6.1.10",
  "@tailwindcss/vite": "^4.x",
  "@tailwindcss/typography": "^0.5.x"
}
```

### Architectural Decisions Made by This Stack

**Language & Runtime:**
TypeScript strict mode — all components and content schemas are typed end-to-end. Astro's `.astro` files are JSX-like with frontmatter; MDX files use standard MDX syntax.

**Styling Solution:**
Tailwind CSS v4 via `@tailwindcss/vite` plugin. Typography plugin registered in `global.css` via `@plugin "@tailwindcss/typography"`. All color values in CSS custom properties — no hardcoded Tailwind palette classes (see UX Invariants). `not-prose` required on every custom component inside `<article class="prose">`.

**Build Tooling:**
Vite (Astro's bundler) — no configuration needed. `output: 'static'` (default) — pre-rendered HTML only, no SSR, no edge functions.

**Content Organization:**
Astro v6 Content Collections with `src/content.config.ts` (note: v5+ moved config from `src/content/config.ts`). `pubDate` typed as `z.coerce.date()` — required for valid RSS `<pubDate>` nodes. `description` field required (`z.string()`) — source for RSS excerpts.

**Project Structure:**

```
src/
  content/
    posts/           # .mdx files — one per issue
  content.config.ts  # Zod schema — single source of truth for taxonomy
  components/        # ~8 custom components
  layouts/
    BaseLayout.astro
    PostLayout.astro
  pages/
    index.astro
    archive.astro
    about.astro
    pgp.astro
    rss.xml.ts
  styles/
    global.css       # CSS custom properties, dark mode, font-face
public/
  pubkey.asc
  .well-known/
vercel.json          # All security headers + CSP
astro.config.mjs
```

**Development Experience:**
`astro dev` — Vite HMR, instant preview. Branch preview deploys via Vercel for draft review. Author workflow: draft in `src/content/posts/` → `astro dev` preview → `git push` → Vercel auto-deploy.

**Note:** Project initialization using the commands above should be the first implementation story.

---

## Core Architectural Decisions

### Decision Priority Analysis

**Critical (block implementation):**
- Client-side JS strategy — determines component architecture
- Image handling — determines how post images are authored

**Important (shape architecture):**
- SEO / Open Graph — determines BaseLayout.astro structure
- `font-display` strategy — determines perceived performance on first load

**Deferred (post-launch):**
- Dynamic per-post OG image generation
- Archive pagination (add when post count warrants it)
- Syntax highlighting theme (Shiki built-in — configure theme in `astro.config.mjs`)
- Search (taxonomy browsing covers navigation at launch)

---

### Data Architecture

No database. Content store is the filesystem:

- `src/content/posts/` — MDX files, one per issue
- `src/content.config.ts` — Zod schema is the single source of truth for all taxonomy
- No migrations, no seeding, no ORM
- All data access via Astro's `getCollection()` / `getEntry()` — typed at build time

---

### Authentication & Security

No authentication. No user accounts. No sessions.

Security surface is entirely static-file delivery:

- CSP delivered via `vercel.json` response headers (not `<meta>`)
- Plausible SRI hash pinned in `BaseLayout.astro`
- No cookies, no localStorage, no JS-injected tracking
- Buttondown form: unauthenticated POST to Buttondown endpoint — no CSRF risk (no auth, no session; Buttondown double opt-in handles abuse)
- GPG key published at `/pubkey.asc` + WKD — see GPG Key Publication section

---

### API & Communication

No server-side API. Two "endpoints" in the static build:

- `/rss.xml` — generated by `@astrojs/rss` at build time
- Buttondown form — plain HTML `<form action="[buttondown-endpoint]" method="POST">`, no JS

No rate limiting, no API versioning, no inter-service communication.

---

### Frontend Architecture

**JavaScript strategy:** Vanilla JS only. No framework islands (no React, Vue, or Svelte hydration). Interactive behaviors are limited to:
- Boombox echo: click listener on `.embed-wrapper` → add `.embed-playing` → fires `boombox-echo` keyframe once
- Embed mutual exclusion: `querySelectorAll('.embed-wrapper')` + loop removes `.embed-playing` from all siblings before adding to clicked wrapper
- Astro deduplicates `<script>` tags — register listeners via a module script with a `data-initialized` guard

**Component architecture:** Astro components (`.astro`) only. No framework components needed. Props are typed via TypeScript interfaces in the component frontmatter.

**Routing:** Astro file-based routing. All routes are static pages generated at build time:
- `/` — homepage (latest issue)
- `/archive` — all issues list
- `/about` — author page
- `/pgp` — GPG key publication
- `/rss.xml` — RSS feed
- `/posts/[slug]` — individual post

**State management:** None. No shared client state. All data is in props passed at render time.

**Image handling:** `astro:assets` `<Image>` component for all post images. Provides automatic WebP/AVIF conversion, responsive `srcset`, and CLS-safe `width`/`height` — required to maintain CLS = 0 on image-heavy posts. Images stored in `src/content/posts/` alongside MDX files (co-location) or in `src/assets/` (shared assets).

**SEO / Open Graph:** Manual `<meta>` tags in `BaseLayout.astro`. No package dependency. Fields: `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`, `twitter:title`, `twitter:description`. OG image defaults to static site logo at launch; per-post OG images deferred post-launch.

---

### Infrastructure & Deployment

**Hosting:** Vercel — static output, no serverless functions, no edge runtime.

**CI/CD:** Vercel Git integration. Push to `main` → production deploy. Push to any branch → preview deploy URL. No custom pipeline needed.

**Environment configuration:** No secrets at launch. Buttondown endpoint URL is public. No `.env` file required for the site build.

**Monitoring:** Plausible cloud analytics. No error monitoring at launch (no server-side code to monitor). Browser console errors surfaced during manual testing only.

**Scaling:** Not applicable — static files served from Vercel CDN.

**`font-display` strategy:** `optional` for Space Grotesk (heading/display font) to eliminate FOUT. Body text uses system font stack fallback during `optional` loading. Must be validated with throttled network before first issue publishes.

---

### Decision Impact Analysis

**Implementation sequence implied by these decisions:**

1. Initialize Astro project + add integrations
2. Configure `vercel.json` (security headers, CSP) — before any deploy
3. Set up `global.css` (CSS custom properties, dark mode, font-face with `optional`) — before any component work
4. Define Zod schema in `content.config.ts` — before writing any content
5. Build `BaseLayout.astro` (fonts, SEO meta, Plausible script, RSS autodiscovery) — before building page templates
6. Build `PostLayout.astro` (grid, sticky sidebar) — before building post components
7. Build embed components (`PrimaryEmbed`, `ReferenceEmbed`) with all 4 states — before writing first real post
8. Build remaining components (`Note`, `ArtistSupport`, `ClosingRitual`, `HiFiSidebar`, `NewsletterSubscribe`)
9. Build page templates (index, archive, about, pgp, rss.xml)

**Cross-component dependencies:**
- `global.css` CSS custom properties → all components depend on these tokens
- Zod schema → `PostLayout.astro` reads typed frontmatter; RSS feed reads `description` field
- `vercel.json` CSP `frame-src` → must list exact iframe origins before `PrimaryEmbed` / `ReferenceEmbed` ship
- `<script>` deduplication → boombox echo listener must use a `data-initialized` guard if `PrimaryEmbed` is used multiple times per page

---

## Implementation Patterns & Consistency Rules

### Conflict Points Identified

13 areas where AI agents could make different choices that cause silent failures, style regressions, broken dark mode, or broken user experience. Every pattern below exists to prevent a specific documented failure mode.

---

### Naming Patterns

**Component files:** PascalCase, `.astro` extension.
- Correct: `PrimaryEmbed.astro`, `HiFiSidebar.astro`, `BaseLayout.astro`
- Wrong: `primary-embed.astro`, `primaryEmbed.astro`

**Content files:** kebab-case, `.mdx` extension, in `src/content/posts/`.
- Format: `YYYY-MM-DD-slug.mdx`
- Filename date is **sort-order convenience only**. `pubDate` frontmatter is the authoritative date for display and feed generation. Do not write sync-validation logic between filename date and frontmatter date.

**TypeScript interfaces:** PascalCase, defined inline in component frontmatter or in `src/types/index.ts` for shared types.
- Every component that accepts props must declare `interface Props { ... }` in its script block.

**CSS classes (custom, non-Tailwind):** kebab-case.
- Correct: `.embed-wrapper`, `.embed-playing`, `.hifi-sidebar`, `.post-layout`, `.is-playing`
- Never camelCase or underscores in CSS class names.

**Page routes:** kebab-case, matching Astro file name. Slug from MDX filename (minus date prefix), enforced by Astro.

---

### Component Patterns

**`not-prose` rule — ALL components, no exceptions:**
Every custom component rendered inside `<article class="prose">` must have `not-prose` on its outermost element. The six components listed below are the current inventory — this is **not a whitelist**. Any new component rendered inside prose must have `not-prose` regardless of whether it appears in this list. Update this list when adding new in-prose components.

Current in-prose components: `PrimaryEmbed`, `ReferenceEmbed`, `Note`, `ArtistSupport`, `ClosingRitual`, `NewsletterSubscribe`.

```astro
<!-- Correct -->
<div class="not-prose embed-wrapper">...</div>

<!-- Wrong — Tailwind typography will override component styles -->
<div class="embed-wrapper">...</div>
```

**Embed components — all 4 states required, per-component state:**
Each embed component manages its own state independently. There is no shared state utility or hook. State lives in the component's `<script>` tag and CSS classes on the component's root element.

A component is not complete until it implements all 4 states in both light and dark mode:

| State | Implementation |
|---|---|
| Loading | Fixed-dimension placeholder via `aspect-ratio` CSS (see embed dimensions below) |
| Loaded | Full iframe rendered |
| Playing | `.is-playing` class on component root; triggers `boombox-echo` keyframe |
| Failed | Styled block with human-readable message and platform link |

**Embed dimensions — CSS custom properties, not Tailwind utilities:**
```css
/* In src/styles/tokens.css */
--embed-ratio-video: 16 / 9;          /* YouTube */
--embed-ratio-spotify-compact: auto;   /* Spotify compact — fixed height */
--embed-height-spotify-compact: 80px;
--embed-height-spotify-expanded: 352px;
--embed-ratio-apple: 16 / 9;          /* Apple Music */
```

**Embed failed state — content and dark mode requirements:**
- Must contain: a human-readable message in site voice + a direct link to the content on the platform
- Same fixed dimensions as loading state (no layout shift on failure)
- Same border treatment as loaded state
- In dark mode: muted, low-contrast treatment — never a harsh red or high-alarm color. Failure is an acknowledgment, not an alarm.
- Never a blank or unstyled gap.

**Props interface — always typed:**
```astro
---
interface Props {
  src: string;
  platform: 'spotify' | 'youtube' | 'apple';
  title: string;
}
const { src, platform, title } = Astro.props;
---
```

**Image rule — `<Image>` only, never `<img>`, required props:**
```astro
<!-- Correct -->
import { Image } from 'astro:assets';
<Image
  src={albumArt}
  alt="Album cover: [title] by [artist]"
  widths={[400, 800, 1200]}
  formats={['avif', 'webp']}
  loading="lazy"   <!-- "eager" for LCP images only -->
/>

<!-- Wrong — bypasses dimension inference, breaks CLS = 0 -->
<img src="/album.jpg" alt="..." />
```

---

### CSS & Styling Patterns

**CSS custom property token location — canonical, nowhere else:**
All color, spacing, and animation tokens are declared in `src/styles/tokens.css`. This file is imported once in `BaseLayout.astro`. Tokens are never declared in component `<style>` blocks or inline `style` attributes.

```css
/* src/styles/tokens.css — only file that declares :root custom properties */
:root {
  --color-text: #1C1510;
  --color-surface: #FAF6F0;
  --color-teal: #256B6B;
  --boombox-echo-duration: 600ms;
  /* ... all tokens */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-text: #F0E8DC;
    --color-surface: #1C1510;
    /* cool undertones, desaturated accents — see dark mode character below */
  }
}
```

**Color values — CSS custom properties only, no Tailwind palette classes:**
```css
/* Correct */
color: var(--color-text);
background: var(--color-surface);

/* Wrong — breaks dark mode */
color: #1C1510;
```

**Tailwind dark mode — `dark:` utility class must NOT be used:**
Dark mode is implemented entirely via CSS custom properties and the `@media (prefers-color-scheme: dark)` block in `src/styles/tokens.css`. Tailwind's `dark:` variant utility classes (e.g. `dark:text-white`, `dark:bg-slate-900`) must never be used — they conflict with the CSS-custom-properties-only approach and produce unpredictable results. If Tailwind's `darkMode` config is present, set it to `'media'` to prevent accidental class-based dark mode.

**Dark mode character contract:**
Dark mode is a parallel emotional environment, not a color inversion. When updating dark mode token values, maintain these intent descriptors:
- Background: `#1C1510` — warm near-black, not cool gray
- Text: `#F0E8DC` — warm off-white, not pure white
- Accents: desaturate slightly from light-mode equivalents — do not simply darken
- Failure/error states: muted, low-contrast — late-night acknowledgment, not clinical alarm

**Animation — `prefers-reduced-motion` is global, do not add per-component:**
The global reduced-motion override in `global.css` applies to all components. Do not add per-component `prefers-reduced-motion` checks.

---

### JavaScript Patterns

**No framework islands — no `client:*` directives:**
Zero React, Vue, or Svelte hydration. All interactivity is vanilla JS in `<script>` tags.

**`<script>` deduplication guard — scope to component root, keyed by name:**
Astro deduplicates `<script>` tags across multiple instances of the same component. All event listeners must guard against double-registration. The guard attribute lives on the **component's outermost DOM element**, keyed by component name:

```astro
<script>
  // Guard is on the component root, not on document.body
  // document.body guard would prevent all subsequent instances from initializing
  document.querySelectorAll('.embed-wrapper:not([data-initialized="PrimaryEmbed"])').forEach(wrapper => {
    wrapper.setAttribute('data-initialized', 'PrimaryEmbed');
    wrapper.addEventListener('click', () => {
      document.querySelectorAll('.embed-wrapper').forEach(el => el.classList.remove('is-playing'));
      wrapper.classList.add('is-playing');
    });
  });
</script>
```

**Boombox echo lifecycle — add on click, remove on `animationend`:**
The `.is-playing` class must be removed after the animation completes so the effect can re-trigger on subsequent clicks. An `animation-iteration-count: 1` class that is never removed means only the first click produces the echo — all subsequent clicks are silent.

```js
wrapper.addEventListener('click', () => {
  document.querySelectorAll('.embed-wrapper').forEach(el => el.classList.remove('is-playing'));
  wrapper.classList.add('is-playing');
});

wrapper.addEventListener('animationend', () => {
  wrapper.classList.remove('is-playing');
});
```

Animation duration is governed by `--boombox-echo-duration` token in `src/styles/tokens.css`. The animation CSS uses this token — never a hardcoded `ms` value.

**No inline event handlers:**
No `onclick="..."` or `onmouseover="..."` attributes in markup. All listeners via `addEventListener`.

---

### MDX Content Patterns

**No import statements in MDX files:**
All custom components are registered globally in `astro.config.mjs` under the `mdx()` integration `components` key:

```js
// astro.config.mjs — authoritative registration location
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [
    mdx({
      components: {
        PrimaryEmbed: './src/components/PrimaryEmbed.astro',
        ReferenceEmbed: './src/components/ReferenceEmbed.astro',
        Note: './src/components/Note.astro',
        ArtistSupport: './src/components/ArtistSupport.astro',
        ClosingRitual: './src/components/ClosingRitual.astro',
        NewsletterSubscribe: './src/components/NewsletterSubscribe.astro',
      }
    })
  ]
});
```

When adding a new globally-used component, add it to this object. An author never writes `import` in a content file — if a component isn't rendering, fix the registration, not the MDX file.

**Frontmatter schema — `src/content.config.ts` is authority:**
The Zod schema in `src/content.config.ts` is the single source of truth for all frontmatter fields. Key constraints:
- `pubDate`: `z.coerce.date()` — accepts ISO 8601 string, coerces to Date; required for valid RSS `<pubDate>` nodes
- `description`: `z.string()` — required; this is the RSS excerpt and OG description; must be present on every post

**Escape hatch — vanilla JS state complexity:**
If embed state complexity grows beyond 4 states or 3 component types, revisit the no-islands constraint before copying vanilla JS state logic into a fourth component. The no-islands decision was made for a known complexity ceiling; if that ceiling is reached, the trade-off changes.

---

### Layout & Mobile Patterns

**Sidebar — never hidden, only repositioned:**
On mobile (below 1100px / `68.75em`), the `HiFiSidebar` content must be visible — never `display: none`. Below the breakpoint, sidebar content relocates to a `<details>`/`<summary>` block within the post flow. `display: none` on the sidebar at any viewport width is wrong.

**Mobile DOM order:**
Source order is always: `<article>` first, `<aside>` second. CSS Grid handles visual placement above the breakpoint. On mobile, the sidebar `<details>` block must appear **before** the `NewsletterSubscribe` component in the post flow — its purpose is to orient the reader, not to arrive after the commitment prompt.

**Sticky sidebar — `overflow` is forbidden on ancestors:**
`position: sticky` on `.hifi-sidebar` silently breaks if any ancestor has `overflow: hidden` or `overflow: auto`. Never set `overflow` on `.post-layout` or any of its ancestors.

---

### Enforcement Guidelines

**All agents implementing stories for this project MUST:**

- Use `<Image>` from `astro:assets` for every image — never `<img>`
- Apply `not-prose` to every custom component rendered inside `<article class="prose">` — ALL components, not just the named list
- Use CSS custom properties from `src/styles/tokens.css` for all color values — never hardcode hex, never use Tailwind palette classes
- Implement all 4 embed states, with failed state copy + recovery action, before marking any embed component story done
- Use `data-initialized="ComponentName"` on the component's outermost element — not on `document.body`
- Remove `.is-playing` on `animationend` — do not persist animation classes
- Name `.astro` component files in PascalCase
- Type all component props with a `Props` interface
- Never use `dark:` Tailwind utility classes

**Verification checklist — all items must be checked before a component story is complete. Unchecked items = implementation is incomplete and must not be committed.**

- [ ] Renders correctly in light mode
- [ ] Renders correctly in dark mode (check CSS custom properties — no hardcoded values)
- [ ] If rendered inside `<article class="prose">`: `not-prose` present on outermost element
- [ ] If interactive: `data-initialized="ComponentName"` guard on component root
- [ ] If animation: `.is-playing` (or equivalent) removed on `animationend`
- [ ] If images: `<Image>` component used with `widths`, `formats`, and `loading` props
- [ ] If embed: all 4 states implemented; failed state has copy + recovery link; dark mode failed state is low-alarm
