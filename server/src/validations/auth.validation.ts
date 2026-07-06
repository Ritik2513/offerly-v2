import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({
        error: "Name is required",
      })
      .min(3, "Name must be at least 3 characters"),

    email: z.email("Please enter a valid email address"),

    password: z
      .string({
        error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),

    companyName: z
      .string({
        error: "Company name is required",
      })
      .min(2, "Company name must be at least 2 characters"),

    role: z.enum(["admin", "affiliate"]).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Please enter a valid email address"),

    password: z
      .string({
        error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
  }),
});
