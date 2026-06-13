import Link from "next/link";
import { ActionCard } from "@/components/dashboard/ActionCard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DataRow } from "@/components/dashboard/DataRow";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";
import { sampleOrder } from "@/lib/mock-data";

const metrics = [
  { label: "Active order", value: "1", note: "Currently in transit" },
  { label: "Completed", value: "12", note: "Across Owerri routes" },
  { label: "Support tickets", value: "0", note: "No open issue" },
  { label: "Saved routes", value: "4", note: "Repeat addresses ready" },
];

const actions = [
  {
    title: "Book a delivery",
    body: "Create a new delivery request, enter pickup and drop-off details, and get an instant fare estimate.",
    href: "/book",
    label: "Start booking",
  },
  {
    title: "Track current order",
    body: "View rider status, pickup OTP, proof notes, support path, and delivery timeline.",
    href: "/orders",
    label: "Track order",
  },
  {
    title: "Open support",
    body: "Get help with pricing questions, failed pickup, failed delivery, cancellation, or safety report.",
    href: "/support/new",
    label: "Open ticket",
  },
];

export default function CustomerDashboardPage() {
  return (
    <DashboardShell
      eyebrow="Customer dashboard"
      title="Your deliveries, estimates, proof, and support in one calm workspace."
      body="This is the frontend shell for the customer account experience. Backend will later connect real orders, saved addresses, support tickets, and notifications."
      chip="Customer PWA"
      actionHref="/book"
      actionLabel="Book delivery"
    >
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.82fr]">
        <Panel
          title="Current order"
          body="A customer should immediately understand status, rider responsibility, proof, and support path."
        >
          <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <StatusChip tone="warning">In transit</StatusChip>
                <h3 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
                  {sampleOrder.id}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  {sampleOrder.pickup} to {sampleOrder.dropoff}
                </p>
              </div>
              <Link
                href="/orders"
                className="rounded-full bg-[#071a2f] px-4 py-2 text-center text-sm font-medium text-white"
              >
                View timeline
              </Link>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-[#f2ede4] p-4">
                <p className="text-xs text-[#667085]">Rider</p>
                <p className="mt-1 text-sm font-medium text-[#071a2f]">
                  {sampleOrder.rider.name}
                </p>
              </div>
              <div className="rounded-2xl bg-[#f2ede4] p-4">
                <p className="text-xs text-[#667085]">Pickup OTP</p>
                <p className="mt-1 text-sm font-medium text-[#071a2f]">4821</p>
              </div>
              <div className="rounded-2xl bg-[#f2ede4] p-4">
                <p className="text-xs text-[#667085]">Proof</p>
                <p className="mt-1 text-sm font-medium text-[#071a2f]">
                  Pickup saved
                </p>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Account actions">
          <div className="grid gap-4">
            {actions.map((action) => (
              <ActionCard key={action.title} {...action} />
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-6">
        <Panel
          title="Saved delivery details"
          body="These fields become useful when backend adds profiles, repeat routes, saved recipients, and business links."
        >
          <DataRow
            label="Default pickup area"
            value="Ikenegbu"
            note="Used to speed up future delivery estimates."
          />
          <DataRow
            label="Preferred support channel"
            value="Phone / WhatsApp"
            note="Backend will later store verified contact preferences."
          />
          <DataRow
            label="Restricted item acknowledgement"
            value="Required before booking"
            note="Visible policy confirmation protects customer, rider, and platform."
          />
        </Panel>
      </section>
    </DashboardShell>
  );
}
