import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { getBusinessPlan } from "@/lib/server/business/business-service";
import { ok } from "@/lib/server/responses";

export async function GET() {
  try {
    await connectDB();

    const user = requireRole(await getSessionUser(), ["BUSINESS", "ADMIN"]);
    const plan = await getBusinessPlan(user);

    return ok({
      plan,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
