"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest } from "@/lib/client/api";

type AuthResponse = {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    accountStatus: string;
    verificationStatus: string;
  };
};

function redirectForRole(role?: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "BUSINESS") return "/business/dashboard";
  if (role === "RIDER") return "/rider";
  return "/book";
}

export function LoginForm() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const role = response.data?.user.role;
      router.push(redirectForRole(role));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-medium tracking-[-0.035em] text-[#071a2f]">
        Welcome back
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#667085]">
        Log in to create real quotes, orders, support tickets, rider jobs,
        business dashboards, and admin operations.
      </p>

      <form className="mt-7 grid gap-5">
        <label>
          <span className="label">Email or phone</span>
          <input
            className="field"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="Enter your email or phone"
          />
        </label>

        <label>
          <span className="label">Password</span>
          <input
            className="field"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
          />
        </label>

        {error ? (
          <div className="rounded-2xl border border-[#f3b6b6] bg-[#fff0f0] p-4 text-sm leading-6 text-[#9a3412]">
            {error}
          </div>
        ) : null}

        <button
          type="button"
          onClick={login}
          disabled={loading || !identifier || !password}
          className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          href="/book"
          className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
        >
          Customer booking
        </Link>
        <Link
          href="/support"
          className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
        >
          Need help?
        </Link>
      </div>

      <p className="mt-6 text-center text-sm text-[#667085]">
        New to Veylo?{" "}
        <Link href="/register" className="font-medium text-[#071a2f]">
          Create account
        </Link>
      </p>
    </div>
  );
}
