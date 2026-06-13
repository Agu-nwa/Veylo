import { getSessionUser } from "@/lib/server/auth/session";
import { requireUser } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { RiderProfileModel } from "@/lib/server/models/RiderProfile";
import { ok } from "@/lib/server/responses";

export async function GET() {
  try {
    await connectDB();

    const user = requireUser(await getSessionUser());

    const profile = await RiderProfileModel.findOne({
      userId: user.userId,
    });

    return ok({
      application: profile
        ? {
            submitted: true,
            profile,
          }
        : {
            submitted: false,
            profile: null,
          },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
