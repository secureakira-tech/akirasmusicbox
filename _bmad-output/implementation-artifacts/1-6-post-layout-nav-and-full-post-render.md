# Story 1.6: PostLayout, Nav & Full Post Render

Status: done

## Story

As a reader,
I want to navigate to any post URL and see fully-styled prose content with a consistent site nav,
so that the site feels like a real publication from the moment it goes live.

## Acceptance Criteria

1. `src/components/SiteNav.astro` exists: sticky top, exactly 52px height, site name "akirasmusicbox" left (Space Grotesk 600), nav links Archive / About / RSS right (Space Grotesk 500, muted at rest, teal on hover); implemented with CSS custom properties only, no hardcoded hex.
2. `src/layouts/PostLayout.astro` exists, uses BaseLayout, includes SiteNav in the `nav` slot, and exposes named props matching the posts Zod schema fields.
3. PostLayout renders a two-column CSS Grid: `grid-template-columns: minmax(0, 700px) 220px; gap: 4rem;` — active at `min-width: 68.75em`. Below the breakpoint, single column.
4. PostLayout grid column source order is always `<article>` first, `<aside>` second — CSS Grid handles visual placement, not source reordering.
5. PostLayout's sidebar `<aside>` uses `position: sticky; top: calc(52px + 2rem); align-self: start;`. No ancestor of `.post-layout` has `overflow: hidden` or `overflow: auto`.
6. `src/pages/posts/[slug].astro` exists, uses `getStaticPaths()` + `getCollection('posts')` + `render(post)` from `astro:content`, and renders each post with PostLayout.
7. Navigating to `/posts/2026-05-01-schema-test` (the test post from Story 1.5) renders fully-styled prose: Source Serif 4 body text at 20px / 1.7 line-height, Space Grotesk headings, correct colors via CSS custom properties.
8. `src/pages/index.astro` displays the most recent post in full (sorted by `pubDate` descending, first entry), using PostLayout.
9. `src/pages/archive.astro` lists all posts in reverse-chronological order using `PostCard` components, with the site nav visible.
10. `src/components/PostCard.astro` exists as a functional placeholder: renders post title (link to `/posts/[id]`), pubDate (IBM Plex Mono), description (2-line clamp), genre, and a green indicator dot when `hifiSidebar` is true.
11. Stub components exist for all MDX-registerable components: `PrimaryEmbed.astro`, `ReferenceEmbed.astro`, `Note.astro`, `ArtistSupport.astro`, `ClosingRitual.astro`, `NewsletterSubscribe.astro`. Each stub has `not-prose` on its outermost element (architecture mandate for all in-prose components).
12. `HiFiSidebar.astro` stub exists in `src/components/`. It is NOT registered as an MDX component — it is used by PostLayout in the sidebar `<aside>`.
13. `astro.config.mjs` registers the six MDX components (PrimaryEmbed, ReferenceEmbed, Note, ArtistSupport, ClosingRitual, NewsletterSubscribe) under `mdx({ components: {...} })`. The stub files must exist before this update — otherwise the build will fail.
14. `src/styles/global.css` contains prose typography overrides: `.prose` body font is Source Serif 4 (20px, 1.7 line-height), headings use Space Grotesk, code uses IBM Plex Mono, links use `var(--color-teal)`, and text/heading colors use CSS custom properties.
15. No hardcoded hex values in any new file. No `dark:` Tailwind utility classes.
16. `npm run build` completes with zero errors and zero warnings.
17. `npx astro check` returns 0 errors, 0 warnings, 0 hints.
18. `npm run dev` — navigating to `/posts/2026-05-01-schema-test` in a browser shows prose with Source Serif 4 body text. Dark mode emulation in DevTools changes colors correctly via CSS custom properties.

## Tasks / Subtasks

### Task 1 — Add prose typography CSS to `global.css` (AC: 14)
- [ ] Open `src/styles/global.css`.
- [ ] After the reduced-motion media query, add the prose typography overrides from Dev Notes "Prose CSS overrides" section below.
- [ ] Confirm `.prose` sets `font-family: 'Source Serif 4', serif`, `font-size: 1.25rem` (20px), `line-height: 1.7`.
- [ ] Confirm `.prose h1, h2, h3, h4` use `font-family: 'Space Grotesk', sans-serif`.
- [ ] Confirm `.prose code, .prose pre` use `font-family: 'IBM Plex Mono', monospace`.
- [ ] Confirm link and text colors use `var(--color-*)` tokens only.

### Task 2 — Create `src/components/SiteNav.astro` (AC: 1)
- [ ] Create `src/components/` directory if it does not exist.
- [ ] Create `src/components/SiteNav.astro` from Dev Notes "SiteNav.astro" section below.
- [ ] Confirm height is exactly 52px.
- [ ] Confirm `position: sticky; top: 0; z-index: 40`.
- [ ] Confirm site name uses Space Grotesk 600; nav links use Space Grotesk 500.
- [ ] Confirm nav link hover color is `var(--color-teal)`.
- [ ] Confirm no hardcoded hex values.

### Task 3 — Create stub components (AC: 11, 12)
- [ ] Create each stub file from the "Stub components" section in Dev Notes below.
- [ ] Stubs: `PrimaryEmbed.astro`, `ReferenceEmbed.astro`, `Note.astro`, `ArtistSupport.astro`, `ClosingRitual.astro`, `NewsletterSubscribe.astro`, `HiFiSidebar.astro`.
- [ ] Confirm each in-prose stub (PrimaryEmbed, ReferenceEmbed, Note, ArtistSupport, ClosingRitual, NewsletterSubscribe) has `not-prose` on its outermost element.
- [ ] HiFiSidebar does NOT need `not-prose` (it renders outside the `<article>` prose column).

### Task 4 — Create `src/components/PostCard.astro` (AC: 10)
- [ ] Create `src/components/PostCard.astro` from Dev Notes "PostCard.astro" section below.
- [ ] Confirm it accepts `id`, `title`, `pubDate`, `description`, `genre?`, `mood?`, `hifiSidebar?` props.
- [ ] Confirm the post link uses `/posts/${id}`.
- [ ] Confirm `hifiSidebar` shows a green dot (`var(--color-green)`) when true.
- [ ] Confirm no hardcoded hex values.

### Task 5 — Update `astro.config.mjs` with MDX component registration (AC: 13)
- [ ] Open `astro.config.mjs`.
- [ ] Replace `mdx()` with `mdx({ components: {...} })` as shown in Dev Notes "Final astro.config.mjs" below.
- [ ] Confirm all six components are registered: PrimaryEmbed, ReferenceEmbed, Note, ArtistSupport, ClosingRitual, NewsletterSubscribe.
- [ ] **CRITICAL**: stub files (Task 3) must be created BEFORE this step — if stubs don't exist, build fails.

### Task 6 — Create `src/layouts/PostLayout.astro` (AC: 2–5)
- [ ] Create `src/layouts/PostLayout.astro` from Dev Notes "PostLayout.astro" section below.
- [ ] Confirm it imports and uses BaseLayout, passing `title` and `description`.
- [ ] Confirm SiteNav is rendered in the `nav` slot.
- [ ] Confirm Props interface includes all post frontmatter fields.
- [ ] Confirm grid CSS: `grid-template-columns: minmax(0, 700px) 220px; gap: 4rem` at `min-width: 68.75em`.
- [ ] Confirm `<article>` appears before `<aside>` in DOM source order (always).
- [ ] Confirm sidebar `position: sticky; top: calc(52px + 2rem); align-self: start`.
- [ ] Confirm `.post-layout` and all its ancestors have NO `overflow: hidden` or `overflow: auto`.

### Task 7 — Create `src/pages/posts/[slug].astro` (AC: 6, 7)
- [ ] Create `src/pages/posts/` directory.
- [ ] Create `src/pages/posts/[slug].astro` from Dev Notes "[slug].astro" section below.
- [ ] Confirm `getStaticPaths()` uses `getCollection('posts')` and maps each post's `id` to the `slug` param.
- [ ] Confirm `render(post)` is imported from `astro:content` (NOT `entry.render()` — that API is deprecated in Astro v5+).
- [ ] Confirm PostLayout receives all frontmatter props.
- [ ] Confirm `<Content />` is rendered inside `class="prose"` wrapper.

### Task 8 — Update `src/pages/index.astro` (AC: 8)
- [ ] Open `src/pages/index.astro`.
- [ ] Replace the Story 1.5 placeholder with the latest-post home page from Dev Notes "index.astro" section below.
- [ ] Confirm posts are sorted by `pubDate` descending (newest first).
- [ ] Confirm `render(latestPost)` is used (not `latestPost.render()`).
- [ ] Confirm PostLayout receives frontmatter from the latest post.

### Task 9 — Create `src/pages/archive.astro` (AC: 9)
- [ ] Create `src/pages/archive.astro` from Dev Notes "archive.astro" section below.
- [ ] Confirm posts are sorted reverse-chronological.
- [ ] Confirm SiteNav appears in the nav slot.
- [ ] Confirm each PostCard receives the correct props.
- [ ] Confirm archive has a page `<title>` of "Archive — Akira's Music Box".

### Task 10 — Validate build and verify in browser (AC: 15–18)
- [ ] Run `npm run build` — zero errors, zero warnings.
- [ ] Run `npx astro check` — 0 errors, 0 warnings, 0 hints.
- [ ] Grep for hardcoded hex outside tokens.css: `grep -rn '#[0-9A-Fa-f]\{3,6\}' src/ --include='*.astro' --include='*.ts' --include='*.css' | grep -v 'tokens.css'` — zero matches.
- [ ] Grep for `dark:` utility classes: `grep -rn 'dark:' src/` — zero matches.
- [ ] Run `npm run dev`, open `http://localhost:4321/posts/2026-05-01-schema-test` — confirm Source Serif 4 body text, Space Grotesk nav, correct colors.
- [ ] Open `http://localhost:4321/` — confirms home page shows latest post.
- [ ] Open `http://localhost:4321/archive` — confirms archive list with PostCard entries.
- [ ] Toggle dark mode in DevTools — confirm color tokens switch correctly.

### Task 11 — Commit and push (AC: 1–18)
- [ ] Stage all new and modified files.
- [ ] Run `git status` — confirm no unintended files staged.
- [ ] Commit (GPG signing active — do not bypass).
- [ ] Push: `git push`.
- [ ] Verify Vercel preview deploy succeeds.

## Dev Notes

### Architecture constraints (must not violate)

- **`render(post)` not `post.render()`** — Astro v5+ deprecated `entry.render()`. Import `render` from `astro:content`. Using the old API will generate deprecation warnings or errors in Astro v6.
- **`post.id` not `post.slug`** — Astro v5+ replaced `entry.slug` with `entry.id` for content collections. The URL will be `/posts/2026-05-01-schema-test` (matching the MDX filename minus extension).
- **`not-prose` on all in-prose components** — ANY component rendered inside `<article class="prose">` must have `class="not-prose"` on its outermost element. Tailwind Typography will otherwise override the component's styles. This applies to: PrimaryEmbed, ReferenceEmbed, Note, ArtistSupport, ClosingRitual, NewsletterSubscribe.
- **HiFiSidebar is NOT an MDX component** — it renders in the PostLayout sidebar column outside the prose `<article>`. Do NOT add it to `mdx({ components: {...} })`. It is a layout component, not an in-prose component.
- **No `overflow` on `.post-layout` ancestors** — `position: sticky` on `.hifi-sidebar` silently breaks if any ancestor has `overflow: hidden` or `overflow: auto`. This is the most common silent layout bug.
- **Breakpoint in `em` not `px`** — `68.75em` (≈1100px). Using `px` would break WCAG 1.4.10 Reflow compliance at 400% zoom.
- **Source order: `<article>` always before `<aside>`** — CSS Grid handles visual placement. Never reorder in DOM.
- **CSS custom properties only for colors** — no hardcoded hex, no Tailwind palette classes, no `dark:` variants.
- **MDX component stubs must exist before updating astro.config.mjs** — if you add a file path to `mdx({ components })` and the file doesn't exist, the build fails immediately.

### Prose CSS overrides (add to `global.css`)

Add this block at the end of `src/styles/global.css`, after the `@media (prefers-reduced-motion: reduce)` block:

```css
/* Prose typography — overrides Tailwind Typography defaults with our token system */
.prose {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 1.25rem;    /* 20px */
  line-height: 1.7;
  color: var(--color-text);
  max-width: var(--measure); /* 65ch */
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  color: var(--color-text);
}

.prose h1 { font-weight: 600; line-height: 1.2; }
.prose h2 { font-weight: 500; line-height: 1.2; letter-spacing: -0.01em; }
.prose h3,
.prose h4 { font-weight: 500; line-height: 1.3; }

.prose a {
  color: var(--color-teal);
  text-underline-offset: 3px;
}

.prose a:hover {
  text-decoration: none;
}

.prose code,
.prose pre,
.prose kbd {
  font-family: 'IBM Plex Mono', 'Courier New', monospace;
}

.prose strong {
  color: var(--color-text);
}

.prose blockquote {
  border-left-color: var(--color-border);
  color: var(--color-text-muted);
}

.prose hr {
  border-color: var(--color-border);
}
```

### `SiteNav.astro`

```astro
---
const navLinks = [
  { href: '/archive', label: 'Archive' },
  { href: '/about', label: 'About' },
  { href: '/rss.xml', label: 'RSS' },
] as const;
---

<header class="site-nav">
  <div class="nav-inner">
    <a href="/" class="site-name">akirasmusicbox</a>
    <nav aria-label="Site navigation">
      <ul class="nav-links">
        {navLinks.map(({ href, label }) => (
          <li>
            <a href={href} class="nav-link">{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  </div>
</header>

<style>
  .site-nav {
    position: sticky;
    top: 0;
    z-index: 40;
    height: 52px;
    background-color: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
  }

  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .site-name {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-weight: 600;
    font-size: 1rem;
    color: var(--color-text);
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-link {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-weight: 500;
    font-size: 0.9rem;
    color: var(--color-text-muted);
    text-decoration: none;
  }

  .nav-link:hover {
    color: var(--color-teal);
  }
</style>
```

### Stub components

Create these 7 stubs. All six in-prose stubs require `not-prose` on the outermost element.

**`src/components/PrimaryEmbed.astro`:**
```astro
---
interface Props {
  [key: string]: unknown;
}
---
<div class="not-prose embed-wrapper" style="border: 1px solid var(--color-dark-orange); border-radius: 4px; padding: 1.5rem; color: var(--color-text-muted); font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; text-align: center;">
  [PrimaryEmbed — Epic 2]
</div>
```

**`src/components/ReferenceEmbed.astro`:**
```astro
---
interface Props {
  [key: string]: unknown;
}
---
<div class="not-prose embed-wrapper" style="border: 1px solid var(--color-border); border-radius: 4px; padding: 1.5rem; color: var(--color-text-muted); font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; text-align: center;">
  [ReferenceEmbed — Epic 2]
</div>
```

**`src/components/Note.astro`:**
```astro
---
interface Props {
  [key: string]: unknown;
}
---
<div class="not-prose" style="font-family: 'Source Serif 4', serif; font-size: 0.9rem; color: var(--color-text-muted); border-left: 2px solid var(--color-border); padding-left: 0.75rem;">
  <slot />
</div>
```

**`src/components/ArtistSupport.astro`:**
```astro
---
interface Props {
  [key: string]: unknown;
}
---
<div class="not-prose" style="border-top: 1px solid var(--color-border); padding-top: 1.5rem; color: var(--color-text-muted); font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem;">
  [ArtistSupport — Epic 3]
</div>
```

**`src/components/ClosingRitual.astro`:**
```astro
---
interface Props {
  [key: string]: unknown;
}
---
<div class="not-prose" style="border-top: 1px solid var(--color-border); padding-top: 1.5rem; color: var(--color-text-muted); font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; text-align: right;">
  [ClosingRitual — Epic 2]
</div>
```

**`src/components/NewsletterSubscribe.astro`:**
```astro
---
interface Props {
  [key: string]: unknown;
}
---
<div class="not-prose" style="background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: 4px; padding: 1.5rem; color: var(--color-text-muted); font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; text-align: center;">
  [NewsletterSubscribe — Epic 3]
</div>
```

**`src/components/HiFiSidebar.astro`** (NOT in MDX components — rendered in PostLayout sidebar):
```astro
---
interface Props {
  class?: string;
}
const { class: className } = Astro.props;
---
<aside
  class:list={['hifi-sidebar-content', className]}
  aria-label="Hi-Fi notes"
  style="border-left: 3px solid var(--color-green); padding-left: 1rem;"
>
  <p style="font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-green); margin: 0 0 1rem;">
    Hi-Fi Thread
  </p>
  <slot />
</aside>
```

### `PostCard.astro`

```astro
---
interface Props {
  id: string;
  title: string;
  pubDate: Date;
  description: string;
  genre?: string;
  mood?: string;
  hifiSidebar?: boolean;
}

const { id, title, pubDate, description, genre, mood, hifiSidebar = false } = Astro.props;

const formattedDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(pubDate);
---

<article class="post-card">
  <a href={`/posts/${id}`} class="post-card-link">
    <div class="post-card-meta">
      {hifiSidebar && (
        <span class="hifi-dot" title="Hi-Fi annotated" aria-label="Hi-Fi annotated"></span>
      )}
      <time datetime={pubDate.toISOString()} class="post-date">{formattedDate}</time>
      {genre && <span class="post-genre">{genre}</span>}
    </div>
    <h2 class="post-title">{title}</h2>
    <p class="post-excerpt">{description}</p>
  </a>
</article>

<style>
  .post-card {
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .post-card-link {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  .post-card-link:hover .post-title {
    color: var(--color-teal);
  }

  .post-card-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .hifi-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--color-green);
    flex-shrink: 0;
    display: inline-block;
  }

  .post-date {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.8rem;
    color: var(--color-text-muted);
  }

  .post-genre {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-muted);
  }

  .post-title {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-weight: 600;
    font-size: 1.25rem;
    margin: 0 0 0.5rem;
    color: var(--color-text);
    transition: color 0.15s ease;
  }

  .post-excerpt {
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 1rem;
    color: var(--color-text-muted);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
```

### Final `astro.config.mjs`

```js
// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://akirasmusicbox.vercel.app',
  integrations: [
    mdx({
      components: {
        PrimaryEmbed: './src/components/PrimaryEmbed.astro',
        ReferenceEmbed: './src/components/ReferenceEmbed.astro',
        Note: './src/components/Note.astro',
        ArtistSupport: './src/components/ArtistSupport.astro',
        ClosingRitual: './src/components/ClosingRitual.astro',
        NewsletterSubscribe: './src/components/NewsletterSubscribe.astro',
      },
    }),
    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
```

### `PostLayout.astro`

```astro
---
import BaseLayout from './BaseLayout.astro';
import SiteNav from '../components/SiteNav.astro';

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  pubDate?: Date;
  genre?: string;
  era?: string;
  instrument?: string;
  mood?: string;
  postType?: string;
  hifiSidebar?: boolean;
}

const { title, description, ogImage, hifiSidebar = false } = Astro.props;
---

<BaseLayout {title} {description} {ogImage}>
  <SiteNav slot="nav" />

  <div class:list={['post-layout', { 'has-sidebar': hifiSidebar }]}>
    <article class="prose-column">
      <slot />
    </article>

    {hifiSidebar && (
      <aside class="sidebar-column" aria-label="Hi-Fi notes">
        <slot name="sidebar" />
      </aside>
    )}
  </div>
</BaseLayout>

<style>
  .post-layout {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  /* Two-column grid activates only when there is sidebar content */
  @media (min-width: 68.75em) {
    .post-layout.has-sidebar {
      display: grid;
      grid-template-columns: minmax(0, 700px) 220px;
      gap: 4rem;
    }
  }

  .prose-column {
    /* No overflow — would break sticky sidebar */
    min-width: 0;
  }

  .sidebar-column {
    position: sticky;
    top: calc(52px + 2rem);
    align-self: start;
    /* Never set overflow here or on .post-layout */
  }
</style>
```

### `posts/[slug].astro`

```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

type Props = {
  post: Awaited<ReturnType<typeof getCollection<'posts'>>>[number];
};

const { post } = Astro.props;
const { Content } = await render(post);
const { title, description, pubDate, genre, era, instrument, mood, postType, hifiSidebar } = post.data;
---

<PostLayout
  {title}
  {description}
  {pubDate}
  {genre}
  {era}
  {instrument}
  {mood}
  {postType}
  {hifiSidebar}
>
  <div class="prose max-w-none">
    <Content />
  </div>
</PostLayout>
```

**Note on `max-w-none`:** The `max-w-none` Tailwind utility removes the default `max-width` from the Tailwind Typography `prose` class, allowing `PostLayout` to control the column width via the grid. The `--measure: 65ch` token in tokens.css is set on `.prose` in global.css (Task 1) so the prose column naturally constrains itself within the grid column.

Wait — actually `max-w-none` would remove our `max-width: var(--measure)` set in `.prose`. Consider this: the prose column is already constrained to `minmax(0, 700px)` by the grid. When there's no sidebar, the prose column can expand to fill the container. Using `max-w-none` in the `<div class="prose max-w-none">` removes the 65ch limit, letting the grid control width. This is correct because:
- With sidebar: grid constrains to 700px max
- Without sidebar: prose fills the container (up to 1200px max-width of .post-layout), which may be wider than 65ch

To fix: apply `max-width: var(--measure)` on the article itself via PostLayout styling, or use `class="prose"` without `max-w-none` and let the 65ch token apply. Since the grid's `minmax(0, 700px)` already limits width, using just `class="prose"` (with global.css's `max-width: 65ch`) is correct — the prose will respect 65ch within the 700px column.

**Final correct approach:** Use `class="prose"` without `max-w-none`. The 65ch from global.css applies, and the grid column is 700px (which is larger than 65ch at 20px font size ≈ 900px equivalent, but `ch` units are based on the `0` character width and Source Serif 4's `0` is narrower, so 65ch ≈ about 680–700px). This will work correctly.

**Updated `[slug].astro` fragment:**
```astro
<div class="prose">
  <Content />
</div>
```

### `index.astro`

```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../layouts/PostLayout.astro';

const posts = await getCollection('posts');
posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
const latestPost = posts[0];

if (!latestPost) {
  throw new Error('No posts found. Add at least one MDX file to src/content/posts/.');
}

const { Content } = await render(latestPost);
const { title, description, pubDate, genre, era, instrument, mood, postType, hifiSidebar } = latestPost.data;
---

<PostLayout
  {title}
  {description}
  {pubDate}
  {genre}
  {era}
  {instrument}
  {mood}
  {postType}
  {hifiSidebar}
>
  <div class="prose">
    <Content />
  </div>
</PostLayout>
```

### `archive.astro`

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import SiteNav from '../components/SiteNav.astro';
import PostCard from '../components/PostCard.astro';

const posts = await getCollection('posts');
posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
---

<BaseLayout title="Archive — Akira's Music Box" description="All posts from Akira's Music Box, newest first.">
  <SiteNav slot="nav" />

  <div class="archive-container">
    <h1 class="archive-title">Archive</h1>
    <ul class="post-list">
      {posts.map((post) => (
        <li>
          <PostCard
            id={post.id}
            title={post.data.title}
            pubDate={post.data.pubDate}
            description={post.data.description}
            genre={post.data.genre}
            mood={post.data.mood}
            hifiSidebar={post.data.hifiSidebar}
          />
        </li>
      ))}
    </ul>
  </div>
</BaseLayout>

<style>
  .archive-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  .archive-title {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-weight: 600;
    font-size: 2rem;
    color: var(--color-text);
    margin: 0 0 2rem;
  }

  .post-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
```

### Key risks and their mitigations

| Risk | Mitigation |
|------|-----------|
| `entry.render()` vs `render(entry)` | Story explicitly requires `import { render } from 'astro:content'` — confirm in Task 7 subtask |
| `post.slug` vs `post.id` | Story explicitly uses `post.id` — confirm in Task 7 subtask; affects URL structure |
| MDX stubs not created before config update | Tasks are ordered: Task 3 (stubs) → Task 5 (config). Do not reorder. |
| `overflow` on `.post-layout` breaking sticky | Task 6 subtask explicitly calls this out; grep for overflow in PostLayout.astro |
| Tailwind `max-w-none` removing prose width control | Dev Notes explicitly addresses this — use `class="prose"` without `max-w-none` |
| `dark:` utility class accidentally added to PostCard or SiteNav | Task 10 grep check catches this |
| Grid breakpoint in `px` not `em` | Task 6 subtask explicitly calls out `68.75em` requirement |
| Hardcoded hex in stub placeholder text styles | Inline styles in stubs must use `var(--color-*)` — grep check in Task 10 |

### Story 1.5 learnings applied

- `z` must be imported from `zod` directly, not `astro:content` (Astro v6 deprecation) — not directly relevant to Story 1.6 but note the pattern.
- `astro check` with 0 hints/warnings/errors is the quality bar — the prose CSS overrides should not introduce type errors.
- Fontsource has static weights only (no variable font) — the prose CSS uses font-weight 400, not 450.

### References

- PostLayout grid spec: [Source: architecture.md#PostLayout-sticky-sidebar-contract]
- Breakpoint `68.75em` spec: [Source: architecture.md#Responsive-breakpoint-contract]
- Sidebar mobile behavior: [Source: architecture.md#Layout-Mobile-Patterns]
- `not-prose` rule: [Source: architecture.md#not-prose-rule]
- MDX component registration: [Source: architecture.md#MDX-Content-Patterns]
- Nav spec: [Source: UX design file, Navigation Patterns section — 52px, Space Grotesk 600 name, 500 links]
- PostCard anatomy: [Source: UX design file, Component Strategy — PostCard section]
- HiFiSidebar anatomy: [Source: UX design file, Component Strategy — HiFiSidebar section]
- `render()` API: Astro v5+ content collections documentation

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (create-story)

### Debug Log References

### Completion Notes List

### File List

## Review Findings

_Code review 2026-05-31 — Blind Hunter + Edge Case Hunter + Acceptance Auditor._

### Decision Needed — RESOLVED

- [x] [Review][Decision→Patch] AC13 — MDX components were not registered. **Spec defect discovered:** `@astrojs/mdx` v5 has NO `components` config option (`mdx({ components })` is invalid — `astro check` fails with ts(2353), and `architecture.md#MDX-Content-Patterns` is wrong about this). Astro only applies components via `<Content components={...} />`. **Resolved (akira's call: follow spec intent of a single registration point):** created `src/components/mdxComponents.ts` as the DRY source of truth, imported into `index.astro` and `[slug].astro`. AC13 is technically unmeetable as written and should be amended; the architecture doc needs correcting. (sources: auditor+blind)
- [x] [Review][Decision→Patch+Defer] `hifiSidebar: true` empty-aside / broken grid. **Resolved (akira's call: defer wiring, guard the gutter):** PostLayout now drives the two-column layout off `Astro.slots.has('sidebar')` instead of the `hifiSidebar` flag, so no empty 220px gutter is reserved when no sidebar content is passed. Full `HiFiSidebar` wiring deferred to the Hi-Fi epic (logged in `deferred-work.md`). [src/layouts/PostLayout.astro] (sources: edge+blind)
- [x] [Review][Decision→Patch] PostLayout dead metadata plumbing. **Resolved (akira's call: remove):** stripped unused `pubDate/genre/era/instrument/mood/postType` props from `PostLayout` `Props` and from the `<PostLayout>` calls in both pages. [src/layouts/PostLayout.astro, src/pages/index.astro, src/pages/posts/[slug].astro] (sources: blind+edge)

### Patch — APPLIED

- [x] [Review][Patch] Date off-by-one fixed — added `timeZone: 'UTC'` to `Intl.DateTimeFormat` [src/components/PostCard.astro:14]
- [x] [Review][Patch] SiteNav `:focus-visible` indicator added (teal outline) for keyboard a11y / WCAG 2.4.7 [src/components/SiteNav.astro:style]
- [x] [Review][Patch] `role="img"` added to the decorative `.hifi-dot` span [src/components/PostCard.astro:markup]
- [x] [Review][Patch] Removed unused `mood` prop from PostCard `Props` and from the `archive.astro` call [src/components/PostCard.astro, src/pages/archive.astro]

_Post-patch verification: `npx astro check` → 0 errors / 0 warnings / 0 hints (19 files); `npm run build` → clean, 3 routes. Note: MDX component registration compiles correctly but is not exercised by the current test post (it uses none of the six components)._

### Deferred

- [x] [Review][Defer] Subdirectory posts break routing — glob `**/*.mdx` yields a multi-segment `post.id` that the single `[slug]` route and PostCard href cannot serve; latent (all current posts are flat) [src/pages/posts/[slug].astro:11]
- [x] [Review][Defer] `/` and `/posts/<latest-id>` render identical content with no `<link rel="canonical">` — duplicate-content SEO [src/pages/index.astro]
- [x] [Review][Defer] Zero-posts handling is inconsistent — `index.astro` hard-throws while `archive.astro`/`[slug].astro` are silent [src/pages/index.astro:13]
