import { PostKeySchema } from "@/domain/entity/post";
import { AppResult } from "@/domain/util/appResult";
import { z } from "zod";

export const DeletePostCommandParametersSchema = PostKeySchema

export type DeletePostCommandInput = z.input<typeof DeletePostCommandParametersSchema>;
export type DeletePostCommandParameters = z.infer<typeof DeletePostCommandParametersSchema>;

export type DeletePostCommand = (input: DeletePostCommandInput) => Promise<AppResult<void>>;
