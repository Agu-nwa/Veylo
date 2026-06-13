import { connectDB } from "@/lib/server/db";
import { createAuditLog } from "@/lib/server/audit/audit";
import { handleApiError } from "@/lib/server/handle-api-error";
import { hashPassword } from "@/lib/server/auth/password";
import { registerSchema } from "@/lib/server/auth/schemas";
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
    const input = validateBody(registerSchema, body);

    const existingUser = await UserModel.findOne({
      $or: [{ email: input.email }, { phone: input.phone }],
    });

    if (existingUser) {
      throw new AppError(
        "An account with this email or phone already exists",
        409,
        "USER_ALREADY_EXISTS"
      );
    }

    const passwordHash = await hashPassword(input.password);

    const user = await UserModel.create({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: input.role,
      accountStatus: "ACTIVE",
      verificationStatus: "UNVERIFIED",
    });

    await setSessionCookie({
      userId: String(user._id),
      role: user.role,
      email: user.email,
    });

    await createAuditLog({
      actorId: String(user._id),
      actorRole: user.role,
      action: "AUTH_REGISTER",
      entityType: "User",
      entityId: String(user._id),
      after: {
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return ok(
      {
        user: toSafeUser(user),
      },
      "Account created",
      201
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      return handleApiError(
        new AppError(
          "An account with this email or phone already exists",
          409,
          "USER_ALREADY_EXISTS"
        )
      );
    }

    return handleApiError(error);
  }
}
