"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/client/api";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

type MeResponse = {
  authenticated: boolean;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    accountStatus: string;
    verificationStatus: string;
  } | null;
};

type DeliveryOrder = {
  orderId: string;
  serviceType: string;
  pickup?: {
    address?: string;
  };
  dropoff?: {
    address?: string;
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

type SupportTicket = {
  ticketId: string;
  orderId?: string;
  category: string;
  subject: string;
  status: string;
  priority: string;
  createdAt?: string;
};

type TicketsResponse = {
  tickets: SupportTicket[];
};

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function statusTone(status: string) {
  if (["DELIVERED", "CLOSED", "RESOLVED"].includes(status)) return "success" as const;
  if (["IN_TRANSIT", "PICKED_UP", "UNDER_REVIEW", "OPEN"].includes(status)) {
    return "warning" as const;
  }
  if (["FAILED_PICKUP", "FAILED_DELIVERY", "DISPUTED", "CANCELLED"].includes(status)) {
    return "danger" as const;
  }
  return "info" as const;
}

export function RealCustomerDashboard() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setError("");
      setLoading(true);

      const meResponse = await apiRequest<MeResponse>("/api/auth/me");
      setMe(meResponse.data);

      if (!meResponse.data?.authenticated) {
        setOrders([]);
        setTickets([]);
        return;
      }

      const [ordersResponse, ticketsResponse] = await Promise.all([
        apiRequest<OrdersResponse>("/api/orders"),
        apiRequest<TicketsResponse>("/api/support/tickets"),
      ]);

      setOrders(ordersResponse.data?.orders ?? []);
      setTickets(ticketsResponse.data?.tickets ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dashboard");
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
        <p className="text-sm text-[#667085]">Loading real customer dashboard...</p>
      </section>
    );
  }

  if (!me?.authenticated || !me.user) {
    return (
      <section className="card rounded-[32px] p-6 md:p-8">
        <StatusChip tone="warning">Login required</StatusChip>
        <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
          Sign in to view your dashboard.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667085]">
          Your dashboard is now connected to real backend data. Login to view
          your orders, support tickets, account status, and delivery activity.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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
      </section>
    );
  }

  const activeOrders = orders.filter((order) =>
    ["ASSIGNING_RIDER", "RIDER_ASSIGNED", "RIDER_EN_ROUTE", "ARRIVED_PICKUP", "PICKED_UP", "IN_TRANSIT", "ARRIVED_DROPOFF"].includes(order.status)
  );

  const completedOrders = orders.filter((order) =>
    ["DELIVERED", "CLOSED"].includes(order.status)
  );

  const openTickets = tickets.filter((ticket) =>
    ["OPEN", "UNDER_REVIEW", "WAITING_FOR_USER"].includes(ticket.status)
  );

  const totalSpend = orders.reduce((sum, order) => sum + Number(order.fare || 0), 0);

  const metrics = [
    {
      label: "Total orders",
      value: String(orders.length),
      note: "Real backend orders",
    },
    {
      label: "Active orders",
      value: String(activeOrders.length),
      note: "Still moving through operations",
    },
    {
      label: "Completed",
      value: String(completedOrders.length),
      note: "Delivered or closed",
    },
    {
      label: "Total spend",
      value: money.format(totalSpend),
      note: "Based on real order fares",
    },
  ];

  return (
    <div>
      <section className="card rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <StatusChip tone="success">Real dashboard</StatusChip>
            <h1 className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.05em] text-[#071a2f] md:text-[42px]">
              Welcome, {me.user.fullName}.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#667085]">
              This dashboard now reads your real account session, backend orders,
              support tickets, and customer activity.
            </p>
          </div>
          <StatusChip tone="info">{me.user.role}</StatusChip>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="Recent real orders"
          body="Orders created from the backend booking flow appear here."
        >
          {orders.length ? (
            <div className="grid gap-3">
              {orders.slice(0, 5).map((order) => (
                <Link
                  key={order.orderId}
                  href={`/orders/${order.orderId}`}
                  className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4 transition hover:border-[#071a2f]/30"
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
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
                No real orders yet. Create a delivery from the booking page.
              </p>
              <Link
                href="/book"
                className="mt-4 inline-flex rounded-full bg-[#071a2f] px-5 py-3 text-sm font-medium text-white"
              >
                Book delivery
              </Link>
            </div>
          )}
        </Panel>

        <Panel
          title="Support tickets"
          body="Support requests linked to your account appear here."
        >
          {tickets.length ? (
            <div className="grid gap-3">
              {tickets.slice(0, 5).map((ticket) => (
                <div
                  key={ticket.ticketId}
                  className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-[#071a2f]">
                      {ticket.ticketId}
                    </p>
                    <StatusChip tone={statusTone(ticket.status)}>
                      {ticket.status.replaceAll("_", " ").toLowerCase()}
                    </StatusChip>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">
                    {ticket.subject}
                  </p>
                  <p className="mt-1 text-xs text-[#98a2b3]">
                    {ticket.category.replaceAll("_", " ").toLowerCase()} ·{" "}
                    {ticket.priority.toLowerCase()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-5">
              <p className="text-sm leading-6 text-[#667085]">
                No support tickets yet.
              </p>
              <Link
                href="/support/new"
                className="mt-4 inline-flex rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-5 py-3 text-sm font-medium text-[#071a2f]"
              >
                Open ticket
              </Link>
            </div>
          )}
        </Panel>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Link
          href="/book"
          className="card rounded-[26px] p-5 text-sm font-medium text-[#071a2f]"
        >
          Book another delivery
        </Link>
        <Link
          href="/orders"
          className="card rounded-[26px] p-5 text-sm font-medium text-[#071a2f]"
        >
          View all orders
        </Link>
        <Link
          href="/profile"
          className="card rounded-[26px] p-5 text-sm font-medium text-[#071a2f]"
        >
          View profile
        </Link>
      </section>

      {error ? (
        <div className="mt-6 rounded-2xl border border-[#f3b6b6] bg-[#fff0f0] p-4 text-sm leading-6 text-[#9a3412]">
          {error}
        </div>
      ) : null}
    </div>
  );
}
