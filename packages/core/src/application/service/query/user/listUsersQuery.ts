import { UserRoleTypeSchema } from "@/domain/value/user";
import { AppResult } from "@/domain/util/appResult";
import { z } from "zod";

export const ListUsersQueryResultItemSchema = z.object({
  username: z.string(),
  email: z.string().nullable(),
  role: UserRoleTypeSchema,
});

export type ListUsersQueryResultItem = z.infer<typeof ListUsersQueryResultItemSchema>;

export type ListUsersQuery = () => Promise<AppResult<ListUsersQueryResultItem[]>>;
