# Deferred Work

Items deferred from code reviews and other workflows. Each entry should be picked up in a future story or operational task.

---

## Deferred from: code review of 1-6-post-layout-nav-and-full-post-render (2026-05-31)

- **Subdirectory posts break routing** — the glob `**/*.mdx` loader yields a multi-segment `post.id` (e.g. `series-a/part-1`) that the single dynamic segment `[slug].astro` route and `PostCard` href (`/posts/${id}`) cannot serve. Latent today (all posts are flat at the collection root). Fix when nested posts are introduced: switch to `[...slug].astro` or constrain the glob to a flat `*.mdx` pattern. [src/pages/posts/[slug].astro:11]
- **Home/post duplicate content** — `/` and `/posts/<latest-id>` render identical full-post content with no `<link rel="canonical">`. Causes duplicate-content/canonical ambiguity for SEO. Add canonical handling (or differentiate the home page) in a later SEO/discovery story. [src/pages/index.astro]
- **Inconsistent zero-posts handling** — `index.astro` hard-throws when the collection is empty, while `archive.astro` and `[slug].astro` render/emit nothing silently. Decide on a coherent empty-state policy across all three consumers. [src/pages/index.astro:13]
- **Correct the MDX-registration spec/docs (AC13 defect)** — `architecture.md#MDX-Content-Patterns` and Story 1.6 AC13/Dev Notes prescribe `mdx({ components: {...} })` in `astro.config.mjs`, but `@astrojs/mdx` v5 has no such option (fails `astro check` with ts(2353)). The correct pattern is `<Content components={...} />`, now centralized in `src/components/mdxComponents.ts`. Update the architecture doc and the epics/story AC so future stories don't reintroduce the invalid config. [_bmad-output/planning-artifacts/architecture.md]

---

## Deferred from: code review of 1-0-gpg-key-and-author-identity (2026-05-09)

- **No `direct` WKD variant published** — requires DNS subdomain `openpgpkey.akirasmusicbox.com`; advanced method sufficient for now. Revisit when DNS is configurable.
- **WKD policy-file rationale not documented** — note in architecture.md that the empty `public/.well-known/openpgpkey/policy` is intentional, to prevent a future contributor from "cleaning up" the empty file and silently breaking WKD discovery. Bundle with a future architecture sweep.
- **WKD `?l=` query handling unverified on Vercel** — verify Vercel's static handler ignores `?l=<localpart>` query strings (strict WKD clients send them). Post-deploy smoke task.
- **No CI smoke test for vercel header serving** — header rules are easy to misconfigure (regex anchors, escaping). Add a GH Actions step that `curl -I`s `/pubkey.asc`, `/.well-known/security.txt`, and the WKD `hu/<hash>` path and asserts Content-Type. Follow-up CI improvement.
- **vercel.json `source` regex case-sensitivity** — `/PUBKEY.ASC` bypasses the Content-Type rule. Minor, no real attack surface; document or revisit if mixed-case becomes a real concern.
- **vercel.json `trailingSlash` not explicit** — Vercel default may rewrite `/.well-known/openpgpkey/policy` paths; strict WKD clients follow only one redirect hop. Verify post-deploy.
- **`.gitignore` patterns case-sensitive on case-insensitive FS** — `*.KEY` slips through on macOS/Windows. Document for contributors in CONTRIBUTING.md (or equivalent) when one exists.
- **No fingerprint `Comment:` header in pubkey.asc** — re-export with a `Comment:` line carrying the formatted fingerprint so anyone reading the armored block sees it inline without needing `gpg --show-keys`. Nice-to-have; requires re-export.
- **Architecture.md committed under `_bmad-output/`** — committing build/output directories with sensitive identity metadata is a project-pattern smell. Not a story-scoped fix; revisit when the bmad output directory layout is reconsidered.
- **Fingerprint surfaced only in repo (no out-of-band path)** — repo-only fingerprint can be swapped atomically by an attacker who compromises the repo. Handled by the future `/pgp` Astro page story (UX-DR24), which will publish the fingerprint on a public page.
- **Role-based security Contact alias** — `security.txt` currently uses the personal `akirabrand@protonmail.com`. Add a follow-up story to switch the Contact to `security@akirasmusicbox.com` (or another role alias) once the domain mailbox/forwarding is set up. Decision: ratify personal identity now, role alias later (Decisions #1 + #5 from this review).
