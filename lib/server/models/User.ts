import mongoose, { model, models } from "mongoose";
import { USER_ROLES } from "@/lib/server/security/enums";
import { baseSchemaOptions, Schema } from "@/lib/server/models/helpers";

const ACCOUNT_STATUSES = ["ACTIVE", "PENDING", "SUSPENDED", "CLOSED"] as const;
const VERIFICATION_STATUSES = [
  "UNVERIFIED",
  "PENDING",
  "VERIFIED",
  "REJECTED",
] as const;

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "CUSTOMER",
      index: true,
    },
    accountStatus: {
      type: String,
      enum: ACCOUNT_STATUSES,
      default: "ACTIVE",
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: VERIFICATION_STATUSES,
      default: "UNVERIFIED",
      index: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  baseSchemaOptions
);

UserSchema.index({ role: 1, accountStatus: 1 });
UserSchema.index({ createdAt: -1 });

export const UserModel = models.User || model("User", UserSchema);

export type UserDocument = mongoose.InferSchemaType<typeof UserSchema>;
