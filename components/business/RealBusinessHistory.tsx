"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusChip } from "@/components/shared/StatusChip";

type BusinessOrder = {
  orderId: string;
  status: string;
  serviceType: string;
  fare: number;
  paymentStatus?: string;
  supportStatus?: string;
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

type BusinessHistoryResponse = {
  orders: BusinessOrder[];
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

export function RealBusinessHistory() {
  const [orders, setOrders] = useState<BusinessOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHistory() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<BusinessHistoryResponse>(
        "/api/business/history"
      );

      setOrders(response.data?.orders ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load business history");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) {
    return (
      <section className="card rounded-[32px] p-6">
        <p className="text-sm text-[#667085]">Loading real business history...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Business access required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Business history is protected.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          Login with an approved business account to view real business delivery history.
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

  const completed = orders.filter((order) => ["DELIVERED", "CLOSED"].includes(order.status));
  const active = orders.filter((order) =>
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
  const totalSpend = orders.reduce((sum, order) => sum + Number(order.fare || 0), 0);

  const metrics = [
    {
      label: "Total orders",
      value: String(orders.length),
      note: "Real business deliveries",
    },
    {
      label: "Active",
      value: String(active.length),
      note: "Still moving through operations",
    },
    {
      label: "Completed",
      value: String(completed.length),
      note: "Delivered or closed",
    },
    {
      label: "Total spend",
      value: money.format(totalSpend),
      note: "Backend fare total",
    },
  ];

  return (
    <div className="grid gap-6">
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real business history</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Business delivery history.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              This page now reads real business account orders from the backend.
            </p>
          </div>

          <Link
            href="/business/new-delivery"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
          >
            New delivery
          </Link>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        {orders.length ? (
          orders.map((order) => (
            <Link
              key={order.orderId}
              href={`/orders/${order.orderId}`}
              className="card rounded-[28px] p-5 transition hover:border-[#071a2f]/30"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-medium tracking-[-0.035em] text-[#071a2f]">
                      {order.orderId}
                    </h2>
                    <StatusChip tone={statusTone(order.status)}>
                      {order.status.replaceAll("_", " ").toLowerCase()}
                    </StatusChip>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#667085]">
                    {order.pickup?.address ?? "Pickup"} →{" "}
                    {order.dropoff?.address ?? "Drop-off"}
                  </p>

                  <p className="mt-1 text-xs text-[#98a2b3]">
                    {order.package?.category ?? "Package"} ·{" "}
                    {order.paymentStatus ?? "payment pending"} ·{" "}
                    {order.supportStatus ?? "support none"}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-sm text-[#667085]">Fare</p>
                  <p className="mt-1 text-lg font-medium text-[#071a2f]">
                    {money.format(order.fare)}
                  </p>
                  {order.createdAt ? (
                    <p className="mt-1 text-xs text-[#98a2b3]">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  ) : null}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="card rounded-[28px] p-6">
            <StatusChip tone="info">No business orders yet</StatusChip>
            <h2 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
              Business orders will appear here.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              Create a business delivery from the new delivery page to populate
              this backend-powered history.
            </p>
            <Link
              href="/business/new-delivery"
              className="mt-6 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
            >
              New business delivery
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
