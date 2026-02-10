import { z } from "zod";

export const TableOperationConfigurationSchema = z.object({
  tableName: z.string(),
});

export type TableOperationConfiguration = z.infer<typeof TableOperationConfigurationSchema>;
