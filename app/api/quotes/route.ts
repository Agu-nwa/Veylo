import { getSessionUser } from "@/lib/server/auth/session";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { generatePricingQuote } from "@/lib/server/pricing/engine";
import { quoteRequestSchema } from "@/lib/server/pricing/schemas";
import { readJsonBody, validateBody } from "@/lib/server/validation";
import { ok } from "@/lib/server/responses";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await readJsonBody(request);
    const input = validateBody(quoteRequestSchema, body);
    const user = await getSessionUser();

    const quote = await generatePricingQuote(input, user);

    return ok(
      {
        quote,
      },
      "Quote created",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
