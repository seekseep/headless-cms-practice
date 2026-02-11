import { GetUserByCredentialQuery, succeed, createLogger } from "@headless-cms-practice/core";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { UserPoolConfiguration } from "@/configuration";

const logger = createLogger("getUserByCredentialQuery");

export function makeGetUserByCredentialQuery (userPoolConfiguration: UserPoolConfiguration): GetUserByCredentialQuery {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: userPoolConfiguration.userPoolId,
    tokenUse: "id",
    clientId: userPoolConfiguration.clientId,
  });

  logger.debug("Initialized", { region: userPoolConfiguration.region, userPoolId: userPoolConfiguration.userPoolId });

  return async function getUserByCredentialQuery (input) {
    logger.debug("Called with credential", { credential: input.credential });

    try {
      const payload = await verifier.verify(input.credential);

      logger.debug("JWT verified", { sub: payload.sub, groups: payload["cognito:groups"] });

      const sub = payload.sub;
      if (!sub) {
        logger.warn("sub claim not found in token");
        return succeed(null);
      }

      const groups = (payload["cognito:groups"] as string[] | undefined) ?? [];
      const role = groups.includes("admin") ? "admin" as const
        : groups.includes("general") ? "general" as const
        : "guest" as const;

      logger.info("User found", { id: sub, role });

      return succeed({ id: sub, role });
    } catch (error) {
      logger.error("JWT verification failed", { error: error instanceof Error ? { name: error.name, message: error.message } : error });
      return succeed(null);
    }
  }
}
