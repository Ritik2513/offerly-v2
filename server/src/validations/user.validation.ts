import { z } from "zod";

//create affiliate
export const createAffiliateSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 Characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 Characters"),
  }),
});

//get Affiliate
export const getAffiliatesSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
    search: z.string().trim().optional(),
  }),
});

//toggle affiliate status
export const toggleAffiliateStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid affiliate ID"),
  }),
  body: z.object({
    isActive: z.boolean(),
  }),
});
