import { Post, PostKeySchema, PostValuesSchema } from "@/domain";
import { AppResult } from "@/domain/util/appResult";
import { z } from "zod";

export const UpdatePostCommandParametersSchema = PostKeySchema
  .extend(PostValuesSchema.partial().shape)

export type UpdatePostCommandInput = z.input<typeof UpdatePostCommandParametersSchema>;
export type UpdatePostCommandParameters = z.infer<typeof UpdatePostCommandParametersSchema>;

export type UpdatePostCommand = (input: UpdatePostCommandInput) => Promise<AppResult<Post>>;
