import { ListPostsByCategoryIdQuery, succeed, failAsInternalError } from "@headless-cms-practice/core";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient, encodeNextToken, decodeNextToken } from "@/util/dynamodb";
import { convertItemToPost } from "@/converter/post";

export function makeListPostsByCategoryIdQuery (tableOperationConfiguration: TableOperationConfiguration): ListPostsByCategoryIdQuery {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  return async function listPostsByCategoryIdQuery (input) {
    try {
      const { Items, LastEvaluatedKey } = await client.send(new QueryCommand({
        TableName: tableName,
        IndexName: "relationType-relationSort-index",
        KeyConditionExpression: "relationType = :rt",
        ExpressionAttributeValues: {
          ":rt": { S: `POST_CATEGORY#${input.categoryId}` },
        },
        ScanIndexForward: false,
        ExclusiveStartKey: decodeNextToken(input.nextToken),
      }));

      return succeed({
        items: (Items ?? []).map(convertItemToPost),
        nextToken: encodeNextToken(LastEvaluatedKey),
      });
    } catch {
      return failAsInternalError("Failed to list posts by category");
    }
  }
}
