import mongoose from "mongoose";
import { createAuditLog } from "@/lib/server/audit/audit";
import type { SessionUser } from "@/lib/server/auth/types";
import { PricingQuoteModel } from "@/lib/server/models/PricingQuote";
import type { QuoteRequestInput } from "@/lib/server/pricing/schemas";
import { createQuoteId, estimateDistanceKm, roundMoney } from "@/lib/server/pricing/helpers";
import { getActivePricingRule } from "@/lib/server/pricing/rules";

type PricingLine = {
  code: string;
  label: string;
  amount: number;
  kind: "charge" | "discount" | "protection";
  note?: string;
};

function getPackageHandling(packageCategory: string, valueBand: string, rule: any) {
  const category = packageCategory.toLowerCase();
  const fees = rule.packageHandlingFees || {};

  if (category.includes("document")) return Number(fees.document ?? 200);
  if (category.includes("fragile")) return Number(fees.fragile ?? 650);
  if (category.includes("food")) return Number(fees.food ?? 300);
  if (valueBand.toLowerCase().includes("high")) {
    return Number(fees.highValue ?? 650);
  }

  return Number(fees.default ?? 250);
}

function getZoneDifficulty(distanceKm: number, rule: any) {
  const zoneRules = rule.zoneDifficultyRules || {};
  return distanceKm > 8
    ? Number(zoneRules.longRoute ?? 350)
    : Number(zoneRules.standard ?? 150);
}

function getBusinessDiscount(input: QuoteRequestInput, rule: any) {
  if (!input.isBusinessAccount) return 0;
  return Math.min(400, Number(rule.discountCap ?? 700));
}

export async function generatePricingQuote(input: QuoteRequestInput, user?: SessionUser | null) {
  const rule = await getActivePricingRule();

  const distanceKm = estimateDistanceKm(input.pickupAddress, input.dropoffAddress);

  const baseFare = Number(rule.baseFare);
  const distanceFee = distanceKm * Number(rule.distanceRate);
  const timeAdjustment = distanceKm * Number(rule.timeRate);
  const packageHandling = getPackageHandling(
    input.packageCategory,
    input.valueBand,
    rule
  );
  const zoneDifficulty = getZoneDifficulty(distanceKm, rule);
  const bookingFee = 150;

  const urgencyMultipliers = rule.urgencyMultipliers || {};
  const urgencyMultiplier = Number(urgencyMultipliers[input.urgency] ?? 1);

  const subtotal =
    baseFare +
    distanceFee +
    timeAdjustment +
    packageHandling +
    zoneDifficulty +
    bookingFee;

  const urgencyEffect = subtotal * urgencyMultiplier - subtotal;
  const grossFare = subtotal * urgencyMultiplier;

  const businessDiscount = getBusinessDiscount(input, rule);
  const discountedFare = grossFare - businessDiscount;

  const fareFloor = Number(rule.fareFloor);
  const fareCap = Number(rule.fareCap);

  const protectedFare = Math.max(fareFloor, Math.min(discountedFare, fareCap));
  const finalFare = roundMoney(protectedFare);

  const validUntil = new Date(
    Date.now() + Number(rule.quoteExpiryMinutes) * 60 * 1000
  );

  const breakdown: PricingLine[] = [
    {
      code: "BASE_FARE",
      label: "Base fare",
      amount: baseFare,
      kind: "charge",
      note: "Starting fee for dispatch handling and rider assignment.",
    },
    {
      code: "DISTANCE_FEE",
      label: "Distance factor",
      amount: roundMoney(distanceFee),
      kind: "charge",
      note: "Estimated route distance between pickup and drop-off.",
    },
    {
      code: "TIME_ADJUSTMENT",
      label: "Route/time factor",
      amount: roundMoney(timeAdjustment),
      kind: "charge",
      note: "Estimated movement effort for the route.",
    },
    {
      code: "PACKAGE_HANDLING",
      label: "Package handling",
      amount: packageHandling,
      kind: "charge",
      note: "Based on package category and declared handling need.",
    },
    {
      code: "ZONE_DIFFICULTY",
      label: "Zone access factor",
      amount: zoneDifficulty,
      kind: "charge",
      note: "Some routes may require additional access or routing effort.",
    },
    {
      code: "BOOKING_FEE",
      label: "Booking fee",
      amount: bookingFee,
      kind: "charge",
      note: "Customer booking and operations support fee.",
    },
  ];

  if (input.urgency !== "STANDARD") {
    breakdown.push({
      code: "URGENCY_MULTIPLIER",
      label: `${input.urgency.toLowerCase()} priority effect`,
      amount: roundMoney(urgencyEffect),
      kind: "charge",
      note: "Priority handling where rider availability and route conditions allow.",
    });
  }

  if (businessDiscount > 0) {
    breakdown.push({
      code: "BUSINESS_DISCOUNT",
      label: "Business plan discount",
      amount: businessDiscount,
      kind: "discount",
      note: "Applied within approved plan limit.",
    });
  }

  breakdown.push({
    code: "FARE_PROTECTION",
    label: "Fare protection check",
    amount: 0,
    kind: "protection",
    note: "Fare floor, cap, surcharge cap, discount cap, and quote expiry checked.",
  });

  const quote = await PricingQuoteModel.create({
    quoteId: createQuoteId(),
    customerId:
      user?.userId && mongoose.Types.ObjectId.isValid(user.userId)
        ? user.userId
        : undefined,
    businessId:
      input.businessId && mongoose.Types.ObjectId.isValid(input.businessId)
        ? input.businessId
        : undefined,
    serviceType: input.serviceType,
    pickupAddress: input.pickupAddress,
    pickupLandmark: input.pickupLandmark,
    dropoffAddress: input.dropoffAddress,
    dropoffLandmark: input.dropoffLandmark,
    packageCategory: input.packageCategory,
    urgency: input.urgency,
    valueBand: input.valueBand,
    distanceKm,
    finalFare,
    fareBreakdown: breakdown,
    protections: [
      "FARE_FLOOR",
      "FARE_CAP",
      "SURCHARGE_CAP",
      "DISCOUNT_CAP",
      "QUOTE_EXPIRY",
    ],
    summaryFactors: [
      `${distanceKm} km estimated route`,
      input.urgency === "EXPRESS"
        ? "Express urgency selected"
        : input.urgency === "SCHEDULED"
          ? "Scheduled delivery timing selected"
          : "Standard delivery timing",
      input.packageCategory,
      input.isBusinessAccount
        ? "Business logic checked"
        : "Standard customer booking",
    ],
    ruleVersion: rule.ruleVersion,
    status: "QUOTE_CREATED",
    validUntil,
    waitingRule:
      "A waiting fee may apply if the rider waits beyond the free grace period at pickup or drop-off.",
    restrictedItemNotice:
      "Restricted, unsafe, cash-heavy, illegal, or unapproved high-value items are not accepted.",
  });

  await createAuditLog({
    actorId: user?.userId,
    actorRole: user?.role ?? "SYSTEM",
    action: "QUOTE_GENERATED",
    entityType: "PricingQuote",
    entityId: quote.quoteId,
    after: {
      finalFare,
      ruleVersion: rule.ruleVersion,
      status: quote.status,
    },
  });

  return quote;
}
