/**
 * Posts API クライアント
 *
 * GET /posts      → getPosts()
 * GET /posts/:id  → getPost()
 */

import type { Article, ListResponse, SingleResponse } from '../types';
import { articles } from '../mock-articles';

// const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export async function getPosts(nextToken?: string | null): Promise<ListResponse<Article>> {
  // TODO: fetch(`${API_BASE_URL}/posts?${nextToken ? `nextToken=${nextToken}` : ''}`)
  const sorted = [...articles].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return { data: { items: sorted, nextToken: null } };
}

export async function getPost(id: string): Promise<SingleResponse<Article>> {
  // TODO: fetch(`${API_BASE_URL}/posts/${id}`)
  const article = articles.find((a) => a.id === id);
  if (!article) throw new Error(`Post not found: ${id}`);
  return { data: article };
}
