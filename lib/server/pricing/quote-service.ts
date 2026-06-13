import { AppError } from "@/lib/server/errors";
import { PricingQuoteModel } from "@/lib/server/models/PricingQuote";

export async function findQuoteByPublicId(id: string) {
  const quote = await PricingQuoteModel.findOne({ quoteId: id });

  if (!quote) {
    throw new AppError("Quote not found", 404, "QUOTE_NOT_FOUND");
  }

  return quote;
}

export function isQuoteExpired(quote: any) {
  return new Date() > new Date(quote.validUntil);
}
