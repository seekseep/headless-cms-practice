import { Executor } from "@/application/executor";
import { FindPostByIdQuery, FindPostByIdQueryParametersSchema } from "@/application/service/query/post";
import { isSystemOrAdminExecution } from "@/application/util";
import { AppResult, Post, failAsForbidden, failAsNotFound, failAsValidationError } from "@/domain";
import { succeed } from "@/util/result";
import { z } from "zod";

const GetPostParametersSchema = FindPostByIdQueryParametersSchema;
type GetPostInput = z.input<typeof GetPostParametersSchema>;
type GetPostParameters = z.infer<typeof GetPostParametersSchema>;

type MakeGetPostDependencies = {
  findPostByIdQuery: FindPostByIdQuery;
}

type GetPostUseCase = (input: GetPostInput, executor: Executor) => Promise<AppResult<Post>>;

export function makeGetPostUseCase (dependencies: MakeGetPostDependencies): GetPostUseCase {
  return async function getPostUseCase (input, executor) {
    if (!isSystemOrAdminExecution(executor)) return failAsForbidden();

    const validation = GetPostParametersSchema.safeParse(input);
    if (!validation.success) return failAsValidationError(validation.error);

    const parameters: GetPostParameters = validation.data;

    const result = await dependencies.findPostByIdQuery(parameters);
    if (!result.success) return result;
    if (result.data === null) return failAsNotFound();

    return succeed(result.data);
  }
}
