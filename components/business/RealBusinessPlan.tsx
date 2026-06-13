"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

type BusinessPlanResponse = {
  plan: {
    profile?: {
      businessName: string;
      businessType: string;
      planType: string;
      accountStatus: string;
      approvedDiscountRate?: number;
      discountCap?: number;
      weeklyDeliveryEstimate?: string;
    };
    planType?: string;
    approvedDiscountRate?: number;
    discountCap?: number;
    accountStatus?: string;
    planNote?: string;
    scope?: string;
    plans?: string[];
  };
};

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function statusTone(status?: string) {
  if (status === "ACTIVE") return "success" as const;
  if (status === "PENDING") return "warning" as const;
  if (["SUSPENDED", "REJECTED", "PAUSED"].includes(status || "")) return "danger" as const;
  return "info" as const;
}

export function RealBusinessPlan() {
  const [plan, setPlan] = useState<BusinessPlanResponse["plan"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPlan() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<BusinessPlanResponse>("/api/business/plan");
      setPlan(response.data?.plan ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load business plan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlan();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real business plan...</p>
      </section>
    );
  }

  if (error || !plan) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Business access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Business plan is protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          Login with an approved business account to view your active plan,
          discounts, and backend pricing policy.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Login as business
          </Link>
          <Link
            href="/business/request"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Request business account
          </Link>
        </div>
      </section>
    );
  }

  const profile = plan.profile;
  const planType = plan.planType || profile?.planType || "PAY_AS_YOU_GO";
  const accountStatus = plan.accountStatus || profile?.accountStatus || "PENDING";
  const discountRate = plan.approvedDiscountRate ?? profile?.approvedDiscountRate ?? 0;
  const discountCap = plan.discountCap ?? profile?.discountCap ?? 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real business plan</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              {planType.replaceAll("_", " ").toLowerCase()}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
              Your business plan is now loaded from the backend and used by
              pricing rules during quote generation.
            </p>
          </div>

          <StatusChip tone={statusTone(accountStatus)}>
            {accountStatus.toLowerCase()}
          </StatusChip>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
            <p className="text-xs text-[#667085]">Business</p>
            <p className="mt-2 text-xl font-medium tracking-[-0.035em] text-[#071a2f]">
              {profile?.businessName || "Approved business"}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              {profile?.businessType || "Business account"}
            </p>
          </div>

          <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
            <p className="text-xs text-[#667085]">Delivery volume</p>
            <p className="mt-2 text-xl font-medium tracking-[-0.035em] text-[#071a2f]">
              {profile?.weeklyDeliveryEstimate || "Not set"}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              Used by operations to evaluate account fit.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
            <p className="text-xs text-[#667085]">Approved discount</p>
            <p className="mt-2 text-3xl font-medium tracking-[-0.05em] text-[#071a2f]">
              {discountRate}%
            </p>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              Applied only within backend rule limits.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
            <p className="text-xs text-[#667085]">Discount cap</p>
            <p className="mt-2 text-3xl font-medium tracking-[-0.05em] text-[#071a2f]">
              {money.format(discountCap)}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              Maximum discount protection per pricing rule.
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/business/new-delivery"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            New business delivery
          </Link>
          <Link
            href="/business/dashboard"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Back to dashboard
          </Link>
        </div>
      </section>

      <Panel
        title="Plan policy"
        body="Backend pricing owns business discounts and fare rules."
      >
        <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-5">
          <p className="text-sm leading-6 text-[#667085]">
            {plan.planNote ||
              "Business plan pricing is enforced by backend pricing rules and discount caps."}
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          {[
            "Frontend cannot override final fare.",
            "Discounts are capped by backend rules.",
            "Quote expiry and rule versioning are backend-controlled.",
            "Admin can later adjust pricing rules from protected operations.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4 text-sm leading-6 text-[#475467]"
            >
              {item}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
