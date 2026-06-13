import { RiderShell } from "@/components/rider/RiderShell";
import { DataRow } from "@/components/dashboard/DataRow";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";

const metrics = [
  { label: "Today earnings", value: "₦8,600", note: "Mock active-day total" },
  { label: "Weekly earnings", value: "₦42,800", note: "Mock weekly summary" },
  { label: "Completed jobs", value: "27", note: "This week" },
  { label: "Pending payout", value: "₦18,400", note: "Backend payout later" },
];

export default function RiderEarningsPage() {
  return (
    <RiderShell
      eyebrow="Earnings"
      title="Rider earnings, payout status, and active-hour performance."
      body="Backend will later calculate real rider payouts, bonuses, waiting fees, payout floors, deductions, and settlement status."
    >
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Payout details">
          <DataRow label="Minimum payout protection" value="Checked" note="Backend will apply rider payout floor." />
          <DataRow label="Express premium share" value="Included when eligible" note="Priority jobs may include higher rider share." />
          <DataRow label="Waiting fee share" value="Pending rules" note="Backend will define rider/platform split." />
          <DataRow label="Payout status" value="Pending backend" note="Real settlement not implemented yet." />
        </Panel>

        <Panel title="Performance signals">
          <DataRow label="Acceptance rate" value="88%" note="Affects access to better jobs later." />
          <DataRow label="Completion rate" value="94%" note="Used for rider tier." />
          <DataRow label="Dispute rate" value="1.8%" note="Lower dispute rate improves trust." />
          <DataRow label="Proof compliance" value="97%" note="OTP and photo proof behavior." />
        </Panel>
      </section>
    </RiderShell>
  );
}
