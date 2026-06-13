"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { StatusChip } from "@/components/shared/StatusChip";
import { OrderCancellationBox } from "@/components/orders/OrderCancellationBox";
import { OrderProofPanel } from "@/components/proofs/OrderProofPanel";

type DeliveryOrder = {
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
    restrictedItemConfirmed?: boolean;
  };
  fare: number;
  status: string;
  paymentStatus?: string;
  supportStatus?: string;
  cancellationStatus?: string;
  createdAt?: string;
};

type TimelineEvent = {
  id?: string;
  status: string;
  label: string;
  detail: string;
  actorRole?: string;
  createdAt?: string;
};

type OrderDetailResponse = {
  order: DeliveryOrder;
  timeline: TimelineEvent[];
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

export function RealOrderDetail({ orderId }: { orderId: string }) {
  const [data, setData] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrder() {
    try {
      setError("");
      setLoading(true);

      const response = await apiRequest<OrderDetailResponse>(
        `/api/orders/${orderId}`
      );

      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load order");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="card rounded-[30px] p-6">
        <p className="text-sm text-[#667085]">Loading real order detail...</p>
      </div>
    );
  }

  if (error || !data?.order) {
    return (
      <div className="card rounded-[30px] p-6">
        <StatusChip tone="warning">Order access required</StatusChip>
        <h1 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
          We could not load this order.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#667085]">
          This order detail page is now backend-powered. You need to be logged in
          as the customer, rider, or admin allowed to view this order.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Login
          </Link>
          <Link
            href="/orders"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  const order = data.order;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="card rounded-[32px] p-5 md:p-7">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-medium text-[#1f7a55]">Order detail</p>
            <h1 className="mt-2 text-[30px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[40px]">
              {order.orderId}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              Real backend order detail with route, fare, status, package, and
              timeline.
            </p>
          </div>
          <StatusChip tone={statusTone(order.status)}>
            {order.status.replaceAll("_", " ").toLowerCase()}
          </StatusChip>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
            <p className="text-sm font-medium text-[#071a2f]">Pickup</p>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              {order.pickup?.address}
            </p>
            <p className="mt-2 text-xs leading-5 text-[#667085]">
              {order.pickup?.landmark}
            </p>
            <p className="mt-3 text-xs text-[#475467]">
              {order.pickup?.contactName} · {order.pickup?.phone}
            </p>
          </div>

          <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
            <p className="text-sm font-medium text-[#071a2f]">Drop-off</p>
            <p className="mt-3 text-sm leading-6 text-[#667085]">
              {order.dropoff?.address}
            </p>
            <p className="mt-2 text-xs leading-5 text-[#667085]">
              {order.dropoff?.landmark}
            </p>
            <p className="mt-3 text-xs text-[#475467]">
              {order.dropoff?.recipientName} · {order.dropoff?.phone}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
          <p className="text-sm font-medium text-[#071a2f]">Package</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div>
              <p className="text-xs text-[#667085]">Category</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {order.package?.category}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#667085]">Value band</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {order.package?.valueBand}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#667085]">Fare</p>
              <p className="mt-1 text-sm font-medium text-[#071a2f]">
                {money.format(order.fare)}
              </p>
            </div>
          </div>
          {order.package?.note ? (
            <p className="mt-4 text-sm leading-6 text-[#667085]">
              {order.package.note}
            </p>
          ) : null}
        </div>

                <OrderProofPanel orderId={order.orderId} />

        <OrderCancellationBox orderId={order.orderId} currentStatus={order.status} />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/support/new"
            className="rounded-full bg-[#071a2f] px-5 py-3 text-center text-sm font-medium text-white"
          >
            Open support ticket
          </Link>
          <Link
            href="/orders"
            className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-center text-sm font-medium text-[#071a2f]"
          >
            Back to orders
          </Link>
        </div>
      </section>

      <aside className="card rounded-[32px] p-5 md:p-7">
        <p className="text-sm font-medium text-[#1f7a55]">Timeline</p>
        <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
          Order movement history
        </h2>

        <div className="mt-6 grid gap-3">
          {data.timeline.length ? (
            data.timeline.map((event, index) => (
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
            ))
          ) : (
            <p className="text-sm leading-6 text-[#667085]">
              Timeline events will appear as the order moves through Veylo
              operations.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
