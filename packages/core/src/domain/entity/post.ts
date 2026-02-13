import { z } from "zod";

export const PostKeySchema = z.object({
  id: z.string(),
});

export const PostValuesSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  thumbnail: z.string().optional(),
  content: z.string().max(100000).optional(),
  categoryId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const PostSchema = PostKeySchema.extend(PostValuesSchema.shape);

export type Post = z.infer<typeof PostSchema>;
