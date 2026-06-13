import { getSessionUser } from "@/lib/server/auth/session";
import { requireUser } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { updateOrderStatus } from "@/lib/server/orders/order-service";
import { cancelOrderSchema } from "@/lib/server/orders/schemas";
import { readJsonBody, validateBody } from "@/lib/server/validation";
import { ok } from "@/lib/server/responses";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = requireUser(await getSessionUser());
    const { id } = await context.params;

    const body = await readJsonBody(request);
    const input = validateBody(cancelOrderSchema, body);

    const result = await updateOrderStatus({
      orderId: id,
      nextStatus: "CANCELLED",
      actor: user,
      detail: "Order was cancelled.",
      reason: input.reason,
    });

    return ok(result, "Order cancelled");
  } catch (error) {
    return handleApiError(error);
  }
}
