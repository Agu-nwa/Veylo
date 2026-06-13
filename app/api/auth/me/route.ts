import { getSessionUser } from "@/lib/server/auth/session";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { ok } from "@/lib/server/responses";
import { UserModel } from "@/lib/server/models/User";
import { toSafeUser } from "@/lib/server/auth/safe-user";

export async function GET() {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return ok({
        authenticated: false,
        user: null,
      });
    }

    await connectDB();

    const user = await UserModel.findById(sessionUser.userId);

    if (!user) {
      return ok({
        authenticated: false,
        user: null,
      });
    }

    return ok({
      authenticated: true,
      user: toSafeUser(user),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
