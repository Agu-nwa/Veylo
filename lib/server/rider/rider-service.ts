import { createAuditLog } from "@/lib/server/audit/audit";
import type { SessionUser } from "@/lib/server/auth/types";
import { AppError } from "@/lib/server/errors";
import { DeliveryOrderModel } from "@/lib/server/models/DeliveryOrder";
import { RiderProfileModel } from "@/lib/server/models/RiderProfile";
import { UserModel } from "@/lib/server/models/User";
import type { RiderProfileUpdateInput } from "@/lib/server/rider/schemas";
import { createTimelineEvent, getOrderTimeline } from "@/lib/server/orders/timeline";
import { assertLegalOrderTransition, type OrderStatus } from "@/lib/server/orders/state-machine";

export async function getRiderProfileForUser(user: SessionUser) {
  if (user.role !== "RIDER" && user.role !== "ADMIN") {
    throw new AppError("Rider access required", 403, "RIDER_ACCESS_REQUIRED");
  }

  if (user.role === "ADMIN") {
    return null;
  }

  const profile = await RiderProfileModel.findOne({ userId: user.userId });

  if (!profile) {
    throw new AppError(
      "Rider profile not found",
      404,
      "RIDER_PROFILE_NOT_FOUND"
    );
  }

  return profile;
}

export async function getOrCreateRiderProfile(user: SessionUser) {
  if (user.role !== "RIDER") {
    throw new AppError("Rider access required", 403, "RIDER_ACCESS_REQUIRED");
  }

  const existing = await RiderProfileModel.findOne({ userId: user.userId });

  if (existing) {
    return existing;
  }

  const account = await UserModel.findById(user.userId);

  if (!account) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return RiderProfileModel.create({
    userId: user.userId,
    displayName: account.fullName,
    phone: account.phone,
    verificationStatus: "PENDING",
    tier: "NEW",
  });
}

export async function updateRiderProfile(
  user: SessionUser,
  input: RiderProfileUpdateInput
) {
  const profile = await getOrCreateRiderProfile(user);

  Object.assign(profile, input);
  await profile.save();

  await createAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "ADMIN_OVERRIDE",
    entityType: "RiderProfile",
    entityId: String(profile._id),
    after: input,
  });

  return profile;
}

export async function listRiderJobs(user: SessionUser) {
  const profile = await getRiderProfileForUser(user);

  if (user.role === "ADMIN") {
    return DeliveryOrderModel.find({
      status: {
        $in: [
          "ASSIGNING_RIDER",
          "RIDER_ASSIGNED",
          "RIDER_EN_ROUTE",
          "ARRIVED_PICKUP",
          "PICKED_UP",
          "IN_TRANSIT",
          "ARRIVED_DROPOFF",
        ],
      },
    })
      .sort({ createdAt: -1 })
      .limit(100);
  }

  return DeliveryOrderModel.find({
    $or: [
      { riderId: profile?._id },
      { riderId: { $exists: false }, status: "ASSIGNING_RIDER" },
      { riderId: null, status: "ASSIGNING_RIDER" },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(100);
}

export async function getRiderJob(user: SessionUser, orderId: string) {
  const profile = await getRiderProfileForUser(user);

  const order = await DeliveryOrderModel.findOne({ orderId });

  if (!order) {
    throw new AppError("Job not found", 404, "RIDER_JOB_NOT_FOUND");
  }

  const isAssignedToRider =
    profile && String(order.riderId || "") === String(profile._id);

  const isOpenOffer =
    !order.riderId && order.status === "ASSIGNING_RIDER";

  if (user.role !== "ADMIN" && !isAssignedToRider && !isOpenOffer) {
    throw new AppError("Permission denied", 403, "FORBIDDEN");
  }

  const timeline = await getOrderTimeline(order.orderId);

  return {
    order,
    timeline,
  };
}

export async function acceptRiderJob(user: SessionUser, orderId: string) {
  const profile = await getRiderProfileForUser(user);

  if (!profile) {
    throw new AppError("Rider profile required", 403, "RIDER_PROFILE_REQUIRED");
  }

  const order = await DeliveryOrderModel.findOne({ orderId });

  if (!order) {
    throw new AppError("Job not found", 404, "RIDER_JOB_NOT_FOUND");
  }

  if (order.riderId && String(order.riderId) !== String(profile._id)) {
    throw new AppError("Job already assigned", 409, "JOB_ALREADY_ASSIGNED");
  }

  if (order.status !== "ASSIGNING_RIDER") {
    throw new AppError(
      "Only assigning jobs can be accepted",
      409,
      "JOB_NOT_ACCEPTABLE",
      {
        status: order.status,
      }
    );
  }

  order.riderId = profile._id;
  order.status = "RIDER_ASSIGNED";
  await order.save();

  await createTimelineEvent({
    orderId: order.orderId,
    status: "RIDER_ASSIGNED",
    detail: "Rider accepted the delivery job.",
    actor: user,
    metadata: {
      riderProfileId: String(profile._id),
    },
  });

  await createAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "RIDER_ASSIGNED",
    entityType: "DeliveryOrder",
    entityId: order.orderId,
    after: {
      riderId: String(profile._id),
      status: order.status,
    },
  });

  const timeline = await getOrderTimeline(order.orderId);

  return {
    order,
    timeline,
  };
}

export async function rejectRiderJob(
  user: SessionUser,
  orderId: string,
  reason: string
) {
  const profile = await getRiderProfileForUser(user);

  if (!profile) {
    throw new AppError("Rider profile required", 403, "RIDER_PROFILE_REQUIRED");
  }

  const order = await DeliveryOrderModel.findOne({ orderId });

  if (!order) {
    throw new AppError("Job not found", 404, "RIDER_JOB_NOT_FOUND");
  }

  await createAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "ADMIN_OVERRIDE",
    entityType: "DeliveryOrder",
    entityId: order.orderId,
    reason,
    after: {
      riderRejected: true,
      riderProfileId: String(profile._id),
    },
  });

  return {
    rejected: true,
    orderId: order.orderId,
    reason,
  };
}

export async function updateRiderJobStatus({
  user,
  orderId,
  status,
  detail,
  reason,
}: {
  user: SessionUser;
  orderId: string;
  status: OrderStatus;
  detail?: string;
  reason?: string;
}) {
  const profile = await getRiderProfileForUser(user);

  if (!profile) {
    throw new AppError("Rider profile required", 403, "RIDER_PROFILE_REQUIRED");
  }

  const order = await DeliveryOrderModel.findOne({ orderId });

  if (!order) {
    throw new AppError("Job not found", 404, "RIDER_JOB_NOT_FOUND");
  }

  if (String(order.riderId || "") !== String(profile._id)) {
    throw new AppError("Permission denied", 403, "FORBIDDEN");
  }

  const previousStatus = order.status as OrderStatus;

  assertLegalOrderTransition(previousStatus, status);

  order.status = status;

  if (status === "DELIVERED") {
    profile.completedJobs += 1;
    profile.completionRate = Math.min(100, profile.completionRate + 1);
    await profile.save();
  }

  await order.save();

  await createTimelineEvent({
    orderId: order.orderId,
    status,
    detail:
      detail ||
      `Rider updated delivery status from ${previousStatus} to ${status}.`,
    actor: user,
    metadata: {
      previousStatus,
      reason,
      riderProfileId: String(profile._id),
    },
  });

  await createAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "ORDER_STATUS_CHANGED",
    entityType: "DeliveryOrder",
    entityId: order.orderId,
    before: {
      status: previousStatus,
    },
    after: {
      status,
    },
    reason,
  });

  const timeline = await getOrderTimeline(order.orderId);

  return {
    order,
    timeline,
  };
}

export async function getRiderEarnings(user: SessionUser) {
  const profile = await getRiderProfileForUser(user);

  if (!profile) {
    throw new AppError("Rider profile required", 403, "RIDER_PROFILE_REQUIRED");
  }

  const deliveredOrders = await DeliveryOrderModel.find({
    riderId: profile._id,
    status: {
      $in: ["DELIVERED", "CLOSED"],
    },
  }).sort({ createdAt: -1 });

  const grossFare = deliveredOrders.reduce(
    (sum, order) => sum + Number(order.fare || 0),
    0
  );

  const estimatedRiderShare = Math.round(grossFare * 0.68);

  return {
    riderProfileId: String(profile._id),
    deliveredJobs: deliveredOrders.length,
    grossFare,
    estimatedRiderShare,
    pendingPayout: estimatedRiderShare,
    currency: "NGN",
    note: "This is a payout placeholder. Real payout rules will be finalized in the payments phase.",
  };
}
