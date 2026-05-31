// Single registration point for the in-prose MDX components.
//
// NOTE: @astrojs/mdx (v5) has NO global component-registration option —
// `mdx({ components })` is not a valid config key. Astro only applies custom
// components when they are passed to `<Content components={...} />`. This map
// is the DRY source of truth so every page renders MDX with the same set.
import PrimaryEmbed from './PrimaryEmbed.astro';
import ReferenceEmbed from './ReferenceEmbed.astro';
import Note from './Note.astro';
import ArtistSupport from './ArtistSupport.astro';
import ClosingRitual from './ClosingRitual.astro';
import NewsletterSubscribe from './NewsletterSubscribe.astro';

export const mdxComponents = {
  PrimaryEmbed,
  ReferenceEmbed,
  Note,
  ArtistSupport,
  ClosingRitual,
  NewsletterSubscribe,
};
