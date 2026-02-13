import { AppResult } from "@/domain/util/appResult";
import { UploadUrl } from "@/domain/value/asset";
import { z } from "zod";

export const CreateUploadUrlCommandParametersSchema = z.object({
  contentType: z.string(),
});

export type CreateUploadUrlCommandInput = z.input<typeof CreateUploadUrlCommandParametersSchema>;
export type CreateUploadUrlCommandParameters = z.infer<typeof CreateUploadUrlCommandParametersSchema>;

export type CreateUploadUrlCommand = (input: CreateUploadUrlCommandInput) => Promise<AppResult<UploadUrl>>;
