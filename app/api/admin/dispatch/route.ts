import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { getAdminDispatch } from "@/lib/server/admin/admin-service";
import { ok } from "@/lib/server/responses";

export async function GET() {
  try {
    await connectDB();

    const user = requireRole(await getSessionUser(), ["ADMIN"]);
    const dispatch = await getAdminDispatch(user);

    return ok({ dispatch });
  } catch (error) {
    return handleApiError(error);
  }
}
