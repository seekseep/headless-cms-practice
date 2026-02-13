import { CreateCategoryCommand, CreateCategoryCommandParametersSchema, succeed, failAsInternalError } from "@headless-cms-practice/core";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient } from "@/util/dynamodb";
import { convertCategoryToItem } from "@/converter/category";
import { v4 as uuidv4 } from "uuid";

export function makeCreateCategoryCommand (tableOperationConfiguration: TableOperationConfiguration): CreateCategoryCommand {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  return async function createCategoryCommand (input) {
    try {
      const parsed = CreateCategoryCommandParametersSchema.parse(input);
      const category = { id: uuidv4(), ...parsed };
      await client.send(new PutItemCommand({
        TableName: tableName,
        Item: convertCategoryToItem(category),
      }));
      return succeed(category);
    } catch {
      return failAsInternalError("Failed to create category");
    }
  }
}
