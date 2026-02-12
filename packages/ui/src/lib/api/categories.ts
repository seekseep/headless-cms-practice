/**
 * Categories API クライアント
 *
 * GET /categories                     → getCategories()
 * GET /categories/:id                 → getCategory()
 * GET /categories/:parentId/children  → getCategoryChildren()
 * GET /categories/:categoryId/posts   → getCategoryPosts()
 */

import type { Article, Category, ListResponse, SingleResponse } from '../types';

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

export async function getCategories(nextToken?: string | null): Promise<ListResponse<Category>> {
  const params = nextToken ? `?nextToken=${encodeURIComponent(nextToken)}` : '';
  const res = await fetch(`${API_BASE_URL}/categories${params}`, { headers });
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
  const body = await res.json();
  return { data: body };
}

export async function getCategory(id: string): Promise<SingleResponse<Category>> {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, { headers });
  if (!res.ok) throw new Error(`Failed to fetch category: ${res.status}`);
  const body = await res.json();
  return { data: body };
}

export async function getCategoryChildren(parentId: string): Promise<ListResponse<Category>> {
  const res = await fetch(`${API_BASE_URL}/categories/${parentId}/children`, { headers });
  if (!res.ok) throw new Error(`Failed to fetch category children: ${res.status}`);
  const body = await res.json();
  return { data: body };
}

export async function getCategoryPosts(categoryId: string): Promise<ListResponse<Article>> {
  const res = await fetch(`${API_BASE_URL}/categories/${categoryId}/posts`, { headers });
  if (!res.ok) throw new Error(`Failed to fetch category posts: ${res.status}`);
  const body = await res.json();
  return {
    data: {
      items: (body.items ?? []).map(parseArticle),
      nextToken: body.nextToken ?? null,
    },
  };
}
