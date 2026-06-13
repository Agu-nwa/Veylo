import mongoose, { model, models } from "mongoose";
import { ORDER_STATUSES, USER_ROLES } from "@/lib/server/security/enums";
import { baseSchemaOptions, Schema } from "@/lib/server/models/helpers";

const OrderTimelineEventSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      required: true,
      index: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    detail: {
      type: String,
      required: true,
      trim: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    actorRole: {
      type: String,
      enum: [...USER_ROLES, "SYSTEM"],
      default: "SYSTEM",
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  baseSchemaOptions
);

OrderTimelineEventSchema.index({ orderId: 1, createdAt: 1 });

export const OrderTimelineEventModel =
  models.OrderTimelineEvent ||
  model("OrderTimelineEvent", OrderTimelineEventSchema);

export type OrderTimelineEventDocument = mongoose.InferSchemaType<
  typeof OrderTimelineEventSchema
>;
