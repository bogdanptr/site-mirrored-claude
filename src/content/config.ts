import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.string(),
    author: z.string(),
    authorImage: z.string().default("/images/placeholder.svg"),
    category: z.string(),
    image: z.string(),
    excerpt: z.string(),
  }),
});

export const collections = { blog };
