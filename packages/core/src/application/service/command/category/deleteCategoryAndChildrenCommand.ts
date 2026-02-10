import { CategoryKeySchema, CategorySchema, CategoryValuesSchema } from "@/domain/entity/category";
import { AppResult } from "@/domain/util/appResult";
import { z } from "zod";

export const DeleteCategoryAndChildrenCommandParametersSchema = CategoryKeySchema

export type DeleteCategoryAndChildrenCommandInput = z.input<typeof DeleteCategoryAndChildrenCommandParametersSchema>;
export type DeleteCategoryAndChildrenCommandParameters = z.infer<typeof DeleteCategoryAndChildrenCommandParametersSchema>;

export type DeleteCategoryAndChildrenCommand = (input: DeleteCategoryAndChildrenCommandInput) => Promise<AppResult<void>>;
