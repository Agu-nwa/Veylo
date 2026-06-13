"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

type ReportRow = {
  orderId: string;
  route: string;
  status: string;
  fare: number;
  createdAt?: string;
};

type BusinessReportsResponse = {
  report: {
    businessId: string;
    currency: string;
    orderCount: number;
    completedCount: number;
    failedOrReviewedCount: number;
    totalSpend: number;
    averageFare: number;
    discountPlaceholder: string;
    rows: ReportRow[];
  };
};

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function statusTone(status: string) {
  if (["DELIVERED", "CLOSED"].includes(status)) return "success" as const;
  if (["FAILED_PICKUP", "FAILED_DELIVERY", "DISPUTED", "CANCELLED"].includes(status)) {
    return "danger" as const;
  }
  if (["ASSIGNING_RIDER", "RIDER_ASSIGNED", "IN_TRANSIT", "PICKED_UP"].includes(status)) {
    return "warning" as const;
  }
  return "info" as const;
}

export function RealBusinessReports() {
  const [report, setReport] = useState<BusinessReportsResponse["report"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReport() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<BusinessReportsResponse>(
        "/api/business/reports"
      );

      setReport(response.data?.report ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load business reports");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real business reports...</p>
      </section>
    );
  }

  if (error || !report) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Business access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Business reports are protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          Login with an approved business account to view real spend, order
          count, completion count, and report rows.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Login as business
          </Link>
          <Link
            href="/business/dashboard"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Business dashboard
          </Link>
        </div>
      </section>
    );
  }

  const metrics = [
    {
      label: "Orders",
      value: String(report.orderCount),
      note: "Total report rows",
    },
    {
      label: "Completed",
      value: String(report.completedCount),
      note: "Delivered or closed",
    },
    {
      label: "Needs review",
      value: String(report.failedOrReviewedCount),
      note: "Failed or disputed",
    },
    {
      label: "Total spend",
      value: money.format(report.totalSpend),
      note: `Average ${money.format(report.averageFare)}`,
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real business reports</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Business delivery reports.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              This page now reads real report data generated from backend
              business orders.
            </p>
          </div>

          <button
            type="button"
            onClick={loadReport}
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
          >
            Refresh report
          </button>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="Report rows"
          body="Backend-generated business delivery report rows."
        >
          {report.rows.length ? (
            <div className="grid gap-3">
              {report.rows.map((row) => (
                <Link
                  key={row.orderId}
                  href={`/orders/${row.orderId}`}
                  className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4 transition hover:border-[#071a2f]/30"
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-[#071a2f]">
                          {row.orderId}
                        </p>
                        <StatusChip tone={statusTone(row.status)}>
                          {row.status.replaceAll("_", " ").toLowerCase()}
                        </StatusChip>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-[#667085]">
                        {row.route}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-sm font-medium text-[#071a2f]">
                        {money.format(row.fare)}
                      </p>
                      {row.createdAt ? (
                        <p className="mt-1 text-xs text-[#98a2b3]">
                          {new Date(row.createdAt).toLocaleString()}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-[#667085]">
              No report rows yet. Create business deliveries to populate reports.
            </p>
          )}
        </Panel>

        <Panel
          title="Report policy"
          body="Plan discounts and business pricing are backend controlled."
        >
          <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-5">
            <p className="text-sm leading-6 text-[#667085]">
              {report.discountPlaceholder}
            </p>
            <p className="mt-4 text-xs leading-5 text-[#98a2b3]">
              Business ID: {report.businessId}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              href="/business/history"
              className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
            >
              View history
            </Link>
            <Link
              href="/business/new-delivery"
              className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
            >
              New delivery
            </Link>
          </div>
        </Panel>
      </section>
    </div>
  );
}
