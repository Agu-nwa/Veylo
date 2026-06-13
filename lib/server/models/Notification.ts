import mongoose, { model, models } from "mongoose";
import { baseSchemaOptions, Schema } from "@/lib/server/models/helpers";

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    channel: {
      type: String,
      enum: ["IN_APP", "EMAIL", "SMS", "WHATSAPP"],
      default: "IN_APP",
      index: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    readAt: {
      type: Date,
    },
  },
  baseSchemaOptions
);

NotificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 });

export const NotificationModel =
  models.Notification || model("Notification", NotificationSchema);

export type NotificationDocument = mongoose.InferSchemaType<
  typeof NotificationSchema
>;
