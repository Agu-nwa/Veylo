"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusChip } from "@/components/shared/StatusChip";

type RiderJob = {
  orderId: string;
  serviceType: string;
  status: string;
  fare: number;
  pickup?: {
    address?: string;
    landmark?: string;
  };
  dropoff?: {
    address?: string;
    landmark?: string;
  };
  package?: {
    category?: string;
    valueBand?: string;
    note?: string;
  };
  createdAt?: string;
};

type RiderJobsResponse = {
  jobs: RiderJob[];
};

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function statusTone(status: string) {
  if (["DELIVERED", "CLOSED"].includes(status)) return "success" as const;

  if (
    [
      "ASSIGNING_RIDER",
      "RIDER_ASSIGNED",
      "RIDER_EN_ROUTE",
      "ARRIVED_PICKUP",
      "PICKED_UP",
      "IN_TRANSIT",
      "ARRIVED_DROPOFF",
    ].includes(status)
  ) {
    return "warning" as const;
  }

  if (["FAILED_PICKUP", "FAILED_DELIVERY", "DISPUTED", "CANCELLED"].includes(status)) {
    return "danger" as const;
  }

  return "info" as const;
}

export function RealRiderJobsList() {
  const [jobs, setJobs] = useState<RiderJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadJobs() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<RiderJobsResponse>("/api/rider/jobs");
      setJobs(response.data?.jobs ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load rider jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real rider jobs...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Rider access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Rider jobs are protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          This page now connects to real protected rider APIs. Login with a rider
          account to view open offers and assigned jobs.
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

  const openOffers = jobs.filter((job) => job.status === "ASSIGNING_RIDER");
  const activeJobs = jobs.filter((job) =>
    [
      "RIDER_ASSIGNED",
      "RIDER_EN_ROUTE",
      "ARRIVED_PICKUP",
      "PICKED_UP",
      "IN_TRANSIT",
      "ARRIVED_DROPOFF",
    ].includes(job.status)
  );
  const completedJobs = jobs.filter((job) =>
    ["DELIVERED", "CLOSED"].includes(job.status)
  );
  const totalFare = jobs.reduce((sum, job) => sum + Number(job.fare || 0), 0);

  const metrics = [
    {
      label: "Open offers",
      value: String(openOffers.length),
      note: "Available for acceptance",
    },
    {
      label: "Active jobs",
      value: String(activeJobs.length),
      note: "Assigned and moving",
    },
    {
      label: "Completed",
      value: String(completedJobs.length),
      note: "Delivered or closed",
    },
    {
      label: "Fare value",
      value: money.format(totalFare),
      note: "Visible rider job value",
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real rider jobs</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Rider jobs and open offers.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              This page reads real backend jobs. Open offers can be accepted, and
              assigned jobs can be updated from the job detail page.
            </p>
          </div>

          <button
            type="button"
            onClick={loadJobs}
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
          >
            Refresh jobs
          </button>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        {jobs.length ? (
          jobs.map((job) => (
            <Link
              key={job.orderId}
              href={`/rider/jobs/${job.orderId}`}
              className="card rounded-[28px] p-5 transition hover:border-[#071a2f]/30"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-medium tracking-[-0.035em] text-[#071a2f]">
                      {job.orderId}
                    </h2>
                    <StatusChip tone={statusTone(job.status)}>
                      {job.status.replaceAll("_", " ").toLowerCase()}
                    </StatusChip>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#667085]">
                    {job.pickup?.address ?? "Pickup"} →{" "}
                    {job.dropoff?.address ?? "Drop-off"}
                  </p>

                  <p className="mt-1 text-xs text-[#98a2b3]">
                    {job.package?.category ?? "Package"} ·{" "}
                    {job.serviceType?.replaceAll("_", " ").toLowerCase()}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-sm text-[#667085]">Fare</p>
                  <p className="mt-1 text-lg font-medium text-[#071a2f]">
                    {money.format(job.fare)}
                  </p>
                  <span className="mt-3 inline-flex text-xs font-medium text-[#1f7a55]">
                    Open job
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="card rounded-[28px] p-6">
            <StatusChip tone="info">No jobs yet</StatusChip>
            <h2 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
              Rider jobs will appear here.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              Admin can assign orders from dispatch, or open offers will appear
              when orders are waiting for rider assignment.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
