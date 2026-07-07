import { z } from "zod";

export const createOfferSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot exceed 100 characters"),

    category: z.string().min(2, "Category is required"),

    landingPageUrl: z.string().url("Please provide a valid URL"),

    payout: z
      .number({
        error: "Payout is required",
      })
      .positive("Payout must be greater than 0"),

    description: z.string().optional(),

    isActive: z.boolean().optional(),
  }),
});

export const updateOfferSchema = z.object({
  body: createOfferSchema.shape.body.partial(),
});
