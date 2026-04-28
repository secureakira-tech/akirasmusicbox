---
title: "PRFAQ Distillate: akira"
type: llm-distillate
source: "prfaq-akira.md"
created: "2026-04-28"
purpose: "Token-efficient context for downstream PRD creation"
---

## Product Identity

- **Name:** akirasmusicbox
- **URL:** akirasmusicbox.com
- **Type:** Personal passion publication / mission-driven music blog
- **Author:** Professional opera singer (performing in professional productions since 2019), live and studio recording experience. Vast vinyl collection.
- **Thesis:** "I don't tell people what to like — I teach them how to listen." Listening literacy is the core value proposition, not taste curation.
- **Tone:** Irreverent but technically serious. "Never-ending eargasms." Not stuffy, not academic — human and playful.

## Customer

- **Primary:** Technically-minded, algorithmically-aware people who understand how recommendation systems work and distrust them — infosec professionals, software developers, engineers, AI skeptics
- **Secondary:** General music lovers who are algorithm-fatigued and have lost a sense of wonder; hi-fi curious people repelled by audiophile gatekeeping culture
- **Core pain:** Not just boredom — a slow algorithmic narrowing of perspective across multiple domains (music, dating, discovery). Technology promised expansion and delivered a mirror.
- **The wound:** They've been betrayed by every algorithmic system. They want wonder back. They're ready for someone who invites them in instead of gatekeeping.
- **Hi-fi pain:** Audiophile communities use jargon and cost-signaling as barriers. Reader wants plain-language guidance that starts with ears, not gear.

## Positioning

- **The transformation arc:** Bitterness (algorithm failure, audiophile gatekeeping, tech betrayal) → pivot ("the music was never the problem") → wonder restored
- **Differentiation from YouTube (Adam Neely, 12tone):** Written long-form is searchable, skimmable, referenceable. This audience already reads long-form — documentation, essays, deep dives. Their format.
- **Differentiation from music journalism:** Pitchfork tells you whether to listen. akirasmusicbox tells you what to listen *for*. The skill transfers beyond any single post.
- **Differentiation from audiophile writing:** Literacy first, gear second. "You can learn to unlock music on cheap headphones far better than someone on a $10k system who has no idea what they're hearing."
- **Author's unexpected differentiator:** Opera singer covering classical, metal, psychedelic rock, ambient, hip hop. The trained operatic ear transfers across all genres — physics of resonance, phrase shaping, technical correctness vs. expression. This must be addressed proactively, not reactively, as it's the most interesting thing about the site.

## Content

- **Genres:** Classical, metal, psychedelic rock, ambient, hip hop
- **Format:** Long-form posts, technically deep but accessible. No music degree required — "you've felt this your whole life, I'll show you what caused it."
- **Audio:** Embedded platform players only (Spotify, Apple Music, YouTube). No hosted clips. Platform handles licensing. Chosen to eliminate copyright exposure.
  - *Rejected:* "Licensed audio excerpts" — removed from press release. Too much legal complexity for solo creator at launch.
- **Images:** Included in posts
- **Hi-fi thread:** Woven through music posts, not a standalone pillar. Philosophy: literacy first, gear second. Form (sidebar, aside, occasional standalone) TBD — must be defined before design.
- **Cadence:** One long-form post per week. 6-10 hours per post. Two-post buffer maintained. During opera production runs: shorter-form pieces (single track breakdown, listening recommendation) rather than silence.

## Technical Platform

- **Stack:** Astro (static site generator) + Vercel or Netlify hosting. Posts in Markdown/MDX.
- **Email:** Buttondown (free to start) for newsletter subscriptions
- **Donations:** Ko-fi integration. Free content, always. No paywall, no premium tier.
- **Rejected:** Ghost (considered but replaced by custom build for credibility and control reasons)
- **Security requirements (non-negotiable):**
  - Zero tracking — no Google Analytics, no Meta pixels, no third-party data collection
  - Plausible Analytics or no analytics
  - Strict CSP, HSTS preloaded, X-Frame-Options, Referrer-Policy, X-Content-Type-Options
  - HTTPS automatic (Vercel/Netlify)
  - DNSSEC on domain
  - Subresource Integrity on any external scripts
  - No cookies beyond functional minimum
  - Branch protection on repo, no secrets in code
  - Published statement on-site: "No trackers. No cookies. No algorithms. Built from scratch."
- **Build timeline:** ~2-3 weeks before first post goes live
- **Why custom matters for this audience:** Infosec/cybersecurity readers will notice. A custom-built, tracker-free site is a credibility signal that reinforces the anti-algorithm thesis.

## Legal & Business

- **Entity:** Form LLC before launch. ~$200-500 in filing fees. Single-member LLC. Separate bank account mandatory.
- **Monetization:** Donation-based (Ko-fi). Mission-first. Never intended as primary income.
- **Audio copyright:** Platform embeds eliminate exposure. No hosted clips. Fair use not relied upon at launch.
- **Defamation risk:** Managed through editorial discipline — opinion clearly labeled, no false factual claims published without evidence.
- **DMCA exposure:** Platform-level (labels can flag embeds). Manageable nuisance. Standard counter-notice procedure applies.

## Distribution & Growth

- **Launch channel:** Existing large following in cybersecurity/infosec community. Not a cold-start problem.
- **Secondary channels:** Music-focused forums and communities (Reddit: r/ifyoulikeblank, r/musictheory, r/audiophile), Discords
- **Success at 6 months:** 200 subscribers + organic forum mentions from people who didn't hear about it from the author
- **Failure signal:** Posts written to fill a slot rather than say something. Quality is the leading indicator.

## Verdict Items Requiring PRD Attention

- **Press release update needed:** Opera background must surface earlier (solution paragraph or author quote setup). Currently only in Customer FAQ Q7.
- **Press release update needed:** Name the sharpest audience — technically-minded, algorithmically-aware — not just "bored Spotify users."
- **"How It Works" needs specificity:** Should describe the unique *akirasmusicbox* reading experience, not generic blog reading.
- **Hi-fi thread form:** Must be defined in PRD before design begins. Options: recurring labeled section, inline aside, occasional standalone post.
- **Opera-to-metal/hip-hop framing:** Needs proactive treatment on About page and in press release. The answer (trained ear transfers) is strong — it just needs to be front-loaded.
- **Minimum viable post definition:** What's the shortest/lightest form that still meets the quality bar during hard weeks? Needs to be defined so the author has a genuine safety valve.
- **Written vs. video argument:** Strengthen by leaning into audience-specific angle — this audience reads long-form by culture and habit.

## Open Questions

- Exact cybersecurity community announcement strategy (which platforms, which communities, timing)
- Ghost setup vs. custom build timeline — custom confirmed, execution planning deferred to PRD
- LLC state of formation — action item pre-launch, no blocker
- Plausible Analytics vs. no analytics — decision deferred
- Comment system (if any) — not addressed in PRFAQ, likely scope for PRD
- Social media presence (if any) — not addressed, likely scope for PRD
