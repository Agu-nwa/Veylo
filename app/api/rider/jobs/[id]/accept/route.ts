import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { acceptRiderJob } from "@/lib/server/rider/rider-service";
import { ok } from "@/lib/server/responses";

export async function PATCH(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = requireRole(await getSessionUser(), ["RIDER"]);
    const { id } = await context.params;

    const result = await acceptRiderJob(user, id);

    return ok(result, "Job accepted");
  } catch (error) {
    return handleApiError(error);
  }
}
