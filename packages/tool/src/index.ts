import "dotenv/config";
import { Command } from "commander";

const program = new Command();

program
  .name("tool")
  .description("CLI tool for operating AWS resources")
  .requiredOption("--profile <profile>", "AWS profile name")
  .option("--region <region>", "AWS region")
  .hook("preAction", (thisCommand) => {
    const { profile } = thisCommand.opts();
    process.env.AWS_PROFILE = profile;
  });

program
  .command("verify-auth")
  .description("Verify AWS authentication status for the given profile")
  .action(async () => {
    const { profile, region } = program.opts();
    const { verifyAuth } = await import("@/cli");
    await verifyAuth({ profile, region });
  });

program
  .command("set-role")
  .description("Set a user's role (admin / general) interactively")
  .action(async () => {
    const { profile, region } = program.opts();
    const { setRole } = await import("@/cli");
    await setRole({ profile, region });
  });

program.parse();
