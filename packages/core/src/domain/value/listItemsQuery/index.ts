import { z } from "zod";

export const ListItemsQueryParametersSchema = z.object({
  nextToken: z.string().nullable(),
});
