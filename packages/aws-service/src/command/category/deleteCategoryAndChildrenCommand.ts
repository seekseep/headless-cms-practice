import { DeleteCategoryAndChildrenCommand, succeed, failAsInternalError } from "core";
import { DeleteItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient } from "@/util/dynamodb";

export function makeDeleteCategoryAndChildrenCommand (tableOperationConfiguration: TableOperationConfiguration): DeleteCategoryAndChildrenCommand {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  async function deleteCategoryRecursive (id: string): Promise<void> {
    const { Items } = await client.send(new QueryCommand({
      TableName: tableName,
      IndexName: "relationType-relationSort-index",
      KeyConditionExpression: "relationType = :rt",
      ExpressionAttributeValues: {
        ":rt": { S: `CATEGORY_PARENT#${id}` },
      },
    }));

    if (Items) {
      for (const child of Items) {
        await deleteCategoryRecursive(child.id.S!);
      }
    }

    await client.send(new DeleteItemCommand({
      TableName: tableName,
      Key: { PK: { S: `CATEGORY#${id}` }, SK: { S: `CATEGORY#${id}` } },
    }));
  }

  return async function deleteCategoryAndChildrenCommand (input) {
    try {
      await deleteCategoryRecursive(input.id);
      return succeed(undefined as void);
    } catch {
      return failAsInternalError("Failed to delete category and children");
    }
  }
}
