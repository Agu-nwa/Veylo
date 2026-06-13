import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DataRow } from "@/components/dashboard/DataRow";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";
import { adminStats, sampleOrder } from "@/lib/mock-data";

const operations = [
  {
    title: "Dispatch queue",
    value: "5 pending",
    href: "/admin/dispatch",
    note: "New orders waiting for rider assignment or review.",
  },
  {
    title: "Orders",
    value: "Live",
    href: "/admin/orders",
    note: "Monitor customer orders, status, rider, fare, and proof state.",
  },
  {
    title: "Pricing rules",
    value: "Active",
    href: "/admin/pricing",
    note: "Fare floors, caps, surcharge limits, discount limits, quote expiry.",
  },
  {
    title: "Quote logs",
    value: "142 today",
    href: "/admin/quotes",
    note: "Generated, viewed, accepted, abandoned, expired, and refreshed.",
  },
  {
    title: "Rider verification",
    value: "7 reviews",
    href: "/admin/riders",
    note: "ID checks, bike details, training, tier, suspension state.",
  },
  {
    title: "Businesses",
    value: "12 active",
    href: "/admin/businesses",
    note: "Business accounts, plans, discounts, reports, and review state.",
  },
  {
    title: "Disputes",
    value: "2 open",
    href: "/admin/disputes",
    note: "Proof review, rider notes, customer notes, support decision.",
  },
  {
    title: "Analytics",
    value: "Ready",
    href: "/admin/analytics",
    note: "Operational metrics, quote acceptance, support load, and margin signals.",
  },
];

const quoteEvents = [
  ["QUOTE_GENERATED", "Rule version applied", "VEYLO-MVP-RULES-v1"],
  ["DISCOUNT_APPLIED", "Business discount checked", "Within approved limit"],
  ["SURCHARGE_APPLIED", "Zone access factor applied", "Surcharge cap checked"],
  ["FINAL_FARE_CONFIRMED", "Customer accepted estimate", "Audit-ready"],
];

export default function AdminPage() {
  return (
    <DashboardShell
      eyebrow="Admin operations"
      title="Control dispatch, pricing governance, proof review, and support."
      body="This is the frontend operating center for live orders, riders, businesses, pricing rules, quote logs, fare audit, disputes, and analytics placeholders."
      chip="Admin dashboard"
    >
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="Operations control"
          body="Admin must supervise assignment, exceptions, proof, disputes, and pricing controls without turning every fare into manual guessing."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {operations.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-3xl border border-[#e5ded2] bg-[#fffdf8] p-5 transition hover:border-[#071a2f]/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm font-medium text-[#071a2f]">
                    {item.title}
                  </h3>
                  <span className="rounded-full bg-[#f2ede4] px-3 py-1 text-xs text-[#475467]">
                    {item.value}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#667085]">
                  {item.note}
                </p>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="Live job sample">
          <StatusChip tone="warning">In transit</StatusChip>
          <h3 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
            {sampleOrder.id}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#667085]">
            {sampleOrder.pickup} to {sampleOrder.dropoff}
          </p>

          <div className="mt-6">
            <DataRow
              label="Rider"
              value={sampleOrder.rider.name}
              note="Verified profile and rating visible to customer."
            />
            <DataRow
              label="Proof"
              value="Pickup OTP confirmed"
              note="Delivery proof pending."
            />
            <DataRow
              label="Support"
              value="No ticket open"
              note="Support path remains available."
            />
            <DataRow
              label="Pricing"
              value="Fare audit available"
              note="Quote and rule version ready for backend."
            />
          </div>
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          title="Quote and fare audit timeline"
          body="This frontend structure prepares backend logging for quote generation, discounts, surcharges, protections, overrides, and final fare confirmation."
        >
          <div className="space-y-3">
            {quoteEvents.map(([event, label, value]) => (
              <div
                key={event}
                className="rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
              >
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <div>
                    <p className="text-sm font-medium text-[#071a2f]">
                      {event}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#667085]">
                      {label}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-[#1f7a55]">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Analytics placeholders"
          body="These become real once backend starts collecting quote, booking, rider, support, proof, and completed order events."
        >
          <DataRow label="Order completion rate" value="92%" note="Mock success metric" />
          <DataRow label="Rider acceptance" value="84%" note="Used for supply quality" />
          <DataRow label="Average delivery time" value="38 min" note="Route intelligence input" />
          <DataRow label="Support tickets / 100 orders" value="6" note="Trust and ops health" />
          <DataRow label="Contribution estimate" value="₦310/order" note="Margin placeholder" />
        </Panel>
      </section>
    </DashboardShell>
  );
}
