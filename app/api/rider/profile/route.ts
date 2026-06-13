import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { getOrCreateRiderProfile, updateRiderProfile } from "@/lib/server/rider/rider-service";
import { riderProfileUpdateSchema } from "@/lib/server/rider/schemas";
import { readJsonBody, validateBody } from "@/lib/server/validation";
import { ok } from "@/lib/server/responses";

export async function GET() {
  try {
    await connectDB();

    const user = requireRole(await getSessionUser(), ["RIDER"]);
    const profile = await getOrCreateRiderProfile(user);

    return ok({
      profile,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();

    const user = requireRole(await getSessionUser(), ["RIDER"]);
    const body = await readJsonBody(request);
    const input = validateBody(riderProfileUpdateSchema, body);

    const profile = await updateRiderProfile(user, input);

    return ok(
      {
        profile,
      },
      "Rider profile updated"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
