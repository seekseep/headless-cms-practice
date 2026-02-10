import type { Context } from "hono";
import type { AppResult } from "@headless-cms-practice/core";

const statusMap = {
  InternalError: 500,
  NotFoundError: 404,
  ExternalServiceError: 502,
  ValidationError: 400,
  BadRequestError: 400,
  ForbiddenError: 403,
} as const;

export function handleResult<T>(c: Context, result: AppResult<T>) {
  if (result.success) {
    return c.json({ data: result.data });
  }

  const status = statusMap[result.error.name as keyof typeof statusMap] ?? 500;
  return c.json({ error: result.error }, status);
}
