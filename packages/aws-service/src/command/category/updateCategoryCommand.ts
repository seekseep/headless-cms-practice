import { UpdateCategoryCommand, succeed, failAsInternalError, failAsNotFound } from "@headless-cms-practice/core";
import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient } from "@/util/dynamodb";
import { convertItemToCategory, convertCategoryToItem } from "@/converter/category";

export function makeUpdateCategoryCommand (tableOperationConfiguration: TableOperationConfiguration): UpdateCategoryCommand {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  return async function updateCategoryCommand (input) {
    const { id, ...values } = input;

    try {
      const { Item } = await client.send(new GetItemCommand({
        TableName: tableName,
        Key: { PK: { S: `CATEGORY#${id}` }, SK: { S: `CATEGORY#${id}` } },
      }));

      if (!Item) {
        return failAsNotFound("Category not found");
      }

      const existing = convertItemToCategory(Item);
      const updatedCategory = {
        ...existing,
        ...values,
        id,
      };

      const parentKey = updatedCategory.parentId ?? "__ROOT__";
      const orderPadded = String(updatedCategory.order).padStart(10, "0");

      await client.send(new PutItemCommand({
        TableName: tableName,
        Item: {
          PK: { S: `CATEGORY#${id}` },
          SK: { S: `CATEGORY#${id}` },
          entityType: { S: "CATEGORY" },
          entitySort: { S: `${orderPadded}#${id}` },
          relationType: { S: `CATEGORY_PARENT#${parentKey}` },
          relationSort: { S: `${orderPadded}#${id}` },
          ...convertCategoryToItem(updatedCategory),
        },
      }));

      return succeed(updatedCategory);
    } catch {
      return failAsInternalError("Failed to update category");
    }
  }
}
