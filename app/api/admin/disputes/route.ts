import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { listAdminDisputes } from "@/lib/server/admin/admin-service";
import { ok } from "@/lib/server/responses";

export async function GET() {
  try {
    await connectDB();

    const user = requireRole(await getSessionUser(), ["ADMIN"]);
    const disputes = await listAdminDisputes(user);

    return ok({ disputes });
  } catch (error) {
    return handleApiError(error);
  }
}
