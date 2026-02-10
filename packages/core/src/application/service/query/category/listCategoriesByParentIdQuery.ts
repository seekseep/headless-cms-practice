import { CategorySchema, CategoryValuesSchema } from "@/domain/entity/category";
import { AppResult } from "@/domain/util/appResult";
import { createListItemsResultSchema } from "@/domain/util/createListItemsResultSchema";
import { ListItemsQueryParametersSchema } from "@/domain/value";
import { z } from "zod";

export const ListCategoriesByParentIdQueryParametersSchema = ListItemsQueryParametersSchema.extend({
  parentId: CategoryValuesSchema.shape.parentId,
});

export const ListCategoriesByParentIdQueryResultSchema = createListItemsResultSchema(CategorySchema);

export type ListCategoriesByParentIdQueryInput = z.input<typeof ListCategoriesByParentIdQueryParametersSchema>;
export type ListCategoriesByParentIdQueryParameters = z.infer<typeof ListCategoriesByParentIdQueryParametersSchema>;
export type ListCategoriesByParentIdQueryResult = z.infer<typeof ListCategoriesByParentIdQueryResultSchema>;

export type ListCategoriesByParentIdQuery = (input: ListCategoriesByParentIdQueryInput) => Promise<AppResult<ListCategoriesByParentIdQueryResult>>;
