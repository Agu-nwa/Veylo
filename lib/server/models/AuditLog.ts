import mongoose, { model, models } from "mongoose";
import { USER_ROLES } from "@/lib/server/security/enums";
import { baseSchemaOptions, Schema } from "@/lib/server/models/helpers";

const AuditLogSchema = new Schema(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    actorRole: {
      type: String,
      enum: [...USER_ROLES, "SYSTEM"],
      default: "SYSTEM",
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      required: true,
      index: true,
    },
    entityId: {
      type: String,
      index: true,
    },
    before: {
      type: Schema.Types.Mixed,
    },
    after: {
      type: Schema.Types.Mixed,
    },
    reason: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  baseSchemaOptions
);

AuditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export const AuditLogModel =
  models.AuditLog || model("AuditLog", AuditLogSchema);

export type AuditLogDocument = mongoose.InferSchemaType<typeof AuditLogSchema>;
