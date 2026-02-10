import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  createPostUseCase,
  getPostUseCase,
  listPostsUseCase,
  updatePostUseCase,
  deletePostUseCase,
  listPostsByCategoryIdUseCase,
  systemExecutor,
} from "../application/usecase";

export function registerPostTools(server: McpServer) {
  server.tool(
    "create_post",
    "記事を作成する",
    {
      title: z.string().min(1).max(100).describe("記事タイトル"),
      slug: z.string().min(1).max(100).describe("スラッグ"),
      content: z.string().max(500).optional().describe("記事本文"),
      thumbnail: z.string().optional().describe("サムネイルURL"),
      categoryId: z.string().describe("カテゴリID"),
    },
    async (input) => {
      const now = new Date();
      const result = await createPostUseCase(
        { ...input, createdAt: now, updatedAt: now },
        systemExecutor
      );
      if (!result.success) {
        return { content: [{ type: "text" as const, text: `Error: ${result.error.message}` }], isError: true };
      }
      return { content: [{ type: "text" as const, text: JSON.stringify(result.data, null, 2) }] };
    }
  );

  server.tool(
    "get_post",
    "記事をIDで取得する",
    {
      id: z.string().describe("記事ID"),
    },
    async (input) => {
      const result = await getPostUseCase(input, systemExecutor);
      if (!result.success) {
        return { content: [{ type: "text" as const, text: `Error: ${result.error.message}` }], isError: true };
      }
      return { content: [{ type: "text" as const, text: JSON.stringify(result.data, null, 2) }] };
    }
  );

  server.tool(
    "list_posts",
    "記事一覧を取得する",
    {
      nextToken: z.string().nullable().default(null).describe("ページネーショントークン"),
    },
    async (input) => {
      const result = await listPostsUseCase(input, systemExecutor);
      if (!result.success) {
        return { content: [{ type: "text" as const, text: `Error: ${result.error.message}` }], isError: true };
      }
      return { content: [{ type: "text" as const, text: JSON.stringify(result.data, null, 2) }] };
    }
  );

  server.tool(
    "update_post",
    "記事を更新する",
    {
      id: z.string().describe("記事ID"),
      title: z.string().min(1).max(100).optional().describe("記事タイトル"),
      slug: z.string().min(1).max(100).optional().describe("スラッグ"),
      content: z.string().max(500).optional().describe("記事本文"),
      thumbnail: z.string().optional().describe("サムネイルURL"),
      categoryId: z.string().optional().describe("カテゴリID"),
    },
    async (input) => {
      const result = await updatePostUseCase(
        { ...input, updatedAt: new Date() },
        systemExecutor
      );
      if (!result.success) {
        return { content: [{ type: "text" as const, text: `Error: ${result.error.message}` }], isError: true };
      }
      return { content: [{ type: "text" as const, text: JSON.stringify(result.data, null, 2) }] };
    }
  );

  server.tool(
    "delete_post",
    "記事を削除する",
    {
      id: z.string().describe("記事ID"),
    },
    async (input) => {
      const result = await deletePostUseCase(input, systemExecutor);
      if (!result.success) {
        return { content: [{ type: "text" as const, text: `Error: ${result.error.message}` }], isError: true };
      }
      return { content: [{ type: "text" as const, text: "記事を削除しました" }] };
    }
  );

  server.tool(
    "list_posts_by_category",
    "カテゴリの記事一覧を取得する",
    {
      categoryId: z.string().describe("カテゴリID"),
      nextToken: z.string().nullable().default(null).describe("ページネーショントークン"),
    },
    async (input) => {
      const result = await listPostsByCategoryIdUseCase(input, systemExecutor);
      if (!result.success) {
        return { content: [{ type: "text" as const, text: `Error: ${result.error.message}` }], isError: true };
      }
      return { content: [{ type: "text" as const, text: JSON.stringify(result.data, null, 2) }] };
    }
  );
}
