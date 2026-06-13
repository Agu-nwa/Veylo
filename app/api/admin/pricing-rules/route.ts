import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import {
  adminCreatePricingRule,
  listPricingRules,
} from "@/lib/server/admin/admin-service";
import { pricingRuleUpdateSchema } from "@/lib/server/admin/schemas";
import { readJsonBody, validateBody } from "@/lib/server/validation";
import { ok } from "@/lib/server/responses";

export async function GET() {
  try {
    await connectDB();

    const user = requireRole(await getSessionUser(), ["ADMIN"]);
    const pricing = await listPricingRules(user);

    return ok({ pricing });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();

    const user = requireRole(await getSessionUser(), ["ADMIN"]);
    const body = await readJsonBody(request);
    const input = validateBody(pricingRuleUpdateSchema, body);

    const rule = await adminCreatePricingRule(user, input);

    return ok({ rule }, "Pricing rule created");
  } catch (error) {
    return handleApiError(error);
  }
}
