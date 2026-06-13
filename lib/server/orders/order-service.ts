import { createAuditLog } from "@/lib/server/audit/audit";
import type { SessionUser } from "@/lib/server/auth/types";
import { AppError } from "@/lib/server/errors";
import { DeliveryOrderModel } from "@/lib/server/models/DeliveryOrder";
import { PricingQuoteModel } from "@/lib/server/models/PricingQuote";
import type { CreateOrderInput } from "@/lib/server/orders/schemas";
import { createOrderId, createOtp, hashOtp } from "@/lib/server/orders/helpers";
import { createTimelineEvent, getOrderTimeline } from "@/lib/server/orders/timeline";
import type { OrderStatus } from "@/lib/server/orders/state-machine";
import { assertLegalOrderTransition } from "@/lib/server/orders/state-machine";

export async function createOrderFromQuote(input: CreateOrderInput, user: SessionUser) {
  if (!input.package.restrictedItemConfirmed) {
    throw new AppError(
      "Restricted item confirmation is required",
      422,
      "RESTRICTED_ITEM_CONFIRMATION_REQUIRED"
    );
  }

  if (!input.waitingRuleAccepted) {
    throw new AppError(
      "Waiting rule acceptance is required",
      422,
      "WAITING_RULE_ACCEPTANCE_REQUIRED"
    );
  }

  const quote = await PricingQuoteModel.findOne({ quoteId: input.quoteId });

  if (!quote) {
    throw new AppError("Quote not found", 404, "QUOTE_NOT_FOUND");
  }

  if (quote.status !== "QUOTE_ACCEPTED") {
    throw new AppError(
      "Quote must be accepted before creating an order",
      409,
      "QUOTE_NOT_ACCEPTED",
      {
        quoteStatus: quote.status,
      }
    );
  }

  if (new Date() > new Date(quote.validUntil)) {
    quote.status = "QUOTE_EXPIRED";
    quote.expiredAt = new Date();
    await quote.save();

    throw new AppError("Quote has expired", 409, "QUOTE_EXPIRED");
  }

  const existingOrder = await DeliveryOrderModel.findOne({
    quoteId: quote.quoteId,
  });

  if (existingOrder) {
    throw new AppError(
      "An order already exists for this quote",
      409,
      "ORDER_ALREADY_EXISTS"
    );
  }

  const pickupOtp = createOtp();
  const deliveryOtp = createOtp();

  const order = await DeliveryOrderModel.create({
    orderId: createOrderId(),
    customerId: user.userId,
    businessId: quote.businessId,
    quoteId: quote.quoteId,
    serviceType: quote.serviceType,
    pickup: input.pickup,
    dropoff: input.dropoff,
    package: input.package,
    fare: quote.finalFare,
    status: "ASSIGNING_RIDER",
    pickupOtpHash: await hashOtp(pickupOtp),
    deliveryOtpHash: await hashOtp(deliveryOtp),
    paymentStatus: "PENDING",
    supportStatus: "NONE",
    cancellationStatus: "NONE",
  });

  await createTimelineEvent({
    orderId: order.orderId,
    status: "CREATED",
    detail: "Customer created a delivery order from an accepted quote.",
    actor: user,
    metadata: {
      quoteId: quote.quoteId,
      finalFare: quote.finalFare,
    },
  });

  await createTimelineEvent({
    orderId: order.orderId,
    status: "ASSIGNING_RIDER",
    detail: "Veylo is assigning a verified rider for this delivery.",
    actor: user,
  });

  await createAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "ORDER_CREATED",
    entityType: "DeliveryOrder",
    entityId: order.orderId,
    after: {
      orderId: order.orderId,
      quoteId: quote.quoteId,
      status: order.status,
      fare: order.fare,
    },
  });

  const timeline = await getOrderTimeline(order.orderId);

  return {
    order,
    timeline,
    pickupOtp,
    deliveryOtp,
  };
}

export async function findOrderForUser(orderId: string, user: SessionUser) {
  const order = await DeliveryOrderModel.findOne({ orderId });

  if (!order) {
    throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  }

  if (
    user.role !== "ADMIN" &&
    String(order.customerId) !== user.userId &&
    String(order.riderId || "") !== user.userId
  ) {
    throw new AppError("Permission denied", 403, "FORBIDDEN");
  }

  const timeline = await getOrderTimeline(order.orderId);

  return {
    order,
    timeline,
  };
}

export async function listOrdersForUser(user: SessionUser) {
  if (user.role === "ADMIN") {
    return DeliveryOrderModel.find().sort({ createdAt: -1 }).limit(100);
  }

  if (user.role === "RIDER") {
    return DeliveryOrderModel.find({ riderId: user.userId })
      .sort({ createdAt: -1 })
      .limit(100);
  }

  return DeliveryOrderModel.find({ customerId: user.userId })
    .sort({ createdAt: -1 })
    .limit(100);
}

export async function updateOrderStatus({
  orderId,
  nextStatus,
  actor,
  detail,
  reason,
}: {
  orderId: string;
  nextStatus: OrderStatus;
  actor: SessionUser;
  detail: string;
  reason?: string;
}) {
  const order = await DeliveryOrderModel.findOne({ orderId });

  if (!order) {
    throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  }

  const previousStatus = order.status as OrderStatus;

  assertLegalOrderTransition(previousStatus, nextStatus);

  order.status = nextStatus;
  await order.save();

  await createTimelineEvent({
    orderId: order.orderId,
    status: nextStatus,
    detail,
    actor,
    metadata: {
      previousStatus,
      reason,
    },
  });

  await createAuditLog({
    actorId: actor.userId,
    actorRole: actor.role,
    action: "ORDER_STATUS_CHANGED",
    entityType: "DeliveryOrder",
    entityId: order.orderId,
    before: {
      status: previousStatus,
    },
    after: {
      status: nextStatus,
    },
    reason,
  });

  const timeline = await getOrderTimeline(order.orderId);

  return {
    order,
    timeline,
  };
}
