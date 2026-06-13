import { z } from "zod";

export const quoteRequestSchema = z.object({
  serviceType: z
    .enum([
      "PICKUP_DELIVERY",
      "ERRAND_RUN",
      "BUSINESS_DELIVERY",
      "EXPRESS_DELIVERY",
      "SCHEDULED_DELIVERY",
      "SECURE_DOCUMENT",
      "MARKET_RUN_LATER",
    ])
    .default("PICKUP_DELIVERY"),
  pickupAddress: z.string().trim().min(3).max(240),
  pickupLandmark: z.string().trim().max(160).optional(),
  dropoffAddress: z.string().trim().min(3).max(240),
  dropoffLandmark: z.string().trim().max(160).optional(),
  packageCategory: z.string().trim().min(2).max(80),
  urgency: z.enum(["STANDARD", "EXPRESS", "SCHEDULED"]).default("STANDARD"),
  valueBand: z.string().trim().min(2).max(80),
  isBusinessAccount: z.boolean().optional().default(false),
  businessId: z.string().trim().optional(),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
