"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/client/api";
import { StatusChip } from "@/components/shared/StatusChip";

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
    lastLoginAt?: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
};

type LogoutResponse = {
  loggedOut: boolean;
};

function roleDescription(role?: string) {
  if (role === "CUSTOMER") return "Customer account for quotes, bookings, orders, and support.";
  if (role === "BUSINESS") return "Business account for vendor deliveries, reports, and plans.";
  if (role === "RIDER") return "Rider account for job console, profile, and earnings.";
  if (role === "ADMIN") return "Internal operations account for Veylo admin tools.";
  return "Veylo account.";
}

export function RealProfilePanel() {
  const router = useRouter();

  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  async function loadProfile() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<MeResponse>("/api/auth/me");
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load profile");
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

      router.push("/login");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not logout");
    } finally {
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading your real profile...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card rounded-[32px] p-6">
        <StatusChip tone="warning">Profile error</StatusChip>
        <h1 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
          We could not load your profile.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#667085]">{error}</p>
      </section>
    );
  }

  if (!data?.authenticated || !data.user) {
    return (
      <section className="card rounded-[32px] p-6">
        <StatusChip tone="warning">Login required</StatusChip>
        <h1 className="mt-4 text-3xl font-medium tracking-[-0.05em] text-[#071a2f]">
          Sign in to view your Veylo profile.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085]">
          Your profile is now connected to the backend session. Login to view
          account details, role, verification status, and delivery access.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Create account
          </Link>
        </div>
      </section>
    );
  }

  const user = data.user;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Authenticated</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              {user.fullName}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              {roleDescription(user.role)}
            </p>
          </div>

          <StatusChip tone="info">{user.role}</StatusChip>
        </div>

        <div className="mt-8 grid gap-4">
          {[
            ["Email", user.email],
            ["Phone", user.phone],
            ["Account status", user.accountStatus],
            ["Verification", user.verificationStatus],
            ["User ID", user.id],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
            >
              <p className="text-xs text-[#667085]">{label}</p>
              <p className="mt-1 break-all text-sm font-medium text-[#071a2f]">
                {value}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="mt-7 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </section>

      <aside className="grid gap-5">
        <section className="card rounded-[28px] p-6">
          <p className="text-sm font-medium text-[#1f7a55]">Account actions</p>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
            Continue from your profile.
          </h2>
          <div className="mt-6 grid gap-3">
            <Link
              href="/book"
              className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4 text-sm font-medium text-[#071a2f]"
            >
              Book a delivery
            </Link>
            <Link
              href="/orders"
              className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4 text-sm font-medium text-[#071a2f]"
            >
              View real orders
            </Link>
            <Link
              href="/support/new"
              className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4 text-sm font-medium text-[#071a2f]"
            >
              Open support ticket
            </Link>
          </div>
        </section>

        <section className="card rounded-[28px] p-6">
          <p className="text-sm font-medium text-[#1f7a55]">Role access</p>
          <p className="mt-3 text-sm leading-6 text-[#667085]">
            Veylo now uses backend role-based sessions. Customer, business,
            rider, and admin accounts will gradually unlock different dashboard
            screens as integration continues.
          </p>
        </section>
      </aside>
    </div>
  );
}
