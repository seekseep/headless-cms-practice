import { Hono } from "hono";
import { createUserExecutor } from "@headless-cms-practice/core";
import { authMiddleware, type AuthEnv } from "@/middleware/auth";
import { handleResult } from "@/util/handleResult";
import {
  createCategoryUseCase,
  getCategoryUseCase,
  listCategoriesUseCase,
  listCategoriesByParentIdUseCase,
  updateCategoryUseCase,
  deleteCategoryAndChildrenUseCase,
  listPostsByCategoryIdUseCase,
} from "@/application/usecase";

const app = new Hono<AuthEnv>();

app.use("*", authMiddleware);

app.get("/", async (c) => {
  const executor = createUserExecutor(c.get("user"));
  const nextToken = c.req.query("nextToken") ?? null;
  const result = await listCategoriesUseCase({ nextToken }, executor);
  return handleResult(c, result);
});

app.get("/:id", async (c) => {
  const executor = createUserExecutor(c.get("user"));
  const result = await getCategoryUseCase({ id: c.req.param("id") }, executor);
  return handleResult(c, result);
});

app.post("/", async (c) => {
  const executor = createUserExecutor(c.get("user"));
  const body = await c.req.json();
  const result = await createCategoryUseCase(body, executor);
  return handleResult(c, result);
});

app.put("/:id", async (c) => {
  const executor = createUserExecutor(c.get("user"));
  const body = await c.req.json();
  const result = await updateCategoryUseCase({ id: c.req.param("id"), ...body }, executor);
  return handleResult(c, result);
});

app.delete("/:id", async (c) => {
  const executor = createUserExecutor(c.get("user"));
  const result = await deleteCategoryAndChildrenUseCase({ id: c.req.param("id") }, executor);
  return handleResult(c, result);
});

app.get("/:parentId/children", async (c) => {
  const executor = createUserExecutor(c.get("user"));
  const nextToken = c.req.query("nextToken") ?? null;
  const result = await listCategoriesByParentIdUseCase({ parentId: c.req.param("parentId"), nextToken }, executor);
  return handleResult(c, result);
});

app.get("/:categoryId/posts", async (c) => {
  const executor = createUserExecutor(c.get("user"));
  const nextToken = c.req.query("nextToken") ?? null;
  const result = await listPostsByCategoryIdUseCase({ categoryId: c.req.param("categoryId"), nextToken }, executor);
  return handleResult(c, result);
});

export default app;
