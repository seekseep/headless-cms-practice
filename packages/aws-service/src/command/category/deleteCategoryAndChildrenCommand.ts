import { DeleteCategoryAndChildrenCommand, succeed, failAsInternalError } from "@headless-cms-practice/core";
import { DeleteItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient } from "@/util/dynamodb";

export function makeDeleteCategoryAndChildrenCommand (tableOperationConfiguration: TableOperationConfiguration): DeleteCategoryAndChildrenCommand {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  return async function deleteCategoryAndChildrenCommand (input) {
    try {
      // Delete children first
      const { Items } = await client.send(new QueryCommand({
        TableName: tableName,
        IndexName: "ParentIdIndex",
        KeyConditionExpression: "parentId = :pid",
        ExpressionAttributeValues: {
          ":pid": { S: input.id },
        },
      }));

      for (const item of Items ?? []) {
        await client.send(new DeleteItemCommand({
          TableName: tableName,
          Key: { id: { S: item.id.S! } },
        }));
      }

      // Delete the category itself
      await client.send(new DeleteItemCommand({
        TableName: tableName,
        Key: { id: { S: input.id } },
      }));

      return succeed(undefined as void);
    } catch {
      return failAsInternalError("Failed to delete category and children");
    }
  }
}
