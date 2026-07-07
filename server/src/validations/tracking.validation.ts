import { z } from "zod";

export const generateTrackingSchema = z.object({
  body: z.object({
    offerId: z.string().uuid("Invalid offer ID"),

    affiliateId: z.string().uuid("Invalid affiliate ID").optional(),
  }),
});
