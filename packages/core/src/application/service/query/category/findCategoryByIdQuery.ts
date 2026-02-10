import { Category, CategoryKeySchema } from "@/domain/entity/category";
import { AppResult } from "@/domain/util/appResult";
import { z } from "zod";

export const FindCategoryByIdQueryParametersSchema = CategoryKeySchema;

export type FindCategoryByIdQueryInput = z.input<typeof FindCategoryByIdQueryParametersSchema>;
export type FindCategoryByIdQueryParameters = z.infer<typeof FindCategoryByIdQueryParametersSchema>;

export type FindCategoryByIdQuery = (input: FindCategoryByIdQueryInput) => Promise<AppResult<Category | null>>;
