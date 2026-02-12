import { createMiddleware } from "hono/factory";
import { createLogger, type User } from "@headless-cms-practice/core";
import { getUserByCredentialQuery } from "@/application/service/query";

const logger = createLogger("auth-middleware");

export type AuthEnv = {
  Variables: {
    user: User | null;
  };
};

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  // API キー認証
  const apiKey = c.req.header("X-Api-Key");
  const configuredApiKey = process.env.API_KEY;
  if (apiKey && configuredApiKey && apiKey === configuredApiKey) {
    logger.info("Authenticated via API key");
    c.set("user", { id: "system", role: "admin" });
    return next();
  }

  const authorization = c.req.header("Authorization");
  logger.debug("Authorization header", { authorization: authorization ?? null });

  if (!authorization?.startsWith("Bearer ")) {
    logger.warn("Missing or invalid Authorization header");
    c.set("user", null);
    return next();
  }

  const credential = authorization.slice(7);
  logger.debug("Credential extracted", { credential });

  const result = await getUserByCredentialQuery({ credential });
  logger.debug("getUserByCredentialQuery result", { success: result.success, data: result.success ? result.data : null });

  if (!result.success) {
    logger.error("getUserByCredentialQuery failed", { error: result.error });
  } else if (!result.data) {
    logger.warn("User not found for credential");
  } else {
    logger.info("User authenticated", { userId: result.data.id });
  }

  c.set("user", result.success ? result.data : null);

  return next();
});
