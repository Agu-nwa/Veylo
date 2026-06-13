import { getSessionUser } from "@/lib/server/auth/session";
import { requireUser } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import {
  createSupportTicket,
  listSupportTickets,
} from "@/lib/server/support/support-service";
import { supportTicketCreateSchema } from "@/lib/server/support/schemas";
import { readJsonBody, validateBody } from "@/lib/server/validation";
import { ok } from "@/lib/server/responses";

export async function POST(request: Request) {
  try {
    await connectDB();

    const user = await getSessionUser();
    const body = await readJsonBody(request);
    const input = validateBody(supportTicketCreateSchema, body);

    const ticket = await createSupportTicket(input, user);

    return ok(
      {
        ticket,
      },
      "Support ticket created",
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
    const tickets = await listSupportTickets(user);

    return ok({
      tickets,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
