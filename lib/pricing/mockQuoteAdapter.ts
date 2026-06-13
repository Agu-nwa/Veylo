import type { PricingQuote, QuoteInput } from "@/lib/types";

const currencyRound = (value: number) => Math.round(value / 50) * 50;

const hashText = (text: string) => {
  return text.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
};

const estimateDistanceKm = (pickup: string, dropoff: string) => {
  const seed = hashText(`${pickup}-${dropoff}`);
  return Math.max(2, Math.min(13, 2 + (seed % 12)));
};

export async function generateMockQuote(input: QuoteInput): Promise<PricingQuote> {
  await new Promise((resolve) => setTimeout(resolve, 520));

  const distanceKm = estimateDistanceKm(input.pickup, input.dropoff);
  const baseFare = 900;
  const distanceFee = distanceKm * 190;
  const timeAdjustment = distanceKm * 55;
  const packageHandling =
    input.packageCategory === "Fragile item" || input.valueBand === "High value"
      ? 650
      : 250;
  const bookingFee = 150;
  const zoneDifficulty = distanceKm > 8 ? 350 : 150;
  const urgencyMultiplier = input.urgency === "EXPRESS" ? 1.35 : 1;
  const businessDiscount = input.isBusiness ? 400 : 0;

  const subtotal =
    baseFare +
    distanceFee +
    timeAdjustment +
    packageHandling +
    bookingFee +
    zoneDifficulty;

  const grossFare = subtotal * urgencyMultiplier;
  const discountedFare = grossFare - businessDiscount;
  const protectedFare = Math.max(1200, Math.min(discountedFare, 8500));
  const finalFare = currencyRound(protectedFare);

  const expiresAt = new Date(Date.now() + 8 * 60 * 1000).toISOString();

  return {
    quoteId: `QUOTE-${Date.now().toString().slice(-6)}`,
    status: "QUOTE_CREATED",
    serviceType: input.serviceType,
    currency: "NGN",
    finalFare,
    validMinutes: 8,
    expiresAt,
    ruleVersion: "VEYLO-MVP-RULES-v1",
    summaryFactors: [
      `${distanceKm} km estimated route`,
      input.urgency === "EXPRESS" ? "Express urgency selected" : "Standard delivery timing",
      input.packageCategory,
      input.isBusiness ? "Business plan discount applied" : "Customer booking fee included",
    ],
    waitingRule:
      "A waiting fee may apply if the rider waits beyond the free grace period at pickup or drop-off.",
    restrictedItemNotice:
      "Restricted, unsafe, cash-heavy, illegal, or unapproved high-value items are not accepted in this MVP flow.",
    protections: [
      "Minimum fare protection checked",
      "Surcharge stacking limited",
      "Quote expiry applied",
    ],
    breakdown: [
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
        amount: currencyRound(distanceFee),
        kind: "charge",
        note: "Estimated route distance between pickup and drop-off.",
      },
      {
        code: "TIME_ADJUSTMENT",
        label: "Route/time factor",
        amount: currencyRound(timeAdjustment),
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
        note: "Some areas may require additional routing or access effort.",
      },
      {
        code: "BOOKING_FEE",
        label: "Customer booking fee",
        amount: bookingFee,
        kind: "charge",
      },
      ...(input.urgency === "EXPRESS"
        ? [
            {
              code: "URGENCY_MULTIPLIER" as const,
              label: "Express priority effect",
              amount: currencyRound(grossFare - subtotal),
              kind: "charge" as const,
              note: "Priority handling where rider availability allows.",
            },
          ]
        : []),
      ...(input.isBusiness
        ? [
            {
              code: "BUSINESS_DISCOUNT" as const,
              label: "Business plan discount",
              amount: businessDiscount,
              kind: "discount" as const,
              note: "Applied within approved plan limit.",
            },
          ]
        : []),
      {
        code: "FARE_PROTECTION",
        label: "Fare protection check",
        amount: 0,
        kind: "protection",
        note: "Fare floor, cap, and quote expiry rules checked.",
      },
    ],
  };
}
