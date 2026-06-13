import { z } from "zod";

export const supportTicketCreateSchema = z.object({
  orderId: z.string().trim().max(80).optional(),
  category: z.enum([
    "TRACK_ORDER",
    "PRICING_QUESTION",
    "FAILED_PICKUP",
    "FAILED_DELIVERY",
    "DAMAGE_CLAIM",
    "LOST_ITEM",
    "PAYMENT",
    "CANCELLATION",
    "BUSINESS_SUPPORT",
    "RIDER_SUPPORT",
    "SAFETY_REPORT",
  ]),
  subject: z.string().trim().min(3).max(180),
  message: z.string().trim().min(10).max(4000),
  evidenceUrls: z.array(z.string().url()).optional().default([]),
  contactPhone: z.string().trim().max(30).optional(),
  contactEmail: z.string().trim().email().toLowerCase().optional(),
});

export const supportTicketUpdateSchema = z.object({
  status: z
    .enum(["OPEN", "UNDER_REVIEW", "WAITING_FOR_USER", "RESOLVED", "CLOSED"])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assignedAdminId: z.string().trim().optional(),
  resolutionNote: z.string().trim().max(4000).optional(),
});

export type SupportTicketCreateInput = z.infer<typeof supportTicketCreateSchema>;
export type SupportTicketUpdateInput = z.infer<typeof supportTicketUpdateSchema>;
