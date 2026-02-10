import { CreatePostCommand, Post, succeed, failAsInternalError } from "core";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient } from "@/util/dynamodb";
import { convertPostToItem } from "@/converter/post";

export function makeCreatePostCommand (tableOperationConfiguration: TableOperationConfiguration): CreatePostCommand {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  return async function createPostCommand (input) {
    const id = crypto.randomUUID();
    const post: Post = { id, ...input };

    try {
      await client.send(new PutItemCommand({
        TableName: tableName,
        Item: {
          PK: { S: `POST#${id}` },
          SK: { S: `POST#${id}` },
          entityType: { S: "POST" },
          entitySort: { S: post.createdAt.toISOString() },
          relationType: { S: `POST_CATEGORY#${post.categoryId}` },
          relationSort: { S: post.createdAt.toISOString() },
          ...convertPostToItem(post),
        },
      }));
      return succeed(post);
    } catch {
      return failAsInternalError("Failed to create post");
    }
  }
}
