"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

type DispatchOrder = {
  orderId: string;
  status: string;
  serviceType: string;
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
  fare?: number;
  riderId?: string;
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

type RiderProfile = {
  id: string;
  displayName: string;
  phone: string;
  residentialArea?: string;
  verificationStatus: string;
  tier: string;
  rating?: number;
  completedJobs?: number;
  acceptanceRate?: number;
  completionRate?: number;
};

type RidersResponse = {
  riders: RiderProfile[];
};

type AssignRiderResponse = {
  order: DispatchOrder;
  rider: RiderProfile;
};

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function statusTone(status: string) {
  if (["VERIFIED", "RIDER_ASSIGNED"].includes(status)) return "success" as const;

  if (
    [
      "ASSIGNING_RIDER",
      "RIDER_EN_ROUTE",
      "ARRIVED_PICKUP",
      "PICKED_UP",
      "IN_TRANSIT",
      "ARRIVED_DROPOFF",
      "PENDING",
      "UNDER_REVIEW",
      "NEW",
      "STANDARD",
      "PRIORITY",
    ].includes(status)
  ) {
    return "warning" as const;
  }

  if (
    ["FAILED_PICKUP", "FAILED_DELIVERY", "DISPUTED", "CANCELLED", "SUSPENDED", "REJECTED"].includes(
      status
    )
  ) {
    return "danger" as const;
  }

  return "info" as const;
}

export function RealAdminDispatch() {
  const [queue, setQueue] = useState<DispatchOrder[]>([]);
  const [metrics, setMetrics] = useState<DispatchResponse["dispatch"]["metrics"] | null>(
    null
  );
  const [riders, setRiders] = useState<RiderProfile[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedRiderId, setSelectedRiderId] = useState("");
  const [reason, setReason] = useState("Assigning verified rider from dispatch console");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const selectedOrder = useMemo(
    () => queue.find((order) => order.orderId === selectedOrderId) ?? null,
    [queue, selectedOrderId]
  );

  const verifiedRiders = riders.filter(
    (rider) => rider.verificationStatus === "VERIFIED"
  );

  async function loadDispatch() {
    try {
      setError("");
      setLoading(true);

      const [dispatchResponse, ridersResponse] = await Promise.all([
        apiRequest<DispatchResponse>("/api/admin/dispatch"),
        apiRequest<RidersResponse>("/api/admin/riders"),
      ]);

      const dispatchData = dispatchResponse.data?.dispatch;
      const riderData = ridersResponse.data?.riders ?? [];

      setQueue(dispatchData?.queue ?? []);
      setMetrics(dispatchData?.metrics ?? null);
      setRiders(riderData);

      const firstOrder = dispatchData?.queue?.[0];
      const firstVerifiedRider = riderData.find(
        (rider) => rider.verificationStatus === "VERIFIED"
      );

      if (firstOrder && !selectedOrderId) {
        setSelectedOrderId(firstOrder.orderId);
      }

      if (firstVerifiedRider && !selectedRiderId) {
        setSelectedRiderId(firstVerifiedRider.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dispatch");
    } finally {
      setLoading(false);
    }
  }

  async function assignRider() {
    if (!selectedOrderId || !selectedRiderId) return;

    try {
      setError("");
      setNotice("");
      setAssigning(true);

      const response = await apiRequest<AssignRiderResponse>(
        `/api/admin/orders/${selectedOrderId}/assign-rider`,
        {
          method: "PATCH",
          body: JSON.stringify({
            riderProfileId: selectedRiderId,
            reason,
          }),
        }
      );

      const updatedOrder = response.data?.order;

      if (updatedOrder) {
        setQueue((current) =>
          current.map((order) =>
            order.orderId === updatedOrder.orderId ? updatedOrder : order
          )
        );
      }

      setNotice("Rider assigned successfully.");
      await loadDispatch();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not assign rider. Check rider verification and order status."
      );
    } finally {
      setAssigning(false);
    }
  }

  useEffect(() => {
    loadDispatch();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real dispatch queue...</p>
      </section>
    );
  }

  if (error && !metrics) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Admin access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Dispatch operations are protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          This page now connects to protected admin dispatch APIs. Login with
          the seeded ADMIN account to view the queue and assign verified riders.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Login as admin
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Admin orders
          </Link>
        </div>
      </section>
    );
  }

  const metricCards = [
    {
      label: "Pending assignment",
      value: String(metrics?.pendingAssignment ?? 0),
      note: "Orders waiting for rider",
    },
    {
      label: "Active jobs",
      value: String(metrics?.activeJobs ?? 0),
      note: "Riders currently moving orders",
    },
    {
      label: "Risk review",
      value: String(metrics?.failedRisk ?? 0),
      note: "Failed, disputed, or blocked",
    },
    {
      label: "Verified riders",
      value: String(metrics?.verifiedRiders ?? 0),
      note: "Eligible for assignment",
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real dispatch</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Dispatch queue and rider assignment.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              This screen reads real operational queue data and assigns verified
              riders through protected backend admin APIs.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDispatch}
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
          >
            Refresh queue
          </button>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="Dispatch queue"
          body="Orders in assignment, movement, or risk review."
        >
          {queue.length ? (
            <div className="grid gap-3">
              {queue.map((order) => (
                <button
                  key={order.orderId}
                  type="button"
                  onClick={() => setSelectedOrderId(order.orderId)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedOrderId === order.orderId
                      ? "border-[#071a2f] bg-[#071a2f] text-white"
                      : "border-[#e5ded2] bg-[#fffdf8] text-[#071a2f] hover:border-[#071a2f]/30"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{order.orderId}</p>
                        <StatusChip tone={statusTone(order.status)}>
                          {order.status.replaceAll("_", " ").toLowerCase()}
                        </StatusChip>
                      </div>

                      <p
                        className={`mt-2 text-xs leading-5 ${
                          selectedOrderId === order.orderId
                            ? "text-white/70"
                            : "text-[#667085]"
                        }`}
                      >
                        {order.pickup?.address ?? "Pickup"} →{" "}
                        {order.dropoff?.address ?? "Drop-off"}
                      </p>

                      <p
                        className={`mt-1 text-[11px] ${
                          selectedOrderId === order.orderId
                            ? "text-white/60"
                            : "text-[#98a2b3]"
                        }`}
                      >
                        {order.serviceType?.replaceAll("_", " ").toLowerCase()}
                      </p>
                    </div>

                    <p className="text-sm font-medium">
                      {money.format(order.fare ?? 0)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-5">
              <p className="text-sm leading-6 text-[#667085]">
                No dispatch queue yet. Create a real order from the booking flow
                to populate pending assignment.
              </p>
              <Link
                href="/book"
                className="mt-4 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
              >
                Create order
              </Link>
            </div>
          )}
        </Panel>

        <Panel
          title="Assign rider"
          body="Only verified riders are eligible for assignment."
        >
          {selectedOrder ? (
            <div>
              <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-lg font-medium tracking-[-0.035em] text-[#071a2f]">
                    {selectedOrder.orderId}
                  </p>
                  <StatusChip tone={statusTone(selectedOrder.status)}>
                    {selectedOrder.status.replaceAll("_", " ").toLowerCase()}
                  </StatusChip>
                </div>

                <div className="mt-5 grid gap-4">
                  <div>
                    <p className="text-xs text-[#667085]">Pickup</p>
                    <p className="mt-1 text-sm leading-6 text-[#071a2f]">
                      {selectedOrder.pickup?.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#667085]">Drop-off</p>
                    <p className="mt-1 text-sm leading-6 text-[#071a2f]">
                      {selectedOrder.dropoff?.address}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/orders/${selectedOrder.orderId}`}
                  className="mt-5 inline-flex rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
                >
                  View order detail
                </Link>
              </div>

              <div className="mt-5 rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
                <label>
                  <span className="label">Verified rider</span>
                  <select
                    className="field"
                    value={selectedRiderId}
                    onChange={(event) => setSelectedRiderId(event.target.value)}
                  >
                    <option value="">Select verified rider</option>
                    {verifiedRiders.map((rider) => (
                      <option key={rider.id} value={rider.id}>
                        {rider.displayName} · {rider.phone} · {rider.tier}
                      </option>
                    ))}
                  </select>
                </label>

                {verifiedRiders.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-[#f2d59b] bg-[#fff5dc] p-4 text-sm leading-6 text-[#8a5a00]">
                    No verified riders yet. Seed or verify a rider first before
                    assignment.
                  </div>
                ) : null}

                <label className="mt-4 block">
                  <span className="label">Assignment reason</span>
                  <textarea
                    className="field"
                    rows={4}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                  />
                </label>

                {notice ? (
                  <div className="mt-4 rounded-2xl border border-[#b7dfcf] bg-[#e8f6ef] p-4 text-sm leading-6 text-[#1f7a55]">
                    {notice}
                  </div>
                ) : null}

                {error ? (
                  <div className="mt-4 rounded-2xl border border-[#f3b6b6] bg-[#fff0f0] p-4 text-sm leading-6 text-[#9a3412]">
                    {error}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={assignRider}
                  disabled={
                    assigning ||
                    !selectedOrderId ||
                    !selectedRiderId ||
                    reason.trim().length < 5
                  }
                  className="mt-5 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  {assigning ? "Assigning..." : "Assign verified rider"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-6 text-[#667085]">
              Select an order from the dispatch queue to assign a rider.
            </p>
          )}
        </Panel>
      </section>
    </div>
  );
}
