import { Hono } from "hono";
import { createUserExecutor } from "core";
import { authMiddleware, type AuthEnv } from "@/middleware/auth";
import { handleResult } from "@/util/handleResult";
import { createUploadUrlUseCase } from "@/application/usecase";

const app = new Hono<AuthEnv>();

app.use("*", authMiddleware);

app.post("/upload-url", async (c) => {
  const executor = createUserExecutor(c.get("user"));
  const body = await c.req.json();
  const result = await createUploadUrlUseCase(body, executor);
  return handleResult(c, result);
});

export default app;
