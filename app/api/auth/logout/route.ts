import { clearSessionCookie, getSessionUser } from "@/lib/server/auth/session";
import { createAuditLog } from "@/lib/server/audit/audit";
import { handleApiError } from "@/lib/server/handle-api-error";
import { ok } from "@/lib/server/responses";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    await clearSessionCookie();

    if (user) {
      await createAuditLog({
        actorId: user.userId,
        actorRole: user.role,
        action: "AUTH_LOGOUT",
        entityType: "User",
        entityId: user.userId,
        userAgent: request.headers.get("user-agent") || undefined,
      });
    }

    return ok(
      {
        loggedOut: true,
      },
      "Logged out"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
