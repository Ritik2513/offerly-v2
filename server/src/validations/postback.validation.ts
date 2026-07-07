import { z } from "zod";

export const postbackSchema = z.object({
  query: z.object({
    clickId: z.string().min(1),
    amount: z.coerce.number().positive().optional(),
  }),
});
