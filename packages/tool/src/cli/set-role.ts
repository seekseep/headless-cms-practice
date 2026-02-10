import { select } from "@inquirer/prompts";
import { listUsersUseCase, updateUserRoleUseCase } from "@/application/usecase";

interface SetRoleOptions {
  profile: string;
  region?: string;
}

export async function setRole(_options: SetRoleOptions): Promise<void> {
  console.log("Fetching users...");

  const users = await listUsersUseCase();

  if (users.length === 0) {
    console.log("No users found.");
    return;
  }

  const selectedUsername = await select({
    message: "Select a user:",
    choices: users.map((user) => ({
      name: `${user.email ?? user.username} (${user.role})`,
      value: user.username,
    })),
  });

  const selectedUser = users.find((u) => u.username === selectedUsername)!;
  console.log(`Current role: ${selectedUser.role}`);

  const newRole = await select({
    message: "Select new role:",
    choices: [
      { name: "admin", value: "admin" as const },
      { name: "general", value: "general" as const },
    ],
  });

  if (newRole === selectedUser.role) {
    console.log(`Already ${newRole}. No changes made.`);
    return;
  }

  await updateUserRoleUseCase(selectedUsername, newRole);
  console.log(`Updated ${selectedUser.email ?? selectedUsername}: ${selectedUser.role} -> ${newRole}`);
}
