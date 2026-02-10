import { PostSchema, PostValuesSchema } from "@/domain/entity";
import { AppResult } from "@/domain/util/appResult";
import { createListItemsResultSchema } from "@/domain/util/createListItemsResultSchema";
import { ListItemsQueryParametersSchema } from "@/domain/value";
import { z } from "zod";

export const ListPostsByCategoryIdQueryParametersSchema = ListItemsQueryParametersSchema.extend({
  categoryId: PostValuesSchema.shape.categoryId,
});

export const ListPostsByCategoryIdQueryResultSchema = createListItemsResultSchema(PostSchema);

export type ListPostsByCategoryIdQueryInput = z.input<typeof ListPostsByCategoryIdQueryParametersSchema>;
export type ListPostsByCategoryIdQueryParameters = z.infer<typeof ListPostsByCategoryIdQueryParametersSchema>;
export type ListPostsByCategoryIdQueryResult = z.infer<typeof ListPostsByCategoryIdQueryResultSchema>;

export type ListPostsByCategoryIdQuery = (input: ListPostsByCategoryIdQueryInput) => Promise<AppResult<ListPostsByCategoryIdQueryResult>>;
