"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

type RiderEarningsResponse = {
  earnings: {
    riderProfileId: string;
    deliveredJobs: number;
    grossFare: number;
    estimatedRiderShare: number;
    pendingPayout: number;
    currency: string;
    note: string;
  };
};

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function RealRiderEarnings() {
  const [earnings, setEarnings] =
    useState<RiderEarningsResponse["earnings"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEarnings() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<RiderEarningsResponse>(
        "/api/rider/earnings"
      );

      setEarnings(response.data?.earnings ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load earnings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEarnings();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real rider earnings...</p>
      </section>
    );
  }

  if (error || !earnings) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Rider login required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Rider earnings are protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          This page now connects to the real rider earnings backend. Login with a
          rider account to view delivered jobs, fare volume, estimated rider
          share, and pending payout.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Login as rider
          </Link>
          <Link
            href="/rider"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Rider dashboard
          </Link>
        </div>
      </section>
    );
  }

  const metrics = [
    {
      label: "Delivered jobs",
      value: String(earnings.deliveredJobs),
      note: "Orders delivered or closed",
    },
    {
      label: "Gross fare",
      value: money.format(earnings.grossFare),
      note: "Total fare value",
    },
    {
      label: "Estimated rider share",
      value: money.format(earnings.estimatedRiderShare),
      note: "Placeholder payout logic",
    },
    {
      label: "Pending payout",
      value: money.format(earnings.pendingPayout),
      note: "Awaiting payout phase",
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real earnings</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Rider earnings and payout estimate.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              This page reads backend rider earnings data. Real payment rules
              will be finalized in the payments and payout phase.
            </p>
          </div>

          <button
            type="button"
            onClick={loadEarnings}
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
          >
            Refresh earnings
          </button>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Panel
          title="Payout note"
          body="Current earnings are calculated from delivered and closed orders."
        >
          <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-5">
            <p className="text-sm leading-6 text-[#667085]">
              {earnings.note}
            </p>
            <p className="mt-4 text-xs leading-5 text-[#98a2b3]">
              Rider profile ID: {earnings.riderProfileId}
            </p>
          </div>
        </Panel>

        <Panel
          title="Next rider actions"
          body="Continue from earnings into active job operations."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/rider/jobs"
              className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4 text-sm font-medium text-[#071a2f]"
            >
              View rider jobs
            </Link>
            <Link
              href="/rider/profile"
              className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4 text-sm font-medium text-[#071a2f]"
            >
              Update rider profile
            </Link>
            <Link
              href="/rider"
              className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4 text-sm font-medium text-[#071a2f]"
            >
              Rider dashboard
            </Link>
            <Link
              href="/rider/support"
              className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4 text-sm font-medium text-[#071a2f]"
            >
              Rider support
            </Link>
          </div>
        </Panel>
      </section>
    </div>
  );
}
