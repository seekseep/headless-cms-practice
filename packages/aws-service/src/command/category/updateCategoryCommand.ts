import { UpdateCategoryCommand, succeed, failAsInternalError } from "@headless-cms-practice/core";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient } from "@/util/dynamodb";
import { convertItemToCategory } from "@/converter/category";
import { ROOT_PARENT_ID } from "@/constants";

export function makeUpdateCategoryCommand (tableOperationConfiguration: TableOperationConfiguration): UpdateCategoryCommand {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  return async function updateCategoryCommand (input) {
    try {
      const { id, ...values } = input;
      const expressionParts: string[] = [];
      const names: Record<string, string> = {};
      const attrValues: Record<string, any> = {};

      for (const [key, value] of Object.entries(values)) {
        if (value === undefined) continue;
        const nameKey = `#${key}`;
        const valueKey = `:${key}`;
        expressionParts.push(`${nameKey} = ${valueKey}`);
        names[nameKey] = key;
        if (key === 'parentId') {
          attrValues[valueKey] = { S: (value as string | null) ?? ROOT_PARENT_ID };
        } else if (key === 'thumbnail') {
          attrValues[valueKey] = value !== null ? { S: String(value) } : { NULL: true };
        } else if (typeof value === 'number') {
          attrValues[valueKey] = { N: String(value) };
        } else {
          attrValues[valueKey] = { S: String(value) };
        }
      }

      if (expressionParts.length === 0) {
        return failAsInternalError("No fields to update");
      }

      const result = await client.send(new UpdateItemCommand({
        TableName: tableName,
        Key: { id: { S: id } },
        UpdateExpression: `SET ${expressionParts.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: attrValues,
        ReturnValues: "ALL_NEW",
      }));

      return succeed(convertItemToCategory(result.Attributes!));
    } catch {
      return failAsInternalError("Failed to update category");
    }
  }
}
