import mongoose, { model, models } from "mongoose";
import { baseSchemaOptions, Schema } from "@/lib/server/models/helpers";

const BUSINESS_TYPES = [
  "INSTAGRAM_VENDOR",
  "RESTAURANT",
  "BOUTIQUE",
  "OFFICE",
  "SCHOOL",
  "HOTEL",
  "SUPERMARKET",
  "PHARMACY_APPROPRIATE",
  "OTHER_SME",
] as const;

const PLAN_TYPES = ["PAY_AS_YOU_GO", "GROWTH_VENDOR", "CORPORATE"] as const;
const ACCOUNT_STATUSES = ["PENDING", "ACTIVE", "PAUSED", "SUSPENDED", "REJECTED"] as const;

const BusinessProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
      index: true,
    },
    businessType: {
      type: String,
      enum: BUSINESS_TYPES,
      required: true,
      index: true,
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
    address: {
      type: String,
      trim: true,
      maxlength: 240,
    },
    planType: {
      type: String,
      enum: PLAN_TYPES,
      default: "PAY_AS_YOU_GO",
      index: true,
    },
    accountStatus: {
      type: String,
      enum: ACCOUNT_STATUSES,
      default: "PENDING",
      index: true,
    },
    weeklyDeliveryEstimate: {
      type: String,
      trim: true,
    },
    approvedDiscountRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    discountCap: {
      type: Number,
      default: 0,
      min: 0,
    },
    monthlyOrderCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  baseSchemaOptions
);

BusinessProfileSchema.index({ accountStatus: 1, planType: 1 });

export const BusinessProfileModel =
  models.BusinessProfile || model("BusinessProfile", BusinessProfileSchema);

export type BusinessProfileDocument = mongoose.InferSchemaType<
  typeof BusinessProfileSchema
>;
