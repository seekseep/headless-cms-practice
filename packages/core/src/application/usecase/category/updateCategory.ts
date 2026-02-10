import { Executor } from "@/application/executor";
import { UpdateCategoryCommand, UpdateCategoryCommandParametersSchema } from "@/application/service/command";
import { FindCategoryByIdQuery } from "@/application/service/query/category";
import { isSystemOrAdminExecution } from "@/application/util";
import { AppResult, Category, failAsForbidden, failAsNotFound, failAsValidationError } from "@/domain";
import { z } from "zod";

const UpdateCategoryParametersSchema = UpdateCategoryCommandParametersSchema;
type UpdateCategoryInput = z.input<typeof UpdateCategoryParametersSchema>;
type UpdateCategoryParameters = z.infer<typeof UpdateCategoryParametersSchema>;

type MakeUpdateCategoryDependencies = {
  findCategoryByIdQuery: FindCategoryByIdQuery;
  updateCategoryCommand: UpdateCategoryCommand;
}

type UpdateCategoryUseCase = (input: UpdateCategoryInput, executor: Executor) => Promise<AppResult<Category>>;

export function makeUpdateCategoryUseCase (dependencies: MakeUpdateCategoryDependencies): UpdateCategoryUseCase {
  return async function updateCategoryUseCase (input, executor) {
    if (!isSystemOrAdminExecution(executor)) return failAsForbidden();

    const validation = UpdateCategoryParametersSchema.safeParse(input);
    if (!validation.success) return failAsValidationError(validation.error);

    const parameters: UpdateCategoryParameters = validation.data;

    const existing = await dependencies.findCategoryByIdQuery({ id: parameters.id });
    if (!existing.success) return failAsNotFound();
    if (existing.data === null) return failAsNotFound();

    return dependencies.updateCategoryCommand(parameters);
  }
}
