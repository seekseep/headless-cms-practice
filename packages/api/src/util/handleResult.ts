import type { Context } from "hono";
import { createLogger, type AppResult } from "@headless-cms-practice/core";

const logger = createLogger("handleResult");

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
    return c.json(result.data);
  }

  const status = statusMap[result.error.name as keyof typeof statusMap] ?? 500;
  const cause = 'cause' in result.error ? result.error.cause : undefined;
  const causeSummary = cause instanceof Error ? `${cause.name}: ${cause.message}` :
    cause && typeof cause === 'object' && 'message' in cause ? `${(cause as { name?: string }).name ?? 'Error'}: ${(cause as { message: string }).message}` :
    cause ? String(cause) : undefined;
  logger.error(`${c.req.method} ${c.req.path} -> ${status} ${result.error.name}: ${result.error.message}${causeSummary ? ` [${causeSummary}]` : ''}`);
  const { cause: _, ...error } = result.error as Record<string, unknown>;
  return c.json({ error }, status);
}
