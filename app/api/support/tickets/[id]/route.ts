import { getSessionUser } from "@/lib/server/auth/session";
import { requireUser } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import {
  getSupportTicket,
  updateSupportTicket,
} from "@/lib/server/support/support-service";
import { supportTicketUpdateSchema } from "@/lib/server/support/schemas";
import { readJsonBody, validateBody } from "@/lib/server/validation";
import { ok } from "@/lib/server/responses";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = requireUser(await getSessionUser());
    const { id } = await context.params;

    const ticket = await getSupportTicket(id, user);

    return ok({
      ticket,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = requireUser(await getSessionUser());
    const { id } = await context.params;

    const body = await readJsonBody(request);
    const input = validateBody(supportTicketUpdateSchema, body);

    const ticket = await updateSupportTicket(id, input, user);

    return ok(
      {
        ticket,
      },
      "Support ticket updated"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
