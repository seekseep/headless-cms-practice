import { Executor } from "@/application/executor";
import { DeletePostCommand, DeletePostCommandParametersSchema } from "@/application/service/command";
import { FindPostByIdQuery } from "@/application/service/query/post";
import { isSystemOrAdminExecution } from "@/application/util";
import { AppResult, failAsForbidden, failAsNotFound, failAsValidationError } from "@/domain";
import { z } from "zod";

const DeletePostParametersSchema = DeletePostCommandParametersSchema;
type DeletePostInput = z.input<typeof DeletePostParametersSchema>;
type DeletePostParameters = z.infer<typeof DeletePostParametersSchema>;

type MakeDeletePostDependencies = {
  findPostByIdQuery: FindPostByIdQuery;
  deletePostCommand: DeletePostCommand;
}

type DeletePostUseCase = (input: DeletePostInput, executor: Executor) => Promise<AppResult<void>>;

export function makeDeletePostUseCase (dependencies: MakeDeletePostDependencies): DeletePostUseCase {
  return async function deletePostUseCase (input, executor) {
    if (!isSystemOrAdminExecution(executor)) return failAsForbidden();

    const validation = DeletePostParametersSchema.safeParse(input);
    if (!validation.success) return failAsValidationError(validation.error);

    const parameters: DeletePostParameters = validation.data;

    const existing = await dependencies.findPostByIdQuery({ id: parameters.id });
    if (!existing.success) return failAsNotFound();
    if (existing.data === null) return failAsNotFound();

    return dependencies.deletePostCommand(parameters);
  }
}
