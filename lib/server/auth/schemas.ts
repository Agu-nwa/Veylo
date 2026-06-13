import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().toLowerCase(),
  phone: z.string().trim().min(7).max(30),
  password: z.string().min(8).max(128),
  role: z.enum(["CUSTOMER", "RIDER", "BUSINESS"]).default("CUSTOMER"),
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(3).max(160),
  password: z.string().min(1).max(128),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
