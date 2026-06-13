import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { getRiderEarnings } from "@/lib/server/rider/rider-service";
import { ok } from "@/lib/server/responses";

export async function GET() {
  try {
    await connectDB();

    const user = requireRole(await getSessionUser(), ["RIDER"]);
    const earnings = await getRiderEarnings(user);

    return ok({
      earnings,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
