import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { getAdminAnalytics } from "@/lib/server/admin/admin-service";
import { ok } from "@/lib/server/responses";

export async function GET() {
  try {
    await connectDB();

    const user = requireRole(await getSessionUser(), ["ADMIN"]);
    const analytics = await getAdminAnalytics(user);

    return ok({ analytics });
  } catch (error) {
    return handleApiError(error);
  }
}
