import { AwsCredentialIdentityProvider } from "@aws-sdk/types";
import { z } from "zod";

export const UserPoolConfigurationSchema = z.object({
  userPoolId: z.string(),
  region: z.string(),
});

export type UserPoolConfiguration = z.infer<typeof UserPoolConfigurationSchema> & {
  credentials?: AwsCredentialIdentityProvider;
};
