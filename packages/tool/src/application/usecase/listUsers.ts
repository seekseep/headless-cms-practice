import { ListUsersQuery, ListUsersQueryResultItem } from "@headless-cms-practice/core";

type MakeListUsersDependencies = {
  listUsersQuery: ListUsersQuery;
};

type ListUsersUseCase = () => Promise<ListUsersQueryResultItem[]>;

export function makeListUsersUseCase(dependencies: MakeListUsersDependencies): ListUsersUseCase {
  const { listUsersQuery } = dependencies;

  return async function listUsersUseCase() {
    const result = await listUsersQuery();
    if (!result.success) {
      throw new Error(result.error.message);
    }
    return result.data;
  };
}
