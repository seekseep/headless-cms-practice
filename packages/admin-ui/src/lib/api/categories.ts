import type {
  ListAllCategoriesQueryInput,
  FindCategoryByIdQueryInput,
  CreateCategoryCommandInput,
  UpdateCategoryCommandInput,
} from '@headless-cms-practice/core'
import client from './client'
import type { Category, ListResponse } from './types'

export async function listCategories(
  input: ListAllCategoriesQueryInput,
): Promise<ListResponse<Category>> {
  const res = await client.get('/categories', {
    params: { nextToken: input.nextToken },
  })
  return res.data
}

export async function getCategory(
  input: FindCategoryByIdQueryInput,
): Promise<Category> {
  const res = await client.get(`/categories/${input.id}`)
  return res.data
}

export async function createCategory(
  input: CreateCategoryCommandInput,
): Promise<Category> {
  const res = await client.post('/categories', input)
  return res.data
}

export async function updateCategory(
  input: UpdateCategoryCommandInput,
): Promise<Category> {
  const { id, ...body } = input
  const res = await client.put(`/categories/${id}`, body)
  return res.data
}

export async function deleteCategory(
  input: FindCategoryByIdQueryInput,
): Promise<void> {
  await client.delete(`/categories/${input.id}`)
}
