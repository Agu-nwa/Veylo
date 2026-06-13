import mongoose, { model, models } from "mongoose";
import { baseSchemaOptions, Schema } from "@/lib/server/models/helpers";

const RIDER_VERIFICATION_STATUSES = [
  "PENDING",
  "UNDER_REVIEW",
  "VERIFIED",
  "SUSPENDED",
  "REJECTED",
] as const;

const SUSPENSION_STATUSES = ["NONE", "TEMPORARY", "INDEFINITE"] as const;

const RiderProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    residentialArea: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    bikeAccessType: {
      type: String,
      enum: ["OWN_BIKE", "PERMISSIONED_BIKE", "FLEET", "OTHER"],
      default: "OWN_BIKE",
    },
    dispatchExperience: {
      type: String,
      enum: ["LESS_THAN_6_MONTHS", "6_TO_12_MONTHS", "1_TO_3_YEARS", "3_PLUS_YEARS"],
      default: "LESS_THAN_6_MONTHS",
    },
    referencePhone: {
      type: String,
      trim: true,
    },
    verificationStatus: {
      type: String,
      enum: RIDER_VERIFICATION_STATUSES,
      default: "PENDING",
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    completedJobs: {
      type: Number,
      default: 0,
      min: 0,
    },
    acceptanceRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    disputeRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    proofComplianceRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    tier: {
      type: String,
      enum: ["NEW", "STANDARD", "PRIORITY", "SUSPENDED"],
      default: "NEW",
      index: true,
    },
    suspensionStatus: {
      type: String,
      enum: SUSPENSION_STATUSES,
      default: "NONE",
    },
    documents: {
      type: [
        {
          type: {
            type: String,
            trim: true,
          },
          url: {
            type: String,
            trim: true,
          },
          status: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED"],
            default: "PENDING",
          },
        },
      ],
      default: [],
    },
  },
  baseSchemaOptions
);

RiderProfileSchema.index({ verificationStatus: 1, tier: 1 });
RiderProfileSchema.index({ completedJobs: -1, rating: -1 });

export const RiderProfileModel =
  models.RiderProfile || model("RiderProfile", RiderProfileSchema);

export type RiderProfileDocument = mongoose.InferSchemaType<
  typeof RiderProfileSchema
>;
