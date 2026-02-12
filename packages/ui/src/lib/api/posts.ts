/**
 * Posts API クライアント
 *
 * GET /posts      → getPosts()
 * GET /posts/:id  → getPost()
 */

import type { Article, ListResponse, SingleResponse } from '../types';

const API_BASE_URL = import.meta.env.API_BASE_URL ?? 'http://localhost:3000';
const API_KEY = import.meta.env.API_KEY ?? '';

const headers: HeadersInit = {
  'X-Api-Key': API_KEY,
};

function parseArticle(raw: Record<string, unknown>): Article {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt as string),
    updatedAt: new Date(raw.updatedAt as string),
  } as Article;
}

export async function getPosts(nextToken?: string | null): Promise<ListResponse<Article>> {
  const params = nextToken ? `?nextToken=${encodeURIComponent(nextToken)}` : '';
  const res = await fetch(`${API_BASE_URL}/posts${params}`, { headers });
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  const body = await res.json();
  return {
    data: {
      items: (body.items ?? []).map(parseArticle),
      nextToken: body.nextToken ?? null,
    },
  };
}

export async function getPost(id: string): Promise<SingleResponse<Article>> {
  const res = await fetch(`${API_BASE_URL}/posts/${id}`, { headers });
  if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);
  const body = await res.json();
  return { data: parseArticle(body) };
}
