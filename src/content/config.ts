import { defineCollection, z } from 'astro:content';

// Frontmatter schema for /writing posts.
const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    featured: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional().default([]),
  }),
});

export const collections = { writing };
