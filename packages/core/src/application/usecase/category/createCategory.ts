import { Executor } from "@/application/executor";
import { CreateCategoryCommand, CreateCategoryCommandParametersSchema } from "@/application/service/command";
import { isSystemOrAdminExecution } from "@/application/util";
import { AppResult, Category, failAsForbidden, failAsValidationError } from "@/domain";
import { z } from "zod";

const CreateCategoryParametersSchema = CreateCategoryCommandParametersSchema;
type CreateCategoryInput = z.input<typeof CreateCategoryParametersSchema>;
type CreateCategoryParameters = z.infer<typeof CreateCategoryParametersSchema>;

type MakeCreateCategoryDependencies = {
  createCategoryCommand: CreateCategoryCommand;
}

type CreateCategoryUseCase = (input: CreateCategoryInput, executor: Executor) => Promise<AppResult<Category>>;

export function makeCreateCategoryUseCase (dependencies: MakeCreateCategoryDependencies): CreateCategoryUseCase {
  return async function createCategoryUseCase (input, executor) {
    if (!isSystemOrAdminExecution(executor)) return failAsForbidden();

    const validation = CreateCategoryParametersSchema.safeParse(input);
    if (!validation.success) return failAsValidationError(validation.error);

    const parameters: CreateCategoryParameters = validation.data;
    return dependencies.createCategoryCommand(parameters);
  }
}
