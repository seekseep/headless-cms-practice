import { GetUserByCredentialQuery, succeed, failAsInternalError } from "core";
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { UserPoolConfiguration } from "@/configuration";

export function makeGetUserByCredentialQuery (userPoolConfiguration: UserPoolConfiguration): GetUserByCredentialQuery {
  const cognitoClient = new CognitoIdentityProviderClient({
    region: userPoolConfiguration.region,
  });

  return async function getUserByCredentialQuery (input) {
    try {
      const result = await cognitoClient.send(new GetUserCommand({
        AccessToken: input.credential,
      }));

      const sub = result.UserAttributes?.find(attr => attr.Name === "sub")?.Value;
      const role = result.UserAttributes?.find(attr => attr.Name === "custom:role")?.Value;

      if (!sub) {
        return succeed(null);
      }

      return succeed({
        id: sub,
        role: (role as "admin" | "general" | "guest") ?? "guest",
      });
    } catch {
      return succeed(null);
    }
  }
}
