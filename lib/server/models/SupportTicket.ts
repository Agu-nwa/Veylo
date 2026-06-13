import mongoose, { model, models } from "mongoose";
import { SUPPORT_CATEGORIES } from "@/lib/server/security/enums";
import { baseSchemaOptions, Schema } from "@/lib/server/models/helpers";

const TICKET_STATUSES = ["OPEN", "UNDER_REVIEW", "WAITING_FOR_USER", "RESOLVED", "CLOSED"] as const;
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

const SupportTicketSchema = new Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderId: {
      type: String,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    riderId: {
      type: Schema.Types.ObjectId,
      ref: "RiderProfile",
      index: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "BusinessProfile",
      index: true,
    },
    category: {
      type: String,
      enum: SUPPORT_CATEGORIES,
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    evidenceUrls: {
      type: [String],
      default: [],
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: TICKET_STATUSES,
      default: "OPEN",
      index: true,
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: "MEDIUM",
      index: true,
    },
    assignedAdminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    resolutionNote: {
      type: String,
      trim: true,
      maxlength: 4000,
    },
  },
  baseSchemaOptions
);

SupportTicketSchema.index({ status: 1, priority: 1, createdAt: -1 });

export const SupportTicketModel =
  models.SupportTicket || model("SupportTicket", SupportTicketSchema);

export type SupportTicketDocument = mongoose.InferSchemaType<
  typeof SupportTicketSchema
>;
