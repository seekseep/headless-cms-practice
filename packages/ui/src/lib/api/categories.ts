/**
 * Categories API クライアント
 *
 * GET /categories                     → getCategories()
 * GET /categories/:id                 → getCategory()
 * GET /categories/:parentId/children  → getCategoryChildren()
 * GET /categories/:categoryId/posts   → getCategoryPosts()
 */

import type { Article, Category, ListResponse, SingleResponse } from '../types';
import { articles } from '../mock-articles';
import { categories } from '../mock-categories';

// const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export async function getCategories(nextToken?: string | null): Promise<ListResponse<Category>> {
  // TODO: fetch(`${API_BASE_URL}/categories?${nextToken ? `nextToken=${nextToken}` : ''}`)
  const sorted = [...categories].sort((a, b) => a.order - b.order);
  return { data: { items: sorted, nextToken: null } };
}

export async function getCategory(id: string): Promise<SingleResponse<Category>> {
  // TODO: fetch(`${API_BASE_URL}/categories/${id}`)
  const category = categories.find((c) => c.id === id);
  if (!category) throw new Error(`Category not found: ${id}`);
  return { data: category };
}

export async function getCategoryChildren(parentId: string): Promise<ListResponse<Category>> {
  // TODO: fetch(`${API_BASE_URL}/categories/${parentId}/children`)
  const children = categories
    .filter((c) => c.parentId === parentId)
    .sort((a, b) => a.order - b.order);
  return { data: { items: children, nextToken: null } };
}

export async function getCategoryPosts(categoryId: string): Promise<ListResponse<Article>> {
  // TODO: fetch(`${API_BASE_URL}/categories/${categoryId}/posts`)
  const sorted = articles
    .filter((a) => a.categoryId === categoryId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return { data: { items: sorted, nextToken: null } };
}
