import { Executor } from "@/application/executor";
import { ListCategoriesByParentIdQuery, ListCategoriesByParentIdQueryParametersSchema, ListCategoriesByParentIdQueryResult } from "@/application/service/query/category";
import { isSystemOrAdminExecution } from "@/application/util";
import { AppResult, failAsForbidden, failAsValidationError } from "@/domain";
import { z } from "zod";

const ListCategoriesByParentIdParametersSchema = ListCategoriesByParentIdQueryParametersSchema;
type ListCategoriesByParentIdInput = z.input<typeof ListCategoriesByParentIdParametersSchema>;
type ListCategoriesByParentIdParameters = z.infer<typeof ListCategoriesByParentIdParametersSchema>;

type MakeListCategoriesByParentIdDependencies = {
  listCategoriesByParentIdQuery: ListCategoriesByParentIdQuery;
}

type ListCategoriesByParentIdUseCase = (input: ListCategoriesByParentIdInput, executor: Executor) => Promise<AppResult<ListCategoriesByParentIdQueryResult>>;

export function makeListCategoriesByParentIdUseCase (dependencies: MakeListCategoriesByParentIdDependencies): ListCategoriesByParentIdUseCase {
  return async function listCategoriesByParentIdUseCase (input, executor) {
    if (!isSystemOrAdminExecution(executor)) return failAsForbidden();

    const validation = ListCategoriesByParentIdParametersSchema.safeParse(input);
    if (!validation.success) return failAsValidationError(validation.error);

    const parameters: ListCategoriesByParentIdParameters = validation.data;
    return dependencies.listCategoriesByParentIdQuery(parameters);
  }
}
