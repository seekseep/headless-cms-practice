import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { Post } from "core";

export function convertPostToItem (post: Post): Record<string, AttributeValue> {
  const item: Record<string, AttributeValue> = {
    id: { S: post.id },
    title: { S: post.title },
    slug: { S: post.slug },
    categoryId: { S: post.categoryId },
    createdAt: { S: post.createdAt.toISOString() },
    updatedAt: { S: post.updatedAt.toISOString() },
  };
  if (post.thumbnail !== undefined) item.thumbnail = { S: post.thumbnail };
  if (post.content !== undefined) item.content = { S: post.content };
  return item;
}

export function convertItemToPost (item: Record<string, AttributeValue>): Post {
  return {
    id: item.id.S!,
    title: item.title.S!,
    slug: item.slug.S!,
    thumbnail: item.thumbnail?.S,
    content: item.content?.S,
    categoryId: item.categoryId.S!,
    createdAt: new Date(item.createdAt.S!),
    updatedAt: new Date(item.updatedAt.S!),
  };
}
