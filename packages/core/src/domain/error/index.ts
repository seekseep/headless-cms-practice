export type InternalError = {
  name: 'InternalError'
  message: string
}

export type NotFoundError = {
  name: 'NotFoundError'
  message: string
}

export type ExternalServiceError = {
  name: 'ExternalServiceError'
  message: string
}

export type ValidationError = {
  name: 'ValidationError'
  message: string
  details: Record<string, unknown>
}

export type BadRequestError = {
  name: 'BadRequestError'
  message: string
}

export type ForbiddenError = {
  name: 'ForbiddenError'
  message: string
}

export type AppError =
  | InternalError
  | NotFoundError
  | ExternalServiceError
  | ValidationError
  | BadRequestError
  | ForbiddenError
