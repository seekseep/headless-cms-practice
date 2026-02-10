import { FindPostByIdQuery, succeed, failAsInternalError } from "core";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient } from "@/util/dynamodb";
import { convertItemToPost } from "@/converter/post";

export function makeFindPostByIdQuery (tableOperationConfiguration: TableOperationConfiguration): FindPostByIdQuery {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  return async function findPostByIdQuery (input) {
    try {
      const { Item } = await client.send(new GetItemCommand({
        TableName: tableName,
        Key: { PK: { S: `POST#${input.id}` }, SK: { S: `POST#${input.id}` } },
      }));

      if (!Item) {
        return succeed(null);
      }

      return succeed(convertItemToPost(Item));
    } catch {
      return failAsInternalError("Failed to find post");
    }
  }
}
