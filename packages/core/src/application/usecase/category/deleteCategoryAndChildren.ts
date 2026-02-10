import { Executor } from "@/application/executor";
import { DeleteCategoryAndChildrenCommand, DeleteCategoryAndChildrenCommandParametersSchema } from "@/application/service/command";
import { FindCategoryByIdQuery } from "@/application/service/query/category";
import { isSystemOrAdminExecution } from "@/application/util";
import { AppResult, failAsForbidden, failAsNotFound, failAsValidationError } from "@/domain";
import { z } from "zod";

const DeleteCategoryAndChildrenParametersSchema = DeleteCategoryAndChildrenCommandParametersSchema;
type DeleteCategoryAndChildrenInput = z.input<typeof DeleteCategoryAndChildrenParametersSchema>;
type DeleteCategoryAndChildrenParameters = z.infer<typeof DeleteCategoryAndChildrenParametersSchema>;

type MakeDeleteCategoryAndChildrenDependencies = {
  findCategoryByIdQuery: FindCategoryByIdQuery;
  deleteCategoryAndChildrenCommand: DeleteCategoryAndChildrenCommand;
}

type DeleteCategoryAndChildrenUseCase = (input: DeleteCategoryAndChildrenInput, executor: Executor) => Promise<AppResult<void>>;

export function makeDeleteCategoryAndChildrenUseCase (dependencies: MakeDeleteCategoryAndChildrenDependencies): DeleteCategoryAndChildrenUseCase {
  return async function deleteCategoryAndChildrenUseCase (input, executor) {
    if (!isSystemOrAdminExecution(executor)) return failAsForbidden();

    const validation = DeleteCategoryAndChildrenParametersSchema.safeParse(input);
    if (!validation.success) return failAsValidationError(validation.error);

    const parameters: DeleteCategoryAndChildrenParameters = validation.data;

    const existing = await dependencies.findCategoryByIdQuery({ id: parameters.id });
    if (!existing.success) return failAsNotFound();
    if (existing.data === null) return failAsNotFound();

    return dependencies.deleteCategoryAndChildrenCommand(parameters);
  }
}
