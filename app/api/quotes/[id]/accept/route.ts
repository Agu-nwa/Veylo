import { getSessionUser } from "@/lib/server/auth/session";
import { createAuditLog } from "@/lib/server/audit/audit";
import { connectDB } from "@/lib/server/db";
import { AppError } from "@/lib/server/errors";
import { handleApiError } from "@/lib/server/handle-api-error";
import { findQuoteByPublicId, isQuoteExpired } from "@/lib/server/pricing/quote-service";
import { ok } from "@/lib/server/responses";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const user = await getSessionUser();
    const quote = await findQuoteByPublicId(id);

    if (quote.status === "QUOTE_ACCEPTED") {
      return ok({ quote }, "Quote already accepted");
    }

    if (quote.status === "QUOTE_EXPIRED" || isQuoteExpired(quote)) {
      quote.status = "QUOTE_EXPIRED";
      quote.expiredAt = new Date();
      await quote.save();

      throw new AppError("Quote has expired", 409, "QUOTE_EXPIRED");
    }

    quote.status = "QUOTE_ACCEPTED";
    quote.acceptedAt = new Date();
    await quote.save();

    await createAuditLog({
      actorId: user?.userId,
      actorRole: user?.role ?? "SYSTEM",
      action: "QUOTE_ACCEPTED",
      entityType: "PricingQuote",
      entityId: quote.quoteId,
      after: {
        status: quote.status,
        acceptedAt: quote.acceptedAt,
      },
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return ok({ quote }, "Quote accepted");
  } catch (error) {
    return handleApiError(error);
  }
}
