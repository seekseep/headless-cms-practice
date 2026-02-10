import { Executor } from "@/application/executor";
import { ListAllCategoriesQuery, ListAllCategoriesQueryParametersSchema, ListAllCategoriesQueryResult } from "@/application/service/query/category";
import { isSystemOrAdminExecution } from "@/application/util";
import { AppResult, failAsForbidden, failAsValidationError } from "@/domain";
import { z } from "zod";

const ListCategoriesParametersSchema = ListAllCategoriesQueryParametersSchema;
type ListCategoriesInput = z.input<typeof ListCategoriesParametersSchema>;
type ListCategoriesParameters = z.infer<typeof ListCategoriesParametersSchema>;

type MakeListCategoriesDependencies = {
  listAllCategoriesQuery: ListAllCategoriesQuery;
}

type ListCategoriesUseCase = (input: ListCategoriesInput, executor: Executor) => Promise<AppResult<ListAllCategoriesQueryResult>>;

export function makeListCategoriesUseCase (dependencies: MakeListCategoriesDependencies): ListCategoriesUseCase {
  return async function listCategoriesUseCase (input, executor) {
    if (!isSystemOrAdminExecution(executor)) return failAsForbidden();

    const validation = ListCategoriesParametersSchema.safeParse(input);
    if (!validation.success) return failAsValidationError(validation.error);

    const parameters: ListCategoriesParameters = validation.data;
    return dependencies.listAllCategoriesQuery(parameters);
  }
}
