import { UpdateUserRoleCommand, UserRoleType } from "core";

type MakeUpdateUserRoleDependencies = {
  updateUserRoleCommand: UpdateUserRoleCommand;
};

type UpdateUserRoleUseCase = (username: string, role: UserRoleType) => Promise<void>;

export function makeUpdateUserRoleUseCase(dependencies: MakeUpdateUserRoleDependencies): UpdateUserRoleUseCase {
  const { updateUserRoleCommand } = dependencies;

  return async function updateUserRoleUseCase(username, role) {
    const result = await updateUserRoleCommand({ username, role });
    if (!result.success) {
      throw new Error(result.error.message);
    }
  };
}
