import { z } from "zod";

export function createListItemsResultSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    nextToken: z.string().nullable(),
  });
}
