import mongoose from "mongoose";

export const { Schema } = mongoose;

export function toJSONTransform(_: unknown, ret: Record<string, unknown>) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  delete ret.passwordHash;
  delete ret.pickupOtpHash;
  delete ret.deliveryOtpHash;
  return ret;
}

export const baseSchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: toJSONTransform,
  },
  toObject: {
    virtuals: true,
    transform: toJSONTransform,
  },
};
