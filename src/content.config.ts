import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    genre: z.string().optional(),
    era: z.string().optional(),
    instrument: z.string().optional(),
    mood: z.string().optional(),
    postType: z.string().optional(),
    hifiSidebar: z.boolean().default(false),
  }),
});

export const collections = { posts };
