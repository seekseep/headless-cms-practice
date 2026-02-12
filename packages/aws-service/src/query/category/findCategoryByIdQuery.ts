import { FindCategoryByIdQuery, succeed, failAsInternalError } from "@headless-cms-practice/core";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient } from "@/util/dynamodb";
import { convertItemToCategory } from "@/converter/category";

export function makeFindCategoryByIdQuery (tableOperationConfiguration: TableOperationConfiguration): FindCategoryByIdQuery {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  return async function findCategoryByIdQuery (input) {
    try {
      const { Item } = await client.send(new GetItemCommand({
        TableName: tableName,
        Key: { id: { S: input.id } },
      }));

      if (!Item) {
        return succeed(null);
      }

      return succeed(convertItemToCategory(Item));
    } catch {
      return failAsInternalError("Failed to find category");
    }
  }
}
