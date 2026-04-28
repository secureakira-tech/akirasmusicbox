---
stepsCompleted:
  - step-01-init
  - step-02-discovery
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/implementation-readiness-report-2026-04-28.md
---

# UX Design Specification akirasmusicbox

**Author:** a k i r a 
**Date:** 2026-04-28

---

## Executive Summary

### Project Vision

akirasmusicbox is a weekly music publication that teaches readers *how* to listen, not *what* to listen to. The writing is the product. Every UX decision serves the text, the audio, and the direct line between reader and artist — nothing else.

### Target Users

**Discovery Reader (Marcus):** Arrives cold via a link share, skeptical, decides within seconds whether this is a listicle or something real. Needs zero friction to the first embedded audio player and a frictionless path from reading to buying a record.

**Subscriber (Priya):** Weekly ritual — arrives via email, clicks through. Needs a reliable, consistent, calm reading experience. The archive must be browsable enough to surface posts she skipped.

**Hi-fi Curious Reader (Daniel):** Found via audiophile communities, actively scanning for the hi-fi sidebar. Needs the sidebar to be visually distinct and scannable without reading the full post.

**Author / Akira (nominal week):** Writes in Markdown locally, pushes to Git. Needs frontmatter tagging to be frictionless and the preview to render exactly what will publish.

**Author / Akira (opera production week):** 2 hours, 400 words, one embed, done. Needs the short-form path to feel identical in quality to the standard path — same design, less content.

### Key Design Challenges

1. **Embed friction vs. strict CSP** — Spotify/Apple Music/YouTube iframes must render correctly under a strict Content Security Policy. If an embed fails, the post must remain fully readable and the failure must be visually indicated — not a blank gap that reads as broken.

2. **Sidebar legibility at all viewports** — The hi-fi sidebar must feel like a deliberate editorial element (not a widget or ad) on desktop, and collapse gracefully on mobile without losing its semantic identity. Readers like Daniel are specifically scanning for it.

3. **Cold-reader trust in seconds** — The page must signal "this is not a listicle" within the first scroll. Typography, density, and the absence of noise (ads, pop-ups, social share buttons) all contribute. The on-site privacy statement is part of the UX, not just legal copy.

4. **Archive scannability at scale** — As the archive grows, browsing by genre, era, instrument, mood, and post type must surface the right post without a search box. Taxonomy page design is load-bearing for long-term reader retention.

### Design Opportunities

1. **Typography as the primary aesthetic statement** — A reading-first site for a technically-sophisticated audience. A strong typographic system (hierarchy, measure, leading) can signal quality before a single word is read.

2. **The hi-fi sidebar as a recurring design signature** — If visually distinctive and consistent across posts, readers begin anticipating it. It becomes a brand element, not just a layout feature.

3. **Privacy posture as visible design** — The absence of cookie banners, pop-ups, and tracking noise is a positive UX signal for this audience. The design makes the absence of noise feel intentional and principled — a statement the site's architecture argues alongside the writing.
