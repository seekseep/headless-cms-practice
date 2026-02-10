import { z } from 'zod';

export const UserRoleTypeSchema = z.enum(['admin', 'general', 'guest']);

export type UserRoleType = z.infer<typeof UserRoleTypeSchema>;

export const UserSchema = z.object({
  id: z.string(),
  role: UserRoleTypeSchema,
});

export type User = z.infer<typeof UserSchema>;
