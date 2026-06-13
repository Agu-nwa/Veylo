import mongoose, { model, models } from "mongoose";
import { baseSchemaOptions, Schema } from "@/lib/server/models/helpers";

const DISPUTE_STATUSES = ["OPEN", "REVIEWING", "RESOLVED", "REJECTED", "CLOSED"] as const;

const DisputeSchema = new Schema(
  {
    disputeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    raisedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: DISPUTE_STATUSES,
      default: "OPEN",
      index: true,
    },
    customerClaim: {
      type: String,
      trim: true,
      maxlength: 4000,
    },
    riderNote: {
      type: String,
      trim: true,
      maxlength: 4000,
    },
    adminDecision: {
      type: String,
      trim: true,
      maxlength: 4000,
    },
    evidence: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    resolution: {
      type: String,
      trim: true,
      maxlength: 4000,
    },
  },
  baseSchemaOptions
);

DisputeSchema.index({ status: 1, createdAt: -1 });

export const DisputeModel = models.Dispute || model("Dispute", DisputeSchema);

export type DisputeDocument = mongoose.InferSchemaType<typeof DisputeSchema>;
