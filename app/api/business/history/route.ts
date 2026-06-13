import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { getBusinessHistory } from "@/lib/server/business/business-service";
import { ok } from "@/lib/server/responses";

export async function GET() {
  try {
    await connectDB();

    const user = requireRole(await getSessionUser(), ["BUSINESS", "ADMIN"]);
    const orders = await getBusinessHistory(user);

    return ok({
      orders,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
