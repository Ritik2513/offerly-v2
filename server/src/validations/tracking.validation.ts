import { z } from "zod";

export const generateTrackingSchema = z.object({
  body: z.object({
    offerId: z.string().cuid("Invalid offer ID"),

    affiliateId: z.string().cuid("Invalid affiliate ID").optional(),
  }),
});
