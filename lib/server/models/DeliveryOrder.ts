import mongoose, { model, models } from "mongoose";
import { ORDER_STATUSES } from "@/lib/server/security/enums";
import { baseSchemaOptions, Schema } from "@/lib/server/models/helpers";

const DeliveryOrderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "BusinessProfile",
      index: true,
    },
    quoteId: {
      type: String,
      required: true,
      index: true,
    },
    riderId: {
      type: Schema.Types.ObjectId,
      ref: "RiderProfile",
      index: true,
    },
    serviceType: {
      type: String,
      required: true,
      index: true,
    },
    pickup: {
      address: { type: String, required: true },
      landmark: String,
      contactName: String,
      phone: String,
    },
    dropoff: {
      address: { type: String, required: true },
      landmark: String,
      recipientName: String,
      phone: String,
    },
    package: {
      category: { type: String, required: true },
      valueBand: String,
      note: String,
      restrictedItemConfirmed: {
        type: Boolean,
        default: false,
      },
    },
    fare: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "CREATED",
      index: true,
    },
    pickupOtpHash: {
      type: String,
      select: false,
    },
    deliveryOtpHash: {
      type: String,
      select: false,
    },
    paymentStatus: {
      type: String,
      enum: ["NOT_REQUIRED", "PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
      index: true,
    },
    supportStatus: {
      type: String,
      enum: ["NONE", "OPEN", "UNDER_REVIEW", "RESOLVED"],
      default: "NONE",
      index: true,
    },
    cancellationStatus: {
      type: String,
      enum: ["NONE", "REQUESTED", "APPROVED", "REJECTED"],
      default: "NONE",
    },
  },
  baseSchemaOptions
);

DeliveryOrderSchema.index({ customerId: 1, createdAt: -1 });
DeliveryOrderSchema.index({ riderId: 1, status: 1 });
DeliveryOrderSchema.index({ businessId: 1, createdAt: -1 });

export const DeliveryOrderModel =
  models.DeliveryOrder || model("DeliveryOrder", DeliveryOrderSchema);

export type DeliveryOrderDocument = mongoose.InferSchemaType<
  typeof DeliveryOrderSchema
>;
