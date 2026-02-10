import { Executor } from "@/application/executor";
import { FindCategoryByIdQuery, FindCategoryByIdQueryParametersSchema } from "@/application/service/query/category";
import { isSystemOrAdminExecution } from "@/application/util";
import { AppResult, Category, failAsForbidden, failAsNotFound, failAsValidationError } from "@/domain";
import { succeed } from "@/util/result";
import { z } from "zod";

const GetCategoryParametersSchema = FindCategoryByIdQueryParametersSchema;
type GetCategoryInput = z.input<typeof GetCategoryParametersSchema>;
type GetCategoryParameters = z.infer<typeof GetCategoryParametersSchema>;

type MakeGetCategoryDependencies = {
  findCategoryByIdQuery: FindCategoryByIdQuery;
}

type GetCategoryUseCase = (input: GetCategoryInput, executor: Executor) => Promise<AppResult<Category>>;

export function makeGetCategoryUseCase (dependencies: MakeGetCategoryDependencies): GetCategoryUseCase {
  return async function getCategoryUseCase (input, executor) {
    if (!isSystemOrAdminExecution(executor)) return failAsForbidden();

    const validation = GetCategoryParametersSchema.safeParse(input);
    if (!validation.success) return failAsValidationError(validation.error);

    const parameters: GetCategoryParameters = validation.data;

    const result = await dependencies.findCategoryByIdQuery(parameters);
    if (!result.success) return result;
    if (result.data === null) return failAsNotFound();

    return succeed(result.data);
  }
}
