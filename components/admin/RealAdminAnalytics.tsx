"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

type AnalyticsResponse = {
  analytics: {
    totalOrders: number;
    completedOrders: number;
    failedOrders: number;
    businessOrders: number;
    riders: number;
    businesses: number;
    tickets: number;
    quotes: number;
    disputes: number;
    totalFare: number;
    averageFare: number;
    completionRate: number;
    failureRate: number;
    currency: string;
  };
};

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function healthTone(value: number, type: "completion" | "failure") {
  if (type === "completion") {
    if (value >= 80) return "success" as const;
    if (value >= 50) return "warning" as const;
    return "danger" as const;
  }

  if (value <= 5) return "success" as const;
  if (value <= 15) return "warning" as const;
  return "danger" as const;
}

export function RealAdminAnalytics() {
  const [analytics, setAnalytics] =
    useState<AnalyticsResponse["analytics"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAnalytics() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<AnalyticsResponse>(
        "/api/admin/analytics"
      );

      setAnalytics(response.data?.analytics ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load analytics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real admin analytics...</p>
      </section>
    );
  }

  if (error || !analytics) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Admin access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Analytics are protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          This page now connects to the protected backend analytics API. Login
          with an ADMIN account to view real order, quote, rider, business,
          support, and revenue activity.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Login as admin
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Admin overview
          </Link>
        </div>
      </section>
    );
  }

  const orderMetrics = [
    {
      label: "Total orders",
      value: String(analytics.totalOrders),
      note: "All backend delivery orders",
    },
    {
      label: "Completed orders",
      value: String(analytics.completedOrders),
      note: "Delivered or closed",
    },
    {
      label: "Failed/risk orders",
      value: String(analytics.failedOrders),
      note: "Failed, cancelled, or review-needed",
    },
    {
      label: "Business orders",
      value: String(analytics.businessOrders),
      note: "Orders linked to business profiles",
    },
  ];

  const commercialMetrics = [
    {
      label: "Total fare volume",
      value: money.format(analytics.totalFare),
      note: "Backend fare total",
    },
    {
      label: "Average fare",
      value: money.format(analytics.averageFare),
      note: "Average value per order",
    },
    {
      label: "Quotes",
      value: String(analytics.quotes),
      note: "Pricing quotes generated",
    },
    {
      label: "Support tickets",
      value: String(analytics.tickets),
      note: "Customer, rider, and business support",
    },
  ];

  const operations = [
    ["Riders", analytics.riders],
    ["Businesses", analytics.businesses],
    ["Disputes", analytics.disputes],
    ["Completion rate", `${analytics.completionRate}%`],
    ["Failure rate", `${analytics.failureRate}%`],
    ["Currency", analytics.currency],
  ];

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real analytics</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Veylo operating analytics.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              This page reads real metrics from MongoDB through the protected
              analytics endpoint. Use it to monitor orders, quote activity,
              rider/business growth, support volume, and delivery performance.
            </p>
          </div>

          <button
            type="button"
            onClick={loadAnalytics}
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
          >
            Refresh analytics
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {orderMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {commercialMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel
          title="Performance health"
          body="Delivery completion and failure rates from backend order data."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[#071a2f]">
                  Completion rate
                </p>
                <StatusChip tone={healthTone(analytics.completionRate, "completion")}>
                  {analytics.completionRate}%
                </StatusChip>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#667085]">
                Completed orders divided by total orders. This improves as more
                orders reach delivered or closed status.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[#071a2f]">
                  Failure rate
                </p>
                <StatusChip tone={healthTone(analytics.failureRate, "failure")}>
                  {analytics.failureRate}%
                </StatusChip>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#667085]">
                Failed or risk orders divided by total orders. This helps
                operations monitor dispatch, proof, dispute, and delivery quality.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
            <p className="text-sm font-medium text-[#071a2f]">
              Commercial signal
            </p>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              Veylo has processed {money.format(analytics.totalFare)} in fare
              value across {analytics.totalOrders} orders, with an average fare
              of {money.format(analytics.averageFare)}.
            </p>
          </div>
        </Panel>

        <Panel
          title="Operations summary"
          body="High-level system activity across users, quotes, businesses, support, and disputes."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {operations.map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
              >
                <p className="text-xs text-[#667085]">{label}</p>
                <p className="mt-1 text-lg font-medium text-[#071a2f]">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              href="/admin/orders"
              className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
            >
              View orders
            </Link>
            <Link
              href="/admin/quotes"
              className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
            >
              View quotes
            </Link>
            <Link
              href="/admin/riders"
              className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
            >
              View riders
            </Link>
            <Link
              href="/admin/businesses"
              className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
            >
              View businesses
            </Link>
          </div>
        </Panel>
      </section>

      <Panel
        title="What this analytics page proves"
        body="This confirms Veylo is now a working logistics operating shell with real backend activity."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            "Quotes generated from customer and business delivery flows are counted.",
            "Orders created from accepted quotes are counted and categorized.",
            "Riders, businesses, support tickets, disputes, fare value, and completion rates are visible to admin.",
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
