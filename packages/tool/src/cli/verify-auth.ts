import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { fromIni } from "@aws-sdk/credential-providers";

interface VerifyAuthOptions {
  profile: string;
  region?: string;
}

export async function verifyAuth(options: VerifyAuthOptions): Promise<void> {
  const { profile, region } = options;

  const client = new STSClient({
    credentials: fromIni({ profile }),
    ...(region ? { region } : {}),
  });

  try {
    const result = await client.send(new GetCallerIdentityCommand({}));
    console.log("Authentication verified successfully!");
    console.log(`  Account: ${result.Account}`);
    console.log(`  UserId:  ${result.UserId}`);
    console.log(`  Arn:     ${result.Arn}`);
  } catch (error) {
    console.error(`Authentication failed for profile "${profile}".`);
    if (error instanceof Error) {
      console.error(`  Error: ${error.message}`);
    }
    process.exit(1);
  }
}
