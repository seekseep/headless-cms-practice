import { UpdatePostCommand, succeed, failAsInternalError } from "@headless-cms-practice/core";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient } from "@/util/dynamodb";
import { convertItemToPost } from "@/converter/post";

export function makeUpdatePostCommand (tableOperationConfiguration: TableOperationConfiguration): UpdatePostCommand {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  return async function updatePostCommand (input) {
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
        if (value instanceof Date) {
          attrValues[valueKey] = { S: value.toISOString() };
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

      return succeed(convertItemToPost(result.Attributes!));
    } catch {
      return failAsInternalError("Failed to update post");
    }
  }
}
