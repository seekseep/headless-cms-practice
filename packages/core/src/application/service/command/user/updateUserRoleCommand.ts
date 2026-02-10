import { UserRoleTypeSchema } from "@/domain/value/user";
import { AppResult } from "@/domain/util/appResult";
import { z } from "zod";

export const UpdateUserRoleCommandParametersSchema = z.object({
  username: z.string(),
  role: UserRoleTypeSchema,
});

export type UpdateUserRoleCommandInput = z.input<typeof UpdateUserRoleCommandParametersSchema>;
export type UpdateUserRoleCommandParameters = z.infer<typeof UpdateUserRoleCommandParametersSchema>;

export type UpdateUserRoleCommand = (input: UpdateUserRoleCommandInput) => Promise<AppResult<void>>;
