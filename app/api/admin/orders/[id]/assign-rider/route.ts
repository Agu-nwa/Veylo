import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { adminAssignRider } from "@/lib/server/admin/admin-service";
import { assignRiderSchema } from "@/lib/server/admin/schemas";
import { readJsonBody, validateBody } from "@/lib/server/validation";
import { ok } from "@/lib/server/responses";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = requireRole(await getSessionUser(), ["ADMIN"]);
    const { id } = await context.params;

    const body = await readJsonBody(request);
    const input = validateBody(assignRiderSchema, body);

    const result = await adminAssignRider(user, id, input);

    return ok(result, "Rider assigned");
  } catch (error) {
    return handleApiError(error);
  }
}
