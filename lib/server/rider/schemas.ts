import { z } from "zod";

export const rejectJobSchema = z.object({
  reason: z.string().trim().min(5).max(1000),
});

export const riderStatusUpdateSchema = z.object({
  status: z.enum([
    "RIDER_EN_ROUTE",
    "ARRIVED_PICKUP",
    "PICKED_UP",
    "IN_TRANSIT",
    "ARRIVED_DROPOFF",
    "DELIVERED",
    "FAILED_PICKUP",
    "FAILED_DELIVERY",
  ]),
  detail: z.string().trim().min(5).max(1000).optional(),
  reason: z.string().trim().max(1000).optional(),
});

export const riderProfileUpdateSchema = z.object({
  displayName: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().min(7).max(30).optional(),
  residentialArea: z.string().trim().max(160).optional(),
  bikeAccessType: z
    .enum(["OWN_BIKE", "PERMISSIONED_BIKE", "FLEET", "OTHER"])
    .optional(),
  dispatchExperience: z
    .enum(["LESS_THAN_6_MONTHS", "6_TO_12_MONTHS", "1_TO_3_YEARS", "3_PLUS_YEARS"])
    .optional(),
  referencePhone: z.string().trim().max(30).optional(),
});

export type RejectJobInput = z.infer<typeof rejectJobSchema>;
export type RiderStatusUpdateInput = z.infer<typeof riderStatusUpdateSchema>;
export type RiderProfileUpdateInput = z.infer<typeof riderProfileUpdateSchema>;
