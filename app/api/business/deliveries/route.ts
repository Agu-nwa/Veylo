import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { createBusinessDeliveryQuote } from "@/lib/server/business/business-service";
import { businessDeliverySchema } from "@/lib/server/business/schemas";
import { readJsonBody, validateBody } from "@/lib/server/validation";
import { ok } from "@/lib/server/responses";

export async function POST(request: Request) {
  try {
    await connectDB();

    const user = requireRole(await getSessionUser(), ["BUSINESS"]);
    const body = await readJsonBody(request);
    const input = validateBody(businessDeliverySchema, body);

    const result = await createBusinessDeliveryQuote(user, input);

    return ok(result, "Business delivery quote created", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
