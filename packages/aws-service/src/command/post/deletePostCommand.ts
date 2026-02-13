import { DeletePostCommand, succeed, failAsInternalError } from "@headless-cms-practice/core";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient } from "@/util/dynamodb";

export function makeDeletePostCommand (tableOperationConfiguration: TableOperationConfiguration): DeletePostCommand {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  return async function deletePostCommand (input) {
    try {
      await client.send(new DeleteItemCommand({
        TableName: tableName,
        Key: { id: { S: input.id } },
      }));
      return succeed(undefined as void);
    } catch {
      return failAsInternalError("Failed to delete post");
    }
  }
}
