"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

type AdminOrder = {
  orderId: string;
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
  fare: number;
  status: string;
  paymentStatus?: string;
  supportStatus?: string;
  cancellationStatus?: string;
  createdAt?: string;
};

type AdminOrdersResponse = {
  orders: AdminOrder[];
};

type StatusUpdateResponse = {
  order: AdminOrder;
  timeline: Array<unknown>;
};

const orderStatuses = [
  "ASSIGNING_RIDER",
  "RIDER_ASSIGNED",
  "RIDER_EN_ROUTE",
  "ARRIVED_PICKUP",
  "PICKED_UP",
  "IN_TRANSIT",
  "ARRIVED_DROPOFF",
  "DELIVERED",
  "FAILED_PICKUP",
  "FAILED_DELIVERY",
  "DISPUTED",
  "CLOSED",
  "CANCELLED",
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

export function RealAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [nextStatus, setNextStatus] = useState("RIDER_ASSIGNED");
  const [reason, setReason] = useState("Admin operational review");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const selectedOrder = useMemo(
    () => orders.find((order) => order.orderId === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  async function loadOrders() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<AdminOrdersResponse>("/api/admin/orders");
      const loadedOrders = response.data?.orders ?? [];

      setOrders(loadedOrders);

      if (!selectedOrderId && loadedOrders.length) {
        setSelectedOrderId(loadedOrders[0].orderId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load admin orders");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus() {
    if (!selectedOrderId) return;

    try {
      setError("");
      setNotice("");
      setUpdating(true);

      const response = await apiRequest<StatusUpdateResponse>(
        `/api/admin/orders/${selectedOrderId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: nextStatus,
            reason,
            detail: `Admin updated order status to ${nextStatus}.`,
          }),
        }
      );

      const updatedOrder = response.data?.order;

      if (updatedOrder) {
        setOrders((current) =>
          current.map((order) =>
            order.orderId === updatedOrder.orderId ? updatedOrder : order
          )
        );
      }

      setNotice("Order status updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update order status. Check legal transition rules."
      );
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real admin orders...</p>
      </section>
    );
  }

  if (error && !orders.length) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Admin access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Admin orders are protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          This page now connects to the real protected admin orders API. Login
          with the seeded ADMIN account to view and manage backend orders.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Login as admin
          </Link>
          <Link
            href="/book"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Create customer order
          </Link>
        </div>
      </section>
    );
  }

  const activeOrders = orders.filter((order) =>
    [
      "ASSIGNING_RIDER",
      "RIDER_ASSIGNED",
      "RIDER_EN_ROUTE",
      "ARRIVED_PICKUP",
      "PICKED_UP",
      "IN_TRANSIT",
      "ARRIVED_DROPOFF",
    ].includes(order.status)
  );

  const completedOrders = orders.filter((order) =>
    ["DELIVERED", "CLOSED"].includes(order.status)
  );

  const riskOrders = orders.filter((order) =>
    ["FAILED_PICKUP", "FAILED_DELIVERY", "DISPUTED", "CANCELLED"].includes(order.status)
  );

  const totalFare = orders.reduce((sum, order) => sum + Number(order.fare || 0), 0);

  const metrics = [
    {
      label: "Total orders",
      value: String(orders.length),
      note: "Real backend orders",
    },
    {
      label: "Active operations",
      value: String(activeOrders.length),
      note: "Still moving through delivery",
    },
    {
      label: "Completed",
      value: String(completedOrders.length),
      note: "Delivered or closed",
    },
    {
      label: "Risk review",
      value: String(riskOrders.length),
      note: "Failed, disputed, or cancelled",
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real admin orders</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Backend order operations.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              This page now reads real MongoDB orders through protected admin
              APIs and supports controlled status updates using the backend
              order state machine.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4 text-right">
            <p className="text-xs text-[#667085]">Fare volume</p>
            <p className="mt-1 text-2xl font-medium text-[#071a2f]">
              {money.format(totalFare)}
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="All orders"
          body="Newest real orders from customer and business booking flows."
        >
          {orders.length ? (
            <div className="grid gap-3">
              {orders.map((order) => (
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
                    </div>

                    <p className="text-sm font-medium">{money.format(order.fare)}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-5">
              <p className="text-sm leading-6 text-[#667085]">
                No real orders yet. Create a customer order from the booking
                flow to populate admin operations.
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
          title="Selected order"
          body="Review and apply controlled status transitions."
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
                  <div>
                    <p className="text-xs text-[#667085]">Package</p>
                    <p className="mt-1 text-sm leading-6 text-[#071a2f]">
                      {selectedOrder.package?.category ?? "Package"} ·{" "}
                      {selectedOrder.package?.valueBand ?? "Value band"}
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
                <p className="text-sm font-medium text-[#071a2f]">
                  Update order status
                </p>
                <p className="mt-2 text-xs leading-5 text-[#667085]">
                  The backend will reject illegal status transitions. This is
                  intentional.
                </p>

                <label className="mt-5 block">
                  <span className="label">Next status</span>
                  <select
                    className="field"
                    value={nextStatus}
                    onChange={(event) => setNextStatus(event.target.value)}
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-4 block">
                  <span className="label">Admin reason</span>
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
                  onClick={updateStatus}
                  disabled={updating || reason.trim().length < 5}
                  className="mt-5 rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  {updating ? "Updating..." : "Update status"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-6 text-[#667085]">
              Select an order to review details and apply admin status updates.
            </p>
          )}
        </Panel>
      </section>
    </div>
  );
}
