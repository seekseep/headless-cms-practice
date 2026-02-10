import { ListPostsQuery, succeed, failAsInternalError } from "core";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient, encodeNextToken, decodeNextToken } from "@/util/dynamodb";
import { convertItemToPost } from "@/converter/post";

export function makeListPostsQuery (tableOperationConfiguration: TableOperationConfiguration): ListPostsQuery {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  return async function listPostsQuery (input) {
    try {
      const { Items, LastEvaluatedKey } = await client.send(new QueryCommand({
        TableName: tableName,
        IndexName: "entityType-entitySort-index",
        KeyConditionExpression: "entityType = :et",
        ExpressionAttributeValues: {
          ":et": { S: "POST" },
        },
        ScanIndexForward: false,
        ExclusiveStartKey: decodeNextToken(input.nextToken),
      }));

      return succeed({
        items: (Items ?? []).map(convertItemToPost),
        nextToken: encodeNextToken(LastEvaluatedKey),
      });
    } catch {
      return failAsInternalError("Failed to list posts");
    }
  }
}
