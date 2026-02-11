import type {
  ListPostsByCategoryIdQueryInput,
  FindPostByIdQueryInput,
  CreatePostCommandInput,
  UpdatePostCommandInput,
  DeletePostCommandInput,
} from '@headless-cms-practice/core'
import client from './client'
import type { Post, ListResponse } from './types'

export async function listPostsByCategoryId(
  input: ListPostsByCategoryIdQueryInput,
): Promise<ListResponse<Post>> {
  const res = await client.get(
    `/categories/${input.categoryId}/posts`,
    { params: { nextToken: input.nextToken } },
  )
  return res.data
}

export async function getPost(
  input: FindPostByIdQueryInput,
): Promise<Post> {
  const res = await client.get(`/posts/${input.id}`)
  return res.data
}

export async function createPost(
  input: CreatePostCommandInput,
): Promise<Post> {
  const res = await client.post('/posts', input)
  return res.data
}

export async function updatePost(
  input: UpdatePostCommandInput,
): Promise<Post> {
  const { id, ...body } = input
  const res = await client.put(`/posts/${id}`, body)
  return res.data
}

export async function deletePost(
  input: DeletePostCommandInput,
): Promise<void> {
  await client.delete(`/posts/${input.id}`)
}
