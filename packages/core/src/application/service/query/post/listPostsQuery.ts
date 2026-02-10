import { PostSchema } from "@/domain/entity";
import { AppResult } from "@/domain/util/appResult";
import { createListItemsResultSchema } from "@/domain/util/createListItemsResultSchema";
import { ListItemsQueryParametersSchema } from "@/domain/value";
import { z } from "zod";

export const ListPostsQueryParametersSchema = ListItemsQueryParametersSchema;

export const ListPostsQueryResultSchema = createListItemsResultSchema(PostSchema);

export type ListPostsQueryInput = z.input<typeof ListPostsQueryParametersSchema>;
export type ListPostsQueryParameters = z.infer<typeof ListPostsQueryParametersSchema>;
export type ListPostsQueryResult = z.infer<typeof ListPostsQueryResultSchema>;

export type ListPostsQuery = (input: ListPostsQueryInput) => Promise<AppResult<ListPostsQueryResult>>;
