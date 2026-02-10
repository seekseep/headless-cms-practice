import z, { ZodError } from "zod";
import { fail } from "../../../util/result";

export * from "./types";

export function failAsNotFound(message?: string) {
  return fail({
    name: 'NotFoundError' as const,
    message: message ?? 'Resource not found'
  })
}

export function failAsInternalError(message?: string) {
  return fail({
    name: 'InternalError' as const,
    message: message ?? 'Internal server error'
  })
}

export function failAsBadRequest(message?: string) {
  return fail({
    name: 'BadRequestError' as const,
    message: message ?? 'Bad request'
  })
}

export function failAsForbidden(message?: string) {
  return fail({
    name: 'ForbiddenError' as const,
    message: message ?? 'Forbidden'
  })
}

export function failAsValidationError(
  zodError: ZodError,
  message?: string
) {
  return fail({
    name: 'ValidationError' as const,
    message: message ?? 'Validation error',
    details: zodError.issues.reduce((acc, issue) => {
      const path = issue.path.join('.');
      acc[path] = issue.message;
      return acc;
    }, {} as Record<string, unknown>)
  })
}
