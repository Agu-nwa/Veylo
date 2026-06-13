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

type DispatchOrder = {
  orderId: string;
  status: string;
  serviceType: string;
  pickup?: {
    address?: string;
  };
  dropoff?: {
    address?: string;
  };
  fare?: number;
  createdAt?: string;
};

type DispatchResponse = {
  dispatch: {
    metrics: {
      pendingAssignment: number;
      activeJobs: number;
      failedRisk: number;
      verifiedRiders: number;
    };
    queue: DispatchOrder[];
  };
};

type AuditLog = {
  id?: string;
  action: string;
  entityType: string;
  entityId?: string;
  actorRole?: string;
  reason?: string;
  createdAt?: string;
};

type AuditLogsResponse = {
  auditLogs: AuditLog[];
};

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function statusTone(status: string) {
  if (["DELIVERED", "CLOSED", "ACTIVE", "VERIFIED"].includes(status)) {
    return "success" as const;
  }

  if (
    [
      "ASSIGNING_RIDER",
      "RIDER_ASSIGNED",
      "RIDER_EN_ROUTE",
      "ARRIVED_PICKUP",
      "PICKED_UP",
      "IN_TRANSIT",
      "ARRIVED_DROPOFF",
      "OPEN",
      "UNDER_REVIEW",
    ].includes(status)
  ) {
    return "warning" as const;
  }

  if (
    ["FAILED_PICKUP", "FAILED_DELIVERY", "DISPUTED", "CANCELLED", "REJECTED"].includes(
      status
    )
  ) {
    return "danger" as const;
  }

  return "info" as const;
}

export function RealAdminOverview() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse["analytics"] | null>(
    null
  );
  const [dispatch, setDispatch] = useState<DispatchResponse["dispatch"] | null>(
    null
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAdminOverview() {
    try {
      setError("");
      setLoading(true);

      const [analyticsResponse, dispatchResponse, auditResponse] =
        await Promise.all([
          apiRequest<AnalyticsResponse>("/api/admin/analytics"),
          apiRequest<DispatchResponse>("/api/admin/dispatch"),
          apiRequest<AuditLogsResponse>("/api/admin/audit-logs"),
        ]);

      setAnalytics(analyticsResponse.data?.analytics ?? null);
      setDispatch(dispatchResponse.data?.dispatch ?? null);
      setAuditLogs(auditResponse.data?.auditLogs ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load admin overview"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminOverview();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real admin operations...</p>
      </section>
    );
  }

  if (error || !analytics || !dispatch) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Admin access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Admin operations are protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          This admin overview now connects to real protected backend APIs. Log in
          with the seeded ADMIN account to view analytics, dispatch queue, and
          audit logs.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Login as admin
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Customer dashboard
          </Link>
        </div>
      </section>
    );
  }

  const metricCards = [
    {
      label: "Total orders",
      value: String(analytics.totalOrders),
      note: "All backend orders",
    },
    {
      label: "Completion rate",
      value: `${analytics.completionRate}%`,
      note: `${analytics.completedOrders} completed`,
    },
    {
      label: "Open dispatch",
      value: String(dispatch.metrics.pendingAssignment),
      note: "Awaiting rider assignment",
    },
    {
      label: "Total fare volume",
      value: money.format(analytics.totalFare),
      note: `Average ${money.format(analytics.averageFare)}`,
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real admin overview</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Veylo operations control.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              This page now reads real backend analytics, dispatch queue, and
              persistent audit logs from protected admin APIs.
            </p>
          </div>

          <Link
            href="/admin/businesses"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
          >
            View business requests
          </Link>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Panel
          title="Dispatch queue"
          body="Orders that need rider assignment, monitoring, or operational review."
        >
          {dispatch.queue.length ? (
            <div className="grid gap-3">
              {dispatch.queue.slice(0, 8).map((order) => (
                <div
                  key={order.orderId}
                  className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
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

                    <div className="text-left md:text-right">
                      <p className="text-sm font-medium text-[#071a2f]">
                        {money.format(order.fare ?? 0)}
                      </p>
                      <Link
                        href={`/orders/${order.orderId}`}
                        className="mt-2 inline-flex text-xs font-medium text-[#1f7a55]"
                      >
                        View order
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-5">
              <p className="text-sm leading-6 text-[#667085]">
                No active dispatch queue yet. Create real customer orders from
                the booking flow to populate this area.
              </p>
            </div>
          )}
        </Panel>

        <Panel
          title="Operations health"
          body="High-level counts from the protected admin analytics endpoint."
        >
          <div className="grid gap-3">
            {[
              ["Active jobs", dispatch.metrics.activeJobs],
              ["Failed/disputed risk", dispatch.metrics.failedRisk],
              ["Verified riders", dispatch.metrics.verifiedRiders],
              ["Business orders", analytics.businessOrders],
              ["Support tickets", analytics.tickets],
              ["Quotes generated", analytics.quotes],
              ["Disputes", analytics.disputes],
              ["Failure rate", `${analytics.failureRate}%`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
              >
                <p className="text-sm text-[#667085]">{label}</p>
                <p className="text-sm font-medium text-[#071a2f]">{value}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Panel
          title="Recent audit logs"
          body="Sensitive backend actions are now persisted as audit logs."
        >
          {auditLogs.length ? (
            <div className="grid gap-3">
              {auditLogs.slice(0, 8).map((log, index) => (
                <div
                  key={`${log.action}-${log.entityId}-${index}`}
                  className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
                >
                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
                    <div>
                      <p className="text-sm font-medium text-[#071a2f]">
                        {log.action}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#667085]">
                        {log.entityType}
                        {log.entityId ? ` · ${log.entityId}` : ""}
                      </p>
                    </div>
                    <StatusChip tone="info">{log.actorRole || "SYSTEM"}</StatusChip>
                  </div>

                  {log.reason ? (
                    <p className="mt-2 text-xs leading-5 text-[#667085]">
                      Reason: {log.reason}
                    </p>
                  ) : null}

                  {log.createdAt ? (
                    <p className="mt-2 text-[11px] text-[#98a2b3]">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-[#667085]">
              No audit logs yet. Register, quote, order, support, rider, and
              admin actions will appear here.
            </p>
          )}
        </Panel>

        <Panel
          title="Admin modules"
          body="Protected admin modules connected or ready for real data."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["Dispatch", "/admin/dispatch"],
              ["Orders", "/admin/orders"],
              ["Riders", "/admin/riders"],
              ["Businesses", "/admin/businesses"],
              ["Pricing rules", "/admin/pricing"],
              ["Quotes", "/admin/quotes"],
              ["Disputes", "/admin/disputes"],
              ["Analytics", "/admin/analytics"],
              ["Audit logs", "/admin/audit-logs"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4 text-sm font-medium text-[#071a2f] transition hover:border-[#071a2f]/30"
              >
                {label}
              </Link>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}
