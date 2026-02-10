import z from "zod";

export const UploadUrlSchema = z.object({
  url: z.string()
});
export type UploadUrl = z.infer<typeof UploadUrlSchema>;
