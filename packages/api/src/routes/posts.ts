import { Hono } from "hono";
import { createUserExecutor } from "@headless-cms-practice/core";
import { authMiddleware, type AuthEnv } from "@/middleware/auth";
import { handleResult } from "@/util/handleResult";
import {
  createPostUseCase,
  getPostUseCase,
  listPostsUseCase,
  updatePostUseCase,
  deletePostUseCase,
} from "@/application/usecase";

const app = new Hono<AuthEnv>();

app.use("*", authMiddleware);

app.get("/", async (c) => {
  const executor = createUserExecutor(c.get("user"));
  const nextToken = c.req.query("nextToken") ?? null;
  const result = await listPostsUseCase({ nextToken }, executor);
  return handleResult(c, result);
});

app.get("/:id", async (c) => {
  const executor = createUserExecutor(c.get("user"));
  const result = await getPostUseCase({ id: c.req.param("id") }, executor);
  return handleResult(c, result);
});

app.post("/", async (c) => {
  const executor = createUserExecutor(c.get("user"));
  const body = await c.req.json();
  const result = await createPostUseCase(body, executor);
  return handleResult(c, result);
});

app.put("/:id", async (c) => {
  const executor = createUserExecutor(c.get("user"));
  const body = await c.req.json();
  const result = await updatePostUseCase({ id: c.req.param("id"), ...body }, executor);
  return handleResult(c, result);
});

app.delete("/:id", async (c) => {
  const executor = createUserExecutor(c.get("user"));
  const result = await deletePostUseCase({ id: c.req.param("id") }, executor);
  return handleResult(c, result);
});

export default app;