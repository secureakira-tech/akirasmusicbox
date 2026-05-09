# Story 1.3: Security Headers & Content Security Policy

Status: review

## Story

As the site operator,
I want complete security response headers delivered via vercel.json for every page,
so that the site's strict privacy posture is technically verifiable and third-party embeds are allowlisted before any embed components are built.

## Acceptance Criteria

1. `vercel.json` contains a `Content-Security-Policy` header applied to all routes (`/(.*)`).
2. CSP `frame-src` lists exact origins for all three embed platforms: Spotify (`open.spotify.com embed.spotify.com`), YouTube (`www.youtube.com www.youtube-nocookie.com`), Apple Music (`embed.music.apple.com`).
3. CSP `script-src` allows `'self'` and `https://plausible.io` only — no `'unsafe-inline'`, no `'unsafe-eval'`.
4. CSP `connect-src` includes `https://plausible.io` (Plausible analytics API pings).
5. CSP `form-action` includes `'self' https://buttondown.com https://buttondown.email` (newsletter form endpoint).
6. CSP `frame-ancestors 'self'` is set (consistent with X-Frame-Options).
7. CSP `object-src 'none'` and `base-uri 'self'` are set.
8. `X-Content-Type-Options: nosniff` header applied to all routes.
9. `X-Frame-Options: SAMEORIGIN` header applied to all routes.
10. `Referrer-Policy: strict-origin-when-cross-origin` header applied to all routes.
11. `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()` applied to all routes.
12. The two existing GPG Content-Type header rules from Story 1.0 are preserved intact.
13. HSTS is NOT manually added — Vercel handles it on production domains automatically.
14. Verified with `curl -I https://<preview-url>/` that all headers are present on a Vercel preview deploy.

## Tasks / Subtasks

### Task 1 — Expand vercel.json with the wildcard security headers rule (AC: 1–13)
- [x] Open `vercel.json` (currently contains only the two GPG Content-Type rules from Story 1.0).
- [x] Add a third entry in the `headers` array targeting `/(.*)`  — this applies to every response.
- [x] Write the complete `vercel.json` as specified in the Dev Notes "Final vercel.json" section below.
- [x] Verify the file is valid JSON: `python3 -m json.tool vercel.json` — must exit 0.
- [x] Confirm the two GPG Content-Type rules are still present.
- [x] Confirm no HSTS (`Strict-Transport-Security`) header is present.

### Task 2 — Verify headers locally with Astro dev server (AC: 1–12)
- [x] Note: `astro dev` does not serve Vercel headers. Local verification is JSON structure only.
- [x] Confirm the CSP value string contains no `unsafe-inline` or `unsafe-eval`.
- [x] Confirm `frame-src` contains all six embed origins (two each for Spotify, YouTube, Apple Music).
- [x] Confirm `form-action` contains Buttondown domains.
- [x] Confirm `object-src 'none'` is present.

### Task 3 — Deploy to Vercel preview and verify headers (AC: 14)
- [x] Push to a branch or directly to main to trigger a Vercel preview deploy.
- [ ] Once deploy is live, run:
  ```bash
  curl -I https://<your-preview-url>/
  ```
- [ ] Confirm these headers appear in the response:
  - `content-security-policy:` (with the full CSP value)
  - `x-content-type-options: nosniff`
  - `x-frame-options: SAMEORIGIN`
  - `referrer-policy: strict-origin-when-cross-origin`
  - `permissions-policy: camera=(), microphone=(), geolocation=(), payment=()`
- [ ] Confirm `strict-transport-security` is NOT manually set (Vercel sets it automatically on production; should not appear on preview subdomains).
- [ ] If a header is missing, fix `vercel.json` and re-deploy.

### Task 4 — Test that the built site loads without CSP violations (AC: 2–7)
- [ ] Open the Vercel preview URL in a browser with DevTools open (Console + Network tabs).
- [ ] Load the home page. Confirm zero CSP violation errors in the console.
- [ ] Note: embed components don't exist yet — no iframes to test. CSP is being set up ahead of time for correctness.

### Task 5 — Commit and push (AC: 1–13)
- [x] Stage: `git add vercel.json`
- [x] Commit: `git commit -m "feat(security): add full CSP and security headers to vercel.json"`
- [x] Push: `git push`
- [x] Verify CI passes (the `vercel.json` change doesn't affect the build steps).

## Dev Notes

### Final vercel.json

Replace the entire file with this content:

```json
{
  "headers": [
    {
      "source": "/(.*)\\.asc",
      "headers": [
        { "key": "Content-Type", "value": "application/pgp-keys" }
      ]
    },
    {
      "source": "/.well-known/openpgpkey/(.*)",
      "headers": [
        { "key": "Content-Type", "value": "application/octet-stream" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' https://plausible.io; connect-src 'self' https://plausible.io; frame-src open.spotify.com embed.spotify.com www.youtube.com www.youtube-nocookie.com embed.music.apple.com; frame-ancestors 'self'; img-src 'self' data:; style-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self' https://buttondown.com https://buttondown.email;"
        },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), payment=()"
        }
      ]
    }
  ]
}
```

### Why Headers Are in vercel.json, Not `<meta>`

The `frame-ancestors` CSP directive is **completely ignored when delivered via `<meta http-equiv="Content-Security-Policy">`** — it only works as a response header. All other CSP directives also work better as response headers (processed before any page content). This is why every security header in this project lives in `vercel.json`, not in Astro layouts.

[Source: architecture.md → Cross-Cutting Concerns → "CSP policy"]

### CSP Directive Breakdown

| Directive | Value | Reason |
|---|---|---|
| `default-src` | `'self'` | Catch-all fallback — all unspecified resource types blocked unless explicitly allowed |
| `script-src` | `'self' https://plausible.io` | Only our own scripts + Plausible analytics. SRI hash on Plausible tag added in Story 1.5 |
| `connect-src` | `'self' https://plausible.io` | Plausible sends pageview pings to its API; without this, analytics are silently blocked |
| `frame-src` | six embed origins | Exact origins for Spotify, YouTube (prefer nocookie), Apple Music iframes |
| `frame-ancestors` | `'self'` | Prevents this site from being iframed by third parties (belt-and-suspenders with X-Frame-Options) |
| `img-src` | `'self' data:` | `data:` required for any base64-inlined images (Astro may generate these) |
| `style-src` | `'self'` | Tailwind v4 outputs a CSS file at build time — no inline styles needed |
| `font-src` | `'self'` | Fontsource fonts are self-hosted npm packages — no external font CDN |
| `object-src` | `'none'` | Blocks Flash, plugins, and other legacy object embeds — no exceptions |
| `base-uri` | `'self'` | Prevents `<base>` tag injection attacks |
| `form-action` | `'self' https://buttondown.com https://buttondown.email` | Newsletter subscribe form POSTs to Buttondown; both domains covered |

### What Is NOT in the CSP (and Why)

- **`'unsafe-inline'` in `script-src`**: Not needed. Tailwind v4 generates a CSS file; Astro's `<script>` tags are module scripts. If a future story requires inline scripts, it must use a CSP `nonce` — not `'unsafe-inline'`.
- **`'unsafe-eval'`**: Not needed. No eval(), no Function(), no dynamic code generation.
- **`'unsafe-inline'` in `style-src`**: Tailwind v4 outputs static CSS. If Astro injects tiny inline styles that trigger a CSP violation, investigate and fix the specific violation — do not add `'unsafe-inline'` globally.
- **`Strict-Transport-Security`**: Vercel manages HSTS automatically on production domains with `max-age=63072000; includeSubDomains; preload`. Do not add it to `vercel.json` — if you add it yourself with wrong values, browsers will enforce it for years even after you correct it.

### PRD vs Architecture Discrepancy: X-Frame-Options

- PRD (line 370): `X-Frame-Options: DENY`
- Architecture: `X-Frame-Options: SAMEORIGIN`

**Use SAMEORIGIN** (architecture wins — it's the more specific technical document). SAMEORIGIN is also more consistent with `frame-ancestors 'self'` in the CSP. If DENY is genuinely required, it can be changed post-launch without security regression.

### Embed Origins — Why These Exact Domains

Spotify uses two embed subdomains depending on whether the user is logged in and the embed type. YouTube nocookie (`www.youtube-nocookie.com`) is preferred — it reduces cross-site tracking and still plays video. Apple Music uses `embed.music.apple.com` exclusively for its embed player. Any error in these origins will produce a blank embed with a CSP violation in the browser console — the failure mode is silent to the reader but visible to developers.

[Source: architecture.md → Technical Constraints → "Third-party iframes (3 platforms)"]

### Plausible SRI Hash — Deferred to Story 1.5

The SRI hash for the Plausible script tag goes in `BaseLayout.astro` (Story 1.5) as the `integrity` attribute on the `<script>` element, not in `vercel.json`. The CSP `script-src` here just allows the domain.

When Story 1.5 runs, compute the SRI hash with:
```bash
curl -s https://plausible.io/js/script.js | openssl dgst -sha384 -binary | openssl base64 -A
```
Then use: `integrity="sha384-<hash>" crossorigin="anonymous"` on the `<script>` tag.
Re-pin whenever Plausible updates their script.

### Vercel Header Application Order

Vercel applies all matching header rules to a response. The `.asc` and `.well-known/openpgpkey/` rules add `Content-Type` headers to those specific paths. The `(.*)` wildcard rule adds security headers to **all** paths — including the GPG file paths. This is correct: you want security headers even on the GPG key downloads.

### Previous Story Context

From Story 1.0: `vercel.json` was created as a stub with only the two GPG Content-Type rules. The stub comment said: "CSP, HSTS, X-Frame-Options belong in a dedicated security headers story." This is that story.

From Story 1.2: After Astro is initialized, there's a live Vercel preview URL available. Use it in Task 3 to verify headers with `curl -I`.

### Project Structure Notes

Files modified in this story:
```
vercel.json   — expanded from 2-rule stub to full security headers configuration
```

No new files created. No src/ files touched.

### References

- CSP requirement: [Source: architecture.md → Cross-Cutting Concerns → "CSP policy"]
- Embed origins: [Source: architecture.md → Technical Constraints → "Third-party iframes"]
- Plausible SRI: [Source: architecture.md → Technical Constraints → "Plausible analytics"]
- HSTS note: [Source: architecture.md → Cross-Cutting Concerns → "CSP policy" → "HSTS is handled by Vercel"]
- NFR5: HTTPS enforced via Vercel TLS
- NFR6: HSTS (Vercel handles)
- NFR7: Strict CSP in vercel.json
- NFR8: X-Frame-Options: SAMEORIGIN
- NFR9: Referrer-Policy
- NFR10: X-Content-Type-Options
- NFR11: Permissions-Policy
- NFR13: SRI on external scripts (Plausible hash in Story 1.5)
- AR3: All security headers in vercel.json

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- ✅ Task 1: `vercel.json` rewritten from 2-rule stub to full 3-rule security headers config. Valid JSON confirmed (`python3 -m json.tool` exit 0). Both GPG rules preserved. No HSTS present.
- ✅ Task 2: Python script verified all 13 CSP checks: all six embed origins present, `frame-ancestors 'self'`, `object-src 'none'`, `base-uri 'self'`, Buttondown form-action, no `unsafe-inline`/`unsafe-eval`, no HSTS.
- ⏳ Task 3: Pushed to main (commit `ce01d38`). Vercel auto-deploy triggered. User must run `curl -I <preview-url>/` to verify headers on live deployment.
- ⏳ Task 4: User must open Vercel preview URL in browser and confirm zero CSP violations in DevTools console.
- ✅ Task 5: GPG-signed commit `ce01d38` pushed to main. CI passes (`vercel.json` is not tested by the build workflow).

### File List

- `vercel.json` (modified — expanded from 2-rule stub to full security headers)
