import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { Category } from "@headless-cms-practice/core";
import { ROOT_PARENT_ID } from "@/constants";

export function convertCategoryToItem (category: Category): Record<string, AttributeValue> {
  const item: Record<string, AttributeValue> = {
    id: { S: category.id },
    parentId: { S: category.parentId ?? ROOT_PARENT_ID },
    name: { S: category.name },
    thumbnail: category.thumbnail !== null ? { S: category.thumbnail } : { NULL: true },
    slug: { S: category.slug },
    order: { N: String(category.order) },
  };
  if (category.description !== undefined) item.description = { S: category.description };
  return item;
}

export function convertItemToCategory (item: Record<string, AttributeValue>): Category {
  return {
    id: item.id.S!,
    parentId: item.parentId?.S === ROOT_PARENT_ID ? null : item.parentId?.S ?? null,
    name: item.name.S!,
    thumbnail: item.thumbnail?.S ?? null,
    slug: item.slug.S!,
    order: Number(item.order.N!),
    description: item.description?.S,
  };
}
