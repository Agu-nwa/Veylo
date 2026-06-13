import { getSessionUser } from "@/lib/server/auth/session";
import { requireUser } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { createOrderFromQuote, listOrdersForUser } from "@/lib/server/orders/order-service";
import { createOrderSchema } from "@/lib/server/orders/schemas";
import { readJsonBody, validateBody } from "@/lib/server/validation";
import { ok } from "@/lib/server/responses";

export async function POST(request: Request) {
  try {
    await connectDB();

    const user = requireUser(await getSessionUser());
    const body = await readJsonBody(request);
    const input = validateBody(createOrderSchema, body);

    const result = await createOrderFromQuote(input, user);

    return ok(
      {
        order: result.order,
        timeline: result.timeline,
        pickupOtp: result.pickupOtp,
        deliveryOtp: result.deliveryOtp,
        otpNotice:
          "OTP values are shown only at order creation. They are stored hashed and cannot be retrieved later.",
      },
      "Order created",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    await connectDB();

    const user = requireUser(await getSessionUser());
    const orders = await listOrdersForUser(user);

    return ok({
      orders,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
