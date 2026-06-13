import type { SessionUser } from "@/lib/server/auth/types";
import { OrderTimelineEventModel } from "@/lib/server/models/OrderTimelineEvent";
import type { OrderStatus } from "@/lib/server/orders/state-machine";
import { getOrderStatusLabel } from "@/lib/server/orders/state-machine";

export async function createTimelineEvent({
  orderId,
  status,
  detail,
  actor,
  metadata,
}: {
  orderId: string;
  status: OrderStatus;
  detail: string;
  actor?: SessionUser | null;
  metadata?: Record<string, unknown>;
}) {
  return OrderTimelineEventModel.create({
    orderId,
    status,
    label: getOrderStatusLabel(status),
    detail,
    actorId: actor?.userId,
    actorRole: actor?.role ?? "SYSTEM",
    metadata: metadata ?? {},
  });
}

export async function getOrderTimeline(orderId: string) {
  return OrderTimelineEventModel.find({ orderId }).sort({ createdAt: 1 });
}
