import { ListCategoriesByParentIdQuery, succeed, failAsInternalError } from "@headless-cms-practice/core";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient, encodeNextToken, decodeNextToken } from "@/util/dynamodb";
import { convertItemToCategory } from "@/converter/category";

export function makeListCategoriesByParentIdQuery (tableOperationConfiguration: TableOperationConfiguration): ListCategoriesByParentIdQuery {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  return async function listCategoriesByParentIdQuery (input) {
    const parentKey = input.parentId ?? "__ROOT__";

    try {
      const { Items, LastEvaluatedKey } = await client.send(new QueryCommand({
        TableName: tableName,
        IndexName: "relationType-relationSort-index",
        KeyConditionExpression: "relationType = :rt",
        ExpressionAttributeValues: {
          ":rt": { S: `CATEGORY_PARENT#${parentKey}` },
        },
        ScanIndexForward: true,
        ExclusiveStartKey: decodeNextToken(input.nextToken),
      }));

      return succeed({
        items: (Items ?? []).map(convertItemToCategory),
        nextToken: encodeNextToken(LastEvaluatedKey),
      });
    } catch {
      return failAsInternalError("Failed to list categories by parent");
    }
  }
}
