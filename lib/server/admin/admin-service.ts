import mongoose from "mongoose";
import { createAuditLog } from "@/lib/server/audit/audit";
import type { SessionUser } from "@/lib/server/auth/types";
import { AppError } from "@/lib/server/errors";
import { AuditLogModel } from "@/lib/server/models/AuditLog";
import { BusinessProfileModel } from "@/lib/server/models/BusinessProfile";
import { BusinessRequestModel } from "@/lib/server/models/BusinessRequest";
import { DeliveryOrderModel } from "@/lib/server/models/DeliveryOrder";
import { DisputeModel } from "@/lib/server/models/Dispute";
import { PricingQuoteModel } from "@/lib/server/models/PricingQuote";
import { PricingRuleModel } from "@/lib/server/models/PricingRule";
import { RiderProfileModel } from "@/lib/server/models/RiderProfile";
import { UserModel } from "@/lib/server/models/User";
import { SupportTicketModel } from "@/lib/server/models/SupportTicket";
import { createTimelineEvent } from "@/lib/server/orders/timeline";
import {
  assertLegalOrderTransition,
  type OrderStatus,
} from "@/lib/server/orders/state-machine";
import { getActivePricingRule } from "@/lib/server/pricing/rules";
import { updateOrderStatus } from "@/lib/server/orders/order-service";
import type {
  AssignRiderInput,
  BusinessStatusInput,
  DisputeUpdateInput,
  PricingRuleUpdateInput,
  RiderVerificationInput,
} from "@/lib/server/admin/schemas";

function assertAdmin(user: SessionUser) {
  if (user.role !== "ADMIN") {
    throw new AppError("Admin access required", 403, "ADMIN_ACCESS_REQUIRED");
  }
}

function findByIdOrPublicId(model: any, id: string, publicField: string) {
  const conditions: any[] = [{ [publicField]: id }];

  if (mongoose.Types.ObjectId.isValid(id)) {
    conditions.push({ _id: id });
  }

  return model.findOne({ $or: conditions });
}

export async function getAdminDispatch(user: SessionUser) {
  assertAdmin(user);

  const dispatchStatuses = [
    "ASSIGNING_RIDER",
    "RIDER_ASSIGNED",
    "RIDER_EN_ROUTE",
    "ARRIVED_PICKUP",
    "PICKED_UP",
    "IN_TRANSIT",
    "ARRIVED_DROPOFF",
    "FAILED_PICKUP",
    "FAILED_DELIVERY",
  ];

  const [queue, pendingAssignment, activeJobs, failedRisk, verifiedRiders] =
    await Promise.all([
      DeliveryOrderModel.find({ status: { $in: dispatchStatuses } })
        .sort({ createdAt: -1 })
        .limit(100),
      DeliveryOrderModel.countDocuments({ status: "ASSIGNING_RIDER" }),
      DeliveryOrderModel.countDocuments({
        status: {
          $in: [
            "RIDER_ASSIGNED",
            "RIDER_EN_ROUTE",
            "ARRIVED_PICKUP",
            "PICKED_UP",
            "IN_TRANSIT",
            "ARRIVED_DROPOFF",
          ],
        },
      }),
      DeliveryOrderModel.countDocuments({
        status: { $in: ["FAILED_PICKUP", "FAILED_DELIVERY", "DISPUTED"] },
      }),
      RiderProfileModel.countDocuments({ verificationStatus: "VERIFIED" }),
    ]);

  return {
    metrics: {
      pendingAssignment,
      activeJobs,
      failedRisk,
      verifiedRiders,
    },
    queue,
  };
}

export async function listAdminOrders(user: SessionUser) {
  assertAdmin(user);

  return DeliveryOrderModel.find().sort({ createdAt: -1 }).limit(200);
}

export async function adminUpdateOrderStatus(
  user: SessionUser,
  orderId: string,
  input: { status: OrderStatus; detail?: string; reason: string }
) {
  assertAdmin(user);

  return updateOrderStatus({
    orderId,
    nextStatus: input.status,
    actor: user,
    detail: input.detail || `Admin updated order status to ${input.status}.`,
    reason: input.reason,
  });
}

export async function adminAssignRider(
  user: SessionUser,
  orderId: string,
  input: AssignRiderInput
) {
  assertAdmin(user);

  const order = await DeliveryOrderModel.findOne({ orderId });

  if (!order) {
    throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
  }

  const rider = await RiderProfileModel.findById(input.riderProfileId);

  if (!rider) {
    throw new AppError("Rider not found", 404, "RIDER_NOT_FOUND");
  }

  if (rider.verificationStatus !== "VERIFIED") {
    throw new AppError(
      "Only verified riders can be assigned",
      409,
      "RIDER_NOT_VERIFIED",
      {
        verificationStatus: rider.verificationStatus,
      }
    );
  }

  const previousStatus = order.status as OrderStatus;

  if (previousStatus !== "RIDER_ASSIGNED") {
    assertLegalOrderTransition(previousStatus, "RIDER_ASSIGNED");
  }

  const before = {
    status: order.status,
    riderId: order.riderId ? String(order.riderId) : null,
  };

  order.riderId = rider._id;
  order.status = "RIDER_ASSIGNED";
  await order.save();

  await createTimelineEvent({
    orderId: order.orderId,
    status: "RIDER_ASSIGNED",
    detail: "Admin assigned a verified rider to this order.",
    actor: user,
    metadata: {
      riderProfileId: String(rider._id),
      reason: input.reason,
    },
  });

  await createAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "RIDER_ASSIGNED",
    entityType: "DeliveryOrder",
    entityId: order.orderId,
    before,
    after: {
      status: order.status,
      riderId: String(rider._id),
    },
    reason: input.reason,
  });

  return {
    order,
    rider,
  };
}


function hasApprovedRiderDocument(rider: any, documentType: string) {
  return (rider.documents ?? []).some(
    (document: any) =>
      document.type === documentType && document.status === "APPROVED"
  );
}

function assertRiderVerificationReadiness(rider: any) {
  const hasGovernmentId = hasApprovedRiderDocument(rider, "GOVERNMENT_ID");
  const hasTraining = hasApprovedRiderDocument(
    rider,
    "TRAINING_ACKNOWLEDGEMENT"
  );
  const hasBikeDocument =
    hasApprovedRiderDocument(rider, "BIKE_DOCUMENT") ||
    hasApprovedRiderDocument(rider, "BIKE_PERMISSION");

  const missing = [];

  if (!hasGovernmentId) missing.push("approved government ID");
  if (!hasBikeDocument) missing.push("approved bike document or bike permission");
  if (!hasTraining) missing.push("approved training acknowledgement");

  if (missing.length) {
    throw new AppError(
      `Rider cannot be verified until they have ${missing.join(", ")}.`,
      422,
      "RIDER_VERIFICATION_REQUIREMENTS_NOT_MET",
      {
        missing,
      }
    );
  }
}

export async function listAdminRiders(user: SessionUser) {
  assertAdmin(user);

  return RiderProfileModel.find().sort({ createdAt: -1 }).limit(200);
}

export async function adminUpdateRiderVerification(
  user: SessionUser,
  riderId: string,
  input: RiderVerificationInput
) {
  assertAdmin(user);

  const rider = await RiderProfileModel.findById(riderId);

  if (!rider) {
    throw new AppError("Rider not found", 404, "RIDER_NOT_FOUND");
  }

  const before = {
    verificationStatus: rider.verificationStatus,
    tier: rider.tier,
    suspensionStatus: rider.suspensionStatus,
  };

  if (input.verificationStatus === "VERIFIED") {
    assertRiderVerificationReadiness(rider);
  }

  rider.verificationStatus = input.verificationStatus;

  if (input.tier) rider.tier = input.tier;
  if (input.suspensionStatus) rider.suspensionStatus = input.suspensionStatus;

  if (input.verificationStatus === "SUSPENDED") {
    rider.tier = "SUSPENDED";
    rider.suspensionStatus = input.suspensionStatus || "TEMPORARY";
  }

  await rider.save();

  if (input.verificationStatus === "VERIFIED") {
    const linkedUser = await UserModel.findById(rider.userId);

    if (linkedUser && linkedUser.role !== "ADMIN") {
      linkedUser.role = "RIDER";
      linkedUser.accountStatus = "ACTIVE";
      linkedUser.verificationStatus = "VERIFIED";
      await linkedUser.save();
    }
  }

  await createAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "ADMIN_OVERRIDE",
    entityType: "RiderProfile",
    entityId: String(rider._id),
    before,
    after: {
      verificationStatus: rider.verificationStatus,
      tier: rider.tier,
      suspensionStatus: rider.suspensionStatus,
    },
    reason: input.reason,
  });

  return rider;
}

export async function listAdminBusinesses(user: SessionUser) {
  assertAdmin(user);

  const [profiles, requests] = await Promise.all([
    BusinessProfileModel.find().sort({ createdAt: -1 }).limit(200),
    BusinessRequestModel.find().sort({ createdAt: -1 }).limit(100),
  ]);

  return {
    profiles,
    requests,
  };
}

export async function adminUpdateBusinessStatus(
  user: SessionUser,
  businessId: string,
  input: BusinessStatusInput
) {
  assertAdmin(user);

  const business = await BusinessProfileModel.findById(businessId);

  if (!business) {
    throw new AppError("Business profile not found", 404, "BUSINESS_NOT_FOUND");
  }

  const before = {
    accountStatus: business.accountStatus,
    planType: business.planType,
    approvedDiscountRate: business.approvedDiscountRate,
    discountCap: business.discountCap,
  };

  business.accountStatus = input.accountStatus;
  if (input.planType) business.planType = input.planType;
  if (typeof input.approvedDiscountRate === "number") {
    business.approvedDiscountRate = input.approvedDiscountRate;
  }
  if (typeof input.discountCap === "number") {
    business.discountCap = input.discountCap;
  }

  await business.save();

  await createAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "ADMIN_OVERRIDE",
    entityType: "BusinessProfile",
    entityId: String(business._id),
    before,
    after: {
      accountStatus: business.accountStatus,
      planType: business.planType,
      approvedDiscountRate: business.approvedDiscountRate,
      discountCap: business.discountCap,
    },
    reason: input.reason,
  });

  return business;
}

export async function listPricingRules(user: SessionUser) {
  assertAdmin(user);

  const rules = await PricingRuleModel.find().sort({ createdAt: -1 }).limit(50);
  const activeRule = await getActivePricingRule();

  return {
    activeRule,
    rules,
  };
}

export async function adminCreatePricingRule(
  user: SessionUser,
  input: PricingRuleUpdateInput
) {
  assertAdmin(user);

  const current = await getActivePricingRule();
  const currentObject = current.toObject();

  const nextRule = {
    ruleVersion: input.ruleVersion || `VEYLO-RULES-${Date.now()}`,
    baseFare: input.baseFare ?? currentObject.baseFare,
    distanceRate: input.distanceRate ?? currentObject.distanceRate,
    timeRate: input.timeRate ?? currentObject.timeRate,
    packageHandlingFees:
      input.packageHandlingFees ?? currentObject.packageHandlingFees ?? {},
    urgencyMultipliers:
      input.urgencyMultipliers ?? currentObject.urgencyMultipliers ?? {},
    zoneDifficultyRules:
      input.zoneDifficultyRules ?? currentObject.zoneDifficultyRules ?? {},
    fareFloor: input.fareFloor ?? currentObject.fareFloor,
    fareCap: input.fareCap ?? currentObject.fareCap,
    surchargeCap: input.surchargeCap ?? currentObject.surchargeCap,
    discountCap: input.discountCap ?? currentObject.discountCap,
    quoteExpiryMinutes:
      input.quoteExpiryMinutes ?? currentObject.quoteExpiryMinutes,
    active: input.active ?? true,
    createdBy: user.userId,
  };

  if (nextRule.active) {
    await PricingRuleModel.updateMany({ active: true }, { active: false });
  }

  const rule = await PricingRuleModel.create(nextRule);

  await createAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "PRICING_RULE_UPDATED",
    entityType: "PricingRule",
    entityId: rule.ruleVersion,
    before: {
      ruleVersion: currentObject.ruleVersion,
    },
    after: nextRule,
    reason: input.reason,
  });

  return rule;
}

export async function listAdminQuotes(user: SessionUser) {
  assertAdmin(user);

  return PricingQuoteModel.find().sort({ createdAt: -1 }).limit(200);
}

export async function listAdminDisputes(user: SessionUser) {
  assertAdmin(user);

  return DisputeModel.find().sort({ createdAt: -1 }).limit(200);
}

export async function adminUpdateDispute(
  user: SessionUser,
  disputeId: string,
  input: DisputeUpdateInput
) {
  assertAdmin(user);

  const dispute = await findByIdOrPublicId(DisputeModel, disputeId, "disputeId");

  if (!dispute) {
    throw new AppError("Dispute not found", 404, "DISPUTE_NOT_FOUND");
  }

  const before = {
    status: dispute.status,
    adminDecision: dispute.adminDecision,
    resolution: dispute.resolution,
  };

  dispute.status = input.status;
  if (input.adminDecision) dispute.adminDecision = input.adminDecision;
  if (input.resolution) dispute.resolution = input.resolution;

  await dispute.save();

  await createAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "DISPUTE_UPDATED",
    entityType: "Dispute",
    entityId: dispute.disputeId,
    before,
    after: {
      status: dispute.status,
      adminDecision: dispute.adminDecision,
      resolution: dispute.resolution,
    },
    reason: input.reason,
  });

  return dispute;
}

export async function getAdminAnalytics(user: SessionUser) {
  assertAdmin(user);

  const [orders, riders, businesses, tickets, quotes, disputes] =
    await Promise.all([
      DeliveryOrderModel.find().select("status fare businessId riderId").limit(5000),
      RiderProfileModel.countDocuments(),
      BusinessProfileModel.countDocuments(),
      SupportTicketModel.countDocuments(),
      PricingQuoteModel.countDocuments(),
      DisputeModel.countDocuments(),
    ]);

  const totalOrders = orders.length;
  const completedOrders = orders.filter((order) =>
    ["DELIVERED", "CLOSED"].includes(order.status)
  ).length;
  const failedOrders = orders.filter((order) =>
    ["FAILED_PICKUP", "FAILED_DELIVERY", "DISPUTED"].includes(order.status)
  ).length;
  const businessOrders = orders.filter((order) => Boolean(order.businessId)).length;
  const totalFare = orders.reduce(
    (sum, order) => sum + Number(order.fare || 0),
    0
  );

  return {
    totalOrders,
    completedOrders,
    failedOrders,
    businessOrders,
    riders,
    businesses,
    tickets,
    quotes,
    disputes,
    totalFare,
    averageFare: totalOrders ? Math.round(totalFare / totalOrders) : 0,
    completionRate: totalOrders
      ? Math.round((completedOrders / totalOrders) * 100)
      : 0,
    failureRate: totalOrders ? Math.round((failedOrders / totalOrders) * 100) : 0,
    currency: "NGN",
  };
}

export async function listAuditLogs(user: SessionUser) {
  assertAdmin(user);

  return AuditLogModel.find().sort({ createdAt: -1 }).limit(200);
}
