import { defineCollection, z } from 'astro:content';

// Frontmatter schema for /writing posts.
// Matches the 28 existing posts being migrated in.
const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = { writing };
