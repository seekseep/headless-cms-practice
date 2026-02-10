import { createMiddleware } from "hono/factory";
import type { User } from "core";
import { getUserByCredentialQuery } from "@/application/service/query";

export type AuthEnv = {
  Variables: {
    user: User | null;
  };
};

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const authorization = c.req.header("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    c.set("user", null);
    return next();
  }

  const credential = authorization.slice(7);
  const result = await getUserByCredentialQuery({ credential });
  c.set("user", result.success ? result.data : null);

  return next();
});
