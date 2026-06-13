"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

type BusinessProfile = {
  id?: string;
  _id?: string;
  businessName: string;
  businessType: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  weeklyDeliveryEstimate?: string;
  planType?: string;
  accountStatus?: string;
  approvedDiscountRate?: number;
  discountCap?: number;
  monthlyOrderCount?: number;
};

type BusinessOrder = {
  orderId: string;
  status: string;
  serviceType: string;
  fare: number;
  pickup?: {
    address?: string;
  };
  dropoff?: {
    address?: string;
  };
  createdAt?: string;
};

type BusinessDashboardResponse = {
  dashboard: {
    scope: string;
    profile?: BusinessProfile;
    metrics?: {
      recentOrders: number;
      completedCount: number;
      activeCount: number;
      totalSpend: number;
      currency: string;
    };
    recentOrders?: BusinessOrder[];
    activeBusinesses?: number;
    pendingRequests?: number;
    totalBusinessOrders?: number;
  };
};

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function statusTone(status?: string) {
  if (["ACTIVE", "DELIVERED", "CLOSED"].includes(status || "")) return "success" as const;
  if (["PENDING", "ASSIGNING_RIDER", "RIDER_ASSIGNED", "IN_TRANSIT"].includes(status || "")) return "warning" as const;
  if (["SUSPENDED", "REJECTED", "FAILED_PICKUP", "FAILED_DELIVERY", "DISPUTED"].includes(status || "")) return "danger" as const;
  return "info" as const;
}

export function RealBusinessDashboard() {
  const [dashboard, setDashboard] = useState<BusinessDashboardResponse["dashboard"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<BusinessDashboardResponse>("/api/business/dashboard");
      setDashboard(response.data?.dashboard ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load business dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real business dashboard...</p>
      </section>
    );
  }

  if (error || !dashboard) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Business access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Business dashboard is protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          Login with an approved business account to view real business delivery
          metrics, order history, reports, and plan details.
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

  const profile = dashboard.profile;
  const metrics = dashboard.metrics;

  const metricCards = [
    {
      label: "Recent orders",
      value: String(metrics?.recentOrders ?? 0),
      note: "Real business orders",
    },
    {
      label: "Active deliveries",
      value: String(metrics?.activeCount ?? 0),
      note: "Still moving through operations",
    },
    {
      label: "Completed",
      value: String(metrics?.completedCount ?? 0),
      note: "Delivered or closed",
    },
    {
      label: "Total spend",
      value: money.format(metrics?.totalSpend ?? 0),
      note: "Backend fare total",
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real business dashboard</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              {profile?.businessName || "Business account"}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              This dashboard now reads real business profile, metrics, and recent
              delivery orders from the backend.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusChip tone={statusTone(profile?.accountStatus)}>
              {profile?.accountStatus || "business"}
            </StatusChip>
            <StatusChip tone="info">{profile?.planType || "plan"}</StatusChip>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Panel
          title="Recent business orders"
          body="Orders created under this approved business profile."
        >
          {dashboard.recentOrders?.length ? (
            <div className="grid gap-3">
              {dashboard.recentOrders.slice(0, 8).map((order) => (
                <Link
                  key={order.orderId}
                  href={`/orders/${order.orderId}`}
                  className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4 transition hover:border-[#071a2f]/30"
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-[#071a2f]">
                          {order.orderId}
                        </p>
                        <StatusChip tone={statusTone(order.status)}>
                          {order.status.replaceAll("_", " ").toLowerCase()}
                        </StatusChip>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-[#667085]">
                        {order.pickup?.address ?? "Pickup"} →{" "}
                        {order.dropoff?.address ?? "Drop-off"}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-[#071a2f]">
                      {money.format(order.fare)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-5">
              <p className="text-sm leading-6 text-[#667085]">
                No business orders yet. Create a business delivery quote from
                the new delivery page.
              </p>
              <Link
                href="/business/new-delivery"
                className="mt-4 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
              >
                New business delivery
              </Link>
            </div>
          )}
        </Panel>

        <Panel
          title="Business profile"
          body="Approved business account details used for pricing and reports."
        >
          <div className="grid gap-3">
            {[
              ["Business type", profile?.businessType || "Not set"],
              ["Contact", profile?.contactName || "Not set"],
              ["Phone", profile?.contactPhone || "Not set"],
              ["Email", profile?.contactEmail || "Not set"],
              ["Address", profile?.address || "Not set"],
              ["Weekly estimate", profile?.weeklyDeliveryEstimate || "Not set"],
              ["Discount rate", `${profile?.approvedDiscountRate ?? 0}%`],
              ["Discount cap", money.format(profile?.discountCap ?? 0)],
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

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              href="/business/plan"
              className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
            >
              View plan
            </Link>
            <Link
              href="/business/reports"
              className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
            >
              View reports
            </Link>
          </div>
        </Panel>
      </section>
    </div>
  );
}
