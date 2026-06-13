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

export function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    role: "CUSTOMER",
    password: "",
  });

  const [acceptedRules, setAcceptedRules] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(name: string, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function register() {
    try {
      setError("");
      setLoading(true);

      await apiRequest<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      router.push("/book");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const disabled =
    loading ||
    !form.fullName ||
    !form.phone ||
    !form.email ||
    !form.password ||
    !acceptedRules;

  return (
    <div>
      <h2 className="text-2xl font-medium tracking-[-0.035em] text-[#071a2f]">
        Create your account
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#667085]">
        This now creates a real MongoDB-backed Veylo account and signs you in
        with a secure HTTP-only session cookie.
      </p>

      <form className="mt-7 grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="label">Full name</span>
            <input
              className="field"
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="Enter full name"
            />
          </label>

          <label>
            <span className="label">Phone number</span>
            <input
              className="field"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="Enter phone number"
            />
          </label>
        </div>

        <label>
          <span className="label">Email address</span>
          <input
            className="field"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="Enter email address"
          />
        </label>

        <label>
          <span className="label">Account type</span>
          <select
            className="field"
            value={form.role}
            onChange={(event) => updateField("role", event.target.value)}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="BUSINESS">Business / Vendor</option>
            <option value="RIDER">Rider applicant</option>
          </select>
        </label>

        <label>
          <span className="label">Password</span>
          <input
            className="field"
            type="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="Create password"
          />
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4">
          <input
            type="checkbox"
            checked={acceptedRules}
            onChange={(event) => setAcceptedRules(event.target.checked)}
            className="mt-1 h-4 w-4"
          />
          <span>
            <span className="block text-sm font-medium text-[#071a2f]">
              I agree to Veylo delivery rules
            </span>
            <span className="mt-1 block text-xs leading-5 text-[#667085]">
              Restricted items, waiting rules, proof, and support policies apply.
            </span>
          </span>
        </label>

        {error ? (
          <div className="rounded-2xl border border-[#f3b6b6] bg-[#fff0f0] p-4 text-sm leading-6 text-[#9a3412]">
            {error}
          </div>
        ) : null}

        <button
          type="button"
          onClick={register}
          disabled={disabled}
          className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          href="/business/request"
          className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
        >
          Request business account
        </Link>
        <Link
          href="/riders/apply"
          className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
        >
          Apply as rider
        </Link>
      </div>

      <p className="mt-6 text-center text-sm text-[#667085]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[#071a2f]">
          Log in
        </Link>
      </p>
    </div>
  );
}
