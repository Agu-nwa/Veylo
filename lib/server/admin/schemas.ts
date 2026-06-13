import { z } from "zod";
import { ORDER_STATUSES } from "@/lib/server/security/enums";

export const adminOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  detail: z.string().trim().min(5).max(1000).optional(),
  reason: z.string().trim().min(5).max(1000),
});

export const assignRiderSchema = z.object({
  riderProfileId: z.string().trim().min(8).max(80),
  reason: z.string().trim().min(5).max(1000),
});

export const riderVerificationSchema = z.object({
  verificationStatus: z.enum([
    "PENDING",
    "UNDER_REVIEW",
    "VERIFIED",
    "SUSPENDED",
    "REJECTED",
  ]),
  tier: z.enum(["NEW", "STANDARD", "PRIORITY", "SUSPENDED"]).optional(),
  suspensionStatus: z.enum(["NONE", "TEMPORARY", "INDEFINITE"]).optional(),
  reason: z.string().trim().min(5).max(1000),
});

export const businessStatusSchema = z.object({
  accountStatus: z.enum(["PENDING", "ACTIVE", "PAUSED", "SUSPENDED", "REJECTED"]),
  planType: z.enum(["PAY_AS_YOU_GO", "GROWTH_VENDOR", "CORPORATE"]).optional(),
  approvedDiscountRate: z.number().min(0).max(100).optional(),
  discountCap: z.number().min(0).optional(),
  reason: z.string().trim().min(5).max(1000),
});

export const pricingRuleUpdateSchema = z.object({
  ruleVersion: z.string().trim().min(3).max(80).optional(),
  baseFare: z.number().min(0).optional(),
  distanceRate: z.number().min(0).optional(),
  timeRate: z.number().min(0).optional(),
  packageHandlingFees: z.record(z.string(), z.number()).optional(),
  urgencyMultipliers: z.record(z.string(), z.number()).optional(),
  zoneDifficultyRules: z.record(z.string(), z.number()).optional(),
  fareFloor: z.number().min(0).optional(),
  fareCap: z.number().min(0).optional(),
  surchargeCap: z.number().min(0).optional(),
  discountCap: z.number().min(0).optional(),
  quoteExpiryMinutes: z.number().min(1).optional(),
  active: z.boolean().optional().default(true),
  reason: z.string().trim().min(5).max(1000),
});

export const disputeUpdateSchema = z.object({
  status: z.enum(["OPEN", "REVIEWING", "RESOLVED", "REJECTED", "CLOSED"]),
  adminDecision: z.string().trim().max(4000).optional(),
  resolution: z.string().trim().max(4000).optional(),
  reason: z.string().trim().min(5).max(1000),
});

export type AdminOrderStatusInput = z.infer<typeof adminOrderStatusSchema>;
export type AssignRiderInput = z.infer<typeof assignRiderSchema>;
export type RiderVerificationInput = z.infer<typeof riderVerificationSchema>;
export type BusinessStatusInput = z.infer<typeof businessStatusSchema>;
export type PricingRuleUpdateInput = z.infer<typeof pricingRuleUpdateSchema>;
export type DisputeUpdateInput = z.infer<typeof disputeUpdateSchema>;
