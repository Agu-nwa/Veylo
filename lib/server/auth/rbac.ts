import { AppError } from "@/lib/server/errors";
import type { SessionUser, UserRole } from "@/lib/server/auth/types";

export function requireUser(user: SessionUser | null): SessionUser {
  if (!user) {
    throw new AppError("Authentication required", 401, "UNAUTHENTICATED");
  }

  return user;
}

export function requireRole(
  user: SessionUser | null,
  allowedRoles: UserRole[]
): SessionUser {
  const sessionUser = requireUser(user);

  if (!allowedRoles.includes(sessionUser.role)) {
    throw new AppError("Permission denied", 403, "FORBIDDEN");
  }

  return sessionUser;
}

export function isAdmin(user: SessionUser | null) {
  return Boolean(user && user.role === "ADMIN");
}
