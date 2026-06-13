"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/client/api";

type MeResponse = {
  authenticated: boolean;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    accountStatus: string;
    verificationStatus: string;
  } | null;
};

type LogoutResponse = {
  loggedOut: boolean;
};

function dashboardForRole(role?: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "BUSINESS") return "/business/dashboard";
  if (role === "RIDER") return "/rider";
  return "/dashboard";
}

function shortName(name?: string) {
  if (!name) return "Account";

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 1) return parts[0];

  return `${parts[0]} ${parts[1][0]}.`;
}

export function AccountMenu() {
  const router = useRouter();

  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  async function loadMe() {
    try {
      setLoading(true);

      const response = await apiRequest<MeResponse>("/api/auth/me");
      setMe(response.data);
    } catch {
      setMe({
        authenticated: false,
        user: null,
      });
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setLoggingOut(true);

      await apiRequest<LogoutResponse>("/api/auth/logout", {
        method: "POST",
      });

      setMe({
        authenticated: false,
        user: null,
      });

      router.push("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-4 py-2 text-sm font-medium text-[#98a2b3] sm:inline-flex">
          Checking...
        </span>
        <Link
          href="/book"
          className="rounded-full bg-[#071a2f] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#102a43]"
        >
          Estimate fare
        </Link>
      </div>
    );
  }

  if (!me?.authenticated || !me.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="hidden rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-4 py-2 text-sm font-medium text-[#071a2f] transition hover:border-[#071a2f]/30 sm:inline-flex"
        >
          Login
        </Link>
        <Link
          href="/book"
          className="rounded-full bg-[#071a2f] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#102a43]"
        >
          Estimate fare
        </Link>
      </div>
    );
  }

  const dashboardHref = dashboardForRole(me.user.role);

  return (
    <div className="flex items-center gap-2">
      <Link
        href={dashboardHref}
        className="hidden rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-4 py-2 text-sm font-medium text-[#071a2f] transition hover:border-[#071a2f]/30 md:inline-flex"
      >
        {shortName(me.user.fullName)}
      </Link>

      <Link
        href="/profile"
        className="hidden rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-4 py-2 text-sm font-medium text-[#071a2f] transition hover:border-[#071a2f]/30 sm:inline-flex"
      >
        Profile
      </Link>

      <button
        type="button"
        onClick={logout}
        disabled={loggingOut}
        className="rounded-full bg-[#071a2f] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#102a43] disabled:opacity-60"
      >
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
