import { Executor } from "@/application/executor";
import { UpdatePostCommand, UpdatePostCommandParametersSchema } from "@/application/service/command";
import { FindPostByIdQuery } from "@/application/service/query/post";
import { isSystemOrAdminExecution } from "@/application/util";
import { AppResult, Post, failAsForbidden, failAsNotFound, failAsValidationError } from "@/domain";
import { z } from "zod";

const UpdatePostParametersSchema = UpdatePostCommandParametersSchema;
type UpdatePostInput = z.input<typeof UpdatePostParametersSchema>;
type UpdatePostParameters = z.infer<typeof UpdatePostParametersSchema>;

type MakeUpdatePostDependencies = {
  findPostByIdQuery: FindPostByIdQuery;
  updatePostCommand: UpdatePostCommand;
}

type UpdatePostUseCase = (input: UpdatePostInput, executor: Executor) => Promise<AppResult<Post>>;

export function makeUpdatePostUseCase (dependencies: MakeUpdatePostDependencies): UpdatePostUseCase {
  return async function updatePostUseCase (input, executor) {
    if (!isSystemOrAdminExecution(executor)) return failAsForbidden();

    const validation = UpdatePostParametersSchema.safeParse(input);
    if (!validation.success) return failAsValidationError(validation.error);

    const parameters: UpdatePostParameters = validation.data;

    const existing = await dependencies.findPostByIdQuery({ id: parameters.id });
    if (!existing.success) return failAsNotFound();
    if (existing.data === null) return failAsNotFound();

    return dependencies.updatePostCommand(parameters);
  }
}
