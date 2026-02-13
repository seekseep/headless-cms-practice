import { z } from "zod";

export const BacketConfigurationSchema = z.object({
  backetName: z.string(),
  assetBaseUrl: z.string(),
});

export type BacketConfiguration = z.infer<typeof BacketConfigurationSchema>;
