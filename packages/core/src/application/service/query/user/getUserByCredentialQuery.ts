import { User } from "@/domain/value/user";
import { AppResult } from "@/domain/util/appResult";
import { z } from "zod";

export const GetUserByCredentialQueryParametersSchema = z.object({
  credential: z.string(),
});

export type GetUserByCredentialQueryInput = z.input<typeof GetUserByCredentialQueryParametersSchema>;
export type GetUserByCredentialQueryParameters = z.infer<typeof GetUserByCredentialQueryParametersSchema>;

export type GetUserByCredentialQuery = (input: GetUserByCredentialQueryInput) => Promise<AppResult<User | null>>;
