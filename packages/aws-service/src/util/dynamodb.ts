import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";

export function createDynamoDBClient (): DynamoDBClient {
  return new DynamoDBClient({});
}

export function encodeNextToken (lastEvaluatedKey: Record<string, AttributeValue> | undefined): string | null {
  if (!lastEvaluatedKey) return null;
  return Buffer.from(JSON.stringify(lastEvaluatedKey)).toString("base64");
}

export function decodeNextToken (nextToken: string | null): Record<string, AttributeValue> | undefined {
  if (!nextToken) return undefined;
  return JSON.parse(Buffer.from(nextToken, "base64").toString("utf-8"));
}
