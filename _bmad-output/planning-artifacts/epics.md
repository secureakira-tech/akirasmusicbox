---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
---

# akirasmusicbox - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for akirasmusicbox, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

---

## Requirements Inventory

### Functional Requirements

FR1: Author can create and edit posts in Markdown/MDX with structured frontmatter metadata
FR2: Author can tag posts with genre, era, instrument, mood, post type (standard or short-form), and hi-fi sidebar presence
FR3: Author can embed audio players (Spotify, Apple Music, YouTube) inline within post content
FR4: Author can include direct artist support links (Bandcamp, Patreon, merch) within post content
FR5: Author can include a hi-fi sidebar section within any post
FR6: Author can publish posts via Git push with automatic site deployment
FR7: Author can queue newsletter delivery to Buttondown on a scheduled basis
FR8: Readers can read full post content with inline embedded audio players
FR9: Readers can access artist support links directly from within a post without leaving the page context
FR10: Readers can identify and read the hi-fi sidebar as a visually and semantically distinct element within a post
FR11: Readers can navigate from a post to related posts or the broader archive
FR12: Readers can subscribe to the newsletter from within a post page
FR13: Readers can access an About page explaining the author's background, credentials, and cross-genre methodology
FR14: Embedded audio players (Spotify, Apple Music, YouTube) render and play within post content
FR15: Embedded audio players load without causing visible layout shift
FR16: All post images are displayed with descriptive alt text
FR17: Readers can access Bandcamp purchase links from within a post
FR18: Readers can access artist social profiles from within a post
FR19: Readers can access artist merch and crowdfunding links (Patreon, etc.) from within a post
FR20: Readers can make a voluntary donation to the site via Ko-fi
FR21: Readers can browse all posts filtered by genre
FR22: Readers can browse all posts filtered by era
FR23: Readers can browse all posts filtered by instrument
FR24: Readers can browse all posts filtered by mood
FR25: Individual posts and taxonomy pages are indexable and discoverable via external search engines
FR26: Site generates and publishes a sitemap for search engine indexing
FR27: Readers can subscribe to the weekly email newsletter using only an email address
FR28: Subscribers receive new posts delivered to their inbox via Buttondown
FR29: Newsletter emails link directly to the published post on-site
FR30: Site operates with zero third-party tracking scripts or surveillance pixels
FR31: Site displays a published on-site statement declaring its no-tracker, no-cookie, no-algorithm posture
FR32: Site collects privacy-respecting, cookieless analytics via Plausible
FR33: All third-party embeds (audio players, Plausible script, Ko-fi link) function correctly within the site's strict Content Security Policy
FR34: All post content and site navigation is operable by keyboard alone
FR35: All images carry descriptive alt text sufficient for screen reader comprehension
FR36: The hi-fi sidebar is navigable as a distinct landmark region, independently accessible from main post content
FR37: Site color contrast meets WCAG 2.1 AA minimums throughout
FR38: Site home page displays the most recent post in full, including its hi-fi sidebar if present
FR39: Site-wide top navigation includes links to About, Support (Ko-fi), and Archive
FR40: Readers can access an Archive page listing all posts in reverse-chronological order
FR41: Readers can browse all posts that include a hi-fi sidebar, via the same taxonomy browse pattern as genre/era/instrument/mood

### NonFunctional Requirements

NFR1: LCP < 2.5s on desktop; < 4s on mobile (simulated 3G)
NFR2: CLS = 0 — third-party embeds use reserved placeholder space; no layout movement on embed load
NFR3: INP < 200ms
NFR4: Site performance does not degrade as archive grows (static generation + CDN delivery)
NFR5: HTTPS enforced on all pages via Vercel automatic TLS
NFR6: HSTS preloaded with includeSubDomains and max-age ≥ 1 year
NFR7: Strict CSP delivered via vercel.json — all third-party sources explicitly allowlisted; no unsafe-inline or unsafe-eval unless provably required and documented
NFR8: X-Frame-Options: SAMEORIGIN
NFR9: Referrer-Policy: strict-origin-when-cross-origin
NFR10: X-Content-Type-Options: nosniff
NFR11: Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
NFR12: DNSSEC enabled on domain registrar
NFR13: Subresource Integrity (SRI) hashes on all externally loaded scripts
NFR14: No cookies set by the site itself
NFR15: No user PII collected or stored by the site — email held only by Buttondown
NFR16: Git repo: branch protection on main; no secrets, tokens, or credentials in codebase or commit history
NFR17: All commits signed with author's GPG key; public key published on-site and linked to keyserver
NFR18: WCAG 2.1 AA compliance verified before launch via Lighthouse, axe, and manual keyboard nav
NFR19: Screen reader compatibility tested against VoiceOver or NVDA before launch
NFR20: No information conveyed by color alone — all visual distinctions have a non-color equivalent
NFR21: No auto-playing audio or video
NFR22: Each embedded audio player preceded by descriptive context for screen reader users
NFR23: Buttondown newsletter delivered within 2 hours of scheduled send; failure must not affect site availability
NFR24: Plausible script loaded with defer; if blocked, site remains fully functional with no visible error
NFR25: If a platform embed fails to load, post remains fully readable with visual failure indication (never a blank gap)
NFR26: Ko-fi as plain anchor link; zero site dependency on Ko-fi availability
NFR27: Site availability 99.9% (Vercel platform SLA)
NFR28: New content live within 5 minutes of Git push to main
NFR29: Newsletter delivery operates independently of site deployment

### Additional Requirements

- AR1: Project initialized with `npm create astro@latest akirasmusicbox -- --template minimal --typescript strict`; integrations added in sequence: mdx, sitemap, tailwind (@tailwindcss/vite), @astrojs/rss
- AR2: Version pins locked in package.json before writing any collection code: astro ^6.1.10, @tailwindcss/vite ^4.x, @tailwindcss/typography ^0.5.x
- AR3: All security headers in vercel.json (not <meta>): Content-Security-Policy (frame-src exact embed origins), X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, Content-Type for .asc and WKD files
- AR4: GPG key generated (Ed25519 or RSA-4096 minimum); uploaded to keys.openpgp.org only (not SKS); revocation certificate generated and stored offline; architecture doc placeholders filled with fingerprint, creation date, expiry date, revocation cert location
- AR5: public/pubkey.asc + .well-known/security.txt + .well-known/openpgpkey/ WKD directory structure created in public/
- AR6: CSS tokens in src/styles/tokens.css; Tailwind darkMode config set to 'media'; no dark: utility classes permitted anywhere
- AR7: font-display: optional for Space Grotesk; validated with throttled network before first issue publishes
- AR8: RSS autodiscovery <link> in BaseLayout.astro head; pubDate typed as z.coerce.date() in Zod schema; description field required (z.string())
- AR9: All custom Astro component files named in PascalCase; all props typed with Props interface in component frontmatter
- AR10: not-prose class on outermost wrapper of every custom component rendered inside <article class="prose">
- AR11: data-initialized="ComponentName" guard on all interactive component root elements (NOT on document.body)
- AR12: .is-playing (boombox echo class) removed on animationend — never persisted; animation-duration governed by --boombox-echo-duration CSS token
- AR13: <Image> from astro:assets for all post images — never bare <img>; widths, formats, and loading props required
- AR14: Embed dimensions specified as CSS custom properties in tokens.css (--embed-ratio-video, --embed-height-spotify-compact, --embed-height-spotify-expanded, --embed-ratio-apple)
- AR15: Boombox echo mutual exclusion: JS click listener uses querySelectorAll + loop to remove .embed-playing from all siblings before adding to clicked wrapper
- AR16: src/pages/kitchen-sink.astro created early; renders all components in isolation; gated or removed before launch
- AR17: MDX components registered globally in astro.config.mjs under mdx() integration components key; no import statements in .mdx content files
- AR18: Content Collections with Zod schema in src/content.config.ts as single source of truth for all frontmatter taxonomy fields
- AR19: Astro 6 project structure: src/content.config.ts (not src/content/config.ts); src/content/posts/ for MDX files

### UX Design Requirements

UX-DR1: Design token system: all colors as CSS custom properties in src/styles/tokens.css; no hardcoded hex anywhere; two :root blocks (light default, dark inside @media prefers-color-scheme: dark)
UX-DR2: Typography system installed via Fontsource: Space Grotesk (@fontsource/space-grotesk, headings/UI), Source Serif 4 (@fontsource/source-serif-4, body prose at font-weight 450), IBM Plex Mono (@fontsource/ibm-plex-mono, matrix number/code); imported in BaseLayout.astro; Space Grotesk validated at H1 display scale before final commit
UX-DR3: Dark mode token pairs: --color-bg #1C1510, --color-surface #231A13, --color-text #F0E8DC, --color-text-muted #9A8070, --color-border #3D2A1F, --color-teal #3AAFAF, --color-green #5A9060, --color-dark-orange #E06820; warm near-black not cool gray
UX-DR4: Teal token value #256B6B (light) achieves 4.6:1 on cream — all teal uses via var(--color-teal) only; dark orange (#C4520A) verified with APCA at 16px+ text use only
UX-DR5: Boombox echo animation: @keyframes boombox-echo with teal box-shadow pulse (0→12px→0), ~1.5s duration governed by --boombox-echo-duration token, single cycle not looped; .is-playing on wrapper; removed on animationend; all prefers-reduced-motion via global gate not per-component
UX-DR6: PrimaryEmbed component: outer wrapper (left border dark-orange, cream fill), dark inner player bar, all 4 states (loading/loaded/playing/failed), aspect-ratio CLS prevention per embed type, boombox echo on play, platform-linked failure message in site voice; <figure>/<figcaption> semantic; iframe title="[Platform] player: [Track] — [Artist]"; no allow="autoplay"
UX-DR7: ReferenceEmbed component: float-right 240px desktop, full-width inline mobile, REF label, all 4 states identical to PrimaryEmbed, float cleared by next block or explicit clearfix
UX-DR8: HiFiSidebar component: <aside aria-label="Hi-Fi notes"> landmark; sticky right gutter on desktop (top: calc(52px + 2rem)); three annotation types (Production Note, Listener's Gloss, Dissent/Complication); on mobile: relocates to full-width <details>/<summary> block — never display:none; green left border + green-tinted background zone; Source Serif 4 15px; structurally distinct (type scale + container + color combined)
UX-DR9: Note component v1: superscript teal marker (①②③) in prose; right-margin float at -240px on desktop (float: right, width: 220px); <details>/<summary> on mobile; maximum 3 per post; summary:focus-visible with teal ring
UX-DR10: ArtistSupport component: plain link-style (no button affordance); labelled links with prefix (e.g. "Buy on Bandcamp →"); teal underline on hover; no urgency language; positioned after post body before closing ritual
UX-DR11: ClosingRitual component: coda paragraph (italic, body font); matrix number format `akirasmusicbox — {issue-number} — {year}` (IBM Plex Mono, muted); optional listening note; prev/next navigation (two-column grid, issue number + title; "Next issue hasn't arrived yet." if no next post)
UX-DR12: NewsletterSubscribe component: plain HTML <form> POST to Buttondown embed endpoint; single email <input> with explicit <label for>; submit button (dark-orange fill, cream text, Space Grotesk 500); zero JS dependency; no modal, no toast; positioned post-end only, after ClosingRitual; must function with JavaScript disabled
UX-DR13: PostCard component: issue number (IBM Plex Mono, dark-orange), title (Space Grotesk 600), genre/mood tags (small-caps, muted brown), date (mono, muted), 2-line excerpt (body font), hi-fi indicator dot (green) when sidebar present; teal left-border on hover; default cream-dark border at rest
UX-DR14: TaxonomyPage Astro page template: single template with getStaticPaths() generating pages for all 6 taxonomy dimensions (genre, era, instrument, mood, post-type, hi-fi presence); identical layout across all dimensions; empty-state copy "No posts tagged [x] yet." in site voice
UX-DR15: Two-column CSS Grid: grid-template-columns: minmax(0, 700px) 220px, gap: 4rem, max-width ~1200px, centred; DOM order always <article> first, <aside> second; CSS Grid handles visual placement via grid-column
UX-DR16: Responsive: single custom breakpoint 68.75em (em not px, for WCAG 1.4.10 reflow compliance); below: single column, sidebar content relocates (never disappears), notes become <details>, embeds full-width
UX-DR17: Sticky sidebar: position:sticky, top: calc(52px + 2rem), align-self: start; NEVER set overflow:hidden or overflow:auto on .post-layout or any ancestor
UX-DR18: Skip link: <a href="#main-content" class="skip-link"> visually hidden until focused; target <main id="main-content">; transforms from translateY(-100%) to none on :focus
UX-DR19: Focus states: :focus-visible { outline: 2px solid var(--color-teal); outline-offset: 2px } on all interactive elements; never outline:none without visible replacement; touch targets ≥ 44×44px
UX-DR20: prefers-reduced-motion global gate in global.css: *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important } — applied once globally, not per-component
UX-DR21: Home page (index.astro): displays most recent post in full with all components rendered (including hi-fi sidebar if present in frontmatter)
UX-DR22: Archive page (archive.astro): all posts in reverse-chronological order using PostCard components; issue numbers as primary identifiers
UX-DR23: About page: author background, opera credentials, infosec voice, cross-genre methodology; opera-to-crossover credibility addressed proactively; Ko-fi donation link; on-site privacy statement ("No trackers. No cookies. No algorithms. Built from scratch.")
UX-DR24: PGP page (/pgp): full 40-char fingerprint formatted in groups of four; inline armored ASCII block in <pre>; direct download link to /pubkey.asc; link to keys.openpgp.org search by fingerprint; <link rel="pgpkey" href="/pubkey.asc"> in BaseLayout.astro head
UX-DR25: 404 page: custom, in site voice; brief, not clever; links back to home and archive
UX-DR26: Accessibility statement page (/accessibility): WCAG 2.1 AA compliance target; known limitations (third-party iframe interiors outside our control); contact method for reporting barriers; required before launch
UX-DR27: Site nav: sticky top, 52px height, site name left (Space Grotesk 600), nav links right (Archive, About, RSS — Space Grotesk 500, muted at rest, teal on hover); no hamburger unless viewport testing proves otherwise
UX-DR28: Embed hover treatment: border-color transitions from dark-orange to teal over 200ms ease on hover (all embed wrappers); gated behind prefers-reduced-motion global

### FR Coverage Map

FR1: Epic 1 — MDX authoring + frontmatter
FR2: Epic 1 — Taxonomy frontmatter fields in Zod schema
FR3: Epic 2 — PrimaryEmbed + ReferenceEmbed components
FR4: Epic 3 — ArtistSupport component
FR5: Epic 2 — HiFiSidebar component
FR6: Epic 1 — Git push → Vercel auto-deploy
FR7: Epic 3 — Buttondown newsletter queue
FR8: Epic 2 — Full post render with embeds
FR9: Epic 3 — ArtistSupport inline links
FR10: Epic 2 — HiFiSidebar visual + semantic distinction
FR11: Epic 4 — Post navigation + archive links
FR12: Epic 3 — NewsletterSubscribe component
FR13: Epic 4 — About page
FR14: Epic 2 — Embed render + play
FR15: Epic 2 — CLS = 0, aspect-ratio containers
FR16: Epic 2 — `<Image>` with alt text
FR17: Epic 3 — Bandcamp links in ArtistSupport
FR18: Epic 3 — Social profile links in ArtistSupport
FR19: Epic 3 — Merch/Patreon links in ArtistSupport
FR20: Epic 3 — Ko-fi plain anchor link
FR21: Epic 4 — Genre taxonomy pages
FR22: Epic 4 — Era taxonomy pages
FR23: Epic 4 — Instrument taxonomy pages
FR24: Epic 4 — Mood taxonomy pages
FR25: Epic 1 — Semantic HTML + meta tags in BaseLayout
FR26: Epic 4 — Sitemap via @astrojs/sitemap
FR27: Epic 3 — Email subscribe form
FR28: Epic 3 — Buttondown delivery
FR29: Epic 3 — Newsletter links back to post
FR30: Epic 5 — Zero trackers verified
FR31: Epic 5 — On-site privacy statement
FR32: Epic 5 — Plausible setup + SRI
FR33: Epic 5 — CSP validation against all embeds
FR34: Epic 5 — Keyboard navigation audit
FR35: Epic 5 — Alt text audit
FR36: Epic 5 — Sidebar as `<aside>` landmark
FR37: Epic 5 — WCAG 2.1 AA contrast verification
FR38: Epic 4 — Home page (index.astro) template
FR39: Epic 4 — Site-wide nav component
FR40: Epic 4 — Archive page
FR41: Epic 4 — Hi-fi presence taxonomy page

## Epic List

### Epic 1: Author Identity & Site Foundation
The author has a cryptographically-established identity. The site exists on Vercel with its design system, security headers, and the ability to render a complete post from MDX source via Git push. A reader visiting any post URL gets fully-styled prose content.
**FRs covered:** FR1, FR2, FR6, FR25

**Stories (pre-defined):**

#### E1-S0: GPG Key & Author Identity
Generate Ed25519 GPG key; upload to keys.openpgp.org; generate and store revocation certificate offline; fill architecture.md placeholders (fingerprint, creation date, expiry date, revocation cert location); create public/pubkey.asc; create .well-known/security.txt; create .well-known/openpgpkey/ WKD structure.
*Must be first story. Satisfies AR4, AR5, NFR16, NFR17.*

#### E1-S1: CI/CD Pipeline (GitHub Actions)
Create `.github/workflows/ci.yml` that runs on every push and pull request to main: `npm ci`, `astro check`, `tsc --noEmit`, `npm run build`. Fail the workflow on any error. No deployment — Vercel handles that independently via its GitHub integration.
*Satisfies NFR15 (no broken builds reach main), AR1 (project initialized correctly).*

#### E1-S2: Astro Project Initialization
Run `npm create astro@latest` with minimal + TypeScript strict template at the repo root. Add all required integrations in sequence: `@astrojs/mdx`, `@astrojs/sitemap`, Tailwind v4 via `@tailwindcss/vite`, `@astrojs/rss`. Lock version pins in package.json before writing any collection code: `astro ^6.1.10`, `@tailwindcss/vite ^4.x`, `@tailwindcss/typography ^0.5.x`. Verify `npm run build` produces a dist/ output and CI goes green.
*Satisfies AR1, AR2, NFR1 (static generation foundation).*

#### E1-S3: Security Headers & Content Security Policy
Expand the `vercel.json` stub from E1-S0 into a complete security headers configuration: strict Content-Security-Policy with exact `frame-src` origins for Spotify, YouTube, Apple Music; `script-src 'self'` with Plausible placeholder; `X-Content-Type-Options: nosniff`; `X-Frame-Options: SAMEORIGIN`; `Referrer-Policy: strict-origin-when-cross-origin`; `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`. All headers delivered via `vercel.json`, not `<meta>` tags.
*Satisfies NFR5–NFR13, AR3.*

#### E1-S4: Design System & CSS Tokens
Create `src/styles/tokens.css` with all color, animation, and embed dimension tokens as CSS custom properties (light and dark `:root` blocks). Create `src/styles/global.css` with `@plugin "@tailwindcss/typography"`, global `prefers-reduced-motion` gate, and `@font-face` declarations with `font-display: optional` for Space Grotesk. Install Fontsource packages: `@fontsource/space-grotesk`, `@fontsource/source-serif-4`, `@fontsource/ibm-plex-mono`. Verify dark mode tokens apply via `@media (prefers-color-scheme: dark)`.
*Satisfies UX-DR1–UX-DR5, UX-DR20, AR6, AR7.*

#### E1-S5: Content Schema & BaseLayout
Create `src/content.config.ts` with full Zod schema for all frontmatter fields: `title`, `pubDate` (`z.coerce.date()`), `description` (`z.string()` — required), `genre`, `era`, `instrument`, `mood`, `postType`, `hifiSidebar` (boolean). Create `src/layouts/BaseLayout.astro` with: font imports, all SEO `<meta>` tags, Open Graph, RSS autodiscovery `<link>`, `<link rel="pgpkey">`, Plausible script stub with SRI placeholder, skip link, and `<main id="main-content">`. Create one sample MDX post in `src/content/posts/` to verify schema validation on build.
*Satisfies FR1, FR2, FR6, FR25, AR8, AR9, AR18, AR19, UX-DR18, UX-DR24.*

#### E1-S6: PostLayout, Nav & Full Post Render
Create `src/layouts/PostLayout.astro` with two-column CSS Grid (`minmax(0, 700px) 220px`), sticky sidebar slot, site nav (52px, sticky top, Space Grotesk). Create `src/pages/index.astro` (home — latest post in full), `src/pages/posts/[slug].astro` (individual post), and `src/pages/archive.astro` (all posts, reverse-chronological using PostCard placeholder). Register all MDX components globally in `astro.config.mjs`. Verify a real post URL serves fully-styled prose content.
*Satisfies FR6, FR8, FR25, FR38, FR39, FR40, UX-DR15–UX-DR17, UX-DR21–UX-DR23, UX-DR27.*

**Epic 1 close gate:** Run `/security-review` before starting Epic 2.

### Epic 2: The Complete Post Reading Experience
Readers get the full intended experience — embedded audio that plays inline without layout shift (boombox echo), the hi-fi sidebar as a distinct editorial thread, marginal notes, the closing ritual with matrix number, and properly handled images.
**FRs covered:** FR3, FR5, FR8, FR10, FR14, FR15, FR16, FR38

### Epic 3: Artist Support, Newsletter & Reader Retention
Posts achieve their purpose — readers can support artists directly (Bandcamp, merch, social, Patreon), subscribe to the newsletter via plain HTML form, and make voluntary donations via Ko-fi. Buttondown integration is live and delivering.
**FRs covered:** FR4, FR7, FR9, FR12, FR17, FR18, FR19, FR20, FR27, FR28, FR29

### Epic 4: Discovery, Archive & Navigation
Readers can navigate the full publication — browse and filter the archive by genre, era, instrument, mood, and hi-fi presence; access the About page, PGP key page, and RSS feed; navigate between posts with issue numbers.
**FRs covered:** FR11, FR13, FR21, FR22, FR23, FR24, FR26, FR38, FR39, FR40, FR41

### Epic 5: Trust Posture, Accessibility & Pre-Launch
Every reader gets equal access regardless of how they navigate (keyboard, screen reader, dark mode). Technically-minded readers can verify the site's privacy claims. The site passes all security and accessibility gates.
**FRs covered:** FR30, FR31, FR32, FR33, FR34, FR35, FR36, FR37

**Pre-launch verification action items (carried forward):**
- **GPG/security domain binding** (from Story 1.0 review 2026-05-09, Decision #2) — confirm `akirasmusicbox.com` is bound on Vercel and the following endpoints return 200 with the expected `Content-Type` / `Cache-Control` headers:
  - `https://akirasmusicbox.com/pubkey.asc` → `application/pgp-keys`
  - `https://akirasmusicbox.com/.well-known/security.txt` → `text/plain` (or signed variant)
  - `https://akirasmusicbox.com/.well-known/openpgpkey/hu/q736ttod8166r8cwurunzdpqaira3pdr` → `application/octet-stream`
  - `https://akirasmusicbox.com/.well-known/openpgpkey/policy` → `text/plain`
