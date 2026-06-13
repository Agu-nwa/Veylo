import mongoose, { model, models } from "mongoose";
import { PROOF_TYPES } from "@/lib/server/security/enums";
import { baseSchemaOptions, Schema } from "@/lib/server/models/helpers";

const ProofSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    proofType: {
      type: String,
      enum: PROOF_TYPES,
      required: true,
      index: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  baseSchemaOptions
);

ProofSchema.index({ orderId: 1, proofType: 1, createdAt: -1 });

export const ProofModel = models.Proof || model("Proof", ProofSchema);

export type ProofDocument = mongoose.InferSchemaType<typeof ProofSchema>;
