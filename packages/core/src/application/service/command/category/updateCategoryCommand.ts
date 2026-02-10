import { Category, CategoryKeySchema, CategorySchema, CategoryValuesSchema } from "@/domain/entity/category";
import { AppResult } from "@/domain/util/appResult";
import { z } from "zod";

export const UpdateCategoryCommandParametersSchema = CategoryKeySchema
  .extend(CategoryValuesSchema.partial().shape)

export type UpdateCategoryCommandInput = z.input<typeof UpdateCategoryCommandParametersSchema>;
export type UpdateCategoryCommandParameters = z.infer<typeof UpdateCategoryCommandParametersSchema>;

export type UpdateCategoryCommand = (input: UpdateCategoryCommandInput) => Promise<AppResult<Category>>;
