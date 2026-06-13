import { createAuditLog } from "@/lib/server/audit/audit";
import type { SessionUser } from "@/lib/server/auth/types";
import { AppError } from "@/lib/server/errors";
import { DeliveryOrderModel } from "@/lib/server/models/DeliveryOrder";
import { ProofModel } from "@/lib/server/models/Proof";
import type { ProofCreateInput } from "@/lib/server/proofs/schemas";

export async function canAccessOrderProofs(order: any, user: SessionUser) {
  if (user.role === "ADMIN") return true;
  if (String(order.customerId) === user.userId) return true;
  if (String(order.riderId || "") === user.userId) return true;
  if (user.role === "BUSINESS" && order.businessId) return true;
  return false;
}

export async function createProof(input: ProofCreateInput, user: SessionUser) {
  const order = await DeliveryOrderModel.findOne({ orderId: input.orderId });

  if (!order) {
    throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  }

  const allowed = await canAccessOrderProofs(order, user);

  if (!allowed) {
    throw new AppError("Permission denied", 403, "FORBIDDEN");
  }

  if (input.proofType === "PHOTO_PROOF" && !input.imageUrl) {
    throw new AppError(
      "Photo proof requires an imageUrl",
      422,
      "PHOTO_PROOF_IMAGE_REQUIRED"
    );
  }

  const proof = await ProofModel.create({
    orderId: input.orderId,
    proofType: input.proofType,
    uploadedBy: user.userId,
    imageUrl: input.imageUrl,
    note: input.note,
    metadata: input.metadata,
  });

  await createAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "PROOF_UPLOADED",
    entityType: "Proof",
    entityId: String(proof._id),
    after: {
      orderId: input.orderId,
      proofType: input.proofType,
      imageUrl: input.imageUrl,
    },
  });

  return proof;
}

export async function listOrderProofs(orderId: string, user: SessionUser) {
  const order = await DeliveryOrderModel.findOne({ orderId });

  if (!order) {
    throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  }

  const allowed = await canAccessOrderProofs(order, user);

  if (!allowed) {
    throw new AppError("Permission denied", 403, "FORBIDDEN");
  }

  return ProofModel.find({ orderId }).sort({ createdAt: -1 });
}
