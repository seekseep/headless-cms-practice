import { UserSchema } from "@/domain/value/user";
import { z } from "zod";

export const UserExecutorSchema = z.object({
  type: z.literal('user'),
  user: UserSchema,
});

export const SystemExecutorSchema = z.object({
  type: z.literal('system'),
  name: z.string(),
})

export const ExecutorSchema = z.discriminatedUnion('type', [
  UserExecutorSchema,
  SystemExecutorSchema,
]);

export type UserExecutor = z.infer<typeof UserExecutorSchema>;
export type SystemExecutor = z.infer<typeof SystemExecutorSchema>;
export type Executor = z.infer<typeof ExecutorSchema>;
