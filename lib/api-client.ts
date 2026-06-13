import { generateMockQuote } from "@/lib/pricing/mockQuoteAdapter";
import type { BookingDraft, MockOrderResponse } from "@/lib/contracts/booking-contracts";
import type { PricingQuote, QuoteInput } from "@/lib/types";

export async function requestQuote(input: QuoteInput): Promise<PricingQuote> {
  return generateMockQuote(input);
}

export async function refreshQuote(input: QuoteInput): Promise<PricingQuote> {
  return generateMockQuote(input);
}

export async function createMockOrder(
  draft: BookingDraft,
  quote: PricingQuote
): Promise<MockOrderResponse> {
  await new Promise((resolve) => setTimeout(resolve, 450));

  return {
    orderId: `VYL-${Date.now().toString().slice(-5)}`,
    quote,
    status: "ASSIGNING_RIDER",
    message: `Your ${draft.packageCategory.toLowerCase()} delivery has been created.`,
    nextAction:
      "Veylo will assign a verified rider and update the order timeline. Backend will later persist this order.",
  };
}
