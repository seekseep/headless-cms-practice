import z from "zod";

export const UploadUrlSchema = z.object({
  uploadUrl: z.string(),
  url: z.string(),
});
export type UploadUrl = z.infer<typeof UploadUrlSchema>;
