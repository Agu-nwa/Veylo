import { createAuditLog } from "@/lib/server/audit/audit";
import type { SessionUser } from "@/lib/server/auth/types";
import { AppError } from "@/lib/server/errors";
import { BusinessProfileModel } from "@/lib/server/models/BusinessProfile";
import { BusinessRequestModel } from "@/lib/server/models/BusinessRequest";
import { DeliveryOrderModel } from "@/lib/server/models/DeliveryOrder";
import type {
  BusinessDeliveryInput,
  BusinessRequestInput,
} from "@/lib/server/business/schemas";
import { generatePricingQuote } from "@/lib/server/pricing/engine";

export async function createBusinessRequest(input: BusinessRequestInput) {
  const request = await BusinessRequestModel.create({
    businessName: input.businessName,
    businessType: input.businessType,
    contactName: input.contactName,
    contactPhone: input.contactPhone,
    contactEmail: input.contactEmail,
    weeklyDeliveryEstimate: input.weeklyDeliveryEstimate,
    message: input.message,
    status: "PENDING",
  });

  await createAuditLog({
    actorRole: "SYSTEM",
    action: "BUSINESS_REQUEST_CREATED",
    entityType: "BusinessRequest",
    entityId: String(request._id),
    after: {
      businessName: request.businessName,
      businessType: request.businessType,
      status: request.status,
    },
  });

  return request;
}

export async function getBusinessProfileForUser(user: SessionUser) {
  if (user.role !== "BUSINESS" && user.role !== "ADMIN") {
    throw new AppError("Business access required", 403, "BUSINESS_ACCESS_REQUIRED");
  }

  if (user.role === "ADMIN") {
    return null;
  }

  const profile = await BusinessProfileModel.findOne({ userId: user.userId });

  if (!profile) {
    throw new AppError(
      "Business profile not found",
      404,
      "BUSINESS_PROFILE_NOT_FOUND"
    );
  }

  return profile;
}

export async function getBusinessDashboard(user: SessionUser) {
  const profile = await getBusinessProfileForUser(user);

  if (user.role === "ADMIN") {
    const [activeBusinesses, pendingRequests, totalOrders] = await Promise.all([
      BusinessProfileModel.countDocuments({ accountStatus: "ACTIVE" }),
      BusinessRequestModel.countDocuments({ status: { $in: ["PENDING", "UNDER_REVIEW"] } }),
      DeliveryOrderModel.countDocuments({ businessId: { $exists: true, $ne: null } }),
    ]);

    return {
      scope: "ADMIN",
      activeBusinesses,
      pendingRequests,
      totalBusinessOrders: totalOrders,
    };
  }

  const orders = await DeliveryOrderModel.find({ businessId: profile?._id })
    .sort({ createdAt: -1 })
    .limit(20);

  const completedCount = orders.filter((order) =>
    ["DELIVERED", "CLOSED"].includes(order.status)
  ).length;

  const totalSpend = orders.reduce(
    (sum, order) => sum + Number(order.fare || 0),
    0
  );

  return {
    scope: "BUSINESS",
    profile,
    metrics: {
      recentOrders: orders.length,
      completedCount,
      activeCount: orders.length - completedCount,
      totalSpend,
      currency: "NGN",
    },
    recentOrders: orders,
  };
}

export async function getBusinessHistory(user: SessionUser) {
  const profile = await getBusinessProfileForUser(user);

  if (user.role === "ADMIN") {
    return DeliveryOrderModel.find({ businessId: { $exists: true, $ne: null } })
      .sort({ createdAt: -1 })
      .limit(100);
  }

  return DeliveryOrderModel.find({ businessId: profile?._id })
    .sort({ createdAt: -1 })
    .limit(100);
}

export async function getBusinessReports(user: SessionUser) {
  const profile = await getBusinessProfileForUser(user);

  const query =
    user.role === "ADMIN"
      ? { businessId: { $exists: true, $ne: null } }
      : { businessId: profile?._id };

  const orders = await DeliveryOrderModel.find(query)
    .sort({ createdAt: -1 })
    .limit(500);

  const totalSpend = orders.reduce(
    (sum, order) => sum + Number(order.fare || 0),
    0
  );

  const completed = orders.filter((order) =>
    ["DELIVERED", "CLOSED"].includes(order.status)
  );

  const failedOrReviewed = orders.filter((order) =>
    ["FAILED_PICKUP", "FAILED_DELIVERY", "DISPUTED"].includes(order.status)
  );

  return {
    businessId: profile ? String(profile._id) : "ADMIN_ALL",
    currency: "NGN",
    orderCount: orders.length,
    completedCount: completed.length,
    failedOrReviewedCount: failedOrReviewed.length,
    totalSpend,
    averageFare: orders.length ? Math.round(totalSpend / orders.length) : 0,
    discountPlaceholder:
      "Plan discounts are applied during quote generation and will be fully reportable after payment integration.",
    rows: orders.map((order) => ({
      orderId: order.orderId,
      route: `${order.pickup?.address || ""} → ${order.dropoff?.address || ""}`,
      status: order.status,
      fare: order.fare,
      createdAt: order.createdAt,
    })),
  };
}

export async function getBusinessPlan(user: SessionUser) {
  const profile = await getBusinessProfileForUser(user);

  if (user.role === "ADMIN") {
    return {
      scope: "ADMIN",
      plans: ["PAY_AS_YOU_GO", "GROWTH_VENDOR", "CORPORATE"],
    };
  }

  return {
    profile,
    planType: profile?.planType,
    approvedDiscountRate: profile?.approvedDiscountRate ?? 0,
    discountCap: profile?.discountCap ?? 0,
    accountStatus: profile?.accountStatus,
    planNote:
      "Business plan pricing is enforced by backend pricing rules and discount caps.",
  };
}

export async function createBusinessDeliveryQuote(
  user: SessionUser,
  input: BusinessDeliveryInput
) {
  if (!input.restrictedItemConfirmed) {
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

  const profile = await getBusinessProfileForUser(user);

  if (!profile) {
    throw new AppError("Business profile required", 403, "BUSINESS_PROFILE_REQUIRED");
  }

  const quote = await generatePricingQuote(
    {
      serviceType: "BUSINESS_DELIVERY",
      pickupAddress: input.pickupAddress,
      pickupLandmark: input.pickupLandmark,
      dropoffAddress: input.dropoffAddress,
      dropoffLandmark: input.dropoffLandmark,
      packageCategory: input.packageCategory,
      urgency: input.urgency,
      valueBand: input.valueBand,
      isBusinessAccount: true,
      businessId: String(profile._id),
    },
    user
  );

  await createAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "BUSINESS_DELIVERY_QUOTE_CREATED",
    entityType: "PricingQuote",
    entityId: quote.quoteId,
    after: {
      quoteId: quote.quoteId,
      businessId: String(profile._id),
      finalFare: quote.finalFare,
    },
  });

  return {
    quote,
    nextAction:
      "Accept this quote, then create an order from the accepted quote using /api/orders.",
  };
}
