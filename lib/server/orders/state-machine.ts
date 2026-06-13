import { AppError } from "@/lib/server/errors";
import { ORDER_STATUSES } from "@/lib/server/security/enums";

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  CREATED: "Order created",
  QUOTED: "Fare quoted",
  ASSIGNING_RIDER: "Assigning rider",
  RIDER_ASSIGNED: "Rider assigned",
  RIDER_EN_ROUTE: "Rider en route",
  ARRIVED_PICKUP: "Rider arrived at pickup",
  PICKED_UP: "Item picked up",
  IN_TRANSIT: "Delivery in transit",
  ARRIVED_DROPOFF: "Rider arrived at drop-off",
  DELIVERED: "Delivered",
  FAILED_PICKUP: "Pickup failed",
  FAILED_DELIVERY: "Delivery failed",
  DISPUTED: "Disputed",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
};

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  CREATED: ["ASSIGNING_RIDER", "CANCELLED"],
  QUOTED: ["ASSIGNING_RIDER", "CANCELLED"],
  ASSIGNING_RIDER: ["RIDER_ASSIGNED", "CANCELLED", "FAILED_PICKUP"],
  RIDER_ASSIGNED: ["RIDER_EN_ROUTE", "CANCELLED", "FAILED_PICKUP"],
  RIDER_EN_ROUTE: ["ARRIVED_PICKUP", "FAILED_PICKUP", "CANCELLED"],
  ARRIVED_PICKUP: ["PICKED_UP", "FAILED_PICKUP", "CANCELLED"],
  PICKED_UP: ["IN_TRANSIT", "DISPUTED"],
  IN_TRANSIT: ["ARRIVED_DROPOFF", "FAILED_DELIVERY", "DISPUTED"],
  ARRIVED_DROPOFF: ["DELIVERED", "FAILED_DELIVERY", "DISPUTED"],
  DELIVERED: ["CLOSED", "DISPUTED"],
  FAILED_PICKUP: ["CLOSED", "DISPUTED"],
  FAILED_DELIVERY: ["CLOSED", "DISPUTED"],
  DISPUTED: ["CLOSED"],
  CLOSED: [],
  CANCELLED: [],
};

export function assertLegalOrderTransition(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus
) {
  const allowed = allowedTransitions[currentStatus] ?? [];

  if (!allowed.includes(nextStatus)) {
    throw new AppError(
      `Illegal order transition from ${currentStatus} to ${nextStatus}`,
      409,
      "ILLEGAL_ORDER_TRANSITION",
      {
        currentStatus,
        nextStatus,
        allowed,
      }
    );
  }
}

export function getOrderStatusLabel(status: OrderStatus) {
  return ORDER_STATUS_LABELS[status] ?? status;
}
