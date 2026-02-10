import { CategorySchema } from "@/domain/entity/category";
import { AppResult } from "@/domain/util/appResult";
import { createListItemsResultSchema } from "@/domain/util/createListItemsResultSchema";
import { ListItemsQueryParametersSchema } from "@/domain/value";
import { z } from "zod";

export const ListAllCategoriesQueryParametersSchema = ListItemsQueryParametersSchema;

export const ListAllCategoriesQueryResultSchema = createListItemsResultSchema(CategorySchema);

export type ListAllCategoriesQueryInput = z.input<typeof ListAllCategoriesQueryParametersSchema>;
export type ListAllCategoriesQueryParameters = z.infer<typeof ListAllCategoriesQueryParametersSchema>;
export type ListAllCategoriesQueryResult = z.infer<typeof ListAllCategoriesQueryResultSchema>;

export type ListAllCategoriesQuery = (input: ListAllCategoriesQueryInput) => Promise<AppResult<ListAllCategoriesQueryResult>>;
