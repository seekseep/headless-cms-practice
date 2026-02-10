import { UpdatePostCommand, succeed, failAsInternalError, failAsNotFound } from "core";
import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { TableOperationConfiguration } from "@/configuration";
import { createDynamoDBClient } from "@/util/dynamodb";
import { convertItemToPost, convertPostToItem } from "@/converter/post";

export function makeUpdatePostCommand (tableOperationConfiguration: TableOperationConfiguration): UpdatePostCommand {
  const client = createDynamoDBClient();
  const { tableName } = tableOperationConfiguration;

  return async function updatePostCommand (input) {
    const { id, ...values } = input;

    try {
      const { Item } = await client.send(new GetItemCommand({
        TableName: tableName,
        Key: { PK: { S: `POST#${id}` }, SK: { S: `POST#${id}` } },
      }));

      if (!Item) {
        return failAsNotFound("Post not found");
      }

      const existing = convertItemToPost(Item);
      const updatedPost = {
        ...existing,
        ...values,
        id,
      };

      await client.send(new PutItemCommand({
        TableName: tableName,
        Item: {
          PK: { S: `POST#${id}` },
          SK: { S: `POST#${id}` },
          entityType: { S: "POST" },
          entitySort: { S: updatedPost.createdAt.toISOString() },
          relationType: { S: `POST_CATEGORY#${updatedPost.categoryId}` },
          relationSort: { S: updatedPost.createdAt.toISOString() },
          ...convertPostToItem(updatedPost),
        },
      }));

      return succeed(updatedPost);
    } catch {
      return failAsInternalError("Failed to update post");
    }
  }
}
