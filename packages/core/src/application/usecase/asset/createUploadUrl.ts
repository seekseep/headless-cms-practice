import { Executor } from "@/application/executor";
import { CreateUploadUrlCommand, CreateUploadUrlCommandParametersSchema } from "@/application/service/command";
import { isSystemOrAdminExecution } from "@/application/util";
import { AppResult, failAsForbidden, failAsValidationError } from "@/domain";
import { UploadUrl } from "@/domain/value/asset";
import { z } from "zod";

const CreateUploadUrlParametersSchema = CreateUploadUrlCommandParametersSchema;
type CreateUploadUrlInput = z.input<typeof CreateUploadUrlParametersSchema>;
type CreateUploadUrlParameters = z.infer<typeof CreateUploadUrlParametersSchema>;

type MakeCreateUploadUrlDependencies = {
  createUploadUrlCommand: CreateUploadUrlCommand;
}

type CreateUploadUrlUseCase = (input: CreateUploadUrlInput, executor: Executor) => Promise<AppResult<UploadUrl>>;

export function makeCreateUploadUrlUseCase (dependencies: MakeCreateUploadUrlDependencies): CreateUploadUrlUseCase {
  return async function createUploadUrlUseCase (input, executor) {
    if (!isSystemOrAdminExecution(executor)) return failAsForbidden();

    const validation = CreateUploadUrlParametersSchema.safeParse(input);
    if (!validation.success) return failAsValidationError(validation.error);

    const parameters: CreateUploadUrlParameters = validation.data;
    return dependencies.createUploadUrlCommand(parameters);
  }
}
