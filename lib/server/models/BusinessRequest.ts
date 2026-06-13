import mongoose, { model, models } from "mongoose";
import { baseSchemaOptions, Schema } from "@/lib/server/models/helpers";

const REQUEST_STATUSES = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"] as const;

const BusinessRequestSchema = new Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    businessType: {
      type: String,
      required: true,
      trim: true,
    },
    contactName: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    weeklyDeliveryEstimate: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: REQUEST_STATUSES,
      default: "PENDING",
      index: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  baseSchemaOptions
);

BusinessRequestSchema.index({ status: 1, createdAt: -1 });

export const BusinessRequestModel =
  models.BusinessRequest || model("BusinessRequest", BusinessRequestSchema);

export type BusinessRequestDocument = mongoose.InferSchemaType<
  typeof BusinessRequestSchema
>;
