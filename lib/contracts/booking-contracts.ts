import type { PricingQuote, QuoteInput } from "@/lib/types";

export type BookingStep =
  | "SERVICE"
  | "LOCATIONS"
  | "PACKAGE"
  | "QUOTE"
  | "CONFIRMATION";

export type QuoteUiState =
  | "IDLE"
  | "GENERATING"
  | "READY"
  | "ACCEPTED"
  | "EXPIRED"
  | "REFRESHED";

export interface BookingDraft extends QuoteInput {
  pickupLandmark: string;
  pickupContactName: string;
  pickupContactPhone: string;
  dropoffLandmark: string;
  recipientName: string;
  recipientPhone: string;
  deliveryNote: string;
  restrictedItemConfirmed: boolean;
  waitingRuleAccepted: boolean;
}

export interface MockOrderResponse {
  orderId: string;
  quote: PricingQuote;
  status: "CREATED" | "QUOTED" | "ASSIGNING_RIDER";
  message: string;
  nextAction: string;
}
