import { makeUpdateUserRoleCommand } from "aws-service";
import { fromIni } from "@aws-sdk/credential-providers";

const userPoolConfig = {
  userPoolId: process.env.USER_POOL_ID!,
  region: process.env.AWS_REGION!,
  credentials: fromIni({ profile: process.env.AWS_PROFILE! }),
};

export const updateUserRoleCommand = makeUpdateUserRoleCommand(userPoolConfig);
