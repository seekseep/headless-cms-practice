import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { UserPoolConfiguration } from "@/configuration";

export function createCognitoClient(config: UserPoolConfiguration): CognitoIdentityProviderClient {
  return new CognitoIdentityProviderClient({
    region: config.region,
    ...(config.credentials ? { credentials: config.credentials } : {}),
  });
}
