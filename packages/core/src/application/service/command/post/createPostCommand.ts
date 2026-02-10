import { Post, PostValuesSchema } from "@/domain";
import { AppResult } from "@/domain/util/appResult";
import { z } from "zod";

export const CreatePostCommandParametersSchema = PostValuesSchema;

export type CreatePostCommandInput = z.input<typeof CreatePostCommandParametersSchema>;
export type CreatePostCommandParameters = z.infer<typeof CreatePostCommandParametersSchema>;

export type CreatePostCommand = (input: CreatePostCommandInput) => Promise<AppResult<Post>>;
