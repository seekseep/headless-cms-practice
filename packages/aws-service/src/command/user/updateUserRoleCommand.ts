import { UpdateUserRoleCommand, succeed, failAsInternalError } from "core";
import {
  AdminListGroupsForUserCommand,
  AdminAddUserToGroupCommand,
  AdminRemoveUserFromGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { UserPoolConfiguration } from "@/configuration";
import { createCognitoClient } from "@/util/cognito";

const ROLE_GROUPS = ["admin", "general"] as const;

export function makeUpdateUserRoleCommand(userPoolConfiguration: UserPoolConfiguration): UpdateUserRoleCommand {
  const cognitoClient = createCognitoClient(userPoolConfiguration);

  return async function updateUserRoleCommand(input) {
    const { username, role } = input;

    try {
      const groupsResult = await cognitoClient.send(new AdminListGroupsForUserCommand({
        UserPoolId: userPoolConfiguration.userPoolId,
        Username: username,
      }));

      const currentGroups = (groupsResult.Groups ?? []).map(g => g.GroupName);

      for (const group of ROLE_GROUPS) {
        if (currentGroups.includes(group)) {
          await cognitoClient.send(new AdminRemoveUserFromGroupCommand({
            UserPoolId: userPoolConfiguration.userPoolId,
            Username: username,
            GroupName: group,
          }));
        }
      }

      await cognitoClient.send(new AdminAddUserToGroupCommand({
        UserPoolId: userPoolConfiguration.userPoolId,
        Username: username,
        GroupName: role,
      }));

      return succeed(undefined);
    } catch {
      return failAsInternalError("Failed to update user role");
    }
  }
}
