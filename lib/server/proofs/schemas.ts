import { z } from "zod";

export const proofCreateSchema = z.object({
  orderId: z.string().trim().min(3).max(80),
  proofType: z.enum([
    "PICKUP_OTP",
    "DELIVERY_OTP",
    "PHOTO_PROOF",
    "RECIPIENT_CONFIRMATION",
    "RIDER_NOTE",
    "ADMIN_OVERRIDE",
  ]),
  imageUrl: z.string().trim().url().optional(),
  note: z.string().trim().max(2000).optional(),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

export type ProofCreateInput = z.infer<typeof proofCreateSchema>;
