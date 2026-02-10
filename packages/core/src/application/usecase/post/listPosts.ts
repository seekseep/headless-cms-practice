import { Executor } from "@/application/executor";
import { ListPostsQuery, ListPostsQueryParametersSchema, ListPostsQueryResult } from "@/application/service/query/post";
import { isSystemOrAdminExecution } from "@/application/util";
import { AppResult, failAsForbidden, failAsValidationError } from "@/domain";
import { z } from "zod";

const ListPostsParametersSchema = ListPostsQueryParametersSchema;
type ListPostsInput = z.input<typeof ListPostsParametersSchema>;
type ListPostsParameters = z.infer<typeof ListPostsParametersSchema>;

type MakeListPostsDependencies = {
  listPostsQuery: ListPostsQuery;
}

type ListPostsUseCase = (input: ListPostsInput, executor: Executor) => Promise<AppResult<ListPostsQueryResult>>;

export function makeListPostsUseCase (dependencies: MakeListPostsDependencies): ListPostsUseCase {
  return async function listPostsUseCase (input, executor) {
    if (!isSystemOrAdminExecution(executor)) return failAsForbidden();

    const validation = ListPostsParametersSchema.safeParse(input);
    if (!validation.success) return failAsValidationError(validation.error);

    const parameters: ListPostsParameters = validation.data;
    return dependencies.listPostsQuery(parameters);
  }
}
