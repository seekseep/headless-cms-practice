import { CreateUploadUrlCommand, CreateUploadUrlCommandParameters, succeed, failAsInternalError } from "@headless-cms-practice/core";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BacketConfiguration } from "@/configuration";
import { v4 as uuidv4 } from "uuid";

const contentTypeToExtension: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};

export function makeCreateUploadUrlCommand (backetConfiguration: BacketConfiguration): CreateUploadUrlCommand {
  const client = new S3Client({ region: process.env.AWS_REGION });
  const { backetName, assetBaseUrl } = backetConfiguration;

  return async function createUploadUrlCommand (input: CreateUploadUrlCommandParameters) {
    try {
      const ext = contentTypeToExtension[input.contentType] ?? "";
      const key = `uploads/${uuidv4()}${ext}`;
      const uploadUrl = await getSignedUrl(client, new PutObjectCommand({
        Bucket: backetName,
        Key: key,
        ContentType: input.contentType,
      }), { expiresIn: 3600 });

      const url = `${assetBaseUrl}/${key}`;

      return succeed({ uploadUrl, url });
    } catch {
      return failAsInternalError("Failed to create upload URL");
    }
  }
}
