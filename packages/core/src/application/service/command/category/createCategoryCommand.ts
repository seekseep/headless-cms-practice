import { Category, CategoryValuesSchema } from "@/domain";
import { AppResult } from "@/domain/util/appResult";
import { z } from "zod";

export const CreateCategoryCommandParametersSchema = CategoryValuesSchema;

export type CreateCategoryCommandInput = z.input<typeof CreateCategoryCommandParametersSchema>;
export type CreateCategoryCommandParameters = z.infer<typeof CreateCategoryCommandParametersSchema>;

export type CreateCategoryCommand = (input: CreateCategoryCommandInput) => Promise<AppResult<Category>>;
