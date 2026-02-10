import { ListUsersQuery, succeed, failAsInternalError } from "@headless-cms-practice/core";
import {
  ListUsersCommand,
  AdminListGroupsForUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { UserPoolConfiguration } from "@/configuration";
import { createCognitoClient } from "@/util/cognito";

export function makeListUsersQuery(userPoolConfiguration: UserPoolConfiguration): ListUsersQuery {
  const cognitoClient = createCognitoClient(userPoolConfiguration);

  return async function listUsersQuery() {
    try {
      const result = await cognitoClient.send(new ListUsersCommand({
        UserPoolId: userPoolConfiguration.userPoolId,
      }));

      const users = await Promise.all(
        (result.Users ?? []).map(async (cognitoUser) => {
          const username = cognitoUser.Username!;
          const email = cognitoUser.Attributes?.find(attr => attr.Name === "email")?.Value ?? null;

          const groupsResult = await cognitoClient.send(new AdminListGroupsForUserCommand({
            UserPoolId: userPoolConfiguration.userPoolId,
            Username: username,
          }));

          const groupNames = (groupsResult.Groups ?? []).map(g => g.GroupName);
          let role: "admin" | "general" | "guest" = "guest";
          if (groupNames.includes("admin")) {
            role = "admin";
          } else if (groupNames.includes("general")) {
            role = "general";
          }

          return { username, email, role };
        })
      );

      return succeed(users);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return failAsInternalError(`Failed to list users: ${message}`);
    }
  }
}
