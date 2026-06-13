import { z } from "zod";

export const businessRequestSchema = z.object({
  businessName: z.string().trim().min(2).max(160),
  businessType: z.string().trim().min(2).max(120),
  contactName: z.string().trim().min(2).max(120).optional(),
  contactPhone: z.string().trim().min(7).max(30),
  contactEmail: z.string().trim().email().toLowerCase().optional(),
  weeklyDeliveryEstimate: z.string().trim().max(80).optional(),
  message: z.string().trim().max(2000).optional(),
});

export const businessDeliverySchema = z.object({
  pickupAddress: z.string().trim().min(3).max(240),
  pickupLandmark: z.string().trim().max(160).optional(),
  dropoffAddress: z.string().trim().min(3).max(240),
  dropoffLandmark: z.string().trim().max(160).optional(),
  recipientName: z.string().trim().min(2).max(120),
  recipientPhone: z.string().trim().min(7).max(30),
  packageCategory: z.string().trim().min(2).max(80),
  urgency: z.enum(["STANDARD", "EXPRESS", "SCHEDULED"]).default("STANDARD"),
  valueBand: z.string().trim().min(2).max(80),
  note: z.string().trim().max(1000).optional(),
  restrictedItemConfirmed: z.boolean(),
  waitingRuleAccepted: z.boolean(),
});

export type BusinessRequestInput = z.infer<typeof businessRequestSchema>;
export type BusinessDeliveryInput = z.infer<typeof businessDeliverySchema>;
