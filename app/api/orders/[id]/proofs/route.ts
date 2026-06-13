import { getSessionUser } from "@/lib/server/auth/session";
import { requireUser } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { listOrderProofs } from "@/lib/server/proofs/proof-service";
import { ok } from "@/lib/server/responses";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = requireUser(await getSessionUser());
    const { id } = await context.params;

    const proofs = await listOrderProofs(id, user);

    return ok({
      proofs,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
