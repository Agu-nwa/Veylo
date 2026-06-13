import { connectDB } from "@/lib/server/db";
import type { UserRole } from "@/lib/server/auth/types";
import { AuditLogModel } from "@/lib/server/models/AuditLog";

export type AuditAction =
  | "AUTH_REGISTER"
  | "AUTH_LOGIN"
  | "AUTH_LOGOUT"
  | "QUOTE_GENERATED"
  | "QUOTE_ACCEPTED"
  | "QUOTE_EXPIRED"
  | "ORDER_CREATED"
  | "ORDER_STATUS_CHANGED"
  | "RIDER_ASSIGNED"
  | "ADMIN_OVERRIDE"
  | "PRICING_RULE_UPDATED"
  | "SUPPORT_TICKET_CREATED"
  | "PROOF_UPLOADED"
  | "BUSINESS_REQUEST_CREATED"
  | "BUSINESS_DELIVERY_QUOTE_CREATED"
  | "DISPUTE_UPDATED";

export interface AuditPayload {
  actorId?: string;
  actorRole?: UserRole | "SYSTEM";
  action: AuditAction;
  entityType: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(payload: AuditPayload) {
  try {
    await connectDB();

    const auditLog = await AuditLogModel.create({
      actorId: payload.actorId,
      actorRole: payload.actorRole ?? "SYSTEM",
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId,
      before: payload.before,
      after: payload.after,
      reason: payload.reason,
      ipAddress: payload.ipAddress,
      userAgent: payload.userAgent,
    });

    if (process.env.NODE_ENV !== "production") {
      console.info(
        "[VEYLO_AUDIT_PERSISTED]",
        JSON.stringify({
          action: payload.action,
          entityType: payload.entityType,
          entityId: payload.entityId,
        })
      );
    }

    return auditLog;
  } catch (error) {
    // Audit logging must never break the main user operation.
    // In production this should be monitored and alerted.
    console.error("[VEYLO_AUDIT_ERROR]", error);

    if (process.env.NODE_ENV !== "production") {
      console.info("[VEYLO_AUDIT_FALLBACK]", JSON.stringify(payload));
    }

    return null;
  }
}
