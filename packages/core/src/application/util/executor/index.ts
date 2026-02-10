import { Executor, UserExecutor } from "@/application/executor";
import { User } from "@/domain/value/user";

export function createUserExecutor (user: User | null): UserExecutor {
  if (!user) {
    return { type: 'user', user: { id: 'guest', role: 'guest' } };
  }
  return { type: 'user', user };
}

export function isSystemExecution (executor: Executor): boolean {
  return executor.type === 'system';
}

export function isSystemOrAdminExecution (executor: Executor): boolean {
  if (executor.type === 'system') return true;
  if (executor.user.role === 'admin') return true;
  return false;
}
