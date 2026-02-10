import { Executor } from "@/application/executor";
import { CreatePostCommand, CreatePostCommandParametersSchema } from "@/application/service/command";
import { isSystemOrAdminExecution } from "@/application/util";
import { AppResult, Post, failAsForbidden, failAsValidationError } from "@/domain";
import { z } from "zod";

const CreatePostParametersSchema = CreatePostCommandParametersSchema;
type CreatePostInput = z.input<typeof CreatePostParametersSchema>;
type CreatePostParameters = z.infer<typeof CreatePostParametersSchema>;

type MakeCreatePostDependencies = {
  createPostCommand: CreatePostCommand;
}

type CreatePostUseCase = (input: CreatePostInput, executor: Executor) => Promise<AppResult<Post>>;

export function makeCreatePostUseCase (dependencies: MakeCreatePostDependencies): CreatePostUseCase {
  return async function createPostUseCase (input, executor) {
    if (!isSystemOrAdminExecution(executor)) return failAsForbidden();

    const validation = CreatePostParametersSchema.safeParse(input);
    if (!validation.success) return failAsValidationError(validation.error);

    const parameters: CreatePostParameters = validation.data;
    return dependencies.createPostCommand(parameters);
  }
}
