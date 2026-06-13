import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { updateRiderJobStatus } from "@/lib/server/rider/rider-service";
import { riderStatusUpdateSchema } from "@/lib/server/rider/schemas";
import { readJsonBody, validateBody } from "@/lib/server/validation";
import { ok } from "@/lib/server/responses";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = requireRole(await getSessionUser(), ["RIDER"]);
    const { id } = await context.params;

    const body = await readJsonBody(request);
    const input = validateBody(riderStatusUpdateSchema, body);

    const result = await updateRiderJobStatus({
      user,
      orderId: id,
      status: input.status,
      detail: input.detail,
      reason: input.reason,
    });

    return ok(result, "Job status updated");
  } catch (error) {
    return handleApiError(error);
  }
}
