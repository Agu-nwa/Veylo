import { redirect } from "next/navigation";
import { connectDB } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/auth/session";
import { UserModel } from "@/lib/server/models/User";

export type PageRole = "CUSTOMER" | "BUSINESS" | "RIDER" | "ADMIN";

function dashboardForRole(role?: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "BUSINESS") return "/business/dashboard";
  if (role === "RIDER") return "/rider";
  return "/book";
}

export async function getPageUser() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return null;
  }

  await connectDB();

  const user = await UserModel.findById(sessionUser.userId);

  if (!user) {
    return null;
  }

  return {
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role as PageRole,
    accountStatus: user.accountStatus,
    verificationStatus: user.verificationStatus,
  };
}

export async function requirePageAuth() {
  const user = await getPageUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requirePageRole(allowedRoles: PageRole[]) {
  const user = await requirePageAuth();

  if (!allowedRoles.includes(user.role)) {
    redirect(dashboardForRole(user.role));
  }

  return user;
}
