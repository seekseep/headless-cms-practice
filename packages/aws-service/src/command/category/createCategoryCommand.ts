import { CreateCategoryCommand, Category, succeed, failAsInternalError } from "core";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient } from "@/util/dynamodb";
import { convertCategoryToItem } from "@/converter/category";

export function makeCreateCategoryCommand (tableOperationConfiguration: TableOperationConfiguration): CreateCategoryCommand {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  return async function createCategoryCommand (input) {
    const id = crypto.randomUUID();
    const category: Category = { id, ...input };

    try {
      const parentKey = category.parentId ?? "__ROOT__";
      const orderPadded = String(category.order).padStart(10, "0");

      await client.send(new PutItemCommand({
        TableName: tableName,
        Item: {
          PK: { S: `CATEGORY#${id}` },
          SK: { S: `CATEGORY#${id}` },
          entityType: { S: "CATEGORY" },
          entitySort: { S: `${orderPadded}#${id}` },
          relationType: { S: `CATEGORY_PARENT#${parentKey}` },
          relationSort: { S: `${orderPadded}#${id}` },
          ...convertCategoryToItem(category),
        },
      }));
      return succeed(category);
    } catch {
      return failAsInternalError("Failed to create category");
    }
  }
}
