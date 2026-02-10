import type { Category } from '../types';
import * as categoriesApi from '../api/categories';

export async function getAllCategories(): Promise<Category[]> {
  const res = await categoriesApi.getCategories();
  return res.data.items;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getAllCategories();
  return categories.find((c) => c.slug === slug);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const res = await categoriesApi.getCategory(id).catch(() => null);
  return res?.data;
}

export async function getRootCategories(): Promise<Category[]> {
  const categories = await getAllCategories();
  return categories.filter((c) => c.parentId === null);
}

export async function getChildCategories(parentId: string): Promise<Category[]> {
  const res = await categoriesApi.getCategoryChildren(parentId);
  return res.data.items;
}
