import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { listRiderJobs } from "@/lib/server/rider/rider-service";
import { ok } from "@/lib/server/responses";

export async function GET() {
  try {
    await connectDB();

    const user = requireRole(await getSessionUser(), ["RIDER", "ADMIN"]);
    const jobs = await listRiderJobs(user);

    return ok({
      jobs,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
