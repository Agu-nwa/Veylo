import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { getServerEnv } from "@/lib/server/env";
import type { SessionUser } from "@/lib/server/auth/types";

export const SESSION_COOKIE_NAME = "veylo_session";

function getSecretKey() {
  const { AUTH_SECRET } = getServerEnv();
  return new TextEncoder().encode(AUTH_SECRET);
}

export async function signSession(user: SessionUser) {
  return new SignJWT({
    userId: user.userId,
    role: user.role,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionUser> {
  const verified = await jwtVerify(token, getSecretKey());

  return {
    userId: String(verified.payload.userId),
    role: verified.payload.role as SessionUser["role"],
    email: verified.payload.email
      ? String(verified.payload.email)
      : undefined,
  };
}

export async function setSessionCookie(user: SessionUser) {
  const token = await signSession(user);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}
