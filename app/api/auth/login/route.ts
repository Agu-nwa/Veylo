import { connectDB } from "@/lib/server/db";
import { createAuditLog } from "@/lib/server/audit/audit";
import { handleApiError } from "@/lib/server/handle-api-error";
import { verifyPassword } from "@/lib/server/auth/password";
import { loginSchema } from "@/lib/server/auth/schemas";
import { setSessionCookie } from "@/lib/server/auth/session";
import { readJsonBody, validateBody } from "@/lib/server/validation";
import { ok } from "@/lib/server/responses";
import { AppError } from "@/lib/server/errors";
import { UserModel } from "@/lib/server/models/User";
import { toSafeUser } from "@/lib/server/auth/safe-user";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await readJsonBody(request);
    const input = validateBody(loginSchema, body);

    const normalizedIdentifier = input.identifier.toLowerCase();

    const user = await UserModel.findOne({
      $or: [
        { email: normalizedIdentifier },
        { phone: input.identifier },
      ],
    }).select("+passwordHash");

    if (!user) {
      throw new AppError("Invalid login details", 401, "INVALID_CREDENTIALS");
    }

    if (user.accountStatus !== "ACTIVE") {
      throw new AppError(
        "This account is not active",
        403,
        "ACCOUNT_NOT_ACTIVE"
      );
    }

    const passwordOk = await verifyPassword(input.password, user.passwordHash);

    if (!passwordOk) {
      throw new AppError("Invalid login details", 401, "INVALID_CREDENTIALS");
    }

    user.lastLoginAt = new Date();
    await user.save();

    await setSessionCookie({
      userId: String(user._id),
      role: user.role,
      email: user.email,
    });

    await createAuditLog({
      actorId: String(user._id),
      actorRole: user.role,
      action: "AUTH_LOGIN",
      entityType: "User",
      entityId: String(user._id),
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return ok(
      {
        user: toSafeUser(user),
      },
      "Logged in"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
