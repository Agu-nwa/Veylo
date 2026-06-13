import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { getRiderJob } from "@/lib/server/rider/rider-service";
import { ok } from "@/lib/server/responses";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = requireRole(await getSessionUser(), ["RIDER", "ADMIN"]);
    const { id } = await context.params;

    const result = await getRiderJob(user, id);

    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}
