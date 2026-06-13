import { ActionCard } from "@/components/dashboard/ActionCard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DataRow } from "@/components/dashboard/DataRow";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

const riderMetrics = [
  { label: "Today earnings", value: "₦8,600", note: "Mock active-day summary" },
  { label: "Completed today", value: "6", note: "2 express, 4 standard" },
  { label: "Acceptance rate", value: "88%", note: "Used for rider tier later" },
  { label: "Rating", value: "4.8", note: "326 completed jobs" },
];

const checklist = [
  "Confirm correct pickup address and landmark",
  "Collect only the item described in the order",
  "Enter pickup OTP after item collection",
  "Upload photo proof when required",
  "Move to delivery point and confirm recipient",
];

export default function RiderConsolePage() {
  return (
    <DashboardShell
      eyebrow="Rider console"
      title="Accept jobs, confirm pickup, upload proof, and protect rider earnings."
      body="This is the frontend rider workspace for job offers, route instructions, OTP, proof, failed delivery reasons, earnings, and support."
      chip="Rider PWA"
    >
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {riderMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel
          title="Current job offer"
          body="Riders need a short, directive view of route, package, payout, and expiry before accepting."
        >
          <div className="rounded-[24px] border border-[#e5ded2] bg-[#fffdf8] p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <StatusChip tone="info">Offer expires soon</StatusChip>
                <h3 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-[#071a2f]">
                  Pickup & Delivery
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Ikenegbu pickup to World Bank drop-off. Small parcel, standard urgency.
                </p>
              </div>
              <p className="text-3xl font-medium tracking-[-0.04em] text-[#071a2f]">
                ₦1,650
              </p>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <a href="/rider/jobs/JOB-2401" className="rounded-full bg-[#1f7a55] px-4 py-3 text-center text-sm font-medium text-white">
                View job
              </a>
              <button className="rounded-full border border-[#d8d0c3] bg-[#fffdf8] px-4 py-3 text-sm font-medium text-[#071a2f]">
                Reject with reason
              </button>
            </div>
          </div>
        </Panel>

        <Panel
          title="Pickup checklist"
          body="The rider flow must guide behavior and capture proof data for accountability."
        >
          <div className="space-y-3">
            {checklist.map((item, index) => (
              <div
                key={item}
                className="flex gap-3 rounded-2xl border border-[#e5ded2] bg-[#fffdf8] p-4"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#071a2f] text-xs font-medium text-white">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-[#475467]">{item}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Proof and OTP actions">
          <DataRow
            label="Pickup OTP"
            value="Enter code"
            note="Code should be entered only after the item is collected."
          />
          <DataRow
            label="Delivery OTP"
            value="Pending"
            note="Delivery code is used after recipient receives the item."
          />
          <DataRow
            label="Photo proof"
            value="Required if flagged"
            note="Proof supports claims and dispute review."
          />
        </Panel>

        <Panel title="Rider support">
          <div className="grid gap-4">
            <ActionCard
              title="Report failed pickup"
              body="Use when customer is unavailable, address is wrong, item is not ready, or item violates policy."
              href="/rider/support"
              label="Open support"
            />
            <ActionCard
              title="Check rider rules"
              body="Review conduct, package handling, OTP, proof, restricted item, and support escalation rules."
              href="/rider/profile"
              label="Rider rules"
            />
          </div>
        </Panel>
      </section>
    </DashboardShell>
  );
}
