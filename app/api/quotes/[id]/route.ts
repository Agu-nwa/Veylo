import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { findQuoteByPublicId, isQuoteExpired } from "@/lib/server/pricing/quote-service";
import { ok } from "@/lib/server/responses";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const quote = await findQuoteByPublicId(id);

    if (quote.status === "QUOTE_CREATED" && isQuoteExpired(quote)) {
      quote.status = "QUOTE_EXPIRED";
      quote.expiredAt = new Date();
      await quote.save();
    }

    return ok({
      quote,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
