export type ServiceType =
  | "PICKUP_DELIVERY"
  | "ERRAND_RUN"
  | "BUSINESS_DELIVERY"
  | "EXPRESS_DELIVERY"
  | "SCHEDULED_DELIVERY"
  | "SECURE_DOCUMENT"
  | "MARKET_RUN_LATER";

export type OrderStatus =
  | "CREATED"
  | "QUOTED"
  | "ASSIGNING_RIDER"
  | "RIDER_ASSIGNED"
  | "RIDER_EN_ROUTE"
  | "ARRIVED_PICKUP"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "ARRIVED_DROPOFF"
  | "DELIVERED"
  | "FAILED_PICKUP"
  | "FAILED_DELIVERY"
  | "DISPUTED"
  | "CLOSED"
  | "CANCELLED";

export type QuoteStatus =
  | "QUOTE_CREATED"
  | "QUOTE_VIEWED"
  | "QUOTE_ACCEPTED"
  | "QUOTE_ABANDONED"
  | "QUOTE_EXPIRED"
  | "QUOTE_REFRESHED";

export type PricingModifier =
  | "BASE_FARE"
  | "DISTANCE_FEE"
  | "TIME_ADJUSTMENT"
  | "URGENCY_MULTIPLIER"
  | "ZONE_DIFFICULTY"
  | "RIDER_AVAILABILITY"
  | "PACKAGE_HANDLING"
  | "BOOKING_FEE"
  | "PEAK"
  | "RAIN"
  | "NIGHT"
  | "WAITING"
  | "BUSINESS_DISCOUNT";

export type PricingProtection =
  | "FARE_FLOOR"
  | "FARE_CAP"
  | "RIDER_PAYOUT_FLOOR"
  | "SURCHARGE_CAP"
  | "DISCOUNT_CAP"
  | "QUOTE_EXPIRY"
  | "ADMIN_OVERRIDE";

export type ProofType =
  | "PICKUP_OTP"
  | "DELIVERY_OTP"
  | "PHOTO_PROOF"
  | "RECIPIENT_CONFIRMATION"
  | "RIDER_NOTE"
  | "ADMIN_OVERRIDE";

export type SupportCategory =
  | "TRACK_ORDER"
  | "PRICING_QUESTION"
  | "FAILED_PICKUP"
  | "FAILED_DELIVERY"
  | "DAMAGE_CLAIM"
  | "LOST_ITEM"
  | "PAYMENT"
  | "CANCELLATION"
  | "BUSINESS_SUPPORT"
  | "RIDER_SUPPORT"
  | "SAFETY_REPORT";

export type Urgency = "STANDARD" | "EXPRESS" | "SCHEDULED";

export interface ServiceCard {
  type: ServiceType;
  title: string;
  description: string;
  pricingNote: string;
}

export interface PricingLine {
  code: PricingModifier | "FARE_PROTECTION";
  label: string;
  amount: number;
  kind: "charge" | "discount" | "protection";
  note?: string;
}

export interface PricingQuote {
  quoteId: string;
  status: QuoteStatus;
  serviceType: ServiceType;
  currency: "NGN";
  finalFare: number;
  validMinutes: number;
  expiresAt: string;
  summaryFactors: string[];
  breakdown: PricingLine[];
  protections: string[];
  waitingRule: string;
  restrictedItemNotice: string;
  ruleVersion: string;
}

export interface QuoteInput {
  serviceType: ServiceType;
  pickup: string;
  dropoff: string;
  packageCategory: string;
  urgency: Urgency;
  valueBand: string;
  isBusiness?: boolean;
}

export interface RiderProfile {
  id: string;
  name: string;
  verificationStatus: "VERIFIED" | "PENDING" | "SUSPENDED";
  rating: number;
  completedJobs: number;
  phonePolicy: string;
}

export interface DeliveryOrder {
  id: string;
  status: OrderStatus;
  serviceType: ServiceType;
  pickup: string;
  dropoff: string;
  customerName: string;
  fare: number;
  rider: RiderProfile;
  timeline: Array<{
    status: OrderStatus;
    label: string;
    time: string;
    detail: string;
  }>;
}
