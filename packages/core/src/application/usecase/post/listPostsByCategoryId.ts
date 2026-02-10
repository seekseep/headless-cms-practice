import { Executor } from "@/application/executor";
import { ListPostsByCategoryIdQuery, ListPostsByCategoryIdQueryParametersSchema, ListPostsByCategoryIdQueryResult } from "@/application/service/query/post";
import { isSystemOrAdminExecution } from "@/application/util";
import { AppResult, failAsForbidden, failAsValidationError } from "@/domain";
import { z } from "zod";

const ListPostsByCategoryIdParametersSchema = ListPostsByCategoryIdQueryParametersSchema;
type ListPostsByCategoryIdInput = z.input<typeof ListPostsByCategoryIdParametersSchema>;
type ListPostsByCategoryIdParameters = z.infer<typeof ListPostsByCategoryIdParametersSchema>;

type MakeListPostsByCategoryIdDependencies = {
  listPostsByCategoryIdQuery: ListPostsByCategoryIdQuery;
}

type ListPostsByCategoryIdUseCase = (input: ListPostsByCategoryIdInput, executor: Executor) => Promise<AppResult<ListPostsByCategoryIdQueryResult>>;

export function makeListPostsByCategoryIdUseCase (dependencies: MakeListPostsByCategoryIdDependencies): ListPostsByCategoryIdUseCase {
  return async function listPostsByCategoryIdUseCase (input, executor) {
    if (!isSystemOrAdminExecution(executor)) return failAsForbidden();

    const validation = ListPostsByCategoryIdParametersSchema.safeParse(input);
    if (!validation.success) return failAsValidationError(validation.error);

    const parameters: ListPostsByCategoryIdParameters = validation.data;
    return dependencies.listPostsByCategoryIdQuery(parameters);
  }
}
