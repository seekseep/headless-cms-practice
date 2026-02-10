import type { Article } from '../types';
import * as postsApi from '../api/posts';
import { getChildCategories } from './categories';

export async function getAllArticles(): Promise<Article[]> {
  const res = await postsApi.getPosts();
  return res.data.items;
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await getAllArticles();
  return articles.find((a) => a.slug === slug);
}

export async function getArticlesByCategory(categoryId: string): Promise<Article[]> {
  const children = await getChildCategories(categoryId);
  const targetIds = [categoryId, ...children.map((c) => c.id)];

  const allArticles = await getAllArticles();
  return allArticles.filter((a) => targetIds.includes(a.categoryId));
}
