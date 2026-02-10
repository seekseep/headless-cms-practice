import { CategoryKeySchema } from "@/domain/entity/category";
import { AppResult } from "@/domain/util/appResult";
import { z } from "zod";

export const DeletePostCommandParametersSchema = CategoryKeySchema

export type DeletePostCommandInput = z.input<typeof DeletePostCommandParametersSchema>;
export type DeletePostCommandParameters = z.infer<typeof DeletePostCommandParametersSchema>;

export type DeletePostCommand = (input: DeletePostCommandInput) => Promise<AppResult<void>>;
