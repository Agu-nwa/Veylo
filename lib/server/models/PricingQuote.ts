import mongoose, { model, models } from "mongoose";
import { QUOTE_STATUSES } from "@/lib/server/security/enums";
import { baseSchemaOptions, Schema } from "@/lib/server/models/helpers";

const PricingQuoteSchema = new Schema(
  {
    quoteId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "BusinessProfile",
      index: true,
    },
    serviceType: {
      type: String,
      required: true,
      index: true,
    },
    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },
    pickupLandmark: {
      type: String,
      trim: true,
    },
    dropoffAddress: {
      type: String,
      required: true,
      trim: true,
    },
    dropoffLandmark: {
      type: String,
      trim: true,
    },
    packageCategory: {
      type: String,
      required: true,
      trim: true,
    },
    urgency: {
      type: String,
      required: true,
      index: true,
    },
    valueBand: {
      type: String,
      required: true,
    },
    distanceKm: {
      type: Number,
      required: true,
      min: 0,
    },
    finalFare: {
      type: Number,
      required: true,
      min: 0,
    },
    fareBreakdown: {
      type: [
        {
          code: String,
          label: String,
          amount: Number,
          kind: String,
          note: String,
        },
      ],
      default: [],
    },
    protections: {
      type: [String],
      default: [],
    },
    summaryFactors: {
      type: [String],
      default: [],
    },
    ruleVersion: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: QUOTE_STATUSES,
      default: "QUOTE_CREATED",
      index: true,
    },
    validUntil: {
      type: Date,
      required: true,
      index: true,
    },
    acceptedAt: Date,
    expiredAt: Date,
    waitingRule: String,
    restrictedItemNotice: String,
  },
  baseSchemaOptions
);

PricingQuoteSchema.index({ customerId: 1, createdAt: -1 });
PricingQuoteSchema.index({ status: 1, validUntil: 1 });

export const PricingQuoteModel =
  models.PricingQuote || model("PricingQuote", PricingQuoteSchema);

export type PricingQuoteDocument = mongoose.InferSchemaType<
  typeof PricingQuoteSchema
>;
