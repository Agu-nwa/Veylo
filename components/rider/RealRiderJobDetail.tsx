"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";
import { OrderProofPanel } from "@/components/proofs/OrderProofPanel";

type RiderJob = {
  orderId: string;
  serviceType: string;
  status: string;
  fare: number;
  pickup?: {
    address?: string;
    landmark?: string;
    contactName?: string;
    phone?: string;
  };
  dropoff?: {
    address?: string;
    landmark?: string;
    recipientName?: string;
    phone?: string;
  };
  package?: {
    category?: string;
    valueBand?: string;
    note?: string;
  };
  createdAt?: string;
};

type TimelineEvent = {
  status: string;
  label: string;
  detail: string;
  actorRole?: string;
  createdAt?: string;
};

type RiderJobResponse = {
  order: RiderJob;
  timeline: TimelineEvent[];
};

type RejectResponse = {
  rejected: boolean;
  orderId: string;
  reason: string;
};

const statusOptions = [
  "RIDER_EN_ROUTE",
  "ARRIVED_PICKUP",
  "PICKED_UP",
  "IN_TRANSIT",
  "ARRIVED_DROPOFF",
  "DELIVERED",
  "FAILED_PICKUP",
  "FAILED_DELIVERY",
];

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

export function RealRiderJobDetail({ orderId }: { orderId: string }) {
  const [data, setData] = useState<RiderJobResponse | null>(null);
  const [nextStatus, setNextStatus] = useState("RIDER_EN_ROUTE");
  const [detail, setDetail] = useState("Rider updated delivery movement.");
  const [rejectReason, setRejectReason] = useState("Unable to accept this job.");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadJob() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<RiderJobResponse>(
        `/api/rider/jobs/${orderId}`
      );

      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load rider job");
    } finally {
      setLoading(false);
    }
  }

  async function acceptJob() {
    try {
      setError("");
      setNotice("");
      setWorking("accept");

      const response = await apiRequest<RiderJobResponse>(
        `/api/rider/jobs/${orderId}/accept`,
        {
          method: "PATCH",
        }
      );

      setData(response.data);
      setNotice("Job accepted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not accept job");
    } finally {
      setWorking("");
    }
  }

  async function rejectJob() {
    try {
      setError("");
      setNotice("");
      setWorking("reject");

      await apiRequest<RejectResponse>(`/api/rider/jobs/${orderId}/reject`, {
        method: "PATCH",
        body: JSON.stringify({
          reason: rejectReason,
        }),
      });

      setNotice("Job rejection recorded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reject job");
    } finally {
      setWorking("");
    }
  }

  async function updateStatus() {
    try {
      setError("");
      setNotice("");
      setWorking("status");

      const response = await apiRequest<RiderJobResponse>(
        `/api/rider/jobs/${orderId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: nextStatus,
            detail,
            reason: detail,
          }),
        }
      );

      setData(response.data);
      setNotice("Job status updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update job status. Check legal transition rules."
      );
    } finally {
      setWorking("");
    }
  }

  useEffect(() => {
    loadJob();
  }, [orderId]);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real rider job...</p>
      </section>
    );
  }

  if (error && !data?.order) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Rider access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Job access is protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          This job page is now backend-powered. Login as the assigned rider,
          eligible rider, or admin to view this job.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Login as rider
          </Link>
          <Link
            href="/rider/jobs"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Back to jobs
          </Link>
        </div>
      </section>
    );
  }

  const job = data?.order;

  if (!job) {
    return null;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real rider job</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              {job.orderId}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
              Accept open offers and update assigned delivery movement through
              real rider backend APIs.
            </p>
          </div>

          <StatusChip tone={statusTone(job.status)}>
            {job.status.replaceAll("_", " ").toLowerCase()}
          </StatusChip>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
            <p className="text-sm font-medium text-[#071a2f]">Pickup</p>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              {job.pickup?.address}
            </p>
            <p className="mt-2 text-xs text-[#98a2b3]">
              {job.pickup?.landmark}
            </p>
            <p className="mt-3 text-xs text-[#475467]">
              {job.pickup?.contactName} · {job.pickup?.phone}
            </p>
          </div>

          <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
            <p className="text-sm font-medium text-[#071a2f]">Drop-off</p>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              {job.dropoff?.address}
            </p>
            <p className="mt-2 text-xs text-[#98a2b3]">
              {job.dropoff?.landmark}
            </p>
            <p className="mt-3 text-xs text-[#475467]">
              {job.dropoff?.recipientName} · {job.dropoff?.phone}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
          <p className="text-sm font-medium text-[#071a2f]">Package and fare</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-[#667085]">Category</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {job.package?.category}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#667085]">Value band</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {job.package?.valueBand}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#667085]">Fare</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {money.format(job.fare)}
              </p>
            </div>
          </div>
          {job.package?.note ? (
            <p className="mt-4 text-sm leading-6 text-[#667085]">
              {job.package.note}
            </p>
          ) : null}
        </div>

        <OrderProofPanel orderId={job.orderId} />

        <div className="mt-6 grid gap-4">
          {job.status === "ASSIGNING_RIDER" ? (
            <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
              <p className="text-sm font-medium text-[#071a2f]">
                Open job offer
              </p>
              <p className="mt-2 text-xs leading-5 text-[#667085]">
                Accepting this job assigns it to your rider profile and moves it
                to rider assigned.
              </p>

              <label className="mt-4 block">
                <span className="label">Reject reason</span>
                <input
                  className="field"
                  value={rejectReason}
                  onChange={(event) => setRejectReason(event.target.value)}
                />
              </label>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={acceptJob}
                  disabled={working !== ""}
                  className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  {working === "accept" ? "Accepting..." : "Accept job"}
                </button>

                <button
                  type="button"
                  onClick={rejectJob}
                  disabled={working !== "" || rejectReason.trim().length < 5}
                  className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f] disabled:opacity-60"
                >
                  {working === "reject" ? "Rejecting..." : "Reject job"}
                </button>
              </div>
            </div>
          ) : null}

          {job.status !== "ASSIGNING_RIDER" ? (
            <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
              <p className="text-sm font-medium text-[#071a2f]">
                Update delivery status
              </p>
              <p className="mt-2 text-xs leading-5 text-[#667085]">
                The backend state machine rejects illegal transitions. Follow
                the delivery sequence carefully.
              </p>

              <label className="mt-4 block">
                <span className="label">Next status</span>
                <select
                  className="field"
                  value={nextStatus}
                  onChange={(event) => setNextStatus(event.target.value)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-4 block">
                <span className="label">Movement detail</span>
                <textarea
                  className="field"
                  rows={4}
                  value={detail}
                  onChange={(event) => setDetail(event.target.value)}
                />
              </label>

              <button
                type="button"
                onClick={updateStatus}
                disabled={working !== "" || detail.trim().length < 5}
                className="mt-5 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
              >
                {working === "status" ? "Updating..." : "Update status"}
              </button>
            </div>
          ) : null}

          {notice ? (
            <div className="rounded-2xl border border-[#b7dfcf] bg-[#e8f6ef] p-4 text-sm leading-6 text-[#1f7a55]">
              {notice}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-[#f3b6b6] bg-[#fff0f0] p-4 text-sm leading-6 text-[#9a3412]">
              {error}
            </div>
          ) : null}
        </div>
      </section>

      <Panel
        title="Job timeline"
        body="Every backend status update creates a timeline event."
      >
        {data?.timeline?.length ? (
          <div className="grid gap-3">
            {data.timeline.map((event, index) => (
              <div
                key={`${event.status}-${event.createdAt}-${index}`}
                className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#071a2f] text-xs font-medium text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#071a2f]">
                      {event.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#667085]">
                      {event.detail}
                    </p>
                    {event.createdAt ? (
                      <p className="mt-2 text-[11px] text-[#98a2b3]">
                        {new Date(event.createdAt).toLocaleString()}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-[#667085]">
            Timeline events will appear as this job moves through the delivery
            sequence.
          </p>
        )}

        <Link
          href="/rider/jobs"
          className="mt-5 inline-flex rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
        >
          Back to rider jobs
        </Link>
      </Panel>
    </div>
  );
}
