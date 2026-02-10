import { getIdToken } from './auth'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export type Category = {
  id: string
  parentId: string | null
  name: string
  thumbnail: string | null
  slug: string
  order: number
  description?: string
}

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

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getIdToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(body || `API error: ${res.status}`)
  }
  return res.json()
}

export const categoryApi = {
  list: () => apiFetch<ListResponse<Category>>('/categories'),
  get: (id: string) => apiFetch<Category>(`/categories/${id}`),
  create: (data: Omit<Category, 'id'>) =>
    apiFetch<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Omit<Category, 'id'>>) =>
    apiFetch<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/categories/${id}`, { method: 'DELETE' }),
}

export const postApi = {
  listByCategoryId: (categoryId: string) =>
    apiFetch<ListResponse<Post>>(`/categories/${categoryId}/posts`),
  get: (id: string) => apiFetch<Post>(`/posts/${id}`),
  create: (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiFetch<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (
    id: string,
    data: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt'>>,
  ) =>
    apiFetch<Post>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<void>(`/posts/${id}`, { method: 'DELETE' }),
}
