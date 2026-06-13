"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { StatusChip } from "@/components/shared/StatusChip";

type DeliveryOrder = {
  orderId: string;
  serviceType: string;
  pickup?: {
    address?: string;
    landmark?: string;
  };
  dropoff?: {
    address?: string;
    landmark?: string;
  };
  fare: number;
  status: string;
  paymentStatus?: string;
  supportStatus?: string;
  createdAt?: string;
};

type OrdersResponse = {
  orders: DeliveryOrder[];
};

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function statusTone(status: string) {
  if (["DELIVERED", "CLOSED"].includes(status)) return "success" as const;
  if (["IN_TRANSIT", "PICKED_UP", "ARRIVED_DROPOFF"].includes(status)) {
    return "warning" as const;
  }
  if (["FAILED_PICKUP", "FAILED_DELIVERY", "DISPUTED", "CANCELLED"].includes(status)) {
    return "danger" as const;
  }
  return "info" as const;
}

export function RealOrdersList() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<OrdersResponse>("/api/orders");
      setOrders(response.data?.orders ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="card rounded-[30px] p-6">
        <p className="text-sm text-[#667085]">Loading your real orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card rounded-[30px] p-6">
        <StatusChip tone="warning">Login required</StatusChip>
        <h2 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
          Sign in to view your real orders.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#667085]">
          Your order history is now connected to the backend, so Veylo needs your
          secure session to load account-linked deliveries.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="card rounded-[30px] p-6">
        <StatusChip tone="info">No orders yet</StatusChip>
        <h2 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
          Your real order history will appear here.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#667085]">
          Create a real quote and order from the booking page to populate this
          backend-powered order list.
        </p>
        <Link
          href="/book"
          className="mt-6 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
        >
          Book delivery
        </Link>
      </div>
    );
  }

  return (
    <section className="grid gap-4">
      {orders.map((order) => (
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

              <p className="mt-1 text-xs text-[#667085]">
                {order.serviceType?.replaceAll("_", " ").toLowerCase()} ·{" "}
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
                <p className="mt-1 text-xs text-[#667085]">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              ) : null}
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
