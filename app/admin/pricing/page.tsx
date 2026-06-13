import { AdminShell } from "@/components/admin/AdminShell";
import { DataRow } from "@/components/dashboard/DataRow";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Panel } from "@/components/dashboard/Panel";
import { StatusChip } from "@/components/shared/StatusChip";

const metrics = [
  { label: "Rule version", value: "v1", note: "VEYLO-MVP-RULES-v1" },
  { label: "Quote expiry", value: "8 min", note: "Mock active setting" },
  { label: "Fare floor", value: "₦1,200", note: "Protects margin and payout" },
  { label: "Fare cap", value: "₦8,500", note: "Prevents quote shock" },
];

export default function AdminPricingPage() {
  return (
    <AdminShell
      eyebrow="Pricing rules"
      title="Automated pricing governance, not manual fare guessing."
      body="Admin should manage rules, caps, floors, discounts, and audit reasons. Final production pricing must be generated server-side."
    >
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Active pricing components">
          <DataRow label="Base fare" value="₦900" note="Starting fee for dispatch handling." />
          <DataRow label="Distance rate" value="₦190/km" note="Mock route distance rate." />
          <DataRow label="Time adjustment" value="₦55/km proxy" note="Temporary MVP time factor." />
          <DataRow label="Package handling" value="₦250 - ₦650" note="Depends on category and value band." />
          <DataRow label="Business discount cap" value="Controlled" note="Backend must enforce plan limits." />
        </Panel>

        <Panel title="Admin controls">
          <StatusChip tone="warning">Backend phase</StatusChip>
          <div className="mt-5">
            <DataRow label="Update rule" value="Audit required" note="Every pricing rule change must store actor, reason, and version." />
            <DataRow label="Override fare" value="Reason required" note="Exceptional admin change only; not normal pricing." />
            <DataRow label="Margin alert" value="Planned" note="Backend should warn when discounts or surcharges harm contribution." />
          </div>
        </Panel>
      </section>
    </AdminShell>
  );
}
