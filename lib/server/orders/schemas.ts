import { z } from "zod";

export const createOrderSchema = z.object({
  quoteId: z.string().trim().min(3).max(80),
  pickup: z.object({
    address: z.string().trim().min(3).max(240),
    landmark: z.string().trim().max(160).optional(),
    contactName: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(7).max(30),
  }),
  dropoff: z.object({
    address: z.string().trim().min(3).max(240),
    landmark: z.string().trim().max(160).optional(),
    recipientName: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(7).max(30),
  }),
  package: z.object({
    category: z.string().trim().min(2).max(80),
    valueBand: z.string().trim().min(2).max(80),
    note: z.string().trim().max(1000).optional(),
    restrictedItemConfirmed: z.boolean(),
  }),
  waitingRuleAccepted: z.boolean(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().trim().min(5).max(1000),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
