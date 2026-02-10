import { CreateUploadUrlCommand, succeed, failAsInternalError } from "@headless-cms-practice/core";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BacketConfiguration } from "@/configuration";

export function makeCreateUploadUrlCommand (backetConfiguration: BacketConfiguration): CreateUploadUrlCommand {
  const s3Client = new S3Client({});
  const { backetName } = backetConfiguration;

  return async function createUploadUrlCommand () {
    const key = `uploads/${crypto.randomUUID()}`;

    try {
      const url = await getSignedUrl(
        s3Client,
        new PutObjectCommand({
          Bucket: backetName,
          Key: key,
        }),
        { expiresIn: 3600 },
      );
      return succeed({ url });
    } catch {
      return failAsInternalError("Failed to create upload url");
    }
  }
}
