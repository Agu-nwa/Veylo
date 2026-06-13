import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { adminUpdateOrderStatus } from "@/lib/server/admin/admin-service";
import { adminOrderStatusSchema } from "@/lib/server/admin/schemas";
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
    const input = validateBody(adminOrderStatusSchema, body);

    const result = await adminUpdateOrderStatus(user, id, input);

    return ok(result, "Order status updated by admin");
  } catch (error) {
    return handleApiError(error);
  }
}
