import type { Category } from '@headless-cms-practice/core'

export type { Category }

export type Post = {
  id: string
  title: string
  slug: string
  thumbnail?: string
  content?: string
  categoryId: string
  createdAt: string
  updatedAt: string
}

export type ListResponse<T> = {
  items: T[]
  nextToken: string | null
}
