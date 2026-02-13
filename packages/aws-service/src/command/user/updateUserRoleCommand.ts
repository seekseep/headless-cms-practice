import { UpdateUserRoleCommand, succeed, failAsInternalError } from "@headless-cms-practice/core";
import { AdminAddUserToGroupCommand, AdminRemoveUserFromGroupCommand, AdminListGroupsForUserCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { UserPoolConfiguration } from "@/configuration";

export function makeUpdateUserRoleCommand (userPoolConfiguration: UserPoolConfiguration): UpdateUserRoleCommand {
  const client = new CognitoIdentityProviderClient({ region: userPoolConfiguration.region });
  const { userPoolId } = userPoolConfiguration;

  return async function updateUserRoleCommand (input) {
    try {
      // Remove from all existing groups
      const { Groups } = await client.send(new AdminListGroupsForUserCommand({
        UserPoolId: userPoolId,
        Username: input.username,
      }));

      for (const group of Groups ?? []) {
        if (group.GroupName) {
          await client.send(new AdminRemoveUserFromGroupCommand({
            UserPoolId: userPoolId,
            Username: input.username,
            GroupName: group.GroupName,
          }));
        }
      }

      // Add to new group
      if (input.role !== 'guest') {
        await client.send(new AdminAddUserToGroupCommand({
          UserPoolId: userPoolId,
          Username: input.username,
          GroupName: input.role,
        }));
      }

      return succeed(undefined as void);
    } catch {
      return failAsInternalError("Failed to update user role");
    }
  }
}
