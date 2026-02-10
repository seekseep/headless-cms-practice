import { Result } from "./types"

export * from './types'

export function succeed<T>(data: T): Result<T, never> {
  return {
    success: true,
    data
  }
}

export function fail<E>(error: E): Result<never, E> {
  return {
    success: false,
    error
  }
}
