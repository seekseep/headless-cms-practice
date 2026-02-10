import { Post, PostKeySchema } from "@/domain/entity";
import { AppResult } from "@/domain/util/appResult";
import { z } from "zod";

export const FindPostByIdQueryParametersSchema = PostKeySchema;

export type FindPostByIdQueryInput = z.input<typeof FindPostByIdQueryParametersSchema>;
export type FindPostByIdQueryParameters = z.infer<typeof FindPostByIdQueryParametersSchema>;

export type FindPostByIdQuery = (input: FindPostByIdQueryInput) => Promise<AppResult<Post | null>>;
