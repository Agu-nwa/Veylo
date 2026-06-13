import { getSessionUser } from "@/lib/server/auth/session";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { generatePricingQuote } from "@/lib/server/pricing/engine";
import { findQuoteByPublicId } from "@/lib/server/pricing/quote-service";
import { ok } from "@/lib/server/responses";

export async function PATCH(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const user = await getSessionUser();
    const oldQuote = await findQuoteByPublicId(id);

    if (oldQuote.status === "QUOTE_CREATED") {
      oldQuote.status = "QUOTE_REFRESHED";
      await oldQuote.save();
    }

    const quote = await generatePricingQuote(
      {
        serviceType: oldQuote.serviceType,
        pickupAddress: oldQuote.pickupAddress,
        pickupLandmark: oldQuote.pickupLandmark,
        dropoffAddress: oldQuote.dropoffAddress,
        dropoffLandmark: oldQuote.dropoffLandmark,
        packageCategory: oldQuote.packageCategory,
        urgency: oldQuote.urgency,
        valueBand: oldQuote.valueBand,
        isBusinessAccount: Boolean(oldQuote.businessId),
        businessId: oldQuote.businessId ? String(oldQuote.businessId) : undefined,
      },
      user
    );

    return ok({ quote }, "Quote refreshed");
  } catch (error) {
    return handleApiError(error);
  }
}
