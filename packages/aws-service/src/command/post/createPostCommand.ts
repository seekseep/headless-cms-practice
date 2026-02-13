import { CreatePostCommand, CreatePostCommandParametersSchema, succeed, failAsInternalError } from "@headless-cms-practice/core";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient } from "@/util/dynamodb";
import { convertPostToItem } from "@/converter/post";
import { v4 as uuidv4 } from "uuid";

export function makeCreatePostCommand (tableOperationConfiguration: TableOperationConfiguration): CreatePostCommand {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  return async function createPostCommand (input) {
    try {
      const parsed = CreatePostCommandParametersSchema.parse(input);
      const post = { id: uuidv4(), ...parsed };
      await client.send(new PutItemCommand({
        TableName: tableName,
        Item: convertPostToItem(post),
      }));
      return succeed(post);
    } catch {
      return failAsInternalError("Failed to create post");
    }
  }
}
