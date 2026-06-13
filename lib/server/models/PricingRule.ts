import mongoose, { model, models } from "mongoose";
import { baseSchemaOptions, Schema } from "@/lib/server/models/helpers";

const PricingRuleSchema = new Schema(
  {
    ruleVersion: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    baseFare: {
      type: Number,
      required: true,
      min: 0,
    },
    distanceRate: {
      type: Number,
      required: true,
      min: 0,
    },
    timeRate: {
      type: Number,
      required: true,
      min: 0,
    },
    packageHandlingFees: {
      type: Schema.Types.Mixed,
      default: {},
    },
    urgencyMultipliers: {
      type: Schema.Types.Mixed,
      default: {},
    },
    zoneDifficultyRules: {
      type: Schema.Types.Mixed,
      default: {},
    },
    fareFloor: {
      type: Number,
      required: true,
      min: 0,
    },
    fareCap: {
      type: Number,
      required: true,
      min: 0,
    },
    surchargeCap: {
      type: Number,
      required: true,
      min: 0,
    },
    discountCap: {
      type: Number,
      required: true,
      min: 0,
    },
    quoteExpiryMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    active: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  baseSchemaOptions
);

PricingRuleSchema.index({ active: 1, createdAt: -1 });

export const PricingRuleModel =
  models.PricingRule || model("PricingRule", PricingRuleSchema);

export type PricingRuleDocument = mongoose.InferSchemaType<
  typeof PricingRuleSchema
>;
