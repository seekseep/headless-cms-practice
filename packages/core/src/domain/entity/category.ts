import { z } from "zod";

export const CategoryKeySchema = z.object({
  id: z.string(),
})

export const CategoryValuesSchema = z.object({
  parentId: z.string().nullable().default(null),
  name: z.string().min(1).max(100).default(""),
  thumbnail: z.string().nullable().default(null),
  slug: z.string().min(1).max(255).default(""),
  order: z.number().int().nonnegative().default(0),
  description: z.string().max(500).optional(),
})

export const CategorySchema = CategoryKeySchema.extend(CategoryValuesSchema.shape);

export type Category = z.infer<typeof CategorySchema>;
