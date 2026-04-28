---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
releaseMode: phased
classification:
  projectType: web_app
  domain: general
  complexity: medium
  projectContext: greenfield
inputDocuments:
  - _bmad-output/planning-artifacts/prfaq-akira.md
  - _bmad-output/planning-artifacts/prfaq-akira-distillate.md
workflowType: 'prd'
---

# Product Requirements Document — akirasmusicbox

**Author:** a k i r a  
**Date:** 2026-04-28

---

## Executive Summary

akirasmusicbox is a weekly music publication at akirasmusicbox.com that restores listening depth for readers whose sense of musical wonder has been narrowed by algorithmic curation. Each post is a technically-grounded analysis of a specific piece — classical, metal, psychedelic rock, ambient, or hip hop — functioning as both a guided listening experience and a transferable lesson in how music works. Readers finish a post able to hear something they couldn't hear before; that skill compounds across the archive.

The target reader is algorithmically aware and technically-minded — infosec professionals, software engineers, AI skeptics — people who understand exactly how recommendation systems work and distrust them for that reason. They want a human guide who invites them in, doesn't gatekeep, and respects their intelligence.

The product is free, always. Revenue model: voluntary donation via Ko-fi. No paywall, no premium tier, no algorithmic pressure on content decisions.

### What Makes This Special

The author is a professional opera singer (performing since 2019) and a recognized voice in the infosec/AI security community. That combination doesn't exist elsewhere in music writing. Opera training produces an ear calibrated to the physics of resonance, phrase shaping, and the gap between technical correctness and genuine expression — skills that transfer across every genre covered. The infosec background means the audience already knows and trusts the author's critical thinking, and understands the algorithm critique from the inside rather than as a vague complaint.

The differentiating thesis is listening literacy, not taste curation. Pitchfork tells you whether to listen. akirasmusicbox tells you what to listen *for*. The skill transfers beyond any individual post or recommended record.

Against the dominant alternatives: written long-form is searchable, skimmable, and referenceable in ways video (Adam Neely, 12tone) cannot be — and this audience reads long-form by culture and habit. Against audiophile writing: literacy first, gear second inverts the standard gatekeeping model.

Distribution is not a cold-start problem. The launch audience — infosec and AI security community — is already built.

### Project Classification

- **Project Type:** Web app — custom static site (Astro), browser-based, Markdown/MDX posts, newsletter via Buttondown
- **Domain:** Content publication / personal mission-driven blog
- **Complexity:** Medium — domain is unregulated, but non-trivial requirements: strict privacy-first security posture (CSP, HSTS, DNSSEC, zero trackers), embedded third-party audio players, newsletter integration, hi-fi thread as recurring sidebar
- **Project Context:** Greenfield

---

## Success Criteria

### User Success

A post works when the reader takes a tangible action in support of an artist: buys a record direct (Bandcamp), follows on Instagram, picks up merch, or otherwise completes an energy exchange beyond passive listening. Success is not enjoyment — it is action. Secondary success: a reader returns to something they already owned and hears it differently.

The "aha" moment is the listener realizing the gap between what they were hearing and what was actually there — and that gap closing.

### Business Success

- **6 months:** 200 subscribers + organic forum mentions from people with no prior relationship to the author. Forum mentions are the signal — they mean the writing is doing the work, not the network.
- **12 months:** 650 subscribers — traction beyond the launch cohort, people finding it without already knowing who you are.
- **Failure signal:** Posts written to fill a slot rather than say something. Quality is the leading indicator, always ahead of subscriber count.

### Technical Success

- Security headers verified at launch: strict CSP, HSTS preloaded, X-Frame-Options, DNSSEC, Subresource Integrity, GPG/SSH commit signing active
- Zero third-party trackers; Plausible Analytics operational
- All embedded audio players load without layout shift or performance regression
- Newsletter delivery via Buttondown with no deliverability issues
- Core Web Vitals pass on every deploy

### Measurable Outcomes

| Metric | 6-Month Target | 12-Month Target |
|---|---|---|
| Subscribers | 200 | 650 |
| Organic forum mentions | 1+ independent | Growing |
| Weekly post cadence | Unbroken | Unbroken |
| Artist support actions | Qualitative signal | Qualitative signal |

---

## Project Scope & Delivery Strategy

### MVP Philosophy

**Approach:** Experience MVP — the minimum is not a thin feature set, it is a proof of quality. The site can launch with 5 posts and a subscribe button. It cannot launch with writing that doesn't earn the reader's trust. The technical platform serves the writing; the writing is the product.

**Resources:** Solo developer/author (Akira). All build, authoring, publishing, and operations handled by one person. Every scope decision must be sustainable at that scale indefinitely.

### MVP — Launch

**Core User Journeys Supported:** All five — Discovery Reader, Subscriber, Hi-fi Curious Reader, Author (Nominal Week), Author (Opera Production Week).

**Must-Have Capabilities:**
- Custom Astro static site, deployed to Vercel or Netlify
- 5 posts published at launch; 2-post buffer maintained
- Embedded audio players (Spotify, Apple Music, YouTube) per post
- Direct artist support links (Bandcamp, Patreon, merch) per post
- Hi-fi sidebar component — visually distinct, semantically marked — in each standard post
- Buttondown newsletter subscription (plain HTML form, no JS dependency)
- Ko-fi donation link (plain anchor link, no embedded widget)
- Plausible Analytics
- Browse/filter by genre, era, instrument, mood (taxonomy pages)
- Privacy-first security posture: strict CSP, HSTS preloaded, DNSSEC, X-Frame-Options, Referrer-Policy, X-Content-Type-Options, Subresource Integrity, zero third-party trackers
- GPG or SSH commit signing; public key published on-site
- WCAG 2.1 AA accessibility
- On-site statement: "No trackers. No cookies. No algorithms. Built from scratch."
- LLC formed, separate bank account in place

**Hard Pre-Launch Dependency:** CSP configuration must be validated against all third-party embeds (Spotify, Apple Music, YouTube, Bandcamp iframes, Plausible script) before launch. Embed rendering under strict CSP is not assumed — it must be tested and confirmed. Launch is blocked until resolved.

### Growth — Post-Launch

- Streaming/social media presence (platform TBD)
- Short-form post template — defined and tested for opera production periods

### Vision — 12+ Months

- 650+ subscribers with demonstrable organic discovery
- Archive functioning as a reference resource — posts cited and linked externally
- Measurable artist support pattern visible in Bandcamp/external link behavior
- Comment system: deferred, scope TBD

### Risk Mitigation

**Technical:**
- *CSP + third-party embeds:* Hard pre-launch dependency. Resolve before any launch date is set. Test every embed type under production CSP headers. Document the working header configuration.
- *Deployment pipeline:* Astro → Git → Vercel/Netlify auto-deploy is a well-established pattern. Low risk. Validate on first push.

**Market:**
- *Infosec audience music crossover:* De-risked by community evidence. DEF CON runs a call for musicians; conference playlist culture is a documented community practice. The audience doesn't need converting — they're already there. The bet is that no publication has been written for them at this depth.

**Resource:**
- *Solo creator + opera production schedule:* Mitigated by two-post buffer maintained at all times. Short-form posts (400 words, one track, one embed, one artist link) are the defined safety valve during production runs — not silence, not a gap, not a quality compromise on a different axis. Buffer policy is operational discipline, not a system feature.

---

## User Journeys

### Journey 1: The Discovery Reader (First Contact)

**Meet Marcus.** He's a senior security engineer who's been writing threat models by day and opening Spotify by night for seven years. His Discover Weekly has been serving him variations of the same four artists since 2022. He knows exactly why — he's read the papers on collaborative filtering. That's almost the worst part.

Someone in his infosec Slack pastes a link to an akirasmusicbox post about a Melvins record. He clicks it half-skeptically, expecting another "10 albums you should hear" listicle.

**Rising action:** The post opens mid-sentence, no preamble. It goes straight into the drum pattern on the opening track — specifically why the kick placement creates a kind of seasick gravity. There's an embedded Spotify player right there. He plays the track. He reads the next paragraph. He plays the track again. Something clicks. He's 800 words in before he notices.

**Climax:** At the bottom of the post, there's a Bandcamp link. He buys the record. Not streams it — buys it. He hasn't done that in four years.

**Resolution:** He scrolls to the bottom of the page. There's a newsletter subscribe box. He signs up before closing the tab. He doesn't forward the link yet — that comes in three weeks, when he's read six more posts and knows it's real.

*Capabilities revealed: clean post layout, embedded audio with zero friction, in-context artist support links, newsletter subscribe at post-end.*

---

### Journey 2: The Subscriber (Weekly Ritual)

**Meet Priya.** She subscribed three months ago after a colleague mentioned the site. She's read maybe 14 posts. Not every one — she skipped a classical one because she wasn't sure she was ready — but most of them. She has a ritual now: Friday morning, coffee, inbox.

**Rising action:** The newsletter arrives. Subject line names the track. She opens it, reads the preview, clicks through to the site. The post is about a hip hop producer she's vaguely heard of. She has low expectations. By paragraph three she's found the embedded YouTube clip and is listening with the post open in her other eye.

**Climax:** The post explains a specific sample flip — what the original was, what changed, why the change matters. She pauses, pulls up the original on her phone, listens back and forth. She's doing the thing. The thing the blog is for. Her ears are doing something new.

**Resolution:** She follows the artist on Instagram. Doesn't buy anything yet — but she follows. She goes back to that classical post she skipped. She reads it.

*Capabilities revealed: Buttondown newsletter delivery, post archive browsable by genre/mood, embedded multi-platform audio, related posts and archive navigation.*

---

### Journey 3: The Hi-fi Curious Reader (The Sidebar Thread)

**Meet Daniel.** He's been using the same pair of Sony MDR-7506s for eight years. They're fine. He's been half-wondering for two years whether "fine" is good enough. He found akirasmusicbox through a Reddit thread on r/audiophile where someone linked it as "the one music blog that isn't obnoxious about gear."

**Rising action:** He reads a post. The main content is about a psychedelic rock record. The sidebar catches his eye: a short section on headphone imaging — specifically how this record was mixed for speakers, and what that means when you hear it on cans. It's two paragraphs. It doesn't tell him to buy anything. It tells him what to listen for.

**Climax:** He goes back and listens to the record on his headphones and then through his laptop speakers. He hears the difference the sidebar described. He now knows something real about his gear that no spec sheet ever told him.

**Resolution:** He browses the archive specifically for posts with hi-fi sidebars. He doesn't buy new headphones yet. But he knows what question he's actually trying to answer — not "what should I buy," but "what am I trying to hear?"

*Capabilities revealed: hi-fi sidebar clearly marked and scannable, archive browsable enough to surface sidebar-heavy posts, no upsell pressure anywhere.*

---

### Journey 4: The Author — Nominal Publish Week

**The situation:** It's Tuesday. The post is drafted, edited, audio embeds verified, Bandcamp link checked. The buffer is at two posts.

**Journey:** Akira opens the local editor, drops the Markdown file into the posts directory, verifies frontmatter (genre, era, instrument, mood, post type), checks the hi-fi sidebar renders correctly in preview, pushes to Git. Vercel deploys in under 2 minutes. Buttondown newsletter queued for Thursday morning send. Done.

*Capabilities revealed: fast local Markdown authoring, frontmatter tagging system, sidebar component renders correctly, automatic deployment on push, Buttondown newsletter queues on schedule.*

---

### Journey 5: The Author — Opera Production Week (Edge Case)

**The situation:** Tech week. 14-hour days. The buffer is at one post. Akira has 2 hours Sunday morning.

**Journey:** Opens the short-form post template. Picks one track. Writes one observation — 400 words, no sidebar, one embed, one artist link. Pushes. Buffer restored to two. Newsletter queues. No post is skipped. The reader's inbox gets something real, not silence.

*Capabilities revealed: short-form post path with no enforced sidebar or word count minimum; buffer tracking is operational discipline, not a system constraint.*

---

## Innovation & Novel Patterns

### Detected Innovation Areas

**Author-credibility crossover:** The intersection of professional opera singer and recognized infosec/AI security voice is not represented in music writing. The opera background provides technical ear training that transfers across genres. The infosec background provides audience trust and a shared critical framework around algorithmic systems. Neither alone produces this product. Together they define a category.

**Criticism as artist-support engine:** Conventional music criticism optimizes for influence — the reader forms an opinion. akirasmusicbox optimizes for action — the reader takes a tangible step in support of an artist. The embedded Bandcamp/Patreon/merch links per post are not supplementary; they are the success mechanism. A post that generates streams is a lesser outcome than a post that generates a direct purchase.

**Privacy architecture as editorial statement:** For a technically-literate, AI-skeptical audience, a zero-tracker, custom-built site is not a preference — it is a position. The site's architecture argues what the writing argues. A Substack blog with tracking pixels would undercut the thesis before the first sentence.

### Market Context & Competitive Landscape

The technically-informed music space is currently YouTube-native (Adam Neely, 12tone, Andrew Huang). Long-form written equivalent at comparable technical depth is largely absent. Written format occupies differentiated territory: searchable, referenceable, skimmable — matching the reading habits of the target audience. Music journalism (Pitchfork, The Wire) addresses different readers and different goals. Audiophile writing is gear-first and jargon-heavy. akirasmusicbox occupies a gap that exists specifically because no one with these credentials has been writing in this format for this audience.

### Validation Approach

The launch cohort (infosec/AI security community) is the validation instrument. Organic forum mentions within 6 months from people with no prior relationship to the author confirm the writing is doing the work without the network. Artist support link activity (Bandcamp conversions, social follows) provides qualitative signal — not tracked aggressively, but noted when visible.

### Innovation Risk Mitigation

**Opera-to-metal credibility gap:** Proactive treatment on the About page and in early posts. The answer (trained ear transfers across genres) is strong — it needs to lead, not react.

**Author bandwidth:** Two-post buffer and defined short-form template mitigate the opera production schedule risk. The innovation in positioning does not depend on post length — a 400-word track breakdown at the same quality bar holds the brand.

---

## Web App Technical Requirements

### Overview

akirasmusicbox is a static multi-page application (MPA) built with Astro, deployed to Vercel or Netlify. Each post is a discrete static page. No client-side routing, no real-time requirements, no authentication. Every technical decision serves the reading experience.

### Browser Matrix

- **Target:** Modern browsers — Chrome, Firefox, Safari, Edge (current and previous major version)
- **Excluded:** IE11, legacy mobile browsers
- **Rationale:** Target audience is technically-sophisticated; zero legacy browser support burden is the correct trade-off

### Responsive Design

- **Primary:** Desktop — long-form posts with sidebar, embedded audio players, and artist support links optimized for wide viewport
- **Mobile:** Fully functional and readable; sidebar collapses gracefully; audio embeds scale without overflow; no mobile-specific features
- **Tablet:** Treated as desktop-class

### SEO Strategy

SEO is a primary long-term value driver. The archive compounds — a post from year one must remain discoverable in year three.

- Semantic HTML throughout: proper heading hierarchy (h1 → h2 → h3), article tags, time elements
- Frontmatter-driven meta tags per post: title, description, Open Graph, Twitter Card
- Taxonomy pages for genre, era, instrument, and mood — primary organic search surfaces beyond individual posts
- Sitemap auto-generated by Astro on build
- Full content rendered without JavaScript — crawlers receive complete content on first parse
- Canonical URLs on all pages

### Implementation Considerations

- Astro island architecture: zero JavaScript by default; progressive enhancement only where required (embed players, subscribe form)
- Buttondown subscribe form embedded as plain HTML form — no JavaScript dependency
- Ko-fi implemented as a plain anchor link — no embedded widget, no tracker/CSP conflict
- Plausible Analytics loaded with `defer`; compatible with strict CSP via nonce or hash

---

## Functional Requirements

### Content Publishing

- **FR1:** Author can create and edit posts in Markdown/MDX with structured frontmatter metadata
- **FR2:** Author can tag posts with genre, era, instrument, mood, post type (standard or short-form), and hi-fi sidebar presence
- **FR3:** Author can embed audio players (Spotify, Apple Music, YouTube) inline within post content
- **FR4:** Author can include direct artist support links (Bandcamp, Patreon, merch) within post content
- **FR5:** Author can include a hi-fi sidebar section within any post
- **FR6:** Author can publish posts via Git push with automatic site deployment
- **FR7:** Author can queue newsletter delivery to Buttondown on a scheduled basis

### Reading Experience

- **FR8:** Readers can read full post content with inline embedded audio players
- **FR9:** Readers can access artist support links directly from within a post without leaving the page context
- **FR10:** Readers can identify and read the hi-fi sidebar as a visually and semantically distinct element within a post
- **FR11:** Readers can navigate from a post to related posts or the broader archive
- **FR12:** Readers can subscribe to the newsletter from within a post page
- **FR13:** Readers can access an About page explaining the author's background, credentials, and cross-genre methodology

### Audio & Media

- **FR14:** Embedded audio players (Spotify, Apple Music, YouTube) render and play within post content
- **FR15:** Embedded audio players load without causing visible layout shift
- **FR16:** All post images are displayed with descriptive alt text

### Artist Support

- **FR17:** Readers can access Bandcamp purchase links from within a post
- **FR18:** Readers can access artist social profiles from within a post
- **FR19:** Readers can access artist merch and crowdfunding links (Patreon, etc.) from within a post
- **FR20:** Readers can make a voluntary donation to the site via Ko-fi

### Content Discovery

- **FR21:** Readers can browse all posts filtered by genre
- **FR22:** Readers can browse all posts filtered by era
- **FR23:** Readers can browse all posts filtered by instrument
- **FR24:** Readers can browse all posts filtered by mood
- **FR41:** Readers can browse all posts that include a hi-fi sidebar, via the same taxonomy browse pattern as genre/era/instrument/mood
- **FR25:** Individual posts and taxonomy pages are indexable and discoverable via external search engines
- **FR26:** Site generates and publishes a sitemap for search engine indexing

### Newsletter & Subscription

- **FR27:** Readers can subscribe to the weekly email newsletter using only an email address
- **FR28:** Subscribers receive new posts delivered to their inbox via Buttondown
- **FR29:** Newsletter emails link directly to the published post on-site

### Privacy & Security

- **FR30:** Site operates with zero third-party tracking scripts or surveillance pixels
- **FR31:** Site displays a published on-site statement declaring its no-tracker, no-cookie, no-algorithm posture
- **FR32:** Site collects privacy-respecting, cookieless analytics via Plausible
- **FR33:** All third-party embeds (audio players, Plausible script, Ko-fi link) function correctly within the site's strict Content Security Policy

### Home Page & Navigation

- **FR38:** Site home page displays the most recent post in full, including its hi-fi sidebar if present
- **FR39:** Site-wide top navigation includes links to About, Support (Ko-fi), and Archive
- **FR40:** Readers can access an Archive page listing all posts in reverse-chronological order

### Accessibility

- **FR34:** All post content and site navigation is operable by keyboard alone
- **FR35:** All images carry descriptive alt text sufficient for screen reader comprehension
- **FR36:** The hi-fi sidebar is navigable as a distinct landmark region, independently accessible from main post content
- **FR37:** Site color contrast meets WCAG 2.1 AA minimums throughout

---

## Non-Functional Requirements

### Performance

- LCP < 2.5s on desktop; < 4s on mobile (simulated 3G)
- CLS = 0 — third-party embeds use reserved placeholder space or lazy loading; no layout movement on embed load
- INP < 200ms
- Site performance does not degrade as the archive grows — static generation and CDN delivery maintain consistent load times regardless of archive size

### Security

- HTTPS enforced on all pages via Vercel/Netlify automatic TLS
- HSTS preloaded with `includeSubDomains` and `max-age` ≥ 1 year
- Strict Content Security Policy: all third-party sources (Spotify, Apple Music, YouTube, Bandcamp, Buttondown form endpoint, Plausible) explicitly allowlisted; no `unsafe-inline` or `unsafe-eval` unless provably required by an embed and documented
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Content-Type-Options: nosniff`
- DNSSEC enabled on domain registrar
- Subresource Integrity (SRI) hashes on any externally loaded scripts
- No cookies set by the site itself
- No user PII collected or stored by the site — email addresses held only by Buttondown, inaccessible via site code
- Git repo: branch protection on main; no secrets, tokens, or credentials in codebase or commit history
- All commits signed with the author's GPG or SSH key; author's public key published on-site and/or linked to a public keyserver, enabling cryptographic verification that content originated from the author

### Accessibility

- WCAG 2.1 AA compliance verified before launch via automated tooling (Lighthouse, axe) and manual keyboard navigation test
- Screen reader compatibility tested against at least one major screen reader (VoiceOver or NVDA) before launch
- No information conveyed by color alone — all visual distinctions have a non-color equivalent
- No auto-playing audio or video
- Each embedded audio player preceded by descriptive context so screen reader users understand what they're about to encounter

### Integration

- **Buttondown:** Newsletter emails delivered within 2 hours of scheduled send time; delivery failure must not affect site availability
- **Plausible Analytics:** Script loaded with `defer`; if blocked (ad blocker, CSP) the site remains fully functional with no visible error
- **Embedded audio players:** If a platform embed fails to load, the post remains fully readable and the failure is visually indicated — not a blank space
- **Ko-fi:** Plain anchor link; site function has zero dependency on Ko-fi service availability

### Availability

- Site availability: 99.9% uptime (Vercel/Netlify platform SLA)
- New content live within 5 minutes of Git push to main branch
- Newsletter delivery operates independently of site deployment — a failed deploy must not block or delay Buttondown sends
