import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  createCategoryUseCase,
  getCategoryUseCase,
  listCategoriesUseCase,
  updateCategoryUseCase,
  deleteCategoryAndChildrenUseCase,
  listCategoriesByParentIdUseCase,
  systemExecutor,
} from "../application/usecase";

export function registerCategoryTools(server: McpServer) {
  server.tool(
    "create_category",
    "カテゴリを作成する",
    {
      name: z.string().min(1).max(100).describe("カテゴリ名"),
      slug: z.string().min(1).max(255).describe("スラッグ"),
      parentId: z.string().nullable().default(null).describe("親カテゴリID（ルートの場合はnull）"),
      order: z.number().int().nonnegative().default(0).describe("表示順"),
      description: z.string().max(500).optional().describe("説明"),
      thumbnail: z.string().nullable().default(null).describe("サムネイルURL"),
    },
    async (input) => {
      const result = await createCategoryUseCase(input, systemExecutor);
      if (!result.success) {
        return { content: [{ type: "text" as const, text: `Error: ${result.error.message}` }], isError: true };
      }
      return { content: [{ type: "text" as const, text: JSON.stringify(result.data, null, 2) }] };
    }
  );

  server.tool(
    "get_category",
    "カテゴリをIDで取得する",
    {
      id: z.string().describe("カテゴリID"),
    },
    async (input) => {
      const result = await getCategoryUseCase(input, systemExecutor);
      if (!result.success) {
        return { content: [{ type: "text" as const, text: `Error: ${result.error.message}` }], isError: true };
      }
      return { content: [{ type: "text" as const, text: JSON.stringify(result.data, null, 2) }] };
    }
  );

  server.tool(
    "list_categories",
    "カテゴリ一覧を取得する",
    {
      nextToken: z.string().nullable().default(null).describe("ページネーショントークン"),
    },
    async (input) => {
      const result = await listCategoriesUseCase(input, systemExecutor);
      if (!result.success) {
        return { content: [{ type: "text" as const, text: `Error: ${result.error.message}` }], isError: true };
      }
      return { content: [{ type: "text" as const, text: JSON.stringify(result.data, null, 2) }] };
    }
  );

  server.tool(
    "update_category",
    "カテゴリを更新する",
    {
      id: z.string().describe("カテゴリID"),
      name: z.string().min(1).max(100).optional().describe("カテゴリ名"),
      slug: z.string().min(1).max(255).optional().describe("スラッグ"),
      parentId: z.string().nullable().optional().describe("親カテゴリID"),
      order: z.number().int().nonnegative().optional().describe("表示順"),
      description: z.string().max(500).optional().describe("説明"),
      thumbnail: z.string().nullable().optional().describe("サムネイルURL"),
    },
    async (input) => {
      const result = await updateCategoryUseCase(input, systemExecutor);
      if (!result.success) {
        return { content: [{ type: "text" as const, text: `Error: ${result.error.message}` }], isError: true };
      }
      return { content: [{ type: "text" as const, text: JSON.stringify(result.data, null, 2) }] };
    }
  );

  server.tool(
    "delete_category",
    "カテゴリと子カテゴリを削除する",
    {
      id: z.string().describe("カテゴリID"),
    },
    async (input) => {
      const result = await deleteCategoryAndChildrenUseCase(input, systemExecutor);
      if (!result.success) {
        return { content: [{ type: "text" as const, text: `Error: ${result.error.message}` }], isError: true };
      }
      return { content: [{ type: "text" as const, text: "カテゴリを削除しました" }] };
    }
  );

  server.tool(
    "list_categories_by_parent",
    "親カテゴリの子カテゴリ一覧を取得する",
    {
      parentId: z.string().nullable().default(null).describe("親カテゴリID（ルートの場合はnull）"),
      nextToken: z.string().nullable().default(null).describe("ページネーショントークン"),
    },
    async (input) => {
      const result = await listCategoriesByParentIdUseCase(input, systemExecutor);
      if (!result.success) {
        return { content: [{ type: "text" as const, text: `Error: ${result.error.message}` }], isError: true };
      }
      return { content: [{ type: "text" as const, text: JSON.stringify(result.data, null, 2) }] };
    }
  );
}
