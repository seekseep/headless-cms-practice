import { ListAllCategoriesQuery, succeed, failAsInternalError } from "@headless-cms-practice/core";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient, encodeNextToken, decodeNextToken } from "@/util/dynamodb";
import { convertItemToCategory } from "@/converter/category";

export function makeListAllCategoriesQuery (tableOperationConfiguration: TableOperationConfiguration): ListAllCategoriesQuery {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  return async function listAllCategoriesQuery (input) {
    try {
      const { Items, LastEvaluatedKey } = await client.send(new ScanCommand({
        TableName: tableName,
        ExclusiveStartKey: decodeNextToken(input.nextToken),
      }));

      return succeed({
        items: (Items ?? []).map(convertItemToCategory),
        nextToken: encodeNextToken(LastEvaluatedKey),
      });
    } catch (error) {
      return failAsInternalError("Failed to list categories", error);
    }
  }
}
