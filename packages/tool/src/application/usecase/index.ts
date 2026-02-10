import { listUsersQuery } from "@/application/service/query";
import { updateUserRoleCommand } from "@/application/service/command";
import { makeListUsersUseCase } from "./listUsers";
import { makeUpdateUserRoleUseCase } from "./updateUserRole";

export const listUsersUseCase = makeListUsersUseCase({ listUsersQuery });
export const updateUserRoleUseCase = makeUpdateUserRoleUseCase({ updateUserRoleCommand });
